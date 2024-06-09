
import { DashboardConfig } from "@/types"

export const dashboardConfig: DashboardConfig = {
    mainNav: [
        {
            title: "Support",
            href: "/dashboard/support",
        },
    ],
    sidebarNav: [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: "dashboard",
        },
        {
            title: "Chatbots",
            href: "/dashboard/chatbots",
            icon: "bot",
        },
        {
            title: "Crawlers",
            href: "/dashboard/crawlers",
            icon: "post",
        },
        {
            title: "Files",
            href: "/dashboard/files",
            icon: "folder",
        },
        {
            title: "Exports",
            href: "/dashboard/exports",
            icon: "download",
        },
        {
            title: "Billing",
            href: "/dashboard/billing",
            icon: "billing",
        },
        {
            title: "Settings",
            href: "/dashboard/settings",
            icon: "settings",
        }
    ],
}