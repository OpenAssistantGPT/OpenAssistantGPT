"use client"

import { Suspense } from 'react'
import { useSearchParams } from "next/navigation";


export default function Chatbot() {


    function useChatbot() {
        const params = useSearchParams()

        if ((params.get('chatbox') || '').match('false')) {
            return false
        } else {
            return true
        }
    }


    return (
        <div>
            <Suspense>
                {
                    useChatbot() == true && (
                        <>
                            <script dangerouslySetInnerHTML={{
                                __html: `
        window.addEventListener("message",function(t){if("openChat"===t.data){console.log("Toggle chat visibility");var e=document.getElementById("openassistantgpt-chatbot-iframe");e?(e.style.display="block",e.style.pointerEvents="auto"):console.error("iframe not found")}if("closeChat"===t.data){var e=document.getElementById("openassistantgpt-chatbot-iframe");e&&(e.style.display="none",e.style.pointerEvents="none")}});
      `}} />
                            <iframe
                                src="http://localhost:3000/embed/clq6m06gc000114hm42s838g2/button?chatbox=false"
                                scrolling='no'
                                className="fixed bottom-0 right-0 mb-4 z-50 flex items-end inline-block mr-4 w-14 h-14 border border-black rounded-full shadow-md"
                            ></iframe>
                            <iframe
                                src="http://localhost:3000/embed/clq6m06gc000114hm42s838g2/window?chatbox=false"
                                className='md:block fixed mr-4 mb-24 fixed right-0 bottom-0 pointer-events-none overflow-hidden h-4/6 border border-gray-300 rounded-lg shadow-md'
                                style={{
                                    display: 'none',
                                    width: '30rem'
                                }}
                                allowFullScreen
                                id="openassistantgpt-chatbot-iframe"
                            ></iframe>
                        </>)
                }
            </Suspense>
        </div>
    )
}