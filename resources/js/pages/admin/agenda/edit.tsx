import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Agenda {
    agenda: {
        id: number;
        title: string;
        user_id: number;
        agenda_file_loc: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Agenda',
        href: '/admin/agenda',
    },
    {
        title: 'Upload Agenda',
        href: '/admin/agenda/create',
    },
];

const edit = ({ agenda }: Agenda) => {
    const { data, setData, processing, errors, reset } = useForm({
        title: agenda.title,
        user_id: agenda.user_id,
        agenda_file_loc: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.post(route('admin.agenda.update', agenda.id), {
            ...data,
            _method: 'PUT',
        }, {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Agenda updated successfully');
            },
            onError: (errors) => {
                toast.error('Error updating agenda');
                console.log(errors);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Agenta File" />
            <section className="p-4">
                <div>
                    <h1 className="font-semibold">Upload File Agenda</h1>
                    <p className="text-muted-foreground text-sm">Note: Replacing the current uploaded file will delete the previous file.</p>
                </div>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="grid gap-3">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                name="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                id="title"
                                placeholder="E.g. Team Meeting"
                            />
                            <InputError className="text-sm" message={errors.title} />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="agenda_file_loc">File</Label>
                            {agenda.agenda_file_loc && <p className="text-sm"><span className='font-semibold'>Current file:</span> {agenda.agenda_file_loc}</p>}
                            <Input
                                type="file"
                                name="agenda_file_loc"
                                id="agenda_file_loc"
                                placeholder="E.g. Team Meeting"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setData('agenda_file_loc', e.target.files[0]);
                                    }
                                }}
                            />
                            <p className="text-muted-foreground text-sm">Note: The file must be in PDF or word format and less than 2mb</p>
                            <InputError className="text-sm" message={errors.agenda_file_loc} />
                        </div>
                        <div className="grid place-content-end">
                            <Button disabled={processing}>
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <LoaderCircle className="animate-spin" />
                                        <span>Uploading...</span>
                                    </div>
                                ) : (
                                    'Upload'
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </section>
        </AppLayout>
    );
};

export default edit;
