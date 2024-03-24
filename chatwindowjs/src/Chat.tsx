import React, { useEffect, useState } from 'react';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Icons } from "@/components/icons"
import { siteConfig } from "@/config/site"

import { CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Message,
  // import as useAssistant:
  experimental_useAssistant as useAssistant,
} from 'ai/react';
import { ChatbotConfig } from '@/types';


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
    <div className="rounded-lg bg-card text-card-foreground shadow-sm flex border-none bg-white shadow-lg flex-col w-full overflow-hidden">
      <CardHeader style={{ background: config ? config!.chatHeaderBackgroundColor : "" }} className="shadow border-b p-4">
        <h2 style={{ color: config ? config!.chatHeaderTextColor : "" }} className="text-xl font-bold flex items-center gap-2">
          <div>
            {config ? config!.chatTitle : ""}
            <span className="text-xs text-green-600 block">Online</span>
          </div>
        </h2>
      </CardHeader>
      <CardContent className="border-b overflow-auto p-4 flex-grow overflow-y-auto">

        <div className="space-y-4">
          <div key="0" className="flex items-end gap-2">
            <div className="rounded-lg bg-zinc-200 p-2" style={{ background: config ? config.chatbotReplyBackgroundColor : "" }}>
              <p className="text-md" style={{ color: config ? config.chatbotReplyTextColor : "" }}>{config ? config!.welcomeMessage : ""}</p>
            </div>
          </div>
          {
            messages.map((message: Message) => {
              if (message.role === "assistant") {
                return (
                  <div key={message.id} className="flex items-end gap-2">
                    <div className="rounded-lg bg-zinc-200 p-2" style={{ color: config ? config.chatbotReplyTextColor : "", background: config ? config.chatbotReplyBackgroundColor : "" }}>
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
                                    // Replace URLs with Next.js Link tags or standard <a> tags
                                    const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s]+[^.])\)/g;
                                    const regularLinkRegex = /(https?:\/\/[^\s]+[^.])/g;
                                    const segments = segment.split(markdownLinkRegex);

                                    return segments.map((seg, idx) => {
                                      if (idx % 3 === 1) {
                                        // Render markdown-style link
                                        return (
                                          <a className="underline" target="_blank" key={idx} href={segments[idx + 1]}>
                                            {segments[idx]}
                                          </a>
                                        );
                                      } else if (idx % 2 === 0) {
                                        // Render normal text or regular link
                                        const normalLinkSegments = seg.split(regularLinkRegex);
                                        return normalLinkSegments.map((linkSeg, linkIdx) => {
                                          if (linkIdx % 2 === 1) {
                                            // Render regular link
                                            return (
                                              <a className="underline" target="_blank" key={`${idx}-${linkIdx}`} href={linkSeg}>
                                                {linkSeg}
                                              </a>
                                            );
                                          } else {
                                            // Render normal text
                                            return <span key={`${idx}-${linkIdx}`}>{linkSeg}</span>;
                                          }
                                        });
                                      } else {
                                        // Skip the URL itself, as it's already rendered inside the Link
                                        return null;
                                      }
                                    });
                                  }
                                })}
                              </p>
                            ));
                          }
                        })}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={message.id} className="flex items-end gap-2 justify-end">
                    <div className="rounded-lg flex max-w-5/6 bg-blue-500 text-white p-2 self-end" style={{ background: config ? config.userReplyBackgroundColor : "" }}>
                      <p className="text-md" style={{ color: config ? config.userReplyTextColor : "" }}>{message.content}</p>
                    </div>
                  </div>
                );
              }
            })
          }
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <div className='flex flex-col w-full space-y-2'>

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
                placeholder={config ? config!.chatMessagePlaceHolder : ""}
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
          {config?.displayBranding === true && (
            <div className="text-center text-zinc-400 text-sm mb-2">
              Powered by <a href="https://www.openassistantgpt.io/">{siteConfig.name}</a>
            </div>
          )}
        </div>
      </CardFooter >
    </div>
  )
}
