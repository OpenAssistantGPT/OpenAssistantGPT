"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { File } from "@prisma/client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Url } from "next/dist/shared/lib/router/router"


interface FileOperationsProps {
    file: Pick<File, "id" | "name" | "blobUrl"> | undefined
}

export function FileOperations({ file }: FileOperationsProps) {
    const router = useRouter()
    const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
    const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)

    async function deleteFile(fileId: string) {
        console.log(fileId)
        const response = await fetch(`/api/files/${fileId}`, {
            method: "DELETE",
        })

        if (!response?.ok) {
            toast({
                title: "Something went wrong.",
                description: "Your file was not deleted. Please try again.",
                variant: "destructive",
            })
        } else {
            toast({
                title: "File deleted.",
                description: "Your file was successfully deleted.",
                variant: "default",
            })
        }

        router.refresh()
        return true
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
                    <Icons.ellipsis className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <Link href={file?.blobUrl as Url} className="flex w-full">
                            Download
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="flex cursor-pointer items-center text-destructive focus:text-destructive"
                        onSelect={() => setShowDeleteAlert(true)}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete this file?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async (event: { preventDefault: () => void }) => {
                                event.preventDefault()
                                setIsDeleteLoading(true)

                                await deleteFile(file?.id || "")

                                setIsDeleteLoading(false)
                                setShowDeleteAlert(false)
                                router.refresh()
                            }}
                            className="bg-red-600 focus:ring-red-600"
                        >
                            {isDeleteLoading ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Icons.trash className="mr-2 h-4 w-4" />
                            )}
                            <span>Delete</span>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
