
import Link from "next/link"

import { marketingConfig } from "@/config/marketing"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default function MarketingLayout({
  children,
}: MarketingLayoutProps) {

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between px-4 py-6">
          <MainNav items={marketingConfig.mainNav} />
          <nav className="flex h-20 items-center justify-between px-4 py-6 gap-4">


          <Link
              href="/signup"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
        "px-4",
                "text-white", // White text for contrast
                "hover:text-gray-200", // Slightly lighter text on hover
                "hover:bg-gray-800", // Dark gray background on hover
                "active:text-gray-400", // Even lighter text on active state
                "bg-green-700" // Almost black background on active state
              )}
            >
              Sign up
            </Link>

            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "px-4",
                 "border-black",
                "text-black", // White text for contrast
                "hover:text-gray-200", // Slightly lighter text on hover
                "hover:bg-gray-800", // Dark gray background on hover
                "active:text-gray-400", // Even lighter text on active state
                "bg-gray-200" // Almost black background on active state
              )}
            >
              Log in
            </Link>

          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <SiteFooter simpleFooter={true} />
    </div>
  )
}