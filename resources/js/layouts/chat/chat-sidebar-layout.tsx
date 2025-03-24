import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ProperName } from '@/lib/utils';
import { Props, Users } from '@/types/UserTypes';
import { Link, useForm, usePage } from '@inertiajs/react';
import Echo from 'laravel-echo';
import { LoaderCircleIcon, PlusIcon, SearchIcon } from 'lucide-react';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
(window as any).Pusher = Pusher;

const ChatSidebarLayout = ({ users = [], children, groups = [] }: Props) => {
    const url = usePage().url;
    const group_name_input = usePage().props.errors;
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const { data, setData, post, reset, processing } = useForm({
        conversation_name: '',
        members: '',
    });

    const auth_user = usePage<{ auth: { user: { id: number; name: string } } }>().props.auth.user;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('conversation.store'), {
            onSuccess: () => {
                reset();
                setIsSheetOpen(false);
                toast('Group created successfully!');
            },
            onError: () => {
                toast('Something went wrong. Please try again');
            },
        });
    };

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

        echo.private(`display-created-group-chat-${auth_user.id}`).listen('DisplayCreatedGroupChat', (e: any) => {
            console.log(e);
        });
    }, []);

    return (
        <div className="grid flex-1 grid-cols-3">
            <div className="flex flex-col flex-wrap border-r p-4 text-sm">
                <div className="flex justify-between">
                    <h1 className="text-lg font-bold">Chats</h1>
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button>
                                New Group <PlusIcon />{' '}
                            </Button>
                        </SheetTrigger>

                        <SheetContent>
                            <form onSubmit={handleSubmit} className="mb-3">
                                <SheetHeader>
                                    <SheetTitle>Create Group Conversation</SheetTitle>
                                    <SheetDescription>Chat with multiple users at the same time</SheetDescription>
                                </SheetHeader>

                                <div className="mt-3 grid gap-2 px-4">
                                    <div className="grid items-center gap-4">
                                        <div className="grid w-full items-center gap-1.5">
                                            <Label htmlFor="name">Group Name</Label>
                                            <Input
                                                type="name"
                                                id="name"
                                                name="converation_name"
                                                placeholder="E.g Division I"
                                                onChange={(e) => setData('conversation_name', e.target.value)}
                                                className={`${group_name_input?.conversation_name ? 'border border-red-500' : ''}`}
                                            />
                                            <p className="text-xs text-red-500">{group_name_input?.conversation_name}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="place-self-end">
                                    <SheetFooter className="mt-0">
                                        <Button disabled={processing}>
                                            {processing ? (
                                                <div className="flex items-center gap-2">
                                                    <LoaderCircleIcon className="animate-spin" /> Creating ...
                                                </div>
                                            ) : (
                                                'Create Group'
                                            )}
                                        </Button>
                                    </SheetFooter>
                                </div>
                            </form>
                        </SheetContent>
                    </Sheet>
                </div>
                <div className="relative py-4">
                    <span className="absolute inset-y-0 left-1 grid w-8 place-content-center">
                        <SearchIcon size={14} />
                    </span>
                    <Input type="text" id="Search" name="search" placeholder="Search" className="pl-9" />
                </div>
                <h6 className="text-foreground/70 mb-1 text-xs">All</h6>
                <Link
                    href="/chat/all"
                    className={`duration:100 w-full rounded border-b p-4 font-medium ease-in ${url === '/chat/all' ? 'text-secondary bg-primary' : 'hover:bg-secondary hover:text-primary'} `}
                >
                    Global Chat
                </Link>
                {groups?.length > 0 && (
                    <>
                        <h6 className="text-foreground/70 mt-3 mb-1 text-xs">Groups</h6>
                        {groups?.map((group) => (
                            <Link
                                href={`/chat/group/${group.conversation.id}`}
                                key={group.conversation.id}
                                className={`duration:100 w-full rounded border-b p-4 font-medium ease-in ${url === `/chat/group/${group.conversation.id}` ? 'text-secondary bg-primary' : 'hover:bg-secondary hover:text-primary'}`}
                            >
                                {ProperName(group.conversation.conversation_name)}
                            </Link>
                        ))}
                    </>
                )}
                {users?.length > 0 && (
                    <>
                        <h6 className="text-foreground/70 mt-3 mb-1 text-xs">Users</h6>
                        {users?.map((user: Users) => (
                            <Link
                                href={`/chat/${user.id}`}
                                key={user.id}
                                className={`duration:100 w-full rounded border-b p-4 font-medium ease-in ${url === `/chat/${user.id}` ? 'text-secondary bg-primary' : 'hover:bg-secondary hover:text-primary'}`}
                            >
                                {ProperName(user.name)}
                            </Link>
                        ))}
                    </>
                )}
            </div>
            <div className="col-span-2">{children}</div>
        </div>
    );
};

export default ChatSidebarLayout;
