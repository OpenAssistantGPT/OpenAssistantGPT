import { Message } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { MathJax, MathJaxContext } from 'better-react-mathjax'

import { cn } from '@/lib/utils'
import { CodeBlock } from '@/components/ui/codeblock'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { Icons } from '@/components/icons'
import { ExternalLink } from '@/components/external-link'

export interface ChatMessageProps {
    message: Message
    children?: React.ReactNode
}

export function ChatMessage({ message, children, ...props }: ChatMessageProps) {
    return (
        <div
            className={cn('group relative mb-4 flex items-start ')}
            {...props}
        >
            <div
                className={cn(
                    'flex size-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
                    message.role === 'user'
                        ? 'bg-background'
                        : 'bg-primary text-primary-foreground'
                )}
            >
                {message.role === 'user' ? <Icons.user /> : <Icons.bot />}
            </div>
            <div className="flex-1 px-1 ml-4 space-y-2 overflow-hidden">
                {message.content == "loading" ? <Icons.loading className="animate-spin" /> :
                    <MemoizedReactMarkdown
                        className="prose break-words prose-p:leading-relaxed prose-pre:p-0"
                        remarkPlugins={[remarkGfm, remarkMath]}
                        components={{
                            a({ node, children, ...props }) {
                                return (
                                    <ExternalLink href={props.href!}>
                                        {children}
                                    </ExternalLink>
                                )
                            },
                            p({ children }) {
                                return <p className="mb-2 last:mb-0">{children}</p>
                            },
                            code({ node, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '')

                                if (!match) {
                                    return (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    )
                                }

                                if (match && (match[1] === 'math' || match[1] === 'latex')) {
                                    return (
                                        <MathJaxContext>
                                            <MathJax>{children || ''}</MathJax>
                                        </MathJaxContext>
                                    )
                                }

                                return (
                                    <CodeBlock
                                        key={Math.random()}
                                        language={(match && match[1]) || ''}
                                        value={String(children).replace(/\n$/, '')}
                                        {...props}
                                    />
                                )
                            }
                        }}
                    >
                        {message.content.replace(/\【.*?】/g, "")}
                    </MemoizedReactMarkdown>
                }
                {/*<ChatMessageActions message={message} />*/}
            </div>
        </div>
    )
}
