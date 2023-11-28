import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function UploadFileLoading() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Upload file"
                text="Upload a file and then you'll be able to use it with your chatbot."
            />
            <div className="grid gap-10">
                <CardSkeleton />
            </div>
        </DashboardShell>
    )
}