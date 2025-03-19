import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import Pusher from 'pusher-js';
(window as any).Pusher = Pusher;

interface Props {
    users?: Array<Users>;
}

interface Users {
    id: number;
    name: string;
}

export default function Chat({ users }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Chat',
            href: '/chat',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chat" />
            <div className="grid grid-cols-3 grid-rows-2 gap-2 p-6">
                {users?.map((user : Users) => (
                    <Link href={`/chat/${user.id}`} key={user.id} className='border p-3 rounded shadow hover:bg-gray-100 ease-in duration:100 w-full'>
                        {user.name}
                    </Link>
                ))}
            </div>
        </AppLayout>
    );
}
