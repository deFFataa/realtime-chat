import { CalendarClock } from 'lucide-react';

interface Props {
    upcomingEvent?: string;
}

const UpcomingEvent = ({ upcomingEvent }: Props) => {
    return (
        <div className="bg-background grid h-full w-full rounded-md p-4 font-medium shadow">
            <div className="relative">
                <h2 className="text-sm">Upcoming Meeting</h2>
                <div className="absolute top-0 right-0 p-2">
                    <CalendarClock size={18} fontWeight={600} />
                </div>
            </div>
            <span className="text-primary mt-2 font-extrabold">April 22, 2025 - 10:00 AM</span>
        </div>
    );
};

export default UpcomingEvent;
