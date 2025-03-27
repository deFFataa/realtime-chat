import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import ChatMessage from '@/components/ui/ChatMessage';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import ChatSidebarLayout from '@/layouts/chat/chat-sidebar-layout';
import { ProperName } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import Echo from 'laravel-echo';
import {
    CircleDashed,
    DoorOpen,
    Ellipsis,
    Info,
    LoaderCircle,
    SearchIcon,
    SendIcon,
    SquarePen,
    UserRoundPlus,
    Users,
    X,
    XCircle,
} from 'lucide-react';
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
    conversation?: any;
    group_members?: any;
    users_sidebar?: any;
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

    name: string;
    id: number | string;
}

export default function Show({ messages, conversation, users, groups, conversation_name, group_members, users_sidebar }: Props) {
    const {
        data,
        setData,
        reset,
        post,
        put,
        processing,
        delete: destroy,
    } = useForm({
        message: '',
        conversation_id: conversation.id,
        users: [] as any,
        conversation_name: conversation_name,
    });

    const toggleUserSelection = (selectedUser: any) => {
        const usersArray = Array.isArray(data.users) ? data.users : [];
        const exists = usersArray.some((u: any) => u.id === selectedUser.id);

        setData('users', exists ? usersArray.filter((u: any) => u.id !== selectedUser.id) : [...usersArray, selectedUser]);
    };

    const [chats, setChats] = useState(() => messages.data.slice().reverse());
    const chatInput = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('conversation.send_message'), {
            onSuccess: () => {
                reset();
                chatInput.current?.focus();
            },
            onError: () => {
                toast('Something went wrong. Please try again');
            },
            preserveState: true,
        });
    };

    useEffect(() => {
        chatInput.current?.focus();
    }, []);

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
            echo.private(`group-chat.${conversation.id}`).listen('GroupChat', (event: any) => {
                console.log(event);
                setChats((prevChats: Message[]) => [...prevChats, event]);
            });

            return () => {
                echo.leaveChannel(`group-chat.${conversation.id}`);
            };
        } catch (error) {
            console.log(error);
        }
    }, []);

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
            const response = await axios.get(`./${conversation.id}?page=${page + 1}`);
            const newMessages = response.data.messages;

            if (!newMessages || !newMessages.data) {
                console.error('Invalid response structure:', response.data);
                return;
            }

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

    const [userList, setUserList] = useState<User[]>(users);

    const addMembers = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('conversation.add_members'), {
            onSuccess: () => {
                reset();
                toast('Members added successfully!');
                setUserList((users) => users.filter((user) => !data.users.includes(user)));
            },
            onError: () => {
                toast.error('Something went wrong. Please try again.');
            },
        });
    };

    const leaveGroupChat = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        destroy(
            route('conversation.leave-group-chat', {
                id: auth_user.user?.id,
                conversationId: conversation.id,
            }),
            {
                method: 'delete', // Ensure it's a DELETE request
                onSuccess: () => {
                    reset();
                    toast.success('You successfully left the group chat.');
                },
                onError: () => {
                    toast.error('Something went wrong. Please try again.');
                },
            },
        );
    };

    const updateConversationName = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('conversation.update_conversation_name', { id: conversation.id }), {
            onSuccess: () => {
                toast.success('Group name updated successfully.');
            },
            onError: () => {
                toast.error('Something went wrong. Please try again.');
            },
        });
    };

    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const removeMemberFromGroupChat = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        destroy(
            route('conversation.remove-member-from-group-chat', {
                id: selectedUserId,
                conversationId: conversation.id,
            }),
            {
                onSuccess: () => {
                    toast.success('Member removed successfully.');
                },
                onError: () => {
                    toast.error('Something went wrong. Please try again.');
                },
            },
        );
    };

    const [searchUser, setSearchUser] = useState('');

    useEffect(() => {
        if (searchUser === '') {
            setUserList(users);
        } else {
            setUserList(users.filter((user: any) => user.name.toLowerCase().includes(searchUser.toLowerCase())));
        }
    }, [searchUser, users]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Chat',
            href: '/chat',
        },
        {
            title: ProperName(conversation.conversation_name),
            href: '/#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chat" />
            <ChatSidebarLayout users={users_sidebar} groups={groups}>
                <div className="h-full p-4">
                    <div className="flex justify-between">
                        <h2 className="font-bold">{ProperName(conversation.conversation_name)}</h2>
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
                                            <form onSubmit={addMembers}>
                                                <DialogHeader>
                                                    <DialogTitle>Add people</DialogTitle>
                                                    <DialogDescription>Add people to this group chat.</DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid items-center gap-4">
                                                        <div className="relative">
                                                            <span className="absolute inset-y-0 left-1 grid w-8 place-content-center">
                                                                <SearchIcon size={14} />
                                                            </span>
                                                            <Input
                                                                type="text"
                                                                id="search_possiblemember"
                                                                name="search"
                                                                placeholder="Search"
                                                                className="pl-9"
                                                                value={searchUser}
                                                                onChange={(e) => setSearchUser(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    {Array.isArray(data.users) && data.users.length > 0 && (
                                                        <div className="bg-muted/30 flex gap-2 overflow-auto rounded-md p-2">
                                                            {data.users.map((user: any) => (
                                                                <div
                                                                    key={user.id}
                                                                    className="bg-secondary flex w-full max-w-fit min-w-fit items-center gap-2 rounded-md p-2 text-xs"
                                                                >
                                                                    <div className="w-full">{user.name}</div>
                                                                    <button
                                                                        className="hover:bg-primary/30 rounded-full text-lg duration-100 ease-in"
                                                                        type="button"
                                                                        onClick={() => toggleUserSelection(user)}
                                                                    >
                                                                        <X size={24} className="p-1" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="bg-muted/20 grid max-h-[300px] items-center overflow-y-auto rounded-md">
                                                        {userList.length === 0 && (
                                                            <p className="text-sm">No Results Found. Please try different keyword.</p>
                                                        )}
                                                        {userList.map((user) => {
                                                            const isChecked =
                                                                Array.isArray(data.users) && data.users.some((u: any) => u.id === user.id);

                                                            return (
                                                                <div key={user.id} className="border-b">
                                                                    <div className="hover:bg-muted/30 duration:100 flex items-center justify-between space-x-2 rounded-md ease-in">
                                                                        <label
                                                                            htmlFor={`member-${user.id}`}
                                                                            className="flex w-full items-center gap-2 p-2 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                        >
                                                                            <Avatar>
                                                                                <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
                                                                            </Avatar>
                                                                            <span>{user.name}</span>
                                                                        </label>
                                                                        <Checkbox
                                                                            id={`member-${user.id}`}
                                                                            className="me-2"
                                                                            name="users"
                                                                            checked={isChecked}
                                                                            onCheckedChange={() => toggleUserSelection(user)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit" disabled={data.users.length === 0 || processing}>
                                                        {processing ? (
                                                            <div className="flex items-center gap-2">
                                                                <LoaderCircle size={16} className="animate-spin" />
                                                                Adding ...
                                                            </div>
                                                        ) : (
                                                            'Add'
                                                        )}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" className="flex w-full justify-start">
                                                <Users size={16} />
                                                <span className="ml-2">View Members</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <form onSubmit={addMembers}>
                                                <DialogHeader>
                                                    <DialogTitle>List of Members</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="bg-muted/20 grid max-h-[300px] items-center overflow-y-auto rounded-md">
                                                        {group_members.length === 0 && <p>No Members</p>}
                                                        {group_members.map((user: any) => {
                                                            return (
                                                                <div key={user.user.id} className="flex items-center justify-between border-b">
                                                                    <div className="flex items-center justify-between space-x-2 rounded-md">
                                                                        <label
                                                                            htmlFor={`member-${user.user.id}`}
                                                                            className="flex w-full items-center gap-2 p-2 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                        >
                                                                            <Avatar>
                                                                                <AvatarFallback>{user.user.name[0].toUpperCase()}</AvatarFallback>
                                                                            </Avatar>
                                                                            <span>
                                                                                {user.user.id === auth_user.user?.id ? 'You' : user.user.name}
                                                                            </span>
                                                                        </label>
                                                                    </div>
                                                                    {conversation.user_id === auth_user.user?.id &&
                                                                        user.user.id !== auth_user.user?.id && (
                                                                            <Popover>
                                                                                <PopoverTrigger className="hover:bg-secondary hover:text-primary rounded-full p-1">
                                                                                    <Ellipsis size={24} className="p-1" />
                                                                                </PopoverTrigger>
                                                                                <PopoverContent className="w-fit">
                                                                                    <div className="flex w-full flex-col">
                                                                                        <Dialog>
                                                                                            <DialogTrigger asChild>
                                                                                                <Button
                                                                                                    variant={'ghost'}
                                                                                                    className="flex w-full justify-start text-red-500 hover:text-red-500"
                                                                                                >
                                                                                                    <XCircle className="" size={16} />
                                                                                                    <span className="ml-1 text-sm">
                                                                                                        Remove from Group Chat
                                                                                                    </span>
                                                                                                </Button>
                                                                                            </DialogTrigger>
                                                                                            <DialogContent className="sm:max-w-[425px]">
                                                                                                <DialogHeader>
                                                                                                    <DialogTitle className="text-center">
                                                                                                        Remove Member
                                                                                                    </DialogTitle>
                                                                                                    <DialogDescription className="">
                                                                                                        Are you sure you want to remove{' '}
                                                                                                        <strong className="text-red-500">
                                                                                                            {user.user.name}
                                                                                                        </strong>{' '}
                                                                                                        from this group chat?
                                                                                                    </DialogDescription>
                                                                                                </DialogHeader>
                                                                                                <DialogFooter className="text-center">
                                                                                                    <Button
                                                                                                        form="remove-member-form"
                                                                                                        variant={'destructive'}
                                                                                                        type="submit"
                                                                                                        onClick={() =>
                                                                                                            setSelectedUserId(user.user.id)
                                                                                                        }
                                                                                                        disabled={processing}
                                                                                                    >
                                                                                                        {processing ? (
                                                                                                            <div className="flex items-center gap-2">
                                                                                                                <LoaderCircle className="animate-spin" />
                                                                                                                Removing Member...
                                                                                                            </div>
                                                                                                        ) : (
                                                                                                            'Yes, I confirm.'
                                                                                                        )}
                                                                                                    </Button>
                                                                                                </DialogFooter>
                                                                                            </DialogContent>
                                                                                        </Dialog>
                                                                                    </div>
                                                                                </PopoverContent>
                                                                            </Popover>
                                                                        )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </form>
                                            <form id="remove-member-form" className="hidden" onSubmit={removeMemberFromGroupChat}></form>
                                        </DialogContent>
                                    </Dialog>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" className="flex w-full justify-start">
                                                <SquarePen size={16} />
                                                <span className="ml-2">Change Group Name</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <form onSubmit={updateConversationName}>
                                                <DialogHeader>
                                                    <DialogTitle>Change Name</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid items-center gap-4">
                                                        <div className="relative">
                                                            <Input
                                                                type="text"
                                                                id="conversation_name"
                                                                name="conversation_name"
                                                                placeholder="E.g Division I"
                                                                defaultValue={conversation_name}
                                                                onChange={(e) => setData('conversation_name', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit" disabled={processing || conversation_name === data.conversation_name}>
                                                        {processing ? (
                                                            <div className="flex items-center gap-2">
                                                                <LoaderCircle size={16} className="animate-spin" />
                                                                Saving ...
                                                            </div>
                                                        ) : (
                                                            'Save'
                                                        )}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                    <hr />
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant={'ghost'} className="flex w-full justify-start text-red-500 hover:text-red-500">
                                                <DoorOpen size={16} />
                                                <span className="ml-2">Leave Group Chat</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle className="text-center">Leave Group Chat</DialogTitle>
                                                <DialogDescription className="text-center">
                                                    Are you sure you want to leave this group chat?
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter className="text-center">
                                                <form onSubmit={leaveGroupChat}>
                                                    <Button variant={'destructive'} type="submit" disabled={processing}>
                                                        {processing ? (
                                                            <div className="flex items-center gap-2">
                                                                <LoaderCircle className="animate-spin" />
                                                                Leaving Group Chat...
                                                            </div>
                                                        ) : (
                                                            'Yes, I confirm.'
                                                        )}
                                                    </Button>
                                                </form>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
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
