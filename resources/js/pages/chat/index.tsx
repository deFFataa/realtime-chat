import AppHeaderLayout from '@/layouts/app/app-header-layout';
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
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Chat" />

            <div className="mx-auto flex items-center px-4 md:max-w-7xl">
                <ChatSidebarLayout users={users} groups={groups}>
                    <div className="grid h-[calc(100vh-100px)] place-items-center">
                        <div className="relative">
                            <h1 className="absolute right-0 bottom-7 left-0 text-center text-xl font-bold">eCollab</h1>
                            <img src="images/chat-bg-1.png" width={450} alt="" />
                            <h1 className="text-center font-medium">Collaborate with your team or chat with someone</h1>
                        </div>
                    </div>
                </ChatSidebarLayout>
            </div>
        </AppHeaderLayout>
    );
}
