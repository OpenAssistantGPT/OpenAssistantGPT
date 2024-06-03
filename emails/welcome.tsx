import React from "react";
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
    Tailwind,
    Section,
    Link,
} from "@react-email/components";
import { siteConfig } from "@/config/site";


interface WelcomeEmailProps {
    name: string | null | undefined;
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
    const previewText = `Welcome to ${siteConfig.name}, ${name}!`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="my-10 mx-auto p-5 w-[465px]">
                        <Heading className="text-2xl font-normal text-center p-0 my-8 mx-0">
                            Welcome to {siteConfig.name}!
                        </Heading>
                        <Text className="text-sm">Hello {name},</Text>
                        <Text className="text-sm">
                            We're excited to have you onboard at <span>{siteConfig.name}</span>. We
                            hope you enjoy your journey with us. If you have any questions or
                            need assistance, feel free to reach out.
                        </Text>
                        <Text>
                            You can contact us directly with the email openassistantgpt@gmail.com
                        </Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="p-2 bg-[#00A3FF] rounded text-white text-xs font-semibold no-underline text-center"
                                href={`${siteConfig.url}dashboard/onboarding`}
                            >
                                Get Started
                            </Button>
                        </Section>
                        <Text className="text-sm">
                            Cheers,
                            <br />
                            The {siteConfig.name} Team
                        </Text>
                        <Text className="text-center text-gray-400">
                            You are subscribed to the marketing emails. To manage your communication preferences, click <Link className="underline text-gray-400" href={`${siteConfig.url}dashboard/settings`}>
                                here
                            </Link>
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};