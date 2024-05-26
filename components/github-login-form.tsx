"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react";
import LoadingDots from "@/components/loading-dots";
import { Icons } from "./icons";

export default function GithubLoginForm() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams()


  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        await signIn("github", {
          redirect: false,
          callbackUrl: searchParams?.get("from") || "/welcome",
        })
      }}
      className="flex flex-col space-y-4 px-4 mb-4 sm:px-16"
    >
      <button
        disabled={loading}
        className={`${loading
          ? "cursor-not-allowed border-gray-200 bg-gray-100"
          : "border-black bg-black text-white hover:bg-zinc-100 hover:text-black"
          } flex h-10 w-full items-center justify-center rounded-md border text-md transition-all focus:outline-none`}
      >
        {loading ? (
          <LoadingDots color="#808080" />
        ) : (
          <div className="flex flex-row">
            <Icons.gitHub className="mr-2 h-4 w-4" />
            <p>Sign In With GitHub</p>
          </div>
        )}
      </button>
    </form>
  );
}
