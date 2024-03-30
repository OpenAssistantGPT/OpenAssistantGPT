"use client"

import * as React from "react"
import {
    AlertCircle,
    Archive,
    ArchiveX,
    File,
    Inbox,
    MessagesSquare,
    Search,
    Send,
    ShoppingCart,
    Trash2,
    Users2,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { InquiryDisplay } from "./inquiry-display"
import { ClientInquiries } from "@prisma/client"
import { InquiryList } from "./inquiry-list"
import { TooltipProvider } from "@radix-ui/react-tooltip"

interface MailProps {
    inquiries: ClientInquiries[]
    defaultLayout: number[] | undefined
    defaultCollapsed?: boolean
    navCollapsedSize: number
}

export function Inquiries({
    inquiries,
    defaultLayout = [265, 440, 655],
    defaultCollapsed = false,
    navCollapsedSize,
}: MailProps) {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
    //const [mail] = useMail()

    return (
        <TooltipProvider delayDuration={0}>
            <ResizablePanelGroup
                direction="horizontal"
                onLayout={(sizes: number[]) => {
                    document.cookie = `react-resizable-panels:layout=${JSON.stringify(
                        sizes
                    )}`
                }}
                className="h-full max-h-[800px] items-stretch"
            >
                <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
                    <Tabs defaultValue="all">
                        <div className="flex items-center px-4 py-2">
                            <h1 className="text-xl font-bold">Inbox</h1>
                            <TabsList className="ml-auto">
                                <TabsTrigger
                                    value="all"
                                    className="text-zinc-600 dark:text-zinc-200"
                                >
                                    All mail
                                </TabsTrigger>
                                <TabsTrigger
                                    value="unread"
                                    className="text-zinc-600 dark:text-zinc-200"
                                >
                                    Unread
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <Separator />
                        <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                            <form>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search" className="pl-8" />
                                </div>
                            </form>
                        </div>
                        <TabsContent value="all" className="m-0">
                            <InquiryList inquiries={inquiries} />
                        </TabsContent>
                        <TabsContent value="unread" className="m-0">
                            <InquiryList inquiries={inquiries} />
                        </TabsContent>
                    </Tabs>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={defaultLayout[2]}>
                    <InquiryDisplay
                        inquiry={inquiries[0] || null}
                    />
                </ResizablePanel>
            </ResizablePanelGroup>
        </TooltipProvider>
    )
}