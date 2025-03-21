import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ProperName } from '@/lib/utils';
import { Props, Users } from '@/types/UserTypes';
import { Link, usePage } from '@inertiajs/react';
import { UsersRound } from 'lucide-react';

const ChatSidebarLayout = ({ users, children }: Props) => {
    const url = usePage().url;

    return (
        <div className="grid flex-1 grid-cols-3">
            <div className="flex flex-col flex-wrap border-r p-4 text-sm">
                <div className="flex justify-between">
                    <h1 className="text-lg font-bold">Chats</h1>
                    <form className="mb-3">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline">Open</Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Create Group Conversation</SheetTitle>
                                    <SheetDescription>Chat with multiple users at the same time</SheetDescription>
                                </SheetHeader>
                                <div className="grid gap-2 p-4">
                                    <div className="grid items-center gap-4">
                                        <div className="grid w-full items-center gap-1.5">
                                            <Label htmlFor="name">Group Name</Label>
                                            <Input type="name" id="name" placeholder="E.g Division I" />
                                        </div>
                                    </div>
                                    <div className="grid items-center gap-4 mt-4">
                                        <div className="grid w-full items-center gap-1.5">
                                            <Label htmlFor="name">Members</Label>
                                            <Input type="name" id="name" placeholder="Search Members" />
                                        </div>
                                    </div>
                                </div>
                                <SheetFooter className='mt-0'>
                                    <SheetClose asChild>
                                        <Button type="submit">Save changes</Button>
                                    </SheetClose>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </form>
                </div>
                <Link
                    href="/chat/all"
                    className={`duration:100 w-full rounded border-b p-4 font-medium ease-in ${url === '/chat/all' ? 'text-secondary bg-primary' : 'hover:bg-secondary hover:text-primary'} `}
                >
                    Global Chat
                </Link>
                {users?.map((user: Users) => (
                    <Link
                        href={`/chat/${user.id}`}
                        key={user.id}
                        className={`duration:100 w-full rounded border-b p-4 font-medium ease-in ${url === `/chat/${user.id}` ? 'text-secondary bg-primary' : 'hover:bg-secondary hover:text-primary'}`}
                    >
                        {ProperName(user.name)}
                    </Link>
                ))}
            </div>
            <div className="col-span-2">{children}</div>
        </div>
    );
};

export default ChatSidebarLayout;
