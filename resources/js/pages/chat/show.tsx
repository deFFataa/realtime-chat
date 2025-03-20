import { Button } from '@/components/ui/button';
import ChatMessage from '@/components/ui/ChatMessage';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import ChatSidebarLayout from '@/layouts/chat/chat-sidebar-layout';
import { ProperName } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
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

export default function Show({ messages, user, users }: Props) {
    const { data, setData, reset, post, processing } = useForm({
        message: '',
        to: user.id,
    });

    const [chats, setChats] = useState(messages);
    console.log(chats);

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

    const auth_user: User = usePage().props.auth as User;

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

    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            (chatContainerRef.current as any).scrollTop = (chatContainerRef.current as any).scrollHeight;
        }
    }, [chats]);

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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chat" />
            <ChatSidebarLayout users={users}>
                <div className="h-full p-4">
                    <h2 className="font-bold">{ProperName(user.name)}</h2>
                    <form onSubmit={handleSubmit} className="grid h-full w-full place-items-center">
                        <div className="mt-4 flex h-full w-full flex-col">
                            {chats.length === 0 && (
                                <div
                                    className="grid flex-1 place-items-center overflow-auto rounded-md border font-medium"
                                    style={{ maxHeight: availableHeight }}
                                >
                                    👋 Say hi to {user.name}.
                                </div>
                            )}

                            {chats.length > 0 && (
                                <div ref={chatContainerRef} className="flex-1 overflow-auto rounded-md border p-5" style={{ maxHeight: availableHeight }}>
                                    <div className="flex flex-col gap-4">
                                        {chats?.map((chat: any) => (
                                            <ChatMessage
                                                key={chat.id}
                                                name={chat.name ? chat.name : chat.user?.name}
                                                message={chat?.message}
                                                variant={chat.user_id === auth_user.user?.id ? 'sender' : 'receiver'}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

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
