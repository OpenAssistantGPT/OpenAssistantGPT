'use client';

import { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Icons } from "./icons";
import { Message } from 'ai/react';
import { EmptyPlaceholder } from './empty-placeholder';

export function ChatHistory({
    threads,
    setThreadId,
    threadId,
    deleteThreadFromHistory,
}: {
    threads: Record<string, { creationDate: string; messages: Message[] }>;
    setThreadId: (threadId: string | undefined) => void;
    threadId: string | undefined;
    deleteThreadFromHistory: (threadId: string) => void;
}) {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const getFirstUserMessage = (messages: Message[]) => {
        const userMessage = messages.find(message => message.role === 'user');
        if (!userMessage) return 'No messages';
        const content = userMessage.content;
        return content.length > 30 ? content.substring(0, 30) + '...' : content;
    };

    const sortedThreads = Object.entries(threads).sort(([, threadA], [, threadB]) => {
        const dateA = new Date(threadA.creationDate);
        const dateB = new Date(threadB.creationDate);
        return dateB.getTime() - dateA.getTime();
    });

    const todayThreads = sortedThreads.filter(([mapThreadId, { creationDate }]) => {
        const threadDate = new Date(creationDate);
        const today = new Date();
        return threadDate.toDateString() === today.toDateString();
    });

    const yesterdayThreads = sortedThreads.filter(([mapThreadId, { creationDate }]) => {
        const threadDate = new Date(creationDate);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return threadDate.toDateString() === yesterday.toDateString();
    });

    const previousThreads = sortedThreads.filter(([mapThreadId, { creationDate }]) => {
        const threadDate = new Date(creationDate);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return threadDate.toDateString() !== today.toDateString() && threadDate.toDateString() !== yesterday.toDateString();
    });

    return (
        <>
            <div className="fixed left-0 top-1/2 transform -translate-y-1/2">
                <Button onClick={toggleMenu} size="icon" variant="ghost">
                    <svg
                        className="h-5 w-5 text-muted-foreground"
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
            <div className={`fixed inset-0 z-50 transition-all duration-300 ${isMenuOpen ? 'bg-black bg-opacity-50' : 'pointer-events-none'}`}>

                <div className={`fixed left-0 h-full w-full sm:w-3/4 bg-white transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <Card className="h-full">
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
                                {
                                    todayThreads.length === 0 && yesterdayThreads.length === 0 && previousThreads.length === 0 && (
                                        <EmptyPlaceholder>
                                            <EmptyPlaceholder.Title>No chat history</EmptyPlaceholder.Title>
                                            <EmptyPlaceholder.Description>
                                                Start chatting to create a chat history.
                                            </EmptyPlaceholder.Description>
                                            <Button variant="outline"
                                                onClick={() => {
                                                    setThreadId(undefined);
                                                    setMenuOpen(false);
                                                }}
                                            >Start a chat</Button>
                                        </EmptyPlaceholder>
                                    )
                                }
                                {todayThreads.length > 0 && (
                                    <>
                                        <div className="text-sm text-muted-foreground">Today</div>
                                        {todayThreads.map(([mapThreadId, { creationDate, messages }], index) => (
                                            mapThreadId && (
                                                <Card key={index} className={`flex items-center justify-between p-4 hover:bg-muted/50 focus:bg-muted/50 ${threadId === mapThreadId ? 'bg-zinc-300' : ''}`}
                                                >
                                                    <div className="grid gap-1"
                                                        onClick={() => {
                                                            setThreadId(mapThreadId);
                                                            setMenuOpen(false);
                                                        }}
                                                    >
                                                        <div className="text-sm">
                                                            <span>{getFirstUserMessage(messages)}</span>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {new Date(creationDate).toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="ghost" size="icon"
                                                            onClick={() => {
                                                                console.log('delete thread', threadId)
                                                                deleteThreadFromHistory(mapThreadId)
                                                            }}
                                                        >
                                                            <Icons.trash className="h-4 w-4" />
                                                            <span className="sr-only">Delete</span>
                                                        </Button>
                                                    </div>
                                                </Card>
                                            )
                                        ))}
                                    </>
                                )}
                                {yesterdayThreads.length > 0 && (
                                    <>
                                        <div className="text-sm text-muted-foreground">Yesterday</div>
                                        {yesterdayThreads.map(([mapThreadId, { creationDate, messages }], index) => (
                                            mapThreadId && (
                                                <Card key={index} className={`flex items-center justify-between p-4 hover:bg-muted/50 focus:bg-muted/50 ${threadId === mapThreadId ? 'bg-zinc-300' : ''}`}
                                                >
                                                    <div className="grid gap-1"
                                                        onClick={() => {
                                                            setThreadId(mapThreadId);
                                                            setMenuOpen(false);
                                                        }}
                                                    >
                                                        <div className="text-sm">
                                                            <span>{getFirstUserMessage(messages)}</span>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {new Date(creationDate).toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="ghost" size="icon"
                                                            onClick={() => {
                                                                console.log('delete thread', threadId)
                                                                deleteThreadFromHistory(mapThreadId)
                                                            }}
                                                        >
                                                            <Icons.trash className="h-4 w-4" />
                                                            <span className="sr-only">Delete</span>
                                                        </Button>
                                                    </div>
                                                </Card>
                                            )
                                        ))}
                                    </>
                                )}
                                {previousThreads.length > 0 && (
                                    <>
                                        <div className="text-sm text-muted-foreground">Previous</div>
                                        {previousThreads.map(([mapThreadId, { creationDate, messages }], index) => (
                                            mapThreadId && (
                                                <Card key={index} className={`flex items-center justify-between p-4 hover:bg-muted/50 focus:bg-muted/50 ${threadId === mapThreadId ? 'bg-zinc-300' : ''}`}
                                                >
                                                    <div className="grid gap-1"
                                                        onClick={() => {
                                                            setThreadId(mapThreadId);
                                                            setMenuOpen(false);
                                                        }}
                                                    >
                                                        <div className="text-sm">
                                                            <span>{getFirstUserMessage(messages)}</span>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {new Date(creationDate).toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="ghost" size="icon"
                                                            onClick={() => {
                                                                console.log('delete thread', threadId)
                                                                deleteThreadFromHistory(mapThreadId)
                                                            }}
                                                        >
                                                            <Icons.trash className="h-4 w-4" />
                                                            <span className="sr-only">Delete</span>
                                                        </Button>
                                                    </div>
                                                </Card>
                                            )
                                        ))}
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
