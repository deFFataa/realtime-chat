import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useInitials } from '@/hooks/use-initials';
import { Props } from '@/types/feedback';
import { Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { Star } from 'lucide-react';

const FeedbackSummaryReport = ({ feedbacks, rating_today, overall_rating }: Props) => {
    const getInitials = useInitials();

    return (
        <div className="bg-background h-full overflow-auto rounded-md p-4 shadow">
            <div className="relative">
                <h2 className="text-sm font-medium">Feedback Summary Report</h2>
                <div className="absolute top-0 right-0">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Star className="hover:bg-secondary cursor-pointer rounded-full p-2 duration-100 ease-in" size={35} fontWeight={600} />
                        </PopoverTrigger>
                        <PopoverContent className="w-fit">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Link href="/admin/feedback-report" className="hover:bg-muted rounded-md p-2 text-start text-sm">
                                        View All
                                    </Link>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="mt-5 mb-2">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-medium">Today's Rating:</h2>
                            <div className="inline-flex items-center">
                                <h2 className="text-sm">{rating_today}</h2>
                                <Star className="fill-yellow-300" color="" size={15} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-medium">Overall Rating:</h2>
                            <div className="inline-flex items-center">
                                {/* <h2 className="text-sm">{overall_rating.toFixed(2)}</h2> */}
                                <Star className="fill-yellow-300" color="" size={15} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='max-h-[330px] overflow-auto'>
                    {feedbacks?.map((feedback) => (
                        <div key={feedback.id} className="mt-3 flex justify-between pb-4">
                            <div className="flex items-center gap-2">
                                <Avatar className="self-start">
                                    <AvatarFallback>{getInitials(feedback.user.name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <div className="inline-flex items-center">
                                        <h2 className="mr-2 text-sm font-medium">{feedback.user.name}</h2>
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <Star
                                                key={index}
                                                className={index < feedback.rating ? 'fill-yellow-300' : 'fill-gray-300'}
                                                color=""
                                                size={15}
                                            />
                                        ))}
                                    </div>
                                    <div className="bg-primary mt-1 w-fit rounded-tr rounded-b px-2 py-1 text-sm text-white">{feedback.comment}</div>
                                </div>
                            </div>
                            <div className="self-start text-sm font-medium">
                                {formatDistanceToNow(new Date(feedback.created_at), { addSuffix: true })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeedbackSummaryReport;
