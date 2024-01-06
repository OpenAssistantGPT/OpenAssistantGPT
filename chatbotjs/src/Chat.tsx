import React, { useEffect, useState } from 'react';

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/KeLSEuc92jy
 */
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { siteConfig } from "@/config/site"
import {
  Message,
  // import as useAssistant:
  experimental_useAssistant as useAssistant,
} from 'ai/react';

interface ChatbotConfig {
  id: number;
  welcomeMessage: string;
}

export default function ChatBox() {
  const [config, setConfig] = useState<ChatbotConfig>()
  const [chatbotId, setChatbotId] = useState<string>()
  const [isChatVisible, setIsChatVisible] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  const { status, messages, input, submitMessage, handleInputChange } =
    useAssistant({ api: `${siteConfig.url}api/chatbots/${window.chatbotConfig.chatbotId}/chat` });

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const init = async () => {
      const id = window.chatbotConfig.chatbotId
      setChatbotId(id)

      const config = await fetch(`${siteConfig.url}api/chatbots/${id}/config`)
      const chatbotConfig: ChatbotConfig = await config.json()
      setConfig(chatbotConfig)
    };
    init();
  }, [])

  const chatboxClassname = isMobile ? "w-full max-h-[80vh]" : "max-w-md max-h-[80vh]"

  return (
    <div className="fixed bottom-0 right-0 ml-4 mb-4 mr-4 z-50 flex items-end">
      {isChatVisible &&
        <Card className={chatboxClassname + " ml-2 mr-2 overflow-auto bg-white shadow-lg rounded-lg transform transition-transform duration-200 ease-in-out mb-4"}>
          <div className="flex shadow justify-between items-center p-4">
            <h3 className="text-lg font-semibold">Chat with us</h3>
            <div>
              <Button onClick={toggleChatVisibility} variant="ghost">
                <IconClose className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="space-y-4">
              <div key="0" className="flex items-end gap-2">
                <div className="rounded-lg bg-zinc-200 p-2">
                  <p className="text-sm">{config!.welcomeMessage}</p>
                </div>
              </div>
              {
                messages.map((message: Message) => {
                  if (message.role === "assistant") {
                    return (
                      <div key={message.id} className="flex items-end gap-2">
                        <div className="rounded-lg bg-zinc-200 p-2">
                          {message.content.replace(/\【\d+†source】/g, '') // Remove citation markers
                            .split('```').map((block, blockIdx) => {
                              // Check if the block is a code block or normal text
                              if (blockIdx % 2 === 1) {
                                // Render code block
                                return <pre key={blockIdx}><code>{block}</code></pre>;
                              } else {
                                // Process normal text for ** and \n
                                return block.split('\n').map((line, lineIndex, lineArray) => (
                                  <p key={`${blockIdx}-${lineIndex}`} className={`text-sm ${lineIndex < lineArray.length - 1 ? 'mb-4' : ''}`}>
                                    {line.split('**').map((segment, segmentIndex) => {
                                      // Render bold text for segments surrounded by **
                                      if (segmentIndex % 2 === 1) {
                                        return <strong key={segmentIndex}>{segment}</strong>;
                                      } else {
                                        // Render normal text for other segments
                                        return <span key={segmentIndex}>{segment}</span>;
                                      }
                                    })}
                                  </p>
                                ));
                              }
                            })}
                        </div>
                      </div>
                    )
                  } else {
                    return (
                      <div key={message.id} className="flex items-end gap-2 justify-end">
                        <div className="rounded-lg bg-blue-500 text-white p-2">
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    )
                  }
                })
              }

              {status === 'in_progress' && (
                <div className="h-8 w-full max-w-md p-2 mb-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse" />
              )}
            </div>
          </div>
          <div className="text-center text-zinc-400 text-sm">
            Powered by <a href="https://www.openassistantgpt.io/">{siteConfig.name}</a>
          </div>

          <div className="border-t border-gray-200 p-4">

            <div
              className='w-full flex items-center gap-2'
            >
              <form onSubmit={submitMessage}
                className="flex align-right gap-2 items-end w-full"
              >
                <Input
                  disabled={status !== 'awaiting_message'}
                  className="w-full border border-gray-300 rounded shadow-sm"
                  value={input}
                  placeholder="Type a message..."
                  onChange={handleInputChange}
                />
                <Button type="submit"
                  disabled={status !== 'awaiting_message'}
                  className="flex-none w-1/3"
                >
                  {status !== 'awaiting_message' && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Send
                </Button>
              </form>
            </div>
          </div >
        </Card >
      }
      {
        !isChatVisible &&
        <Button className="shadow-lg border bg-white border-gray-200 rounded-full p-3"
          onClick={toggleChatVisibility} variant="ghost">
          {!isChatVisible && <Icons.message />}
          {isChatVisible && <Icons.close />}
        </Button>
      }
      {
        isChatVisible && !isMobile &&
        <Button className="shadow-lg border bg-white border-gray-200 rounded-full p-3"
          onClick={toggleChatVisibility} variant="ghost">
          {!isChatVisible && <Icons.message />}
          {isChatVisible && <Icons.close />}
        </Button>
      }
    </div >
  )
}

function IconClose(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="3" x2="21" y1="9" y2="9" />
      <path d="m9 16 3-3 3 3" />
    </svg>
  )
}


function IconSend(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}
