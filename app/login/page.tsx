"use client";

import { useRouter } from "next/navigation"

import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import '../../styles/custom-css.css'
import { useEffect, useState } from "react"

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    const checkAuth = async()=>{
      try {
        const res = await fetch('/api/me',{credentials:"include"});
        const data = await res.json();
        if(res.ok){
          router.push('/dashboard');
        }else{
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        setLoading(false);
        
      }
    }
    checkAuth();
  },[router]);

  if(loading){
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="loaderImg bg-muted relative hidden lg:block">
        {/* <img
          src="/vercel.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
      </div>
    </div>
  )
}
