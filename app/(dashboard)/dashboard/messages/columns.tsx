"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Messages = {
    id: string
    message: string
    createdAt: Date
    chatbotId: string
}

export const columns: ColumnDef<Messages>[] = [
    {
        accessorKey: "message",
        header: "Message",
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
    },
    {
        accessorKey: "chatbotId",
        header: "Chatbot Id",
    },
]
