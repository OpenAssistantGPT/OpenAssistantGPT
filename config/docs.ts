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
                    title: "OpenAI Assistant API",
                    href: "/docs/documentation/openai-assistant-api",
                },
                {
                    title: "Chatbot Embedding",
                    href: "/docs/documentation/embed",
                },
                {
                    title: "Pricing",
                    href: "/docs/pricing",
                },
                {
                    title: "Licensing",
                    href: "/docs/licensing",
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
                    title: "See your chatbot's threads",
                    href: "/guides/how-to-see-all-your-chatbot-threads",
                },
                {
                    title: "Build smart assistant chatbot for your website",
                    href: "/guides/how-to-build-smart-chatbot-for-your-webiste",
                },
                {
                    title: "How to use message exports correctly",
                    href: "/guides/how-to-use-message-exports-correctly",
                },
            ],
        },
    ],
}