import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Link } from '@inertiajs/react';
import {
    add,
    eachDayOfInterval,
    endOfMonth,
    format,
    getDay,
    isEqual,
    isSameDay,
    isSameMonth,
    isToday,
    parse,
    parseISO,
    startOfToday,
    isBefore,
    startOfDay,

} from 'date-fns';
import { CalendarClock, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';

function classNames(...classes: Array<string | undefined | null | false>) {
    return classes.filter(Boolean).join(' ');
}

interface Props {
    schedule: Array<{
        id: number;
        title: string;
        description: string;
        date_of_meeting: string;
        start_time: string;
        end_time: string;
    }>;
}

const ScheduleAndReminders = ({ schedule }: Props) => {
    const meetings = schedule;

    let today = startOfToday();
    let [selectedDay, setSelectedDay] = useState(today);
    let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
    let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

    let days = eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: endOfMonth(firstDayCurrentMonth),
    });

    function previousMonth() {
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
    }

    function nextMonth() {
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
    }

    let selectedDayMeetings = meetings.filter((meeting) => isSameDay(parseISO(meeting.date_of_meeting), selectedDay));

    return (
        <div className="bg-background h-full overflow-auto rounded-md p-4 shadow">
            <div className="relative">
                <h2 className="text-sm font-medium">Schedule</h2>
                <div className="absolute top-0 right-0">
                    <Popover>
                        <PopoverTrigger asChild>
                            <CalendarClock
                                className="hover:bg-secondary cursor-pointer rounded-full p-2 duration-100 ease-in"
                                size={35}
                                fontWeight={600}
                            />
                        </PopoverTrigger>
                        <PopoverContent className="w-fit">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Link href="/admin/meeting-scheduler" className="hover:bg-muted rounded-md p-2 text-start text-sm">
                                        View All
                                    </Link>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="mt-4">
                <div className="mx-auto">
                    <div className="md:grid">
                        <div className="">
                            <div className="flex items-center">
                                <h2 className="flex-auto font-medium text-gray-900">{format(firstDayCurrentMonth, 'MMMM yyyy')}</h2>
                                <button
                                    type="button"
                                    onClick={previousMonth}
                                    className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                                >
                                    <span className="sr-only">Previous month</span>
                                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                    onClick={nextMonth}
                                    type="button"
                                    className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                                >
                                    <span className="sr-only">Next month</span>
                                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                            <div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
                                <div>S</div>
                                <div>M</div>
                                <div>T</div>
                                <div>W</div>
                                <div>T</div>
                                <div>F</div>
                                <div>S</div>
                            </div>
                            <div className="mt-2 grid grid-cols-7 text-sm">
                                {days.map((day, dayIdx) => (
                                    <div key={day.toString()} className={classNames(dayIdx === 0 && colStartClasses[getDay(day)], 'py-1.5')}>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedDay(day)}
                                                    className={classNames(
                                                        isEqual(day, selectedDay) && 'text-secondary',
                                                        !isEqual(day, selectedDay) && isToday(day) && 'text-primary',
                                                        !isEqual(day, selectedDay) &&
                                                            !isToday(day) &&
                                                            isSameMonth(day, firstDayCurrentMonth) &&
                                                            'text-secondary-foreground',
                                                        !isEqual(day, selectedDay) &&
                                                            !isToday(day) &&
                                                            !isSameMonth(day, firstDayCurrentMonth) &&
                                                            'text-muted',
                                                        isEqual(day, selectedDay) && isToday(day) && 'bg-primary',
                                                        isEqual(day, selectedDay) && !isToday(day) && 'bg-muted-foreground',
                                                        !isEqual(day, selectedDay) && 'hover:bg-muted',
                                                        (isEqual(day, selectedDay) || isToday(day)) && 'font-semibold',
                                                        'mx-auto flex h-8 w-8 items-center justify-center rounded-full',
                                                    )}
                                                >
                                                    <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <section>
                                                    <h2 className="font-semibold text-secondary-foreground">
                                                        Schedule for{' '}
                                                        <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>{format(selectedDay, 'MMM dd, yyy')}</time>
                                                    </h2>
                                                    <ol className="mt-4 space-y-1 text-sm leading-6 text-muted-foreground">
                                                        {selectedDayMeetings.length > 0 ? (
                                                            selectedDayMeetings.map((meeting) => <Meeting meeting={meeting} key={meeting.id} />)
                                                        ) : (
                                                            <p>No meetings for this day.</p>
                                                        )}
                                                    </ol>
                                                </section>
                                            </PopoverContent>
                                        </Popover>

                                        <div className="mx-auto mt-1 h-1 w-1">
                                            {meetings.some((meeting) => isSameDay(parseISO(meeting.date_of_meeting), day)) && (
                                                <div
                                                    className={`h-1 w-1 rounded-full ${
                                                        meetings.some(
                                                            (meeting) =>
                                                                isSameDay(parseISO(meeting.date_of_meeting), day) &&
                                                                isBefore(parseISO(meeting.date_of_meeting), startOfDay(new Date())),
                                                        )
                                                            ? 'bg-muted-foreground'
                                                            : 'bg-primary'
                                                    }`}
                                                ></div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function Meeting({ meeting }: any) {
    const startTime = format(new Date(`1970-01-01T${meeting.start_time}`), 'h:mm a');
    const endTime = format(new Date(`1970-01-01T${meeting.end_time}`), 'h:mm a');

    return (
        <li className="group flex items-center space-x-4 rounded-xl">
            <div className="flex-auto">
                <p className="text-secondary-foreground">{meeting.title}</p>
                <p className="mt-0.5">
                    <time dateTime={meeting.start_time}>{startTime}</time> - <time dateTime={meeting.end_time}>{endTime}</time>
                </p>
            </div>
        </li>
    );
}

let colStartClasses = ['', 'col-start-2', 'col-start-3', 'col-start-4', 'col-start-5', 'col-start-6', 'col-start-7'];

export default ScheduleAndReminders;
