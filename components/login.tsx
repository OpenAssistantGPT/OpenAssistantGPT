'use client';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Use next-auth's signIn function for login
    const result = await signIn('credentials', {
      callbackUrl: '/dashboard',
      reload: true,
      redirect: true,
      email,
      password,
    });

    if (result?.ok) {
      // Handle successful login
      console.log('Logged in successfully!');
    } else {
      // Handle login error
      console.log('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden bg-white md:w-3/4 lg:w-1/2">
        {/* Left side image */}
        <div className="w-full md:w-1/2">
          <img
            src="https://via.placeholder.com/500x500"
            alt="Login Image"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right side form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Login</h2>
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-4">
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
            <div className="mb-4">
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
              className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
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
