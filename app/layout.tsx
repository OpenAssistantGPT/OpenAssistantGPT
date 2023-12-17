import { Analytics } from '@vercel/analytics/react'
// These styles apply to every route in the application
import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google"
import localFont from "next/font/local"

import { Metadata } from "next";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
})

const title = `Welcome to ${siteConfig.name}`;
const description = "OpenAssistantGPT is an open source platform for building chatbot using OpenAI's assitants.";

export const metadata: Metadata = {
  title,
  description,
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  metadataBase: new URL('https://openassitantgpt.io/'),
  openGraph: {
    title: title,
    description: description,
    url: new URL('https://openassitantgpt.io/'),
    siteName: 'OpenAssistantGPT',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en suppressHydrationWarning">
      <head />
      <body
        id='root'
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
