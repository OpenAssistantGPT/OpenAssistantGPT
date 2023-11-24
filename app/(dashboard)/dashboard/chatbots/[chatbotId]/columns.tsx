"use client"

import Link from "next/link"

import { CrawlerFile } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"


export const columns: ColumnDef<CrawlerFile>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => {
                    table.toggleAllPageRowsSelected(!!value)
                }}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => {
                    console.log(row.getValue("id"))
                    fetch(`/api/crawlers/${row.getValue('crawlerId')}/files`, {
                        method: "POST",
                        body: JSON.stringify([
                            row.getValue("id")
                        ])
                    })
                    row.toggleSelected(!!value)
                }}
                aria-label="Select row"
            />
        ),
    },
    {
        accessorKey: "name",
        header: () => <div className="text-left">Name</div>,

    },
    {
        accessorKey: "createdAt",
        header: "Created At",
    },
    {
        accessorKey: "blobUrl",
        header: "Download",
        cell: ({ row }) => (
            <Link href={row.getValue('blobUrl')}
                className="text-sm font-medium transition-colors hover:text-foreground/80"
                target="_blank"
            >
                Download
            </Link >
        ),
    },
    {
        accessorKey: "id",
        header: () => <></>,
        cell: ({ row }) => (<></>)
    },
    {
        accessorKey: "crawlerId",
        header: () => <></>,
        cell: ({ row }) => (<></>)
    }
]

