import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Icons } from "@/components/icons";

export default function CustomizationFeaturePage() {

    return (
        <>
            <section data-aos="fade-up" className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 py-12 md:py-24 lg:py-32">
                <div className="container flex flex-row max-w-[64rem] items-center gap-4">
                    <div className="flex flex-col gap-4 mr-10">
                    <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                        Build your fully customizable chatbot
                    </h1>
                    <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                        Change the look and feel of your chatbot to match your brand. With more than 9 different customization options and choose any color than you want.
                    </p>
                    <div className="space-x-4 space-y-4">
                        <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
                            <Icons.bot className="h-4 w-4 mr-2"></Icons.bot>
                            Get Started for Free
                        </Link>
                    </div>
                    </div>
                    <Image data-aos="zoom-in" priority={false} className="mt-10 border shadow-lg" src="/dashboard.png" width={810} height={540} alt="Dashboard" />
                </div>
            </section>
        </>
    )
}