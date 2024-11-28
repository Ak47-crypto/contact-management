"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const path=usePathname()
  
    useEffect(()=>{
        if(!localStorage.getItem('token'))
            return;
        if(localStorage.getItem('user')){
            setIsLoggedIn(true)
            return;
        }
        const handleFetchUser = async()=>{
            try {
                const response = await fetch('http://localhost:3001/api/fetchUser',{
                    method:"POST",
                    headers:{
                        "CONTENT-TYPE":"application/json"
                    },
                    body:JSON.stringify({token:localStorage.getItem('token')})
                })
                const data2=await response.json();
                if(data2.statusCode===200){
                    setIsLoggedIn(true)
                    localStorage.setItem('user',JSON.stringify(data2.data.user))
                }
            } catch (error:any) {
                console.log(error.message)
            }
        }
        handleFetchUser();
    },[])
 const handleLogOut = ()=>{
    
        localStorage.removeItem('token');
        localStorage.removeItem('user')
        setIsLoggedIn(false);
        window.location.reload();
      
 }
  return (
    <nav className="w-full border-b">
      <div className="flex items-center justify-between mx-auto max-w-7xl p-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          ContactManager
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {!isLoggedIn ? (
            <>
                <Link href="/docs.pdf">
                <Button variant="ghost">Docs</Button>
              </Link>
              <Link href="/log-in">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Sign Up</Button>
              </Link>
            </>
          ) : (
            <>
            <Link href="/docs.pdf">
                <Button variant="ghost">Docs</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button 
                variant="ghost" 
                onClick={handleLogOut} 
              >
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-4">
                {!isLoggedIn ? (
                  <>
                  <Link href="/SpyneDocument.pdf">
                      <Button variant="ghost" className="w-full">
                        Docs
                      </Button>
                    </Link>
                    <Link href="/log-in">
                      <Button variant="ghost" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </>
                ) : (
                  <>
                  <Link href="/SpyneDocument.pdf">
                      <Button variant="ghost" className="w-full">
                        Docs
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="ghost" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full"
                      onClick={handleLogOut} 
                    >
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;