"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";



export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [formState, setFormState] = useState({
    email:"",
    password:""
  });
  console.log({formState});

  const handleChange = (e:FormEvent)=>{
    setFormState((prevState)=>({...prevState, [(e.target as HTMLInputElement).name]:(e.target as HTMLInputElement).value}))

  }

  const handleSubmit = async(e:React.FormEvent)=>{
    e.preventDefault();
    try {
      const response = await fetch(`/api/login`,{
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
        credentials: "include" //Ensures cookies are sent with the request
      });
      const data = await response.json();
      if(!response.ok){
        console.log("Error:", data.error ||"An error occurred");
      }
      console.log("login successful",data);
      
      router.push('/dashboard');
      
    } catch (error) {
      console.log("An Error occurred", error);
      
    }
    

  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required onChange={handleChange} />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" name="password" type="password" required onChange={handleChange} />
        </div>
        <Button type="submit" onClick={handleSubmit} className="w-full">
          Login
        </Button>
        
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  )
}
