import { Button } from '@/components/ui/button';
import ChatMessage from '@/components/ui/ChatMessage';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import ChatSidebarLayout from '@/layouts/chat/chat-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import Echo from 'laravel-echo';
import { CircleDashed, SendIcon } from 'lucide-react';
import Pusher from 'pusher-js';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
(window as any).Pusher = Pusher;

interface Props {
    messages?: any;
    users?: any;
    test?: any;
}

interface Message {
    id: number | string;
    user_id: number | string;
    message: string;
}

interface User {
    user: {
        id?: number | string;
        name?: string;
        email?: string;
    };
}

export default function GlobalChat({ messages, users, test }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Chat',
            href: '/chat',
        },
        {
            title: 'Global Chat',
            href: '#',
        },
    ];

    const { data, setData, reset, post, processing } = useForm({
        message: '',
        intended: 'all',
    });

    const [chats, setChats] = useState(messages.data);
    // console.log(messages);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('chat.store-global'), {
            onSuccess: () => {
                reset();
            },
            onError: () => {
                toast('Something went wrong. Please try again');
            },
            preserveState: true,
        });
    };

    const auth_user: User = usePage().props.auth as User;

    useEffect(() => {
        const echo = new Echo({
            broadcaster: 'reverb',
            key: import.meta.env.VITE_REVERB_APP_KEY,
            wsHost: import.meta.env.VITE_REVERB_HOST,
            wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
            wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
            forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
        });

        try {
            echo.channel('global-chat').listen('GlobalChat', (event: any) => {
                // console.log(event);

                setChats((prevChats: Message[]) => [...prevChats, event]);
            });

            return () => {
                echo.leaveChannel('global-chat');
            };
        } catch (error) {
            console.log(error);
        }
    }, []);

    const [availableHeight, setAvailableHeight] = useState('400px');

    useEffect(() => {
        const updateHeight = () => {
            const navheader = document.querySelector('#app-sidebar-header') as HTMLElement | null;
            if (navheader) {
                const navHeight = navheader.offsetHeight;
                const viewportHeight = window.innerHeight;
                const calculatedHeight = viewportHeight - navHeight - 120;
                setAvailableHeight(`${calculatedHeight}px`);
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);

        return () => {
            window.removeEventListener('resize', updateHeight);
        };
    }, []);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            (chatContainerRef.current as any).scrollTop = (chatContainerRef.current as any).scrollHeight;
        }
    }, [chats]);

    const [oldMessages, setOldMessages] = useState(messages.data);
    const [page, setPage] = useState(messages.current_page);
    const [hasMore, setHasMore] = useState(messages.next_page_url !== null);
    const [isLoading, setIsLoading] = useState(false);

    const loadMoreMessages = async () => {
        if (!hasMore || isLoading) return;

        setIsLoading(true);

        try {
            const response = await axios.get(`./all?page=${page + 1}`);
            const newMessages = response.data.messages; // Ensure correct response structure

            if (!newMessages || !newMessages.data) {
                console.error('Invalid response structure:', response.data);
                return;
            }

            const uniqueMessages = newMessages.data.filter((newMessage: any) => {
                return !oldMessages.some((oldMessage: any) => oldMessage.id === newMessage.id);
            });

            setOldMessages((prevMessages: any) => [...uniqueMessages, ...prevMessages]); // Add older messages at the top
            setChats((prevChats: any) => [...uniqueMessages, ...prevChats]); // Update state for UI
            setPage(newMessages.current_page);
            setHasMore(newMessages.next_page_url !== null);
        } catch (error) {
            console.error('Error fetching more messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const debounce = (func: any, delay: number) => {
            let timeoutId: any;
            return (...args: any) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func(...args), delay);
            };
        };

        const handleScroll = debounce(() => {
            if (!chatContainerRef.current) return;

            const container = chatContainerRef.current as HTMLElement;
            if (container.scrollTop <= 50) {
                loadMoreMessages();
            }
        }, 200);

        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            chatContainer.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (chatContainer) {
                chatContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [page, hasMore, isLoading]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chat" />
            <ChatSidebarLayout users={users}>
                <div className="h-full p-4">
                    <h2 className="font-bold">Global Chat</h2>
                    <form onSubmit={handleSubmit} className="grid h-full w-full place-items-center">
                        <div className="mt-4 flex h-full w-full flex-col">
                            <div ref={chatContainerRef} className="flex-1 overflow-auto rounded-md border p-5" style={{ maxHeight: availableHeight }}>
                                {chats.length === 0 ? (
                                    <div className="grid h-full place-items-center font-medium">👋 Say hi to everyone.</div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {chats?.map((chat: any) => (
                                            <ChatMessage
                                                name={chat?.user?.name}
                                                key={chat.id}
                                                message={chat?.message}
                                                variant={chat.user_id === auth_user.user?.id ? 'sender' : 'receiver'}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-2 flex items-center gap-2">
                                <Input
                                    name="message"
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder="Type your message here.."
                                    value={data.message}
                                />
                                <Button disabled={data.message === '' || processing}>
                                    {!processing ? <SendIcon /> : <CircleDashed className="h-4 w-4 animate-spin" />}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </ChatSidebarLayout>
        </AppLayout>
    );
}
