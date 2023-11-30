import Link from "next/link"
import { File } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

import { FileOperations } from "@/components/file-operations"

interface UploadFileProps {
    file: Pick<File, "id" | "name" | "blobUrl" | "createdAt" | "openAIFileId">
}

export async function FileItem({ file }: UploadFileProps) {

    return (
        <div className="flex items-center justify-between p-4">
            <div className="grid gap-1">
                <Link
                    href={file.blobUrl}
                    className="font-semibold hover:underline"
                >
                    {file.name}
                </Link>
                <div>
                    <p className="text-sm text-muted-foreground">
                        {file.openAIFileId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {formatDate(file.createdAt?.toDateString())}
                    </p>
                </div>
            </div>
            <FileOperations file={file} />
        </div>
    )
}

FileItem.Skeleton = function FileItemSkeleton() {
    return (
        <div className="p-4">
            <div className="space-y-3">
                <Skeleton className="h-5 w-2/5" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        </div>
    )
}