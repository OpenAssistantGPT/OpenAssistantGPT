import { MobileNav } from "@/components/mobile-nav";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const Header = () => {
  const [isActive, setIsActive] = useState(false);
  const navList = [
    {
      title: "Home",
      path: "#hero",
    },
    {
      title: "Features",
      path: "#features",
    },
    {
      title: "Pricing",
      path: "#pricing",
    },
    {
      title: "Login",
      path: "/login",
    },
    {
      title: "Request A Demo",
      path: "#contact",
    },
  ];
  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute("href")?.substring(1);
    const targetElement = document.getElementById(targetId || "");
    if (targetElement) {
      setTimeout(() => {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: "smooth",
        });
      }, 500);
    }
  };
  return (
    <div className="flex justify-between items-center relative max-w-full lg:max-w-[75%] md:mx-auto w-full py-2">
      <div className="w-[65%] lg:w-[400px] cursor-pointer">
        <a href="/">
        <picture>
          <img src="/wickedchatbots.svg" alt="Wickedchatbots" className="" />
        </picture>
        </a>
      </div>
      {/* for desktop */}
      <div className="hidden md:flex justify-evenly items-center">
        <ul className="list-none flex justify-evenly items-center text-[14px] lg:text-[16px]">
          {navList.map((nav, index) => (
            <li key={index}>
              {nav.title === "Login" ? (
                <a
                  href={nav.path}
                  className="px-[12px] py-2 border border-[#4840C9] mr-5 hover:shadow-lg rounded-md hover:shadow-[#6662a5]"
                >
                  {nav.title}
                </a>
              ) : nav.title === "Request A Demo" ? (
                <a
                  href={nav.path}
                  onClick={handleClick}
                  className="pl-[12px] w-[150px] lg:w-[165px] py-2 bg-[#4840C9] rounded-md flex items-center hover:shadow-lg hover:shadow-[#6662a5]"
                >
                  {nav.title}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="rgba(255,255,255,1)"
                    className="mt-[2px] ml-[2px]"
                  >
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                  </svg>
                </a>
              ) : (
                <a
                  href={nav.path}
                  onClick={handleClick}
                  className="px-5 hover:text-[#4840C9] hover:underline font-semibold"
                >
                  {nav.title}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
      {/* for mobile */}
      <DropdownMenu>
        <DropdownMenuTrigger
          onClick={handleToggle}
          className="md:hidden duration-300 transition-all mr-[22px]"
        >
          {isActive ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="rgba(255,255,255,1)"
            >
              <path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="rgba(255,255,255,1)"
            >
              <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path>
            </svg>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[20rem] shadow-xl shadow-[#333333] absolute -right-[16px] top-[25px] text-white bg-[#131212] border-[#131212] md:hidden">
          {navList.map((navItem, index) => (
            <React.Fragment key={index}>
              <DropdownMenuItem>
                <Link href={navItem.path}>{navItem.title}</Link>
              </DropdownMenuItem>

              {index !== navList.length - 1 && (
                <DropdownMenuSeparator className="bg-[#333333]" />
              )}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Header;
