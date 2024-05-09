"use client"

import Script from "next/script";
import { useEffect } from "react";
import { Suspense } from 'react'
import { useSearchParams } from "next/navigation";


export default function Chatbot() {

    useEffect(() => {
        (window as any).chatbotConfig = {
            chatbotId: "clq6m06gc000114hm42s838g2"
        };
    }, []);

    function enableChatbox() {
        const searchParams = useSearchParams()
       
        return !(params.get('chatbox') || '').match('false')
      }


    return (
        <>
            <Suspense>
                {
                    enableChatbox() && (
                        <Script src="https://openassistantgpt.io/chatbot.js" strategy="afterInteractive" />
                    )
                }
            </Suspense>
        </>
    )
}