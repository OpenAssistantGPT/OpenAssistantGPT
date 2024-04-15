'use client';
import DragAndDrop from "@/components/LandingPage/DragAndDrop/DragAndDrop";
import Header from "@/components/LandingPage/Header/Header";
import Hero from "@/components/LandingPage/Hero/Hero";
import Marketing from "@/components/LandingPage/Marketing/Marketing";
import Work from "@/components/LandingPage/Work/Work";
import React from "react";

const HomePage = () => {
  return (
    <div className="bg-black min-h-screen w-full text-white">
      <div className="flex justify-center">

        <Header />
      </div>
      <div className="container mx-auto grid grid-flow-row grid-cols-1 place-content-center place-items-center gap-20 mt-10">
        <Hero/>
        <Work/>
        <Marketing/>
        <DragAndDrop/>
      </div>
    </div>
  );
};

export default HomePage;
