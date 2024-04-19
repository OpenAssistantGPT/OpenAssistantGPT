"use client"

import formatDistanceToNow from "date-fns/formatDistanceToNow"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useInquiry } from "@/hooks/use-inquiries"
import { InquiryMessages } from "@/types"

interface InquiryListProps {
  inquiries: InquiryMessages[]
}

export function InquiryList({ inquiries }: InquiryListProps) {

  const [selectedInquiry, setSelectedInquiry] = useInquiry()

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {inquiries.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              selectedInquiry.selected === item.id && "bg-muted"
            )}
            onClick={() =>
              setSelectedInquiry({
                ...selectedInquiry,
                selected: item.id,
              })
            }
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.email}</div>
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    selectedInquiry.selected === item.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {formatDistanceToNow(new Date(item.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <div className="text-xs font-medium">{item.threadId}</div>
            </div>
            <div className="line-clamp-2 break-all text-xs text-muted-foreground">
              {item.inquiry.substring(0, 300)}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}

