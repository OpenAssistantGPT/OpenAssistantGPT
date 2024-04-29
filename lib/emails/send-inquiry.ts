import InquiryEmail from "@/emails/inquiry";
import { siteConfig } from "@/config/site";
import { email as EmailClient } from "@/lib/email";

export async function sendNewInquiryEmail({ email, ownerName, userEmail, userInquiry, chatbotName, chatbotId }: { email: string | null | undefined, ownerName: string | null | undefined, userEmail: string | null | undefined, userInquiry: string | null | undefined, chatbotName: string | null | undefined, chatbotId: string | null | undefined }) {
    const emailTemplate = InquiryEmail({ ownerName, userEmail, userInquiry, chatbotName, chatbotId });
    try {
        // Send the email using the Resend API
        await EmailClient.emails.send({
            from: "OpenAssistantGPT <no-reply@openassistantgpt.io>",
            to: email as string,
            subject: `${siteConfig.name} - New User Inquiry!`,
            react: emailTemplate,
        });
    } catch (error) {
        // Log any errors and re-throw the error
        console.log({ error });
        //throw error;
    }
}