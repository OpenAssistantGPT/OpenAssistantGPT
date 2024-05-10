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

    function Chatbox() {
        const params = useSearchParams()
       
        if (!(params.get('chatbox') || '').match('false')) {
           return <Script src="https://openassistantgpt.io/chatbot.js" strategy="afterInteractive" />
        } else {
            return <></>
        }
      }


    return (
        <>
            <Suspense>
                <Chatbox/>
            </Suspense>
        </>
    )
}