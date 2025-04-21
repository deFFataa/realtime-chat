import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon, LoaderCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Meeting Schedules',
        href: '/admin/meeting-scheduler',
    },
    {
        title: 'Schedule a Meeting',
        href: '/admin/meeting-scheduler',
    },
];

const create = () => {
    const inputStartTimeRef = useRef<HTMLInputElement>(null);
    const inputEndTimeRef = useRef<HTMLInputElement>(null);
    const handleStartTimeIconClick = () => {
        inputStartTimeRef.current?.showPicker?.();
    };

    const handleEndTimeIconClick = () => {
        inputEndTimeRef.current?.showPicker?.();
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        date_of_meeting: '',
        start_time: '',
        end_time: '',
    });

    const [date, setDate] = useState<Date | null>(data.date_of_meeting ? new Date(data.date_of_meeting) : null);

    useEffect(() => {
        if (date) {
            setData('date_of_meeting', format(date, 'yyyy-MM-dd'));
        }
    }, [date, setData]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('admin.schedules.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success('A meeting has been scheduled and email will be sent to the governing board members.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedule a Meeting" />
            <section className="p-4">
                <div>
                    <h1 className="font-semibold">Schedule a Meeting</h1>
                    <p className="text-muted-foreground text-sm">Note: Creating a meeting will send an email to all participants.</p>
                </div>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="grid gap-3">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="title">Agenda</Label>
                            <Input
                                name="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                id="title"
                                placeholder="E.g. Team Meeting"
                            />
                            <InputError className="text-sm" message={errors.title && 'The agenda field is required.'} />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                name="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="h-full min-h-auto w-full flex-1 resize-none overflow-x-hidden break-words break-all whitespace-pre-wrap"
                                placeholder="Type the description here..."
                            />
                            <InputError className="text-sm" message={errors.description} />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="date_of_meeting">Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date_of_meeting"
                                        variant={'outline'}
                                        className={`justify-between text-left font-normal ${!date && 'text-muted-foreground'}`}
                                    >
                                        {date ? format(date, 'MMMM dd, yyyy') : <span>Pick a date</span>}
                                        <CalendarIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={date || undefined} onSelect={(day) => setDate(day || null)} initialFocus />
                                </PopoverContent>
                            </Popover>
                            <InputError className="text-sm" message={errors.date_of_meeting && 'The date field is required.'}></InputError>
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="start_time">Start Time</Label>
                            <div className="relative">
                                <Input
                                    name="start_time"
                                    ref={inputStartTimeRef}
                                    id="start_time"
                                    type="time"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={handleStartTimeIconClick}
                                    className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 focus:outline-none"
                                >
                                    <ClockIcon className="h-4 w-4" />
                                </button>
                            </div>
                            <style>
                                {`
                                input[type="time"]::-webkit-calendar-picker-indicator {
                                    display: none;
                                }
                            `}
                            </style>
                            <InputError className="text-sm" message={errors.start_time}></InputError>
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="end_time">End Time</Label>
                            <div className="relative">
                                <Input
                                    ref={inputEndTimeRef}
                                    name="end_time"
                                    id="end_time"
                                    type="time"
                                    value={data.end_time}
                                    onChange={(e) => setData('end_time', e.target.value)}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={handleEndTimeIconClick}
                                    className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 focus:outline-none"
                                >
                                    <ClockIcon className="h-4 w-4" />
                                </button>
                            </div>
                            <style>
                                {`
                                input[type="time"]::-webkit-calendar-picker-indicator {
                                    display: none;
                                }
                            `}
                            </style>
                            <InputError className="text-sm" message={errors.end_time}></InputError>
                        </div>
                        <div className="grid place-content-end">
                            <Button disabled={processing}>
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <LoaderCircle className="animate-spin" />
                                        <span>Submitting...</span>
                                    </div>
                                ) : (
                                    'Submit'
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </section>
        </AppLayout>
    );
};

export default create;
