import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest){
    const token = req.cookies.get('authToken');

    if(!token && req.nextUrl.pathname.startsWith('/dashboard')){
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}
// Protect dashboard routes
export const config = { matcher: ["/dashboard/:path*"] };