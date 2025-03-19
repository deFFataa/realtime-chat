import { Button } from '@/components/ui/button';
import ChatMessage from '@/components/ui/ChatMessage';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import Echo from 'laravel-echo';
import { SendIcon } from 'lucide-react';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
(window as any).Pusher = Pusher;

interface Props {
    messages?: any;
    user?: any;
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

export default function Show({ messages, user }: Props) {
    const { data, setData, reset, post, processing } = useForm({
        message: '',
        to: user.id,
    });

    console.log(messages);

    const [chats, setChats] = useState(messages);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('chat.store'), {
            onSuccess: () => {
                reset();
            },
            onError: () => {
                toast('Something went wrong. Please try again');
            },
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

        echo.channel('channel_for_everyone').listen('GotMessage', (event: any) => {
            setChats((prevChats: Message[]) => {
                const updatedChats = [...prevChats, event];
                return updatedChats;
            });
        });
    }, []);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Chat',
            href: '/chat',
        },
        {
            title: user.name,
            href: '/#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chat" />
            <form onSubmit={handleSubmit} className="grid h-full w-full place-items-center border">
                <div className="mt-4 flex h-full w-full max-w-lg flex-col">
                    {chats.length === 0 && (
                        <div className="max-h-[400px] flex-1 grid place-items-center overflow-auto rounded-md border p-5 font-medium">
                            👋 Say hi to {user.name}.
                        </div>
                    )}

                    {chats.length > 0 && (
                        <div className="max-h-[400px] flex-1 overflow-auto rounded-md border p-5">
                            <div className="flex flex-col gap-8">
                                {chats?.map((chat: any) => (
                                    <ChatMessage
                                        key={chat.id}
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
                            <SendIcon />
                        </Button>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
