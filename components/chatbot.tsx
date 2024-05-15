"use client"

import { Suspense } from 'react'
import { useSearchParams } from "next/navigation";


export default function Chatbot() {


    function useChatbot() {
        const params = useSearchParams()

        if ((params.get('chatbox') || '').match('false')) {
            return <></>
        } else {
            return (
                <>
                    <script dangerouslySetInnerHTML={{
                        __html: `
                                window.addEventListener("message",function(t){var e=document.getElementById("openassistantgpt-chatbot-iframe"),s=document.getElementById("openassistantgpt-chatbot-button-iframe");"openChat"===t.data&&(console.log("Toggle chat visibility"),e&&s?(e.contentWindow.postMessage("openChat","*"),s.contentWindow.postMessage("openChat","*"),e.style.pointerEvents="auto",e.style.display="block",window.innerWidth<640?(e.style.position="fixed",e.style.width="100%",e.style.height="100%",e.style.top="0",e.style.left="0",e.style.zIndex="9999"):(e.style.position="fixed",e.style.width="30rem",e.style.height="65vh",e.style.bottom="0",e.style.right="0",e.style.top="",e.style.left="")):console.error("iframe not found")),"closeChat"===t.data&&e&&s&&(e.style.display="none",e.style.pointerEvents="none",e.contentWindow.postMessage("closeChat","*"),s.contentWindow.postMessage("closeChat","*"))});
      `}} />
                    <iframe
                        src="http://localhost:3000/embed/clq6m06gc000114hm42s838g2/button?chatbox=false"
                        scrolling='no'
                        id="openassistantgpt-chatbot-button-iframe"
                        className="fixed bottom-0 right-0 mb-4 z-50 flex items-end inline-block mr-4 w-14 h-14 border border-gray-300 rounded-full shadow-md"
                    ></iframe>
                    <iframe
                        src="http://localhost:3000/embed/clq6m06gc000114hm42s838g2/window?chatbox=false&withExitX=true"
                        className='md:block fixed mr-4 mb-24 fixed right-0 bottom-0 pointer-events-none overflow-hidden h-4/6 border border-gray-300 rounded-lg shadow-md'
                        style={{
                            display: 'none',
                            width: '30rem'
                        }}
                        allowFullScreen
                        id="openassistantgpt-chatbot-iframe"
                    ></iframe>
                </>
            )
        }
    }


    return (
        <div>
            <Suspense>
                {
                    <useChatbot />
                }
            </Suspense>
        </div>
    )
}