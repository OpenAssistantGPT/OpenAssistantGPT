"use client"

import Script from "next/script";
import { useEffect } from "react";

import { useSearchParams } from "next/navigation";


export default function Chatbot() {
    const params = useSearchParams()

    useEffect(() => {
        (window as any).chatbotConfig = {
            chatbotId: "clq6m06gc000114hm42s838g2"
        };
    }, []);


    return (
        <>
            {
                !(params.get('chatbox') || '').match('false') && (
                    <Script src="https://openassistantgpt.io/chatbot.js" strategy="afterInteractive" />
                )
            }
        </>
    )
}