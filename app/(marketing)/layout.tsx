
'use client';
import Link from "next/link"
import { marketingConfig } from "@/config/marketing"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import Header from "@/components/LandingPage/Header/Header"
import Footer from "@/components/LandingPage/Footer/Footer"
interface MarketingLayoutProps {
  children: React.ReactNode
}

export default function MarketingLayout({
  children,
}: MarketingLayoutProps) {

  return (
    <div className="flex min-h-screen flex-col bg-black text-[#ffffff]">
      <header className="z-40 ">
        <div className="flex h-20 items-center justify-between py-6">
          <Header/>
          {/* <MainNav items={marketingConfig.mainNav} /> */}
          {/* <nav>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "px-4"
              )}
            >
              Login
            </Link>
          </nav> */}
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <Footer/>
      {/* <SiteFooter simpleFooter={false} /> */}
    </div>
  )
}