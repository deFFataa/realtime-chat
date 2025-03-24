import { Button } from '@/components/ui/button';
import ChatMessage from '@/components/ui/ChatMessage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import ChatSidebarLayout from '@/layouts/chat/chat-sidebar-layout';
import { ProperName } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import Echo from 'laravel-echo';
import { CircleDashed, DoorOpen, Info, SearchIcon, SendIcon, UserRoundPlus } from 'lucide-react';
import Pusher from 'pusher-js';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
(window as any).Pusher = Pusher;

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Props {
    messages?: any;
    user?: any;
    users?: any;
    groups?: any;
    conversation_name: string;
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

export default function Show({ messages, user, users, groups, conversation_name }: Props) {
    console.log(user);

    const { data, setData, reset, post, processing } = useForm({
        message: '',
        conversation_id: user.id
    });

    console.log(user.id);
    

    const [chats, setChats] = useState(() => messages.data.slice().reverse());
    const chatInput = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('conversation.send_message'), {
            onSuccess: () => {
                reset()
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

            console.log(newMessages);

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

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Chat',
            href: '/chat',
        },
        {
            title: ProperName(user.conversation_name),
            href: '/#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chat" />
            <ChatSidebarLayout users={users} groups={groups}>
                <div className="h-full p-4">
                    <div className="flex justify-between">
                        <h2 className="font-bold">{ProperName(user.conversation_name)}</h2>
                        <Popover>
                            <PopoverTrigger className="hover:bg-secondary hover:text-primary rounded-full p-1">
                                <Info />
                            </PopoverTrigger>
                            <PopoverContent>
                                <div className="flex w-full flex-col">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" className="flex w-full justify-start">
                                                <UserRoundPlus size={16} />
                                                <span className="ml-2">Add Member</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Add people</DialogTitle>
                                                <DialogDescription>Add people to this group chat.</DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid items-center gap-4">
                                                    <div className="relative">
                                                        <span className="absolute left-1 inset-y-0 grid w-8 place-content-center">
                                                            <SearchIcon size={14}/>
                                                        </span>
                                                        <Input type="text" id="Search" name="search" placeholder="Search" className='pl-9'/>
                                                    </div>
                                                </div>
                                                <div className="grid items-center gap-4">
                                                    Users will be displayed here
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit">Add</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                    <hr />
                                    <Button variant={'ghost'} className="flex w-full justify-start text-red-500 hover:text-red-500">
                                        <DoorOpen size={16} />
                                        <span className="ml-2">Leave Group Chat</span>
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <form onSubmit={handleSubmit} className="grid h-full w-full place-items-center">
                        <div className="mt-4 flex h-full w-full flex-col">
                            {chats.length === 0 && (
                                <div
                                    className="grid flex-1 place-items-center overflow-auto rounded-md border font-medium"
                                    style={{ maxHeight: availableHeight }}
                                >
                                    👋 Say hi to {conversation_name}.
                                </div>
                            )}

                            {chats.length > 0 && (
                                <div
                                    ref={chatContainerRef}
                                    className="flex-1 overflow-auto rounded-md border p-5"
                                    style={{ maxHeight: availableHeight }}
                                >
                                    <div className="flex flex-col gap-4">
                                        {chats?.map((chat: any) => (
                                            <ChatMessage
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
                                />

                                <Button className="self-end" disabled={data.message === '' || processing}>
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
