
import { User } from "@prisma/client"
import type { Icon } from "lucide-react"

import { Icons } from "@/components/icons"

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type MainNavItem = NavItem

export type SidebarNavItem = {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
} & (
    | {
      href: string
      items?: never
    }
    | {
      href?: string
      items: NavLink[]
    }
  )


export type DashboardConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type DocsConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
    productHunt: string
  }
}

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
    stripeCurrentPeriodEnd: number
  }


export type MarketingConfig = {
  mainNav: MainNavItem[]
}

export type CrawlerPublishedFile = {
  crawlerFileId: string
  openAIFileId: string
  name: string
}

export type UploadPublishedFile = {
  uploadFileId: string
  openAIFileId: string
  name: string
}

export type SubscriptionPlan = {
  name: string
  description: string
  stripePriceId: string

  // Specs
  maxChatbots: number

  unlimitedMessages: boolean
  maxMessagesPerMonth: number | undefined

  maxFiles: number

  maxCrawlers: number

  premiumSupport?: boolean

  price: number | undefined
}

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
    stripeCurrentPeriodEnd: number
    isPro: boolean
  }