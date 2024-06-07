'use client'

import { type Message } from 'ai'

import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'

interface ChatMessageActionsProps extends React.ComponentProps<'div'> {
    message: Message
}

export function ChatMessageActions({
    message,
    className,
    ...props
}: ChatMessageActionsProps) {
    const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

    const onCopy = () => {
        if (isCopied) return
        copyToClipboard(message.content)
    }

    return (
        <div
            className={cn(
                'text-muted-forground items-top justify-start transition-opacity group-hover:opacity-100 md:opacity-0',
                className
            )}
            {...props}
        >
            <Button variant="nothing" size="xs" onClick={onCopy}>
                {isCopied ? <Icons.check className='text-muted-foreground h-3 w-3'/> : <Icons.copy className='text-muted-foreground h-3 w-3' />}
                <span className="sr-only">Copy message</span>
            </Button>
        </div>
    )
}