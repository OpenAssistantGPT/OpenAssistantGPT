

import { isAbortError } from '@ai-sdk/provider-utils';
import { use, useCallback, useEffect, useRef, useState } from 'react';
import { generateId } from '@/lib/generate-id';
import { readDataStream } from '@/lib/read-data-stream';
import {
  AssistantStatus,
  CreateMessage,
  Message,
} from 'ai';

export type UseAssistantHelpers = {
  /**
   * The current array of chat messages.
   */
  messages: Message[];

  /**
   * Update the message store with a new array of messages.
   */
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;

  /**
  * Set the current thread ID. Specifying a thread ID will switch to that thread, if it exists. If set to 'undefined', a new thread will be created. For both cases, `threadId` will be updated with the new value and `messages` will be cleared.
  */
  setThreadId: (threadId: string | undefined) => void;

  /**
   * Delete the thread from the history
   */
  deleteThreadFromHistory: (threadId: string) => void;

  /**
   * The current thread ID.
   */
  threadId: string | undefined;
  
  /**
   * The list of threads.
   */
  threads: string[];

  /**
   * The current value of the input field.
   */
  input: string;

  /**
   * Append a user message to the chat list. This triggers the API call to fetch
   * the assistant's response.
   * @param message The message to append
   * @param requestOptions Additional options to pass to the API call
   */
  append: (
    message: Message | CreateMessage,
    requestOptions?: {
      data?: Record<string, string>;
    },
  ) => Promise<void>;

  /**
Abort the current request immediately, keep the generated tokens if any.
   */
  stop: () => void;

  /**
   * setState-powered method to update the input value.
   */
  setInput: React.Dispatch<React.SetStateAction<string>>;

  /**
   * Handler for the `onChange` event of the input field to control the input's value.
   */
  handleInputChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;

  /**
   * Form submission handler that automatically resets the input field and appends a user message.
   */
  submitMessage: (
    event?: React.FormEvent<HTMLFormElement>,
    requestOptions?: {
      data?: Record<string, string>;
    },
  ) => Promise<void>;

  /**
   * The current status of the assistant. This can be used to show a loading indicator.
   */
  status: AssistantStatus;

  /**
   * The error thrown during the assistant message processing, if any.
   */
  error: undefined | unknown;
};

export function useAssistant({
  api,
  threadId: threadIdParam,
  inputFile,
  credentials,
  clientSidePrompt,
  headers,
  body,
  onError,
}: any): UseAssistantHelpers {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentThreadId, setCurrentThreadId] = useState<string | undefined>(
    undefined,
  );
  const [status, setStatus] = useState<AssistantStatus>('awaiting_message');
  const [error, setError] = useState<undefined | Error>(undefined);

  const [threads, setThreads] = useState<string[]>([]);

  useEffect(() => {
    const assistantThreads = localStorage.getItem('assistantThreads')
    const threadsMap = JSON.parse(assistantThreads || '{}')

    // if current thread id is not in local storage, in local storage, set it to undefined
    if (currentThreadId && threadsMap[currentThreadId] === undefined) {
      threadsMap[currentThreadId] = []
      localStorage.setItem('assistantThreads', JSON.stringify(threadsMap))
    }

    // set only ids
    setThreads(Object.keys(threadsMap))
  }, [currentThreadId]);

  useEffect(() => {
    // store new messages in local storage
    const assistantThreads = localStorage.getItem('assistantThreads')
    const threadsMap = JSON.parse(assistantThreads || '{}')

    if (currentThreadId) {
      threadsMap[currentThreadId] = messages
      localStorage.setItem('assistantThreads', JSON.stringify(threadsMap))
    }
  }, [messages]);

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setInput(event.target.value);
  };

  // Abort controller to cancel the current API call.
  const abortControllerRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const append = async (
    message: Message | CreateMessage,
    requestOptions?: {
      data?: Record<string, string>;
    },
  ) => {
    setStatus('in_progress');

    setMessages(messages => [
      ...messages,
      {
        ...message,
        id: message.id ?? generateId(),
      },
    ]);

    setInput('');

    const abortController = new AbortController();

    try {
      abortControllerRef.current = abortController;

      const formData = new FormData();
      formData.append("message", message.content);
      formData.append("threadId", threadIdParam ?? currentThreadId ?? '');
      formData.append("file", inputFile || '');
      formData.append("filename", inputFile !== undefined ? inputFile.name : '');
      formData.append("clientSidePrompt", clientSidePrompt || '');

      const result = await fetch(api, {
        method: "POST",
        credentials,
        signal: abortController.signal,
        body: formData
      });

      if (result.body == null) {
        throw new Error('The response body is empty.');
      }

      for await (const { type, value } of readDataStream(
        result.body.getReader(),
      )) {
        switch (type) {
          case 'assistant_message': {
            setMessages(messages => [
              ...messages,
              {
                id: value.id,
                role: value.role,
                content: value.content[0].text.value,
              },
            ]);
            break;
          }

          case 'message_annotations': {
            // loop over all annotations
            for (const annotation of value) {
              if (annotation.type !== 'file_path') {
                continue;
              }
              setMessages(messages => {
                const lastMessage = messages[messages.length - 1];
                lastMessage.content = lastMessage.content.replace(
                  annotation.text,
                  annotation.file_path.url,
                );
                return [...messages.slice(0, messages.length - 1), lastMessage];
              });
            }
            break;
          }

          case 'text': {
            // text delta - add to last message:
            setMessages(messages => {
              const lastMessage = messages[messages.length - 1];
              return [
                ...messages.slice(0, messages.length - 1),
                {
                  id: lastMessage.id,
                  role: lastMessage.role,
                  content: lastMessage.content + value,
                },
              ];
            });

            break;
          }

          case 'data_message': {
            setMessages(messages => [
              ...messages,
              {
                id: value.id ?? generateId(),
                role: 'data',
                content: '',
                data: value.data,
              },
            ]);
            break;
          }

          case 'assistant_control_data': {
            setCurrentThreadId(value.threadId);

            // set id of last message:
            setMessages(messages => {
              const lastMessage = messages[messages.length - 1];
              lastMessage.id = value.messageId;
              return [...messages.slice(0, messages.length - 1), lastMessage];
            });

            break;
          }

          case 'error': {
            setError(new Error(value));
            break;
          }
        }
      }
    } catch (error) {
      // Ignore abort errors as they are expected when the user cancels the request:
      if (isAbortError(error) && abortController.signal.aborted) {
        abortControllerRef.current = null;
        return;
      }

      if (onError && error instanceof Error) {
        onError(error);
      }

      setError(error as Error);
    } finally {
      abortControllerRef.current = null;
      setStatus('awaiting_message');
    }
  };

  const submitMessage = async (
    event?: React.FormEvent<HTMLFormElement>,
    requestOptions?: {
      data?: Record<string, string>;
    },
  ) => {
    event?.preventDefault?.();

    if (input === '') {
      return;
    }

    append({ role: 'user', content: input }, requestOptions);
  };

  const setThreadId = (threadId: string | undefined) => {
    setCurrentThreadId(threadId);
    // validate if thread has message in local storage
    if (threadId === undefined) {
      setMessages([]);
      return;
    }

    const assistantThreads = localStorage.getItem('assistantThreads')
    const threads = JSON.parse(assistantThreads || '{}')
    setThreads(Object.keys(threads))
    if (threads[threadId] !== undefined) {
      setMessages(threads[threadId])
    }
    else {
      setMessages([]);
    }
  };

  const deleteThreadFromHistory = (threadId: string) => { 
    const assistantThreads = localStorage.getItem('assistantThreads')
    const threads = JSON.parse(assistantThreads || '{}')
    delete threads[threadId]
    localStorage.setItem('assistantThreads', JSON.stringify(threads))
    setThreads(Object.keys(threads))
  }

  return {
    append,
    messages,
    setMessages,
    threadId: currentThreadId,
    setThreadId,
    deleteThreadFromHistory,
    threads,
    input,
    setInput,
    handleInputChange,
    submitMessage,
    status,
    error,
    stop,
  };
}
