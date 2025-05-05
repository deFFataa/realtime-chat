import { Button } from '@/components/ui/button';
import Dot from '@/components/ui/Dot';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Props } from '@/types/UserTypes';
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

    const [groupList, setGroupList] = useState(groups); 
    const auth_user = usePage<{ auth: { user: { id: number; name: string } } }>().props.auth.user;

    // ✅ Create Group Function
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('conversation.store'), {
            onSuccess: (response) => {
                reset();
                setIsSheetOpen(false);
                toast('Group created successfully!');                
                setGroupList((prevGroupList) =>
                    prevGroupList.filter((group) => group.id !== (response.props.groups as { id: number }).id).concat(response.props.groups as { id: number })
                );
                
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

        echo.private(`added-member-to-group-chat-${auth_user.id}`).listen('AddedMemberToGroupChat', (e: any) => {
            toast(`You were added to ${e.conversation_name}`);

            

            setGroupList((prevGroupList) => [...prevGroupList, e]);
            console.log([...groupList, e]);

        });

        return () => {
            echo.disconnect();
        };
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredResults, setFilteredResults] = useState<{ type: string; item: any }[]>([]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredResults([]);
        } else {
            const filteredGroups = groupList
                .filter(
                    (group) =>
                        group.conversation?.conversation_name &&
                        group.conversation.conversation_name.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((group) => ({ type: 'group', item: group.conversation }));

            const filteredUsers = users
                .filter((user) => user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((user) => ({ type: 'user', item: user }));

            const globalMatch = 'global chat'.includes(searchQuery.toLowerCase())
                ? [{ type: 'global', item: { name: 'Global Chat', id: 'all' } }]
                : [];

            setFilteredResults([...globalMatch, ...filteredGroups, ...filteredUsers]);
        }
    }, [searchQuery, users, groupList]);

    return (
        <div className="grid flex-1 grid-cols-3">
            <div className="flex max-h-screen flex-col overflow-auto border-r text-sm">
                <div className="bg-background -500 sticky top-0 py-4 px-2">
                    <div className="flex justify-between">
                        <h1 className="text-lg font-bold">Chats</h1>
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <Button>
                                    New Group <PlusIcon />
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
                                                    type="text"
                                                    id="name"
                                                    name="conversation_name"
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
                        <Input
                            type="text"
                            id="Search"
                            name="search"
                            placeholder="Search groups or users."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {searchQuery ? (
                    filteredResults.length === 0 ? (
                        <p className="px-6 text-sm">No results found. Try a different keyword.</p>
                    ) : (
                        filteredResults.map(({ type, item }) => (
                            <Link
                                key={item.id}
                                href={type === 'global' ? '/chat/all' : type === 'group' ? `/chat/group/${item.id}` : `/chat/${item.id}`}
                                className={`hover:bg-secondary hover:text-primary w-full rounded border-b p-4 font-medium duration-100 ease-in`}
                                preserveState
                            >
                                {type === 'group' ? item.conversation_name : item.name}
                            </Link>
                        ))
                    )
                ) : (
                    <>
                        <>
                            <h6 className="text-foreground/70 mb-1 px-2 text-xs">All</h6>
                            <Link
                                href="/chat/all"
                                className={`flex w-full justify-between rounded border-b p-4 font-medium ${url === '/chat/all' ? 'bg-primary text-secondary' : 'hover:bg-secondary hover:text-primary'} `}
                            >
                                Global Chat
                                {/* <Dot /> To be implemented next week */} 
                            </Link>
                        </>

                        {groups.length > 0 && (
                            <>
                                <h6 className="text-foreground/70 mt-3 mb-1 px-2 text-xs">Groups</h6>
                                {groupList.map((group) => (
                                    <Link
                                        href={`/chat/group/${group.conversation.id}`}
                                        key={group.conversation.id}
                                        className={`duration:100 flex w-full justify-between rounded border-b p-4 font-medium ease-in ${url === `/chat/group/${group.conversation.id}` ? 'text-secondary bg-primary' : 'hover:bg-secondary hover:text-primary'}`}
                                        preserveState
                                    >
                                        {group.conversation.conversation_name}
                                        {/* <Dot /> */}
                                    </Link>
                                ))}
                            </>
                        )}

                        {users.length > 0 && (
                            <>
                                <h6 className="text-foreground/70 mt-3 mb-1 px-2 text-xs">Users</h6>
                                {users.map((user) => (
                                    <Link
                                        key={user.id}
                                        href={`/chat/${user.id}`}
                                        className={`flex w-full justify-between rounded border-b p-4 font-medium ${url === `/chat/${user.id}` ? 'bg-primary text-secondary' : 'hover:bg-secondary hover:text-primary'} `}
                                        preserveState
                                    >
                                        {user.name}
                                        {/* <Dot /> */}
                                    </Link>
                                ))}
                            </>
                        )}
                    </>
                )}
            </div>
            <div className="col-span-2">{children}</div>
        </div>
    );
};

export default ChatSidebarLayout;
