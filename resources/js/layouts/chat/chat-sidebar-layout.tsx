import { ProperName } from '@/lib/utils';
import { Props, Users } from '@/types/UserTypes';
import { Link, usePage } from '@inertiajs/react';

const ChatSidebarLayout = ({ users, children }: Props) => {
    const url = usePage().url;

    return (
        <div className="grid grid-cols-3 flex-1">
            <div className="flex flex-col flex-wrap p-4 text-sm border-r">
                <h1 className="text-lg font-bold">Chats</h1>
                <Link
                    href="/chat/all"
                    className={`duration:100 w-full rounded border-b p-4 font-medium ease-in  ${url === '/chat/all' ? 'text-secondary bg-primary' : 'hover:bg-gray-50'} `}
                >
                    Global Chat
                </Link>
                {users?.map((user: Users) => (
                    <Link
                        href={`/chat/${user.id}`}
                        key={user.id}
                        className={`duration:100 w-full rounded border-b p-4 font-medium ease-in  ${url === `/chat/${user.id}` ? 'text-secondary bg-primary' : 'hover:bg-gray-100'}`}
                    >
                        {ProperName(user.name)}
                    </Link>
                ))}
            </div>
            <div className='col-span-2'>
                {children}
            </div>
        </div>
    );
};

export default ChatSidebarLayout;
