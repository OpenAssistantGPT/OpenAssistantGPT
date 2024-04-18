'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const RegistrationPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Make a POST request to the server endpoint
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.firstName + ' ' + formData.lastName,
          email: formData.email,
          password: formData.password,
          magicLink: window.location.href,
        }),
      });

      if (response.ok) {
        // Parse the JSON response
        const data = await response.json();

        // Handle successful registration
        console.log('User registered successfully:', data);
        router.push('/login');
        // Perform any additional actions such as redirecting to another page or displaying a success message
      } else {
        // Handle registration failure
        console.log('Failed to register user');
        // Optionally, parse and log error data from the response
        const errorData = await response.json();
        console.error('Registration error:', errorData);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle error
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="screen flex shadow-lg rounded-lg">
        {/* Left side image */}
        <div className="w-1/2 bg-gray-200">
          <img
            src="https://via.placeholder.com/500x500"
            alt="Registration Image"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right side form */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-semibold mb-4">Register</h2>
          <form onSubmit={handleSubmit}>
            {/* First Name and Last Name */}
            <div className="mb-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-1/2 px-4 py-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-1/2 px-4 py-2 border rounded"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
