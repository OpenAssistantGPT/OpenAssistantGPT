import Link from "next/link";

import { Metadata } from "next";

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Welcome",
  description: "Welcome to the app!",
}

export default async function Welcome() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const chatbots = await db.chatbot.count({
    where: {
      userId: user.id,
    },
  })

  if (chatbots) {
    redirect("/dashboard")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <div data-aos="fade-up" data-aos-duration="1000" className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.bot className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to {siteConfig.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Let&apos;s get started with creating your first chatbot. We highly recommend you to go through our onboarding process to get started.
          </p>
          <div className="flex flex-col space-y-5 pt-10">
            <Link data-aos="fade-left" data-aos-duration="3000" className="shadow-lg border border-gray inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary rounded text-secondary-foreground hover:bg-secondary/80" href={"/dashboard/onboarding"}>
              <Button variant="secondary">Start with our Onboarding</Button>
            </Link>
            <Link data-aos="fade-right" data-aos-duration="3000" className="shadow-lg border border-gray inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary rounded text-secondary-foreground hover:bg-secondary/80" href={"/dashboard"}>
              <Button variant="secondary">Skip to dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
