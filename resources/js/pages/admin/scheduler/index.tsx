import AppLayout from '@/layouts/app-layout';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown, CalendarPlus, ChevronDown, LoaderCircle, Pencil, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Meeting Schedules',
        href: '/admin/meeting-scheduler',
    },
];

interface Props {
    meeting_schedule: Array<Schedules>;
}

interface Schedules {
    id: number;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
}

const index = ({ meeting_schedule = [] }: Props) => {
    const [schedules, setSchedules] = useState(meeting_schedule);
    const data = schedules;

    useEffect(() => {
        setSchedules(meeting_schedule);
    }, [meeting_schedule]);

    const { delete: destroy, processing } = useForm();

    const handleDelete = (id: number, e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        destroy(route('admin.users.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('You have successfully deleted the user.');
            },
        });
    };

    const columns: ColumnDef<Schedules>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'title',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Agenda
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="font-medium">{row.getValue('title')}</div>,
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => {
                const description = String(row.getValue('description') || '-');
                const trimmed = description.length > 80 ? description.slice(0, 80) + '…' : description;

                return <div className="max-w-md text-wrap capitalize">{trimmed}</div>;
            },
        },
        {
            accessorKey: 'date_of_meeting',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Date
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="">{format(new Date(row.getValue('date_of_meeting')), 'MMM dd, yyyy')}</div>,
        },
        {
            accessorKey: 'end_time',
            header: () => <div>Time</div>,
            cell: ({ row }) => {
                const startTime = new Date(`1970-01-01T${row.original.start_time}Z`) // Convert to a valid Date object
                const endTime = new Date(`1970-01-01T${row.original.end_time}Z`)
        
                return (
                    <div>
                        {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
                    </div>
                )
            },
        },
        {
            accessorKey: 'id',
            header: 'Action',
            cell: ({ row }) => (
                <div className="flex">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="hover:bg-muted-foreground/30 rounded-full">
                                <Link href={route('admin.users.edit', row.getValue('id'))}>
                                    <Pencil className="p-[5px]" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <Dialog>
                                <TooltipTrigger className="hover:bg-muted-foreground/30 rounded-full">
                                    <DialogTrigger asChild type="button">
                                        <Trash className="p-[5px]" />
                                    </DialogTrigger>
                                </TooltipTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Are you sure you want to delete this account?</DialogTitle>
                                        <DialogDescription>
                                            This action cannot be undone. Are you sure you want to permanently delete this account?
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <form onSubmit={() => handleDelete(row.getValue('id'))}>
                                            <Button variant={'destructive'} disabled={processing}>
                                                {processing ? (
                                                    <div className="flex items-center gap-1">
                                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                                        Deleting...
                                                    </div>
                                                ) : (
                                                    'Confirm'
                                                )}
                                            </Button>
                                        </form>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <TooltipContent>
                                <p>Delete</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
        },
    ];

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const columnDisplayNames = {
        title: 'Agenda',
        description: 'Description',
        date_of_meeting: 'Date',
        end_time: 'Time',
        id: 'Action',
    };

    const url = usePage().url;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Meeting Schedules" />

            <div className="w-full p-4">
                <div>
                    <Button asChild>
                        <Link href={route('admin.schedules.create')}>
                            Schedule a Meeting <CalendarPlus />
                        </Link>
                    </Button>
                </div>
                {schedules.length === 0 && (
                    <div className="text-muted-foreground flex h-100 items-center justify-center text-lg font-medium">No schedules found.</div>
                )}
                {schedules.length > 0 && (
                    <>
                        <div className="flex items-center py-4">
                            <Input
                                placeholder="Search by title..."
                                value={table.getState().globalFilter ?? ''}
                                onChange={(event) => table.setGlobalFilter(event.target.value)}
                                className="max-w-sm"
                            />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="ml-auto">
                                        Columns <ChevronDown />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {table
                                        .getAllColumns()
                                        .filter((column) => column.getCanHide())
                                        .map((column) => {
                                            return (
                                                <DropdownMenuCheckboxItem
                                                    key={column.id}
                                                    className="capitalize"
                                                    checked={column.getIsVisible()}
                                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                                >
                                                    {columnDisplayNames[column.id as keyof typeof columnDisplayNames] || column.id}
                                                </DropdownMenuCheckboxItem>
                                            );
                                        })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => {
                                                return (
                                                    <TableHead key={header.id}>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                                    </TableHead>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
};
export default index;
