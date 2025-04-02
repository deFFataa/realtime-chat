import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { WhenVisible } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';

interface Props {
    new_users: Array<{ id: number; name: string; email: string; created_at: string }>;
}

const NewUsers = ({ new_users = [] }: Props) => {
    return (
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
                {new_users.map((user: any) => (
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
                        <div className="self-center text-sm font-medium">{formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}</div>
                    </div>
                ))}
            </div>
        </WhenVisible>
    );
};

export default NewUsers;
