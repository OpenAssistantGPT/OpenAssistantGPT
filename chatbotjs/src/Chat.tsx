import React, { useEffect, useState } from 'react';

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/KeLSEuc92jy
 */
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/icons"

interface ChatbotConfig {
  id: number;
  welcomeMessage: string;
}

export default function ChatBox() {
  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  useEffect(() => {
    (async () => {
      // Load Chatbot
      //const config: ChatbotConfig = await fetch('http://localhost:3000/api/chatbots/clpl60296000qhoqiqwkmn0y5/config')
    })();
  })

  const chatbot = {
    id: 1,
    name: "Chatbot",
    welcomeMessage: "Hello! How can I assist you today?",
  }

  return (
    <div className="fixed right-4 bottom-4">
      <div className="flex items-end">

        {isChatVisible &&
          <Card className="w-80 max-h-[80vh] overflow-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg transform transition-transform duration-200 ease-in-out mb-4">
            <div className="flex justify-between items-center p-4">
              <h3 className="text-lg font-semibold">Chat with us</h3>
              <Button onClick={toggleChatVisibility} variant="ghost">
                <IconClose className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                </div>
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-2">
                  <p className="text-sm">Hello! How can I assist you today?</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                </div>
                <div className="bg-blue-200 dark:bg-blue-800 rounded-lg p-2">
                  <p className="text-sm">I need help with my order.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                </div>
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-2">
                  <p className="text-sm">
                    Sure, I&apos;d be happy to help with that. Could you provide your order number, please?
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <Input className="flex-grow border-0 focus:border-0" id="chat-input" placeholder="Type your message" />
                <Button variant="outline border-0">
                  <IconSend className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        }
        <Button className="ml-2 shadow-lg border border-gray-200 rounded-full p-2"
          onClick={toggleChatVisibility} variant="ghost">
          <Icons.message />
        </Button>
      </div>
    </div >
  )
}


function IconClose(props) {
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


function IconSend(props) {
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
