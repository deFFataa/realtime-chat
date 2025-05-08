import AppLayout from '@/layouts/app-layout';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown, CalendarPlus, ChevronDown, ChevronLeftIcon, ChevronRightIcon, Eye, LoaderCircle, Pencil, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
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
    attendance: {
        item: {
            [meeting_id: number]: Attendance[];
        };
    };
    users_count: number;
}

interface Attendance {
    id: number;
    meeting_id: number;
    user_id: number;
    user: {
        id: number;
        name: string;
    };
}

interface Schedules {
    id: number;
    title: string;
    description: string;
    date_of_meeting: string;
    start_time: string;
    end_time: string;
}

const index = ({ meeting_schedule = [], attendance, users_count }: Props) => {
    const [attendance_list, setAttendance] = useState(attendance);
    const [schedules, setSchedules] = useState(meeting_schedule);
    const data = schedules;

    console.log(attendance_list.item);

    useEffect(() => {
        setSchedules(meeting_schedule);
    }, [meeting_schedule]);

    const { delete: destroy, processing } = useForm();

    const handleDelete = (id: number, e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        destroy(route('admin.schedules.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Meeting is deleted.');
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
            accessorKey: 'platform',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Platform
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize">{String(row.getValue('platform')).replace(/\b\w/g, (char: string) => char.toUpperCase())}</div>
            ),
        },
        //     accessorKey: 'description',
        //     header: 'Description',
        //     cell: ({ row }) => {
        //         const description = String(row.getValue('description') || '-');
        //         const trimmed = description.length > 80 ? description.slice(0, 80) + '…' : description;

        //         return <div className="max-w-md text-wrap capitalize">{trimmed}</div>;
        //     },
        // },
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
                const startTime = new Date(`${row.original.date_of_meeting}T${row.original.start_time}`);
                const endTime = new Date(`${row.original.date_of_meeting}T${row.original.end_time}`);

                return (
                    <div>
                        {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
                    </div>
                );
            },
        },
        {
            accessorKey: '',
            header: 'Attendance',
            cell: ({ row }) => {
                const meetingId = row.original.id;
                const attendances = attendance_list.item[meetingId] || [];

                return (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="m-0 flex w-full justify-center">
                                <span className="">
                                    {attendances.length}/{users_count}
                                </span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form>
                                <DialogHeader>
                                    <DialogTitle>Attendance</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="bg-muted/20 grid max-h-[300px] items-center overflow-y-auto rounded-md">
                                        {attendances.length === 0 && <p className="p-2 text-center">No One Responded Yet.</p>}
                                        {attendances.map((a) => (
                                            <div key={a.id} className="flex items-center gap-2 border-b p-2">
                                                <Avatar>
                                                    <AvatarFallback>{a.user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span>{a.user.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                );
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
                                <Link href={route('admin.schedules.show', row.getValue('id'))}>
                                    <Eye className="p-[5px]" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>View</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="hover:bg-muted-foreground/30 rounded-full">
                                <Link href={route('admin.schedules.edit', row.getValue('id'))}>
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
                                        <DialogTitle>Are you sure you want to delete this meeting?</DialogTitle>
                                        <DialogDescription>
                                            This action cannot be undone. Are you sure you want to permanently delete this meeting?
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <form onSubmit={(e) => handleDelete(row.getValue('id'), e)}>
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
        getPaginationRowModel: getPaginationRowModel(),
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
                                placeholder="Search by agenda..."
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
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                        Show
                                    </Label>
                                    <Select
                                        value={`${table.getState().pagination.pageSize}`}
                                        onValueChange={(value) => {
                                            table.setPageSize(Number(value));
                                        }}
                                    >
                                        <SelectTrigger className="w-20" id="rows-per-page">
                                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                                        </SelectTrigger>
                                        <SelectContent side="top">
                                            {[10, 20, 50, 100].map((pageSize) => (
                                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                                    {pageSize}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    Entries
                                </div>
                                <div className="space-x-1">
                                    {/* <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => table.firstPage()}
                                                    disabled={!table.getCanPreviousPage()}
                                                >
                                                    {'<<'}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Go back to first page.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider> */}

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => table.previousPage()}
                                                    disabled={!table.getCanPreviousPage()}
                                                >
                                                    <ChevronLeftIcon />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Previous</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => table.nextPage()}
                                                    disabled={!table.getCanNextPage()}
                                                >
                                                    <ChevronRightIcon />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Next</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {/* <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => table.lastPage()}
                                                    disabled={!table.getCanNextPage()}
                                                >
                                                    {'>>'}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Go to the last page.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider> */}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
};
export default index;
