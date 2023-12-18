"use client"

import Script from "next/script";
import { useEffect } from "react";

export default function Chatbot() {

    useEffect(() => {
        (window as any).chatbotConfig = {
            chatbotId: "clq6m06gc000114hm42s838g2"
        };

    }, []);

    return (
        <Script src="https://openassistantgpt.io/chatbot.js" strategy="afterInteractive" />
    )
}