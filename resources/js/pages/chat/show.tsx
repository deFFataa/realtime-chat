import { Button } from '@/components/ui/button';
import ChatMessage from '@/components/ui/ChatMessage';
import { Textarea } from '@/components/ui/textarea';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import ChatSidebarLayout from '@/layouts/chat/chat-sidebar-layout';
import { ProperName } from '@/lib/utils';
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
    user?: any;
    users?: any;
    groups?: any;
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

export default function Show({ messages, user, users, groups }: Props) {
    const { data, setData, reset, post, processing } = useForm({
        message: '',
        to: user.id,
    });

    const [chats, setChats] = useState(() => messages.data.slice().reverse());
    const chatInput = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('chat.store'), {
            onSuccess: () => {
                reset();
            },
            onError: () => {
                toast('Something went wrong. Please try again');
            },
            preserveState: true,
        });
    };

    useEffect(() => {
        chatInput.current?.focus();
    }, [handleSubmit]);

    const auth_user: User = usePage().props.auth as User;

    const [availableHeight, setAvailableHeight] = useState('400px');

    useEffect(() => {
        const updateHeight = () => {
            const navheader = document.querySelector('#app-sidebar-header') as HTMLElement | null;
            if (navheader) {
                const navHeight = navheader.offsetHeight;
                const viewportHeight = window.innerHeight;
                const calculatedHeight = viewportHeight - navHeight - 120;
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);

        return () => {
            window.removeEventListener('resize', updateHeight);
        };
    }, []);

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
            const user1 = auth_user.user?.id;
            if (!user1) return;
            const user2 = user.id;
            const channelName = user1 < user2 ? `chat.${user1}.${user2}` : `chat.${user2}.${user1}`;

            echo.private(channelName).listen('GotMessage', (event: any) => {
                setChats((prevChats: Message[]) => [...prevChats, event]);
            });

            return () => {
                echo.leaveChannel(channelName);
            };
        } catch (error) {
            console.log(error);
        }
    }, [auth_user.user?.id, user.id]);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    const [oldMessages, setOldMessages] = useState(messages.data);
    const [page, setPage] = useState(messages.current_page);
    const [hasMore, setHasMore] = useState(messages.next_page_url !== null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (chatContainerRef.current) {
            const container = chatContainerRef.current as HTMLElement;

            if (page === 1) {
                container.scrollTop = container.scrollHeight;
            } else {
                const shouldScroll = container.scrollHeight - container.scrollTop - container.clientHeight < 50;

                if (shouldScroll) {
                    container.scrollTop = container.scrollHeight;
                }
            }
        }
    }, [chats]);

    const loadMoreMessages = async () => {
        if (!hasMore || isLoading || !chatContainerRef.current) return;

        setIsLoading(true);

        const container = chatContainerRef.current as HTMLElement;
        const previousScrollHeight = container.scrollHeight;
        const previousScrollTop = container.scrollTop;

        try {
            const response = await axios.get(`./${user.id}?page=${page + 1}`);
            const newMessages = response.data.messages;

            if (!newMessages || !newMessages.data) {
                console.error('Invalid response structure:', response.data);
                return;
            }

            // Reverse the fetched messages so that they are in ascending order
            const uniqueMessages = newMessages.data
                .filter((newMessage: any) => {
                    return !oldMessages.some((oldMessage: any) => oldMessage.id === newMessage.id);
                })
                .reverse();

            setOldMessages((prevMessages: any) => [...uniqueMessages, ...prevMessages]);
            setChats((prevChats: any) => [...uniqueMessages, ...prevChats]);
            setPage(newMessages.current_page);
            setHasMore(newMessages.next_page_url !== null);

            requestAnimationFrame(() => {
                const newScrollHeight = container.scrollHeight;
                container.scrollTop = previousScrollTop + (newScrollHeight - previousScrollHeight);
            });
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

            const container = chatContainerRef.current;
            if (container.scrollTop <= 10) {
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

    useEffect(() => {
        setChats(messages.data.slice().reverse());
        setOldMessages(messages.data);
        setPage(messages.current_page);
        setHasMore(messages.next_page_url !== null);

        setData({
            message: '',
            to: user.id,
        });
    }, [user.id, messages]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Chat',
            href: '/chat',
        },
        {
            title: ProperName(user.name),
            href: '/#',
        },
    ];

    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Chat" />
                <ChatSidebarLayout users={users} groups={groups}>
                    <div className="h-full p-4">
                        <h2 className="font-bold">{ProperName(user.name)}</h2>
                        <form onSubmit={handleSubmit} className="grid h-full w-full place-items-center">
                            <div className="mt-4 flex h-full w-full flex-col">
                                {chats.length === 0 && (
                                    <div
                                        className="grid flex-1 place-items-center overflow-auto rounded-md border font-medium"
                                    >
                                        👋 Say hi to {user.name}.
                                    </div>
                                )}

                                {chats.length > 0 && (
                                    <div
                                        ref={chatContainerRef}
                                        className="flex-1 overflow-auto rounded-md border p-5"
                                    >
                                        <div className="flex flex-col gap-4">
                                            {chats?.map((chat: any) => (
                                                <ChatMessage
                                                    id={chat.id}
                                                    key={chat.id}
                                                    name={chat.name ? chat.name : chat.user?.name}
                                                    message={<span dangerouslySetInnerHTML={{ __html: chat.message }} />}
                                                    variant={chat.user_id === auth_user.user?.id ? 'sender' : 'receiver'}
                                                    sent_date={new Date(chat.created_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-2 flex gap-2">
                                    <Textarea
                                        name="message"
                                        ref={chatInput}
                                        className="h-full max-h-[100px] min-h-auto w-full flex-1 resize-none overflow-x-hidden break-words break-all whitespace-pre-wrap"
                                        onChange={(e) => setData('message', e.target.value)}
                                        placeholder="Type your message here.."
                                        value={data.message}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSubmit(e as any);
                                            }
                                        }}
                                        disabled={processing}
                                    />

                                    <Button className="self-end" disabled={data.message === '' || processing}>
                                        {!processing ? <SendIcon /> : <CircleDashed className="h-4 w-4 animate-spin" />}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </ChatSidebarLayout>
        </AppHeaderLayout>
    );
}
