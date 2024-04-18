"use client"

import * as React from "react"
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
import { InquiryList } from "./inquiry-list"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { useInquiry } from "@/hooks/use-inquiries"
import { InquiryMessages } from "@/types"

interface InquiryProps {
    inquiries: InquiryMessages[]
    defaultLayout: number[] | undefined
}

export function Inquiries({
    inquiries,
    defaultLayout = [265, 440, 655],
}: InquiryProps) {
    const [selectedInquiry] = useInquiry()

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
                                    className="text-zinc-600"
                                >
                                    New Inquiries
                                </TabsTrigger>
                                <TabsTrigger
                                    value="deleted"
                                    className="text-zinc-600"
                                >
                                    Deleted Inquiries
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <Separator className="mb-4" />
                        <TabsContent value="all" className="m-0">
                            <InquiryList inquiries={inquiries.filter((item) => !item.deletedAt) || []} />
                        </TabsContent>
                        <TabsContent value="deleted" className="m-0">
                            <InquiryList inquiries={inquiries.filter((item) => item.deletedAt) || []} />
                        </TabsContent>
                    </Tabs>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={defaultLayout[2]}>
                    <InquiryDisplay
                        inquiry={selectedInquiry.selected ? inquiries.find((i) => i.id === selectedInquiry.selected) : undefined}
                    />
                </ResizablePanel>
            </ResizablePanelGroup>
        </TooltipProvider>
    )
}