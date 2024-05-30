"use client"

import { Suspense, useEffect } from 'react'
import { useSearchParams } from "next/navigation";


export default function Chatbot() {

    const customStyle = {
        marginRight: '1rem',
        marginBottom: '6rem',
        display: 'none',
        position: 'fixed',
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        height: '65vh',
        border: '2px solid #e2e8f0',
        borderRadius: '0.375rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        width: '30rem'
    };

    useEffect(() => {
        window.addEventListener('message', function (event) {
            var iframe = document.getElementById('openassistantgpt-chatbot-iframe');
            var buttonIframe = document.getElementById('openassistantgpt-chatbot-button-iframe');

            if (event.data === 'openChat') {
                console.log('Toggle chat visibility');
                if (iframe && buttonIframe) {
                    // send openChat to iframe
                    iframe.contentWindow.postMessage('openChat', '*');
                    buttonIframe.contentWindow.postMessage('openChat', '*');
                    iframe.style.pointerEvents = 'auto';
                    iframe.style.display = 'block';
                    // Check if the screen width is less than 640 pixels
                    if (window.innerWidth < 640) {
                        // Make the iframe fullscreen
                        iframe.style.position = 'fixed';
                        iframe.style.width = '100%';
                        iframe.style.height = '100%';
                        iframe.style.top = '0';
                        iframe.style.left = '0';
                        iframe.style.zIndex = '9999';
                    } else {
                        // remove fullscreen
                        iframe.style.position = 'fixed';
                        iframe.style.width = '30rem';
                        iframe.style.height = '65vh';
                        iframe.style.bottom = '0';
                        iframe.style.right = '0';

                        iframe.style.top = '';
                        iframe.style.left = '';
                    }
                } else {
                    // insert an iframe in the body
                    console.error('iframe not found');
                }
            }

            if (event.data === 'closeChat') {
                // No need to redefine iframe here, already defined above
                if (iframe && buttonIframe) {
                    iframe.style.display = 'none';
                    iframe.style.pointerEvents = 'none';
                    // send openChat to iframe
                    iframe.contentWindow.postMessage('closeChat', '*');
                    buttonIframe.contentWindow.postMessage('closeChat', '*');
                }
            }
        });
    });


    function Chatbox() {
        const params = useSearchParams()

        if ((params.get('chatbox') || '').match('false')) {
            return <></>
        } else {
            return (
                <>
                    <iframe
                        src={`/embed/clq6m06gc000114hm42s838g2/button?chatbox=false`}
                        scrolling='no'
                        id="openassistantgpt-chatbot-button-iframe"
                        className="fixed bottom-0 right-0 mb-4 z-50 flex items-end inline-block mr-4 w-14 h-14 border border-gray-300 rounded-full shadow-md"
                    ></iframe>
                    <iframe
                        src={`/embed/clq6m06gc000114hm42s838g2/window?chatbox=false&withExitX=true`}
                        style={customStyle}
                        allowFullScreen
                        className='z-50'
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
                    <Chatbox />
                }
            </Suspense>
        </div>
    )
}