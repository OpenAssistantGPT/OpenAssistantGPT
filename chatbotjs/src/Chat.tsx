import React, { useEffect, useState, useRef } from 'react';

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/KeLSEuc92jy
 */
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { siteConfig } from "@/config/site"
import {
  Message,
  // import as useAssistant:
  experimental_useAssistant as useAssistant,
} from 'ai/react';
import { ChatbotConfig } from '@/types';


export default function ChatBox() {
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState<ChatbotConfig>()
  const [chatbotId, setChatbotId] = useState<string>()
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [sendInquiry, setSendInquiry] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  const { status, messages, input, submitMessage, handleInputChange, threadId } =
    useAssistant({
      api: `${siteConfig.url}api/chatbots/${window.chatbotConfig.chatbotId}/chat`,
    });

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const inquiryRef = useRef(null);

  useEffect(() => {
    // Check if status has changed to "awaiting_message"
    if (status === 'awaiting_message' && inputRef.current) {
      // Focus on the input field
      inputRef.current.focus();
    }
  }, [status]);

  useEffect(() => {
    // Scroll to the bottom of the container on messages update
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (sendInquiry && inquiryRef.current) {
      inquiryRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sendInquiry]);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const id = window.chatbotConfig.chatbotId
      setChatbotId(id)

      const config = await fetch(`${siteConfig.url}api/chatbots/${id}/config`)
      const chatbotConfig: ChatbotConfig = await config.json()
      setConfig(chatbotConfig)
      setLoading(false)
    };
    init();
  }, [])

  const chatboxClassname = isMobile ? "fixed inset-0 flex flex-col" : "mr-3 flex flex-col max-w-md min-h-[65vh] max-h-[65vh]";
  const inputContainerClassname = isMobile ? "fixed bottom-0 left-0 w-full bg-white" : "";
  const inputContainerHeight = 70; // Adjust this value based on your actual input container height

  return (
    <div className="fixed bottom-0 right-0 mb-4 z-50 flex items-end">
      {isChatVisible &&
        <Card className={chatboxClassname + " bg-white shadow-lg transform transition-transform duration-200 ease-in-out" + (isMobile ? " overflow-auto" : "")}>
          <div style={{ background: config ? config!.chatHeaderBackgroundColor : "" }} className="flex rounded-t-lg shadow justify-between items-center p-4">
            <h3 style={{ color: config ? config!.chatHeaderTextColor : "" }} className="text-xl font-semibold">{config ? config!.chatTitle : ""}</h3>
            <div>
              <Button onClick={toggleChatVisibility} variant="ghost">
                <Icons.close style={{ color: config ? config!.chatHeaderTextColor : "" }} className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>

          {
            <div className="p-4 space-y-4 flex-grow overflow-auto custom-scrollbar" style={{ marginBottom: isMobile ? `${inputContainerHeight}px` : '0' }} ref={containerRef}>
              <div className="space-y-4">
                <div key="0" className="flex w-5/6 items-end gap-2">
                  <div className="rounded-lg bg-zinc-200 p-2" style={{ background: config ? config.chatbotReplyBackgroundColor : "" }}>
                    <p className="text-md" style={{ color: config ? config.chatbotReplyTextColor : "" }}>{config ? config!.welcomeMessage : ""}</p>
                    <button className='mt-4 flex flex-row text-sm justify-center' type="submit" style={{ color: config ? config.chatbotReplyTextColor : "" }} onClick={() => setSendInquiry(!sendInquiry)}>
                      Contact our support team {sendInquiry ? <Icons.close className="h-4 w-4" /> : <Icons.chevronRight className="h-4 w-4" />}
                    </button>
                    {/**sendInquiry &&
                      <Card className='border-0 h-full shadow-none'>
                        <CardHeader>
                          <CardTitle>Contact our support team</CardTitle>
                          <CardDescription>Our team is here to help you with any questions you may have. Please provide us with your email and a brief message so we can assist you.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input className="bg-white" id="email" placeholder="Email" type="email" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="message">Message</Label>
                              <Textarea className="min-h-[100px]" id="message" placeholder="Your message" />
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button type="submit" className='bg-black text-white'>Send message</Button>
                        </CardFooter>
                      </Card>
                    **/}
                  </div>
                </div>
              </div>
              {sendInquiry &&
                <div ref={inquiryRef} className="bg-white border-blue-600 border-t-2 rounded-lg shadow-md w-5/6">
                  <Card className='border-0 h-full shadow-none'>
                    <CardHeader>
                      <CardTitle>Contact our support team</CardTitle>
                      <CardDescription>Our team is here to help you with any questions you may have. Please provide us with your email and a brief message so we can assist you.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input className="bg-white" id="email" placeholder="Email" type="email" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea className="min-h-[100px]" id="message" placeholder="Your message" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className='bg-black text-white'>Send message</Button>
                    </CardFooter>
                  </Card>
                </div>
              }

              {
                messages.map((message: Message) => {
                  if (message.role === "assistant") {
                    return (
                      <div key={message.id} className="flex w-5/6 items-end gap-2">
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
                            })}
                          {
                            status === 'awaiting_message' &&
                            <button className="text-sm" onClick={() => setSendInquiry(!sendInquiry)}>
                              Contact our support team {sendInquiry ? <Icons.arrowUp className="h-4 w-4" /> : <Icons.arrowDown className="h-4 w-4" />}
                            </button>
                          }
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={message.id} className="flex max-w-5/6 items-end gap-2 justify-end">
                        <div className="rounded-lg flex max-w-5/6 bg-blue-500 text-white p-2 self-end" style={{ background: config ? config.userReplyBackgroundColor : "" }}>
                          <p className="text-md" style={{ color: config ? config.userReplyTextColor : "" }}>{message.content}</p>
                        </div>

                      </div>
                    );
                  }
                })
              }
            </div>
          }
          <div className={inputContainerClassname}>
            {config?.displayBranding === true && (
              <div className="text-center text-zinc-400 text-md mb-2">
                Powered by <a href="https://www.openassistantgpt.io/">{siteConfig.name}</a>
              </div>
            )}
            <div className="border-t border-gray-200 p-2">
              <div
                className='w-full flex items-center gap-2'
              >
                <form onSubmit={submitMessage}
                  className="flex align-right items-end w-full"
                >
                  <Input
                    ref={inputRef} // Attach inputRef to the input field
                    disabled={status !== 'awaiting_message'}
                    className="w-full border-0 text-md"
                    value={input}
                    placeholder={config ? config!.chatMessagePlaceHolder : ""}
                    onChange={handleInputChange}
                  />
                  <Button type="submit"
                    disabled={status !== 'awaiting_message'}
                    className="flex-none w-1/6 text-md"
                  >
                    {status !== 'awaiting_message' && (
                      <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                    )}
                    {status === 'awaiting_message' && (
                      <IconSend className="mr-2 h-5 w-5 text-gray-500" />
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </Card>
      }
      {
        !loading && !isChatVisible &&
        <button className="ml-4 mr-4 shadow-lg border bg-white border-gray-200 rounded-full p-4" style={{ background: config ? config!.bubbleColor : "" }}
          onClick={toggleChatVisibility}>
          {!isChatVisible && <Icons.message style={{ color: config ? config!.bubbleTextColor : "" }} />}
          {isChatVisible && <Icons.close style={{ color: config ? config!.bubbleTextColor : "" }} />}
        </button>

      }
      {
        !loading && isChatVisible && !isMobile &&
        <button className="ml-4 mr-4 shadow-lg border bg-white border-gray-200 rounded-full p-4" style={{ background: config ? config!.bubbleColor : "" }}
          onClick={toggleChatVisibility}>
          {!isChatVisible && <Icons.message style={{ color: config ? config!.bubbleTextColor : "" }} />}
          {isChatVisible && <Icons.close style={{ color: config ? config!.bubbleTextColor : "" }} />}
        </button>
      }
    </div >
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
