
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { SidebarNavItem } from "@/types"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { UpgradePlanButton } from "./upgrade-plan-button"

interface DashboardNavProps {
    items: SidebarNavItem[]
}

export function DashboardNav({ items }: DashboardNavProps) {
    const path = usePathname()

    if (!items?.length) {
        return null
    }

    return (
        <nav className="flex flex-col justify-center h-250px gap-10">
            <div>
                {items.map((item, index) => {
                    const Icon = Icons[item.icon || "arrowRight"]
                    return (
                        item.href && (
                            <Link key={index} href={item.disabled ? "/" : item.href}>
                                <span
                                    className={cn(
                                        "group flex items-center rounded-md px-3 py-2 text-md font-medium hover:bg-accent hover:text-accent-foreground",
                                        path === item.href ? "bg-accent" : "transparent",
                                        item.disabled && "cursor-not-allowed opacity-80"
                                    )}
                                >
                                    <Icon className="mr-2 h-4 w-4" />
                                    <span>{item.title}</span>
                                </span>
                            </Link>
                        )
                    )
                })}
            </div>

            <div  className=" mt-60">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Upgrade your plan</CardTitle>
                    <CardDescription className="text-xs">
                        Unlock more features by upgrading your plan and get premium support.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UpgradePlanButton size="lg" />
                </CardContent>
            </Card>
            </div>
            
        </nav>
    )
}