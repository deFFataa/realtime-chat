import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Minutes of the Meeting',
        href: '/admin/minutes-of-the-meeting',
    },
    {
        title: 'Upload Minutes of the Meeting',
        href: '/admin/minutes-of-the-meeting/create',
    },
];

interface Props {
    agendas: Array<{
        id: number;
        title: string;
    }>
    minutes_of_meeting: {
        id: number;
        title: string;
        agenda_id: number;
        mom_file_loc: string;
    }
}

const edit = ({ agendas, minutes_of_meeting }: Props) => {


    const { data, setData, post, processing, errors, reset } = useForm({
        title: minutes_of_meeting.title,
        agenda_id: minutes_of_meeting.agenda_id,
        mom_file_loc: null as File | null,
    });

    console.log(usePage().props.errors);
    

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.post(route('admin.mom.update', minutes_of_meeting.id), {
            ...data,
            _method: 'PUT',
        }, {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Minutes of the Meeting updated successfully');
            },
            onError: (errors) => {
                toast.error('Error updating minutes of the meeting');
                console.log(errors);
            },
        });
    };

    const [open, setOpen] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Minutes of the Meeting" />
            <section className="p-4">
                <div>
                    <h1 className="font-semibold">Edit Minutes of the Meeting File</h1>
                    <p className="text-muted-foreground text-sm">Note: Replacing the file will delete the previous file.</p>
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
                        <div className="grid">
                            <Label htmlFor="agenda">Agenda</Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild className="mt-1">
                                    <Button id="agenda" variant="outline" role="combobox" aria-expanded={open} className="justify-between">
                                        {data.agenda_id
                                            ? agendas.find((agenda) => agenda.id === Number(data.agenda_id))?.title
                                            : 'Select agenda for this minutes of the meeting'}
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="min-w-lg p-0">
                                    <Command>
                                        <CommandInput name='agenda_id' placeholder="Search Agenda" />
                                        <CommandList>
                                            <CommandEmpty>No agenda found.</CommandEmpty>
                                            <CommandGroup>
                                                {agendas.map((agenda) => (
                                                    <CommandItem
                                                        key={agenda.id}
                                                        value={String(agenda.id)}
                                                        onSelect={() => {
                                                            setData('agenda_id', agenda.id);
                                                            setOpen(false);
                                                        }}
                                                    >
                                                        {agenda.title}
                                                        <Check
                                                            className={cn(
                                                                'ml-auto',
                                                                data.agenda_id === agenda.id ? 'opacity-100' : 'opacity-0',
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <InputError className="text-sm" message={errors.agenda_id && 'The agenda field is required.'} />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="mom_file_loc">File</Label>
                            {minutes_of_meeting.mom_file_loc && <p className="text-sm"><span className='font-semibold'>Current file:</span> {minutes_of_meeting.mom_file_loc}</p>}
                            <Input
                                type="file"
                                name="mom_file_loc"
                                id="mom_file_loc"
                                placeholder="E.g. Team Meeting"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setData('mom_file_loc', e.target.files[0]);
                                    }
                                }}
                            />
                            <p className="text-muted-foreground text-sm">Note: The file must be in PDF or word format and less than 2mb</p>
                            <InputError className="text-sm" message={errors.mom_file_loc === 'The mom file loc field is required.' ? 'The file field is required.' : errors.mom_file_loc} />
                        </div>
                        <div className="grid place-content-end">
                            <Button disabled={processing}>
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <LoaderCircle className="animate-spin" />
                                        <span>Saving...</span>
                                    </div>
                                ) : (
                                    'Save'
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
