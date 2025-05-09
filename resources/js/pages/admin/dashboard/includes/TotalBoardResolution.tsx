import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Link } from '@inertiajs/react';
import { Handshake } from 'lucide-react';

interface Props {
    totalBoardResolution?: number;
}


const TotalBoardResolution = ({ totalBoardResolution = 0 }: Props) => {
    return (
        <div className="bg-background grid h-full w-full rounded-md p-4 font-medium shadow">
            <div className="relative">
                <h2 className="text-sm">Total Board Resolution Files</h2>
                <div className="absolute top-0 right-0">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Handshake className="hover:bg-secondary cursor-pointer rounded-full p-2 duration-100 ease-in" size={35} fontWeight={600} />
                        </PopoverTrigger>
                        <PopoverContent className="w-fit">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Link href="/admin/board-resolution" className="hover:bg-muted rounded-md p-2 text-start text-sm">
                                        View All
                                    </Link>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <span className="text-primary mt-2 text-2xl font-extrabold">{totalBoardResolution}</span>
        </div>
    );
};

export default TotalBoardResolution;
