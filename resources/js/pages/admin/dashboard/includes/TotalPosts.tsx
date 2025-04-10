import { Megaphone } from 'lucide-react';
import { Link, WhenVisible } from '@inertiajs/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
    totalPosts: number;
}

const TotalPosts = ({ totalPosts = 0 }: Props) => {
    return (
        // <WhenVisible
        //     data="totalPosts"
        //     fallback={
        //         <div className="bg-background h-22 rounded-md">
        //             <div className="flex items-center justify-between space-x-4 p-4">
        //                 <div className="space-y-2">
        //                     <Skeleton className="h-4 w-[150px]" />
        //                     <Skeleton className="h-4 w-[100px]" />
        //                 </div>
        //                 <Skeleton className="h-12 w-12 self-start rounded-full" />
        //             </div>
        //         </div>
        //     }
        // >
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
        // </WhenVisible>
    );
};

export default TotalPosts;
