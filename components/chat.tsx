"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Chatbot } from "@prisma/client"
import { Icons } from "./icons"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import { CardHeader } from "./ui/card"
import {
  useAssistant,
} from '@/hooks/use-assistant';
import { Message } from 'ai/react'
import { useEffect, useRef, useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { FooterText } from "./chat-footer-text";
import { ChatMessage } from "./chat-message"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"

interface ChatbotProps {
  chatbot: Chatbot
  defaultMessage: string
  className?: string
  withExitX?: boolean
  clientSidePrompt?: string
}

export function Chat({ chatbot, defaultMessage, className, withExitX = false, clientSidePrompt, ...props }: ChatbotProps) {
  const [open, setOpen] = useState(false);

  // inquiry
  const [hideInquiry, setHideInquiry] = useState(false)
  const [sendInquiry, setSendInquiry] = useState(false);
  const [userEmail, setUserEmail] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [inquiryLoading, setInquiryLoading] = useState(false)

  let inputFileRef = useRef<HTMLInputElement>(null);

  const [chatThreadId, setChatThreadId] = useState<string | null>()

  const { status, messages, input, submitMessage, handleInputChange, error, threadId } =
    useAssistant({ api: `/api/chatbots/${chatbot.id}/chat`, inputFile: inputFileRef.current?.files ? inputFileRef.current.files[0] : undefined, threadId: chatThreadId || '', clientSidePrompt: clientSidePrompt });

  function handleSubmitMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    submitMessage()

    setFileUploaded(false)
    if (inputFileRef.current) {

      inputFileRef.current.value = '';
    }
  }

  useEffect(() => {
    if (threadId) {
      setChatThreadId(threadId)
    }
  }, [threadId])

  useEffect(() => {
    if (status === 'awaiting_message') {
      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }
    }
  }, [status])

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [fileUploaded, setFileUploaded] = useState(false);

  useEffect(() => {
    if (error) {
      console.log(error)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  }, [error])

  useEffect(() => {
    // Scroll to the bottom of the container on messages update
    document.documentElement.scrollTop = document.getElementById("end").offsetTop;
  }, [messages]);

  async function handleInquirySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setInquiryLoading(true)

    const response = await fetch(`/api/chatbots/${chatbot.id}/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatbotId: chatbot.id,
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
        content: chatbot.inquiryAutomaticReplyText,
      })
    } else {
      console.error(`Failed to send inquiry: ${response}`)
      toast({
        title: 'Error',
        description: 'Failed to send inquiry',
        variant: 'destructive'
      })
    }
    // close dialog
    setOpen(false)
    setInquiryLoading(false)
  }

  useEffect(() => {
    if (defaultMessage !== '') {
      input === '' && handleInputChange({ target: { value: defaultMessage } } as React.ChangeEvent<HTMLInputElement>);
    }
  })

  function closeChat() {
    window.parent.postMessage('closeChat', '*')
  }


  return (
    <>
      <CardHeader style={{ background: chatbot.chatHeaderBackgroundColor }} className="sticky z-50 top-0 border-b p-4">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-xl font-bold flex items-center h-10 gap-2">
            <div style={{ color: chatbot.chatHeaderTextColor }}>
              {chatbot.chatTitle}
            </div>
          </h2>
          <div className="flex flex-row items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  style={{ color: chatbot.chatHeaderTextColor, background: chatbot.chatHeaderBackgroundColor }}
                  className="cursor-pointer"
                  size={'icon'}
                  onClick={() => {
                    window.location.reload()
                  }}
                >
                  <Icons.reload className="h-4 w-4" />
                  <span className="sr-only">New Chat</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>New Chat</TooltipContent>
            </Tooltip>
            {withExitX &&
              <div className="items-end">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={closeChat} variant="nothing" className="cursor-pointer">
                      <Icons.close style={{ color: chatbot.chatHeaderTextColor }} className="h-5 w-5 text-gray-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Exit Chat</TooltipContent>
                </Tooltip>
              </div>
            }
          </div>
        </div>

      </CardHeader>
      <div
        className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      >

        <div
          className={cn('pb-[200px] overflow-auto pl-5 sm:pl-20 pr-5 sm:pr-20 md:pb-[200px] pt-4 md:pt-10', className)}
        >
          <ChatMessage isFirst={true} chatbot={chatbot} message={{ id: '0', role: "assistant", content: chatbot.welcomeMessage }} />
          <div className="flex-grow overflow-y-auto space-y-6 flex flex-col order-2">
            {messages.map((message: Message, index) => {
              return (
                <ChatMessage chatbot={chatbot} key={index} message={message} />
              );
            })}
          </div>
          {status !== "awaiting_message" &&
            <div className="mt-4">
              <ChatMessage chatbot={chatbot} message={{ id: 'waiting', role: "assistant", content: 'loading' }} />
            </div>
          }
          <div id="end" ref={containerRef}> </div>
        </div>
        <div className="fixed inset-x-0 bottom-0 w-full ease-in-out animate-in peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
          <div className="mx-auto sm:max-w-2xl sm:px-4">
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2 px-4 sm:px-0">
              {chatbot.inquiryEnabled && !hideInquiry && messages.length >= chatbot.inquiryDisplayLinkAfterXMessage &&
                <div className="relative">
                  <button onClick={() => { setHideInquiry(true) }} className="bg-zinc-100 shadow hover:bg-zinc-200 border rounded absolute top-0 right-0 -mt-1 -mr-1">
                    <Icons.close className="h-4 w-4" />
                  </button>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-white" variant="outline">
                        {chatbot.inquiryLinkText}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <form onSubmit={handleInquirySubmit}>
                        <DialogHeader>
                          <DialogTitle>{chatbot.inquiryTitle}</DialogTitle>
                          <DialogDescription>
                            {chatbot.inquirySubtitle}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 w-full">
                          <div className="gap-4">
                            <Label htmlFor="name" className="text-right">
                              {chatbot.inquiryEmailLabel}
                            </Label>
                            <Input onChange={(e) => setUserEmail(e.target.value)} className="bg-white" id="email" pattern=".+@.+\..+" type="email" />
                          </div>
                          <div className="gap-4">
                            <Label htmlFor="username" className="text-right">
                              {chatbot.inquiryMessageLabel}
                            </Label>
                            <Textarea onChange={(e) => setUserMessage(e.target.value)} className="min-h-[100px]" id="message" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={inquiryLoading}>
                            {chatbot.inquirySendButtonText}
                            {inquiryLoading && (
                              <Icons.spinner className="ml-2 mr-2 h-5 w-5 animate-spin" />
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              }

            </div>

            <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl md:py-4">
              <form onSubmit={handleSubmitMessage}
                {...props}
              >
                {
                  fileUploaded &&
                  <div className="flex w-full sm:w-1/2 items-center p-2 bg-white border rounded-lg shadow-sm">
                    <Icons.document className="text-gray-400 w-6 h-6 flex-shrink-0" />
                    <div className="flex flex-col pl-3 pr-6 flex-1 min-w-0">
                      <span className="font-sm text-gray-800 truncate">{inputFileRef.current?.files[0].name}</span>
                      <span className="text-sm text-gray-500">Document</span>
                    </div>
                    <Button type="button" variant="ghost" className="flex-shrink-0" onClick={() => {
                      inputFileRef.current.value = '';
                      setFileUploaded(false);
                    }}>
                      <Icons.close className="text-gray-400 w-4 h-4" />
                    </Button>
                  </div>
                }
                <div className={`relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background ${chatbot.chatFileAttachementEnabled ? 'px-8 sm:px-12' : 'px-2 sm:px-2'}`}>
                  {chatbot.chatFileAttachementEnabled &&
                    <div className="">
                      <Label htmlFor="file" className="">
                        <div
                          className={`size-9 absolute left-0 top-[12px] size-8 rounded-full bg-background p-0 sm:left-4 border border-input hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background`}
                        >
                          <Icons.paperclip className="text-muted-foreground h-4 w-4" />
                        </div>
                      </Label>
                      <Input
                        ref={inputFileRef}
                        id="file"
                        type="file"
                        className="hidden"
                        onChange={() => {
                          setFileUploaded(true)
                        }}
                      />
                    </div>
                  }

                  <Input
                    ref={inputRef}
                    tabIndex={0}
                    placeholder={chatbot.chatMessagePlaceHolder}
                    className="border-0 focus-visible:ring-0 min-h-[60px] w-full resize-none bg-transparent pl-4 pr-8 md:pr-12 py-[1.3rem] focus-within:outline-none sm:text-sm"
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    name="message"
                    value={input}
                    onChange={handleInputChange}
                  />
                  <div className={`absolute right-0 top-[14px] sm:right-4`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          id="submit"
                          disabled={status !== 'awaiting_message' || input === ''}
                          type="submit" size="icon">
                          <Icons.arrowRight />
                          <span className="sr-only">Send message</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Send message</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                {
                  chatbot.displayBranding &&
                  <FooterText className="block my-2" />
                }
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
