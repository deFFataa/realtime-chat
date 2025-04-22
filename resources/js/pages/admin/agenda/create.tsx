import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

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

const create = () => {
    const auth_user_id = (usePage() as any).props.auth.user.id;

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        user_id: auth_user_id,
        agenda_file_loc: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('admin.agenda.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success('Uploaded successfully');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedule a Meeting" />
            <section className="p-4">
                <div>
                    <h1 className="font-semibold">Upload File Agenda</h1>
                    {/* <p className="text-muted-foreground text-sm">Note: Creating a meeting will send an email to all governing board members.</p> */}
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

export default create;
