import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, WhenVisible } from '@inertiajs/react';
import { format, formatDistanceToNow, subDays } from 'date-fns';
import Echo from 'laravel-echo';
import { Megaphone, Users, Zap } from 'lucide-react';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

(window as any).Pusher = Pusher;

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

interface Props {
    users_count: number;
    post_count: number;
    new_users: Array<{ id: number; name: string; email: string; created_at: string }>;
    active_users: number;
    all_users: any[];
}

export default function Dashboard({ users_count, post_count, new_users, active_users, all_users }: Props) {
    const [totalUsers, setTotalUsers] = useState(users_count || 0);
    const [totalPosts, setTotalPosts] = useState(post_count || 0);
    const [totalActiveUsers, setTotalActiveUsers] = useState(active_users || 0);
    const [newUser, setNewUser] = useState(new_users);
    const [allUsers, setAllUsers] = useState(all_users);

    const [timeRange, setTimeRange] = useState('7d');

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

        echo.channel('total-users').listen('TotalUsers', (e: any) => setTotalUsers(e.total_users));
        echo.channel('total-posts').listen('TotalPosts', (e: any) => setTotalPosts(e.total_posts));
        echo.channel('active-users').listen('TotalActiveUsers', (e: any) => setTotalActiveUsers(e.total_active_users));
        echo.channel('new-user').listen('NewUser', (e: any) => {
            setNewUser((prevUsers) => [e, ...prevUsers.filter((user) => user.id !== e.id)]);
            setAllUsers((prevUsers) => [e, ...prevUsers.filter((user) => user.id !== e.id)]);
        });
    }, []);

    const transformedData = allUsers.reduce((acc: any[], user: any) => {
        const date = format(new Date(user.created_at), 'MM-dd-yyyy');

        const existingEntry = acc.find((entry) => entry.date === date);
        if (existingEntry) {
            existingEntry.users += 1;
        } else {
            acc.push({ date, users: 1 });
        }

        return acc;
    }, []);

    // Sort data by date
    transformedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Filter data based on selected time range
    const filterDate = (days: number) => {
        const cutoffDate = subDays(new Date(), days);
        return transformedData.filter((entry) => new Date(entry.date) >= cutoffDate);
    };

    const filteredData = timeRange === '30d' ? filterDate(30) : timeRange === '7d' ? filterDate(7) : filterDate(90);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="bg-secondary flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <WhenVisible
                        data="totalUsers"
                        fallback={
                            <div className="bg-background h-22 rounded-md">
                                <div className="flex items-center justify-between space-x-4 p-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[150px]" />
                                        <Skeleton className="h-4 w-[100px]" />
                                    </div>
                                    <Skeleton className="h-12 w-12 self-start rounded-full" />
                                </div>
                            </div>
                        }
                    >
                        <div className="bg-background grid h-full w-full rounded-md p-4 font-medium shadow">
                            <div className="relative">
                                <h2 className="text-sm">Total Users</h2>
                                <div className="absolute top-0 right-0">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Users
                                                className="hover:bg-secondary cursor-pointer rounded-full p-2 duration-100 ease-in"
                                                size={35}
                                                fontWeight={600}
                                            />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-fit">
                                            <div className="grid gap-4">
                                                <div className="space-y-2">
                                                    <Link href="/admin/users" className="hover:bg-muted rounded-md p-2 text-start text-sm">
                                                        View All Users
                                                    </Link>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <span className="text-primary mt-2 text-2xl font-extrabold">{totalUsers}</span>
                        </div>
                    </WhenVisible>
                    <WhenVisible
                        data="totalPosts"
                        fallback={
                            <div className="bg-background h-22 rounded-md">
                                <div className="flex items-center justify-between space-x-4 p-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[150px]" />
                                        <Skeleton className="h-4 w-[100px]" />
                                    </div>
                                    <Skeleton className="h-12 w-12 self-start rounded-full" />
                                </div>
                            </div>
                        }
                    >
                        <div className="bg-background grid h-full w-full rounded-md p-4 font-medium shadow">
                            <div className="relative">
                                <h2 className="text-sm">Total Posts</h2>
                                <div className="absolute top-0 right-0">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Megaphone
                                                className="hover:bg-secondary cursor-pointer rounded-full p-2 duration-100 ease-in"
                                                size={35}
                                                fontWeight={600}
                                            />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-fit">
                                            <div className="grid gap-4">
                                                <div className="space-y-2">
                                                    <Link href="/admin/discussion-board" className="hover:bg-muted rounded-md p-2 text-start text-sm">
                                                        View All Posts
                                                    </Link>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <span className="text-primary mt-2 text-2xl font-extrabold">{totalPosts}</span>
                        </div>
                    </WhenVisible>
                    <WhenVisible
                        data="totalActiveUsers"
                        fallback={
                            <div className="bg-background h-22 rounded-md">
                                <div className="flex items-center justify-between space-x-4 p-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[150px]" />
                                        <Skeleton className="h-4 w-[100px]" />
                                    </div>
                                    <Skeleton className="h-12 w-12 self-start rounded-full" />
                                </div>
                            </div>
                        }
                    >
                        <div className="bg-background grid h-full w-full rounded-md p-4 font-medium shadow">
                            <div className="relative">
                                <h2 className="text-sm">Active Users</h2>
                                <div className="absolute top-0 right-0 p-2">
                                    <Zap size={18} fontWeight={600} />
                                </div>
                            </div>
                            <span className="text-primary mt-2 text-2xl font-extrabold">{totalActiveUsers}</span>
                        </div>
                    </WhenVisible>
                </div>

                <div className="grid min-h-0 flex-1 grid-cols-2 gap-4 max-lg:grid-cols-1">
                <WhenVisible
                        data="filteredData"
                        fallback={
                            <div className="bg-background h-[500px] rounded-md">
                                <div className="flex items-center p-4 w-full">
                                    <div className="space-y-2 w-full">
                                        <Skeleton className="w-full h-[430px]" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                </div>
                            </div>
                        }
                    >
                    <div>
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between">
                                    <CardTitle>User Registrations Over Time</CardTitle>
                                    <div>
                                        <Select value={timeRange} onValueChange={setTimeRange}>
                                            <SelectTrigger className="rounded-lg">
                                                <SelectValue placeholder="Last 3 months" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="90d">Last 3 months</SelectItem>
                                                <SelectItem value="30d">Last 30 days</SelectItem>
                                                <SelectItem value="7d">Last 7 days</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={392}>
                                    <LineChart data={filteredData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), 'MMM dd')} />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                    </WhenVisible>
                    <WhenVisible
                        data="totalActiveUsers"
                        fallback={
                            <div className="bg-background h-[500px] w-full rounded-md">
                                <div className="p-4">
                                    <Skeleton className="h-4 w-[100px]" />
                                </div>
                                <div className="flex items-center justify-between space-x-4 px-4 py-3.5">
                                    <div className="flex justify-center">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[250px]" />
                                            <Skeleton className="h-4 w-[200px]" />
                                        </div>
                                    </div>
                                    <div>
                                        <Skeleton className="h-4 w-[100px]" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between space-x-4 px-4 py-3.5">
                                    <div className="flex justify-center">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[250px]" />
                                            <Skeleton className="h-4 w-[200px]" />
                                        </div>
                                    </div>
                                    <div>
                                        <Skeleton className="h-4 w-[100px]" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between space-x-4 px-4 py-3.5">
                                    <div className="flex justify-center">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[250px]" />
                                            <Skeleton className="h-4 w-[200px]" />
                                        </div>
                                    </div>
                                    <div>
                                        <Skeleton className="h-4 w-[100px]" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between space-x-4 px-4 py-3.5">
                                    <div className="flex justify-center">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[250px]" />
                                            <Skeleton className="h-4 w-[200px]" />
                                        </div>
                                    </div>
                                    <div>
                                        <Skeleton className="h-4 w-[100px]" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between space-x-4 px-4 py-3.5">
                                    <div className="flex justify-center">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[250px]" />
                                            <Skeleton className="h-4 w-[200px]" />
                                        </div>
                                    </div>
                                    <div>
                                        <Skeleton className="h-4 w-[100px]" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between space-x-4 px-4 py-3.5">
                                    <div className="flex justify-center">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[250px]" />
                                            <Skeleton className="h-4 w-[200px]" />
                                        </div>
                                    </div>
                                    <div>
                                        <Skeleton className="h-4 w-[100px]" />
                                    </div>
                                </div>
                            </div>
                        }
                    >
                        <div className="bg-background max-h-[500px] overflow-auto rounded-md shadow">
                            <h2 className="bg-background sticky top-0 z-1 p-4 font-semibold">New Users</h2>
                            {newUser.map((user: any) => (
                                <div key={user.id} className="flex justify-between px-4 pb-4">
                                    <div className="flex items-center gap-2">
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <h2 className="text-sm font-medium">{user.name}</h2>
                                            <span className="text-muted-foreground text-sm">{user.email}</span>
                                        </div>
                                    </div>
                                    <div className="self-center text-sm font-medium">
                                        {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </WhenVisible>
                </div>
            </div>
        </AppLayout>
    );
}
