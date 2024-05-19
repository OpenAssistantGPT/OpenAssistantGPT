'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'
import { Icons } from '@/components/icons'

interface ButtonScrollToBottomProps extends ButtonProps {
    isAtBottom: boolean
    scrollToBottom: () => void
}

export function ButtonScrollToBottom({
    className,
    isAtBottom,
    scrollToBottom,
    ...props
}: ButtonScrollToBottomProps) {
    return (

        <Button
            variant="outline"
            size="sm"
            className={cn(
                'rounded-full z-10 bg-background transition-opacity duration-300 sm:right-8 md:top-2',
                isAtBottom ? 'opacity-0' : 'opacity-100',
                className
            )}
            onClick={() => scrollToBottom()}
            {...props}
        >
            <Icons.arrowDown />
            <span className="sr-only">Scroll to bottom</span>
        </Button>
    )
}