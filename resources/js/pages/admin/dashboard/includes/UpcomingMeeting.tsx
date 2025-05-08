import { format } from 'date-fns';
import { CalendarClock } from 'lucide-react';

interface Props {
    upcomingDateMeeting?: string;
    upcomingStartTimeMeeting?: string;
    upcomingEndTimeMeeting?: string;
}

const UpcomingMeeting = ({ upcomingDateMeeting, upcomingStartTimeMeeting, upcomingEndTimeMeeting }: Props) => {
    return (
        <div className="bg-background grid h-full w-full rounded-md p-4 font-medium shadow">
            <div className="relative">
                <h2 className="text-sm">Upcoming Meeting</h2>
                <div className="absolute top-0 right-0 p-2">
                    <CalendarClock size={18} fontWeight={600} />
                </div>
            </div>
            <span className="text-primary mt-2 font-extrabold">
                {upcomingDateMeeting ? format(new Date(upcomingDateMeeting), 'MMM dd ') : '--'}
                -
                ({upcomingStartTimeMeeting ? format(new Date(`${upcomingDateMeeting}T${upcomingStartTimeMeeting}`), 'hh:mm a ') : '--'}
                -
                {upcomingEndTimeMeeting ? format(new Date(`${upcomingDateMeeting}T${upcomingEndTimeMeeting}`), ' hh:mm a') : '--'})
            </span>
        </div>
    );
};

export default UpcomingMeeting;
