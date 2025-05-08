import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Meeting Schedules',
        href: '/admin/meeting-scheduler',
    },
    {
        title: 'View Scheduled Meeting',
        href: '',
    },
];

interface Props {
    scheduler: {
        id: number;
        title: string;
        description: string;
        date_of_meeting: string;
        start_time: string;
        end_time: string;
        platform: string;
        meeting_link: string;
    };
}

const show = ({ scheduler }: Props) => {
    const inputStartTimeRef = useRef<HTMLInputElement>(null);
    const inputEndTimeRef = useRef<HTMLInputElement>(null);
    const handleStartTimeIconClick = () => {
        inputStartTimeRef.current?.showPicker?.();
    };

    const handleEndTimeIconClick = () => {
        inputEndTimeRef.current?.showPicker?.();
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        title: scheduler.title,
        description: scheduler.description,
        date_of_meeting: scheduler.date_of_meeting,
        start_time: scheduler.start_time,
        end_time: scheduler.end_time,
        platform: scheduler.platform,
        meeting_link: scheduler.meeting_link,
    });

    const [date, setDate] = useState<Date | null>(data.date_of_meeting ? new Date(data.date_of_meeting) : null);

    useEffect(() => {
        if (date) {
            setData('date_of_meeting', format(date, 'yyyy-MM-dd'));
        }
    }, [date, setData]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Scheduled Meeting Details" />
            <section className="p-4">
                <div>
                    <h1 className="font-semibold">Scheduled Meeting</h1>
                </div>
                <div className="mt-4">
                    <div className="grid gap-3">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="title">Agenda</Label>
                            <div className="rounded-md border p-2 text-sm">{data.title}</div>
                            {/* <Input
                                name="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                id="title"
                                placeholder="E.g. Team Meeting"
                                readOnly
                            /> */}
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="description">Description</Label>
                            <div className="rounded-md border p-2 text-sm">{data.description}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="date_of_meeting">Date</Label>
                                <div className="rounded-md border p-2 text-sm">{date && format(date, 'MMMM dd, yyyy')}</div>
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="start_time">Start Time</Label>
                                <div className="rounded-md border p-2 text-sm">
                                    {data.start_time ? format(new Date(`${data.date_of_meeting}T${data.start_time}`), 'h:mm a') : ''}
                                </div>
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="end_time">End Time</Label>
                                <div className="rounded-md border p-2 text-sm">
                                    {data.end_time ? format(new Date(`${data.date_of_meeting}T${data.end_time}`), 'h:mm a') : ''}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <Label htmlFor="title">Platform</Label>
                                <div className="rounded-md border p-2 text-sm">{data.platform}</div>
                            </div>
                            <div className='col-span-2'>
                                <Label htmlFor="title">Meeting Link</Label>
                                <div className="rounded-md border p-2 text-sm">
                                    <a href={data.meeting_link} target='_blank'>{data.meeting_link}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
};

export default show;
