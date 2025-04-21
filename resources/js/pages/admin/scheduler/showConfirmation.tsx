import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';

interface Props {
    user: {
        id: number;
    };
    scheduler: {
        id: number;
        title: string;
        description: string;
        date_of_meeting: string;
        start_time: string;
        end_time: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Confirm Attendance',
        href: '',
    },
];

const showConfirmation = ({ user, scheduler }: Props) => {
    const { data, setData, post, processing, errors, reset } = useForm({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.schedules.confirm', { scheduler_id: scheduler.id, user_id: user.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Confirm Attendance" />
            <section className="p-6">
                <h1 className="text-2xl font-bold">Confirm Attendance</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <div>
                            <h2 className="">
                                <span className="mr-2 font-semibold">What:</span>
                                {scheduler.title}
                            </h2>
                            <p>
                                <span className="mr-2 font-semibold">Description:</span>
                                {scheduler.description}
                            </p>
                            <p>
                                <span className="mr-2 font-semibold">When:</span>
                                {`${format(new Date(scheduler.date_of_meeting), 'MMMM dd, yyyy')} | ${format(new Date(`${scheduler.date_of_meeting}T${scheduler.start_time}`), 'hh:mm aa')} - ${format(
                                    new Date(`${scheduler.date_of_meeting}T${scheduler.end_time}`),
                                    'hh:mm aa',
                                )}`}
                            </p>
                        </div>
                    </div>
                    <Button className="mt-4">Confirm Attendance</Button>
                </form>
            </section>
        </AppLayout>
    );
};

export default showConfirmation;
