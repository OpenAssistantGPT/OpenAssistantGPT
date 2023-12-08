import { SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  name: "OpenAssistantGPT",
  description:
    "An open source application built using OpenAI custom gpts.",
  url: process.env.NEXT_PUBLIC_VERCEL_URL || "",
  ogImage: process.env.NEXT_PUBLIC_VERCEL_URL || "",
  links: {
    twitter: "https://twitter.com/marcolivierbouch",
    github: "https://github.com/marcolivierbouch",
  },
}