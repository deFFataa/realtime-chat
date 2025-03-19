import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';
(window as any).Pusher = Pusher;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Room',
        href: '/room',
    },
];

interface Props {
    room: any;
}

export default function Room({ room }: Props) {
    const [currentUsers, setCurrentUsers] = useState<any>([]);    

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
    
        echo.join(`room.${room.id}`)
            .here((users: any) => {
                setCurrentUsers(users);
            })
            .joining((user: any) => {
                setCurrentUsers((prevUsers: any) => [...prevUsers, user]);
            })
            .leaving((user: any) => {
                setCurrentUsers((prevUsers: any) => prevUsers.filter((u: any) => u.id !== user.id));
            });
        
        return () => {
            echo.leave(`room.${room.id}`);
        };
    }, []);
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <h2 className="px-5">Room {room.name}</h2>
            {currentUsers.map((user: any) => (
                <div key={user.id}>{user.name}</div>
            ))}
        </AppLayout>
    );
}
