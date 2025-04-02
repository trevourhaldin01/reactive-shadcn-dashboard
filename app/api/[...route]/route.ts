import { Hono, Context, Next } from 'hono';
import {PrismaClient} from '@prisma/client';
import {handle} from 'hono/vercel';
import { Bowlby_One_SC } from 'next/font/google';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import {parse} from 'cookie';
import {verify} from 'jsonwebtoken';

export const dynamic = 'force-dynamic';


// interface Context {
//     get(key: string): any;
//     set(key: string, value: any): void;
//   }

// Secret key for signing JWTs (use environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'

const app = new Hono().basePath('/api');
// const prisma = new PrismaClient();

// get all users
app.get('/users', async (c)=>{
    const users = await prisma.user.findMany();
    return c.json(users);
    
});

// post a new user
app.post('/users', async (c) => {
    try {
        const body = await c.req.json();
        console.log("Received Body:", body);

        // Validate if body contains necessary fields
        if (!body.firstName || !body.lastName || !body.email || !body.password || !body.role) {
            return c.json({ error: "Missing required fields" }, 400);
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: body.email },
        });

        if (existingUser) {
            console.log('email already exists')
            return c.json({ error: "Email already exists. Please use a different email." }, 400);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(body.password, 10);

        // Create a new user
        const user = await prisma.user.create({
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                password: hashedPassword,
                role: body.role,
            }
        });

        const {password:_, ...userWithoutPassword} = user;

        return c.json({ message: 'User Registered Successfully', user: userWithoutPassword });

    } catch (error) {
        console.error("Error creating user:", error);
        return c.json({ error: "An internal server error occurred" }, 500);
    }
});



//login a user
app.post('/login', async (c)=>{
    const {email, password} = await c.req.json();
    console.log({email, password});

    const user = await prisma.user.findUnique({where:{email}});
    if(!user) return c.json({error: 'User not found'});

    // validate password
    const isPasswordValid  =await bcrypt.compare(password, user.password);
    if(!isPasswordValid) return c.json({error: 'Invalid password'});

    // generate JWT
    const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: '1d'});

    c.header("Set-Cookie", cookie.serialize('authToken', token, {
        httpOnly: true, //prevent access from javascript
        secure: process.env.NODE_ENV === 'production', //use secure cookies in production
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    }));

    // Remove password from the user object
    const { password: _, ...safeUser } = user;

    return c.json({message: 'User logged in successfully', user: safeUser});
})

app.post('/logout',async (c)=>{
    c.header("Set-Cookie", cookie.serialize('authToken', '', {
        httpOnly: true, //prevent access from javascript
        secure: process.env.NODE_ENV === 'production', //use secure cookies in production
        sameSite: 'strict',
        expires: new Date(0), //expires the cookie immediately
        path: '/',
    }));
    return c.json({message: 'User logged out successfully'});
})

// documents controllers
app.get('/documents', async(c)=>{
    const documents = await prisma.documents.findMany();
    return c.json(documents);
})

app.post('/documents', async (c)=>{
    const body = await c.req.json();
    const document = await prisma.documents.create({data: body});
    return c.json(document);
})

app.put('/documents/:id', async (c)=>{
    const {id} = c.req.param();
    const body = await c.req.json();
    const document = await prisma.documents.update({
        where: {id: Number(id)},
        data: body,
    });
    return c.json({message:"Successfully updated", document});
})

app.delete('/documents/:id', async (c)=>{
    const {id} = c.req.param();
    const document = await prisma.documents.delete({
        where: {id: Number(id)},
    });
    return c.json({message:"Successfully deleted"});
})




 const authMiddleware = async (c: Context, next: Next) => {
  const cookies = parse(c.req.header("Cookie") || "");
  const token = cookies.authToken;

  if (!token) return c.json({ error: "Unauthorized" }, 401);

  try {
    const decoded = verify(token, JWT_SECRET);
    c.set("user", decoded); // Attach user data to context
    await next(); // Continue to the next middleware or route
  } catch (error) {
    return c.json({ error: "Invalid token" }, 401);
  }
};

app.get('/me',authMiddleware, async (c:Context)=>{
    const user = (c.get('user') as {userId: string}).userId;
    return c.json({message:"Authenticated", user});

})


// protected route : get user profile
app.get('/profile',authMiddleware,async(c:any)=>{
    const userId = (c.get('user') as {userId: string}).userId;
    const user  = await prisma.user.findUnique({where: {id: userId}, select:{id:true,firstName: true, lastName: true, email:true, role:true}} );

    if(!user) return c.json({error: 'User not found'},404);

    return c.json(user);
    

});

export const GET = handle(app);
export const POST = handle(app);
export const PUT  =handle(app);
export const DELETE = handle(app);

