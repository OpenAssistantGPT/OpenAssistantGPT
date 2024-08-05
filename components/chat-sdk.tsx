"use client"

import { OpenAssistantGPTChat } from 'openassistantgpt'
import { Message } from 'openassistantgpt'
import { useState } from 'react'
import { SupportInquiry } from './inquiry-extension'

export interface ClientSideChatbotProps {
  id: string;
  name: string;
  userId: string;
  openaiId: string;
  createdAt: Date;
  modelId?: string;
  prompt?: string;
  welcomeMessage: string;
  chatbotErrorMessage: string;
  isImported: boolean;

  chatTitle: string;
  chatMessagePlaceHolder: string;
  rightToLeftLanguage: boolean;

  bubbleColor: string;
  bubbleTextColor: string;
  chatHeaderBackgroundColor: string;
  chatHeaderTextColor: string;
  chatbotReplyBackgroundColor: string;
  chatbotReplyTextColor: string;
  userReplyBackgroundColor: string;
  userReplyTextColor: string;
  chatbotLogoURL?: string;

  chatInputStyle: string;

  inquiryEnabled: boolean;
  inquiryLinkText: string;
  inquiryTitle: string;
  inquirySubtitle: string;
  inquiryEmailLabel: string;
  inquiryMessageLabel: string;
  inquirySendButtonText: string;
  inquiryAutomaticReplyText: string;
  inquiryDisplayLinkAfterXMessage: number;

  chatHistoryEnabled: boolean;

  displayBranding: boolean;
  chatFileAttachementEnabled: boolean;

  maxCompletionTokens?: number;
  maxPromptTokens?: number;

  bannedIps: string[];
  allowEveryone: boolean;
  allowedIpRanges: string[];
}

interface ChatbotProps {
  chatbot: ClientSideChatbotProps;
  defaultMessage: string;
  className?: string;
  withExitX?: boolean;
  clientSidePrompt?: string;
}

export function Chat({ chatbot, defaultMessage, className, withExitX = false, clientSidePrompt, ...props }: ChatbotProps) {

  const [count, setMessagesCount] = useState(0);
  const [threadId, setThreadId] = useState('');
  
  function handleMessagesChange(messages: Message[]) {
    setMessagesCount(messages.length);
  }

  function handleThreadIdChange(threadId: string | undefined) {
    setThreadId(threadId || '');
  }

  console.log(chatbot);

  return (
    <OpenAssistantGPTChat chatbot={{
      ...chatbot,
      displayFooterText: chatbot.displayBranding,
      footerLink: 'https://openassistantgpt.io',
      footerTextName: 'OpenAssistantGPT',
      chatbotLogoURL: chatbot.chatbotLogoURL || '',
    }} path={`/api/chatbots/${chatbot.id}/chat`} withExitX={withExitX} clientSidePrompt={clientSidePrompt} defaultMessage={defaultMessage} {...props} 
    onMessagesChange={handleMessagesChange}
    onThreadIdChange={handleThreadIdChange}
    extensions={[
      chatbot.inquiryEnabled && count > chatbot.inquiryDisplayLinkAfterXMessage && <SupportInquiry key="inquiry" chatbot={chatbot} threadId={threadId} />
    ]}
    />
  )
}
