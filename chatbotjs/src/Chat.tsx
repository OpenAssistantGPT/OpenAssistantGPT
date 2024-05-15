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
  useAssistant,
} from 'ai/react';
import { ChatbotConfig } from '@/types';

export default function ChatBox() {

  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState<ChatbotConfig>()
  const [chatbotId, setChatbotId] = useState<string>()
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [sendInquiry, setSendInquiry] = useState(false);

  // inquiry
  const [userEmail, setUserEmail] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [inquiryLoading, setInquiryLoading] = useState(false)

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

  const chatboxClassname = isMobile ? "fixed inset-0 flex flex-col" : "mr-3 flex flex-col min-w-[400px] max-w-md min-h-[65vh] max-h-[65vh]";
  const inputContainerClassname = isMobile ? "fixed bottom-0 left-0 w-full bg-white" : "";
  const inputContainerHeight = 70; // Adjust this value based on your actual input container height

  return (
    <div className="fixed bottom-0 right-0 mb-4 z-50 flex items-end">
      {isChatVisible &&
        <></>
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
