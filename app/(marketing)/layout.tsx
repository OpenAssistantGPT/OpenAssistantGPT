'use client'

import Link from "next/link"

import { marketingConfig } from "@/config/marketing"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { Background } from "@/components/background"
import { useEffect, useState } from "react"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default function MarketingLayout({
  children,
}: MarketingLayoutProps) {

  const [isHeaderTransparent, setIsHeaderTransparent] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsHeaderTransparent(scrollTop === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Background />
      <header
        className={`z-40 ${
          isHeaderTransparent ? "bg-transparent" : "bg-white/75 backdrop-blur-lg border-b"
        } sticky inset-x-0 top-0 w-full transition-all duration-1000`}
      >
        <div className="container flex h-20 items-center justify-between py-6 ">
          <MainNav items={marketingConfig.mainNav} />
          <nav>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "px-4 border shadow-md"
              )}
            >
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 z-10">
        {children}
      </main>
      <SiteFooter className="z-40" simpleFooter={false} />
    </div>
  );
}