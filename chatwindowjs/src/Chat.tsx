import React, { useEffect, useState } from 'react';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Chatbot } from "@prisma/client"

import { Icons } from "@/components/icons"
import { siteConfig } from "@/config/site"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Message,
  // import as useAssistant:
  experimental_useAssistant as useAssistant,
} from 'ai/react';


export default function ChatBox() {
  const [config, setConfig] = useState<ChatbotConfig>()
  const [chatbotId, setChatbotId] = useState<string>()

  const { status, messages, input, submitMessage, handleInputChange } =
    useAssistant({ api: `${siteConfig.url}api/chatbots/${window.chatbotConfig.chatbotId}/chat` });

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

  return (
    <Card className="flex border flex-col w-full overflow-hidden">
      <CardHeader className="border-b p-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Avatar className="relative overflow-visible w-10 h-10">
            <span className="absolute right-0 top-0 flex h-3 w-3 rounded-full bg-green-600" />
            <AvatarImage alt="User Avatar" src="https://identicons.pgmichael.com/" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            {config ? config!.chatTitle : ""}
            <span className="text-xs text-green-600 block">Online</span>
          </div>
        </h2>
      </CardHeader>
      <CardContent className="border-b overflow-auto p-4">
        <div className="space-y-4">
          <div key="0" className="flex items-end gap-2">
            <div className="rounded-lg bg-zinc-200 p-2">
              <p className="text-sm">{config ? config!.welcomeMessage : ""}</p>
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
      </CardContent>
      <CardFooter className="p-4">
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
              variant="outline"
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
      </CardFooter >
    </Card >
  )
}
