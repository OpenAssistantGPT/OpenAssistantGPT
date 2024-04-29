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


interface InquiryEmailProps {
    ownerName: string | null | undefined;
    userEmail: string | null | undefined;
    userInquiry: string | null | undefined;
    chatbotName: string | null | undefined;
    chatbotId: string | null | undefined;
}

export default function InquiryEmail({ ownerName, userEmail, userInquiry, chatbotName, chatbotId }: InquiryEmailProps) {
    const previewText = `New User Inquiry ${chatbotName}!`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="my-10 mx-auto p-5 w-[465px]">
                        <Heading className="text-2xl font-normal text-center p-0 my-8 mx-0">
                            You have a new user inquiry from {userEmail} !
                        </Heading>
                        <Text className="text-sm">Hello {ownerName},</Text>
                        <Text className="text-sm">
                            You have received a new inquiry from a user. Here are the details:

                            <br />
                            <br />
                            <b>Chatbot Name:</b> {chatbotName}
                            <br />
                            <b>User Email:</b> {userEmail}
                            <br />
                            <b>Inquiry Message:</b> {userInquiry}
                            <br />
                            <br />
                            Open your dashboard to view the inquiry and the full conversation.
                        </Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="p-2 bg-[#00A3FF] rounded text-white text-xs font-semibold no-underline text-center"
                                href={`${siteConfig.url}dashboard/chatbots/${chatbotId}/inquiries`}
                            >
                                Open Inquiries Dashboard
                            </Button>
                        </Section>
                        <Text className="text-sm">
                            Cheers,
                            <br />
                            The {siteConfig.name} Team
                        </Text>
                        <Text className="text-center text-gray-400">
                            You are subscribed to the emails for Inquiry notifications. To manage your communication preferences, click <Link className="underline text-gray-400" href={`${siteConfig.url}dashboard/settings`}>
                                here
                            </Link>
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};