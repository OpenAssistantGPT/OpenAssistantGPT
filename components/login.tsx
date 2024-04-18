"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Icons } from "./icons";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Use next-auth's signIn function for login
    const result = await signIn("credentials", {
      callbackUrl: "/dashboard",
      reload: true,
      redirect: true,
      email,
      password,
    });

    if (result?.ok) {
      // Handle successful login
      console.log("Logged in successfully!");
    } else {
      // Handle login error
      console.log("Login failed");
    }
  };

  return (
    <div className="h-screen w-full container flex items-center justify-center relative">
      <div className="flex flex-col md:flex-row justify-center shadow-lg rounded-lg overflow-hidden h-[70%] md:h-[80%] bg-white md:w-3/4 lg:w-full">
        {/* Left side image */}
        <div className="w-full md:w-1/2 relative hidden md:flex">
          <img
            src="/login/login-bg.jpg"
            alt="Login Image"
            className="h-full w-full object-cover"
          />
          {/* Text overlay */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
            <h1 className="text-[40px] font-bold">
            Wicked ChatBots
            </h1>
            <p className="text-[14px] mt-4">
              Your ultimate solution for intelligent conversational agents.
            </p>
          </div>
        </div>

        {/* Right side form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col gap-y-2 justify-center items-center">
          <Icons.bot className="mx-auto h-8 w-8" />
          <h2 className="text-[35px] md:text-[40px] font-semibold mb-4 text-center text-black tracking-tight">
            Signin
          </h2>
          <form onSubmit={handleLogin} className="w-full md:w-[80%] flex flex-col gap-y-2">
            {/* Email */}
            <div className="mb-4 space-y-2">
              <label htmlFor="email">Enter your email </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4 space-y-2">
              <label htmlFor="password">Enter your password </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-2 bg-[#0F172A] text-white rounded-md hover:bg-[#272E3F] transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
