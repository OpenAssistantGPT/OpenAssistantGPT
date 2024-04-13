import React, { useEffect, useState } from 'react';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { siteConfig } from "@/config/site"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Message,
  // import as useAssistant:
  experimental_useAssistant as useAssistant,
} from 'ai/react';
import { ChatbotConfig } from '@/types';


export default function ChatBox() {

  const [config, setConfig] = useState<ChatbotConfig>()
  const [chatbotId, setChatbotId] = useState<string>()

  // inquiry
  const [sendInquiry, setSendInquiry] = useState(false);
  const [userEmail, setUserEmail] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [inquiryLoading, setInquiryLoading] = useState(false)

  const { status, messages, input, submitMessage, handleInputChange, threadId } =
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

  async function handleInquirySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setInquiryLoading(true)

    const response = await fetch(`${siteConfig.url}api/chatbots/${chatbotId}/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatbotId: chatbotId,
        threadId: threadId || '',
        email: userEmail,
        inquiry: userMessage,
      }),
    })

    if (response.ok) {
      setSendInquiry(false)
      messages.push({
        id: String(messages.length + 1),
        role: 'assistant',
        content: config!.inquiryAutomaticReplyText,
      })
    } else {
      console.error(`Failed to send inquiry: ${response}`)
    }
    setInquiryLoading(false)
  }

  return (
    <div className="border rounded-lg bg-card text-card-foreground shadow-sm flex border-none bg-white shadow-lg flex-col w-full overflow-hidden">
      <CardHeader style={{ background: config ? config!.chatHeaderBackgroundColor : "" }} className="shadow border-b p-4">
        <h2 style={{ color: config ? config!.chatHeaderTextColor : "" }} className="text-xl font-bold flex items-center gap-2">
          <div>
            {config ? config!.chatTitle : ""}
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
              const currentChatbotReply = messages.filter((message) => message.role === 'assistant').indexOf(message) + 1
              if (message.role === "assistant") {
                return (
                  <div key={message.id} className="flex items-end gap-2">
                    <div className="rounded-lg bg-zinc-200 p-2" style={{ color: config ? config.chatbotReplyTextColor : "", background: config ? config.chatbotReplyBackgroundColor : "" }}>
                      {message.content.replace(/\【.*?】/g, '') // Remove citation markers
                        .split('```').map((block, blockIdx) => {
                          // Check if the block is a code block or normal text
                          if (blockIdx % 2 === 1) {
                            // Render code block
                            return <pre key={blockIdx}><code>{block}</code></pre>;
                          } else {
                            // Process normal text for ** and \n
                            return block.split('\n').map((line, lineIndex, lineArray) => (
                              <p key={`${blockIdx}-${lineIndex}`} className={`text-md ${lineIndex < lineArray.length - 1 ? 'mb-4' : ''}`}>
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
                        })
                      }
                      { // Check if it's the first message after X number of assistant replies and the link hasn't been added yet
                        currentChatbotReply > 0 && currentChatbotReply == config!.inquiryDisplayLinkAfterXMessage && status !== "in_progress" && config!.inquiryEnabled &&
                        <button
                          className='mt-4 flex flex-row items-center text-sm justify-center text-blue-600 hover:text-blue-800 focus:outline-none focus:underline'
                          type="button"
                          onClick={() => setSendInquiry(!sendInquiry)}
                        >
                          {config!.inquiryLinkText}
                        </button>
                      }
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
          {status !== 'in_progress' && sendInquiry &&
            <div className="bg-white border-t-2 rounded-lg shadow-md w-5/6">
              <form onSubmit={handleInquirySubmit}>
                <Card className='border-0 h-full shadow-none'>
                  <CardHeader>
                    <CardTitle>{config!.inquiryTitle}</CardTitle>
                    <CardDescription>{config!.inquirySubtitle}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">{config!.inquiryEmailLabel}</Label>
                        <Input onChange={(e) => setUserEmail(e.target.value)} className="bg-white" id="email" type="email" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">{config!.inquiryMessageLabel}</Label>
                        <Textarea onChange={(e) => setUserMessage(e.target.value)} className="min-h-[100px]" id="message" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={inquiryLoading} className='bg-black text-white'>
                      {config!.inquirySendButtonText}
                      {inquiryLoading && (
                        <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </div>
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
