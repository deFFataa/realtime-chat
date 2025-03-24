import AppLayout from '@/layouts/app-layout';
import ChatSidebarLayout from '@/layouts/chat/chat-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Props } from '@/types/UserTypes';
import { Head } from '@inertiajs/react';
import Pusher from 'pusher-js';
(window as any).Pusher = Pusher;

export default function Chat({ users, groups }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Chat',
            href: '/chat',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chat" />
            <ChatSidebarLayout users={users} groups={groups}>
                <div className="h-full">

                </div>
            </ChatSidebarLayout>
        </AppLayout>
    );
}
