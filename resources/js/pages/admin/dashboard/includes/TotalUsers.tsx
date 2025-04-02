import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, WhenVisible } from '@inertiajs/react';
import { Users } from 'lucide-react';

interface Props {
    totalUsers: number;
}

const TotalUsers = ({ totalUsers = 0 }: Props) => {
    return (
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
    );
};

export default TotalUsers;
