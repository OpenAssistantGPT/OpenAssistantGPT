import { DashboardHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { DashboardShell } from "@/components/shell"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import Link from "next/link"

export const metadata = {
    title: `${siteConfig.name} - Support`,
}

export default async function SupportPage() {

    return (
        <DashboardShell>
            <DashboardHeader heading="Support" text="Welcome to Our Support Page.">
                <Link
                    href="/dashboard"
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "md:left-8 md:top-8"
                    )}
                >
                    <>
                        <Icons.chevronLeft className="mr-2 h-4 w-4" />
                        Back
                    </>
                </Link>
            </DashboardHeader>
            <div >
                <p className="text-lg font-semibold">How can we help you?</p>
                <p className="text-muted-foreground">
                    First, before reaching out you can always try our chatbot. He knows a lot about our platform he might be able to help you.
                    <br />
                    If you still have issue with our app you can open a <a className="underline" href={siteConfig.links.github + '/issues'}>Github issue</a>, so we can help you to fix it and it will help us to improve our app.
                </p>
                {/* <div className="min-w-[85%] min-h-[15rem] text-left items-left pt-6">
                    <iframe
                        src="/embed/clq6m06gc000114hm42s838g2/window?chatbox=false"
                        className="overflow-hidden border border-1 rounded-lg shadow-lg w-full h-[65vh]"
                        allowFullScreen allow="clipboard-read; clipboard-write"
                    ></iframe>
                </div> */}
            </div>
        </DashboardShell >
    )
}