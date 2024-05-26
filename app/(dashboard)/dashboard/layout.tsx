import { notFound } from "next/navigation"

import { dashboardConfig } from "@/config/dashboard"
import { getCurrentUser } from "@/lib/session"
import { MainNav } from "@/components/main-nav"
import { DashboardNav } from "@/components/nav"
import { SiteFooter } from "@/components/site-footer"
import { UserAccountNav } from "@/components/user-account-nav"

interface DashboardLayoutProps {
    children?: React.ReactNode
}

export default async function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    const user = await getCurrentUser()

    if (!user) {
        return notFound()
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 border-b bg-background">
                <div className="container flex h-16 items-center justify-between py-4">
                    <MainNav items={dashboardConfig.mainNav} />
                    
                    <UserAccountNav
                        user={{
                            name: user.name,
                            image: user.image,
                            email: user.email,
                        }}
                    />
                </div>
            </header>
            <div className="container flex flex-1 gap-12 md:grid md:grid-cols-[200px_1fr]">
                <aside className="hidden md:flex flex-col w-[200px] sticky top-20 h-[calc(100vh-4rem)] overflow-y-auto">
                    <DashboardNav items={dashboardConfig.sidebarNav} />
                </aside>
                <main className="flex w-full flex-1 flex-col overflow-hidden">
                    {children}
                </main>
            </div>
            <SiteFooter simpleFooter={true} />
        </div>
    )
}
