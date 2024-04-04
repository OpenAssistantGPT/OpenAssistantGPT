import { ClientInquiries } from "@prisma/client"
import { atom, useAtom } from "jotai"


type Config = {
    selected: ClientInquiries["id"] | null
}

const configAtom = atom<Config>({
    selected: null,
})

export function useInquiry() {
    return useAtom(configAtom)
}