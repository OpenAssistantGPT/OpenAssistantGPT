import { User } from "@prisma/client"
import { AvatarProps } from "@radix-ui/react-avatar"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Icons } from "@/components/icons"

interface UserAvatarProps extends AvatarProps {
    user: Pick<User, "image" | "name">
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
    return (
        <Avatar {...props}>
            {user.image ? (
                <AvatarImage alt="Picture" src={user.image} />
            ) : (
                <AvatarFallback>
                    <p className="sr-only">{user.name}</p>
                    <Icons.user className="h-4 w-4" />
                </AvatarFallback>
            )}
        </Avatar>
    )
}