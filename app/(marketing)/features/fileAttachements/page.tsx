import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";

export default function CustomizationFeaturePage() {

    return (
        <>
            <section data-aos="fade-up" className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 py-12 md:py-24 lg:py-32">
                <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
                    <Link
                        href={siteConfig.links.twitter}
                        className="rounded-2xl border shadow-md bg-muted px-4 py-1.5 text-sm font-medium"
                        target="_blank"
                    >
                        Find us on 𝕏
                    </Link>
                    <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                        Build your own chatbot with OpenAI Assistant
                    </h1>
                    <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                        An open source platform for building chatbot with the Assistant API. We offer seamless integration for effortlessly incorporating a chatbot into your website.
                    </p>
                    <div className="space-x-4 space-y-4">
                        <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
                            <Icons.bot className="h-4 w-4 mr-2"></Icons.bot>
                            Get Started for Free
                        </Link>
                        <Link
                            href={siteConfig.links.github}
                            target="_blank"
                            rel="noreferrer"
                            className={cn(buttonVariants({ variant: "outline", size: "lg" }), 'bg-white')}
                        >
                            <Icons.gitHub className="h-4 w-4 mr-2"></Icons.gitHub> GitHub
                        </Link>
                    </div>
                    <Image data-aos="zoom-in" priority={false} className="mt-10 border shadow-lg" src="/dashboard.png" width={810} height={540} alt="Dashboard" />
                </div>
            </section>
        </>
    )
}