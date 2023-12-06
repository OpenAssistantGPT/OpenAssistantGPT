
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { UserNameForm } from "@/components/user-name-form"
import { OpenAIForm } from "@/components/openai-config-form"
import { siteConfig } from "@/config/site"

export const metadata = {
    title: `${siteConfig.name} - Settings`,
    description: "Manage account and website settings.",
}

export default async function SettingsPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    return (
        <DashboardShell>
            <DashboardHeader
                heading="Settings"
                text="Manage account and website settings."
            />
            <div className="grid gap-10">
                <div className="grid gap-10">
                    <UserNameForm user={{ id: user.id, name: user.name || "" }} />
                </div>
                <div className="grid gap-10">
                    <OpenAIForm user={{ id: user.id, name: user.name || "" }} />
                </div>
            </div>
        </DashboardShell>
    )
}