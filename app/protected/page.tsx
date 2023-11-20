import { redirect } from "next/navigation"

import SignOut from "@/components/sign-out";
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth";

import { getCurrentUser } from "@/lib/session"


export default async function Home() {
  const user = await getCurrentUser()
  
  console.log(user)

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/api/auth/signin")
  }

  return (
    <div className="flex h-screen bg-black">
      <div className="w-screen h-screen flex flex-col space-y-5 justify-center items-center">
        <SignOut />
      </div>
    </div>
  );
}
