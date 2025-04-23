import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Feedback, Props } from '@/types/feedback';
import { Head, Link, useForm } from '@inertiajs/react';
import { Checkbox } from '@/components/ui/checkbox';
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
import { ArrowUpDown, ChevronDown, ChevronLeftIcon, ChevronRightIcon, LoaderCircle, Pencil, Star, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Feedback Report',
        href: '/admin/feedback-report',
    },
];

const index = ({ feedbacks = [], rating_today, overall_rating }: Props) => {
    const [feedbackList, setFeedbackList] = useState(feedbacks);
    const data = feedbackList;

    useEffect(() => {
        setFeedbackList(feedbackList);
    }, [feedbackList]);

    const { processing, delete: destroy } = useForm();

    const handleDelete = (id: number, e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        destroy(route('admin.agenda.destroy', id), {
            onSuccess: () => {
                toast.success('Agenda deleted successfully');
            },
            onError: (errors) => {
                toast.error('Error deleting agenda');
                console.log(errors);
            },
        });
    };

    const columns: ColumnDef<Feedback>[] = [
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
            accessorKey: 'name',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Name
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
        },
        {
            accessorKey: 'rating',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Rating
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                return (
                    <div className="font-medium flex gap-1">
                        <span>{row.getValue('rating')}</span>
                        <Star className="fill-yellow-300" color="" size={18} />
                    </div>
                );
            },
        },
        {
            accessorKey: 'comment',
            header: 'Comment',
            cell: ({ row }) => {
                return (
                    <div>
                        <span>{row.getValue('comment')}</span>
                    </div>
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
                                <Link href={route('admin.agenda.edit', row.getValue('id'))}>
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
                                        <DialogTitle>Are you sure you want to delete this file?</DialogTitle>
                                        <DialogDescription>
                                            All of the data that is associated with this file will be deleted. This action cannot be undone. Are you
                                            sure you want to permanently delete this file?
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
        title: 'Title',
        id: 'Action',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Agenda" />
            <div className="w-full p-4">
                {feedbackList.length === 0 && (
                    <div className="text-muted-foreground flex h-100 items-center justify-center text-lg font-medium">No agendas found.</div>
                )}
                {feedbackList.length > 0 && (
                    <>
                        <div className="flex items-center py-4">
                            <Input
                                placeholder="Search by Name or Rating..."
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
