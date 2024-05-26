"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { SkeletonCard } from "@/components/card-skeleton-auth";
//import { sendWelcomeEmail } from "@/lib/emails/send-inquiry";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); 
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/login'); 
      } else {
        setIsLoading(false);
        const data = await res.json();
        setError(data.error || 'Failed to create account. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Failed to create account. Please try again.');
    }
  };
  

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      {isLoading ? (
      <SkeletonCard /> 
        ) : (
      <div className="mx-auto flex w-full flex-col justify-center space-y-10 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.bot className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
          <p className="text-md text-muted-foreground">Create a new account with your email and password.</p>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            className={cn(
              "px-8",
              "h-12"
            )}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn(
              "px-8",
              "h-12"
            )}
          />
          <button type="submit"  className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "px-6",
                 "border-black",
                "text-black", // White text for contrast
                "hover:text-gray-200", // Slightly lighter text on hover
                "hover:bg-gray-800", // Dark gray background on hover
                "active:text-gray-800", // Even lighter text on active state
                "bg-gray-200" // Almost black background on active state
              )}>Sign Up</button>
        </form>
        <p className="text-md text-muted-foreground">
        By registering, you agree to our <a 
      className="text-gray-500"  href="/docs/legal/terms">Terms of Service</a> and <a  className="text-gray-500"  href="/docs/legal/privacy">Privacy Policy</a>.
        </p>

        <hr></hr>
        
        <p className="text-md text-muted-foreground">Already have an account?  <a 
 className="text-gray-500" href="/login">Login</a> </p>
              <hr></hr>

      </div>
        )}
    </div>
  );
}
