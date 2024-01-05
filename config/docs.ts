import { DocsConfig } from "@/types"

export const docsConfig: DocsConfig = {
    mainNav: [
        {
            title: "Documentation",
            href: "/docs",
        },
        {
            title: "Guides",
            href: "/guides",
        },
    ],
    sidebarNav: [
        {
            title: "Getting Started",
            items: [
                {
                    title: "Introduction",
                    href: "/docs",
                },
            ],
        },
        {
            title: "Documentation",
            items: [
                {
                    title: "Introduction",
                    href: "/docs/documentation",
                },
                {
                    title: "Crawlers",
                    href: "/docs/documentation/crawlers",
                },
                {
                    title: "Files",
                    href: "/docs/documentation/files",
                },
                {
                    title: "Chatbots",
                    href: "/docs/documentation/chatbots",
                },
                {
                    title: "Pricing",
                    href: "/docs/pricing",
                },
            ],
        },
        {
            title: "Guides",
            items: [
                {
                    title: "Build a good prompt",
                    href: "/guides/how-to-build-a-good-prompt-for-your-chatbot",
                },
                {
                    title: "All guides",
                    href: "/guides",
                },
            ],
        },
    ],
}