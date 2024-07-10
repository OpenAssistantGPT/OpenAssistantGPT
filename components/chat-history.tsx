'use client'

import { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Icons } from "./icons";

export function ChatHistory({ threads, setThreadId, threadId, deleteThreadFromHistory}: {
    threads: string[]
    setThreadId: (threadId: string | undefined) => void
    threadId: string | undefined
    deleteThreadFromHistory: (threadId: string ) => void
}) {
    const [isMenuOpen, setMenuOpen] = useState(true);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <div className="fixed left-0 top-1/2 transform -translate-y-1/2">
                <Button onClick={toggleMenu} size="icon" variant="ghost">
                    <svg
                        className="h-5 w-5"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </Button>
            </div>
            <div className={`fixed inset-0 z-50 ${isMenuOpen ? 'bg-black bg-opacity-50' : 'pointer-events-none'}`}>

                {isMenuOpen && (
                    <div className="flex min-h-screen">
                        <Card className="fixed left-0 h-full w-3/4 mx-auto bg-white">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Chat History</CardTitle>
                                <div className="flex flex-row items-center">
                                    <Button variant="ghost" size="icon"
                                        onClick={() => {
                                            setThreadId(undefined);
                                            setMenuOpen(false);
                                        }}
                                    >
                                        <Icons.add className="h-5 w-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon"
                                        onClick={() => {
                                            setMenuOpen(false);
                                        }}
                                    >
                                        <Icons.close className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="max-h-[500px] overflow-y-auto">
                                <div className="grid gap-4">
                                    {threads.map((thread, index) => (
                                        <Card key={index} className={`flex items-center justify-between p-4 hover:bg-muted/50 focus:bg-muted/50 ${threadId === thread ? 'bg-zinc-300' : ''}`}
                                        >
                                           <div className="grid gap-1" 
                                            onClick={() => {
                                                setThreadId(thread);
                                                setMenuOpen(false);
                                            }}
                                            >
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <span>June 1, 2023</span>
                                                    <span>·</span>
                                                    <span>3:45 PM</span>
                                                </div>
                                                <div className="font-medium">
                                                    <span>{thread} + {index}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon"
                                                    onClick={() => {
                                                        console.log('delete thread', thread)
                                                        deleteThreadFromHistory(thread)
                                                    }}
                                                >
                                                    <Icons.trash className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </>
    );
}
