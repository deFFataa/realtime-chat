import { Zap } from 'lucide-react';
import { WhenVisible } from '@inertiajs/react';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
    totalActiveUsers: number;
}

const ActiveUsers = ({ totalActiveUsers }: Props) => {
    return (
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
    );
};

export default ActiveUsers;
