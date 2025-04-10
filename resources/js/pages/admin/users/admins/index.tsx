import AppLayout from '@/layouts/app-layout';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, Pencil, Trash } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage, WhenVisible } from '@inertiajs/react';
import { Skeleton } from '@/components/ui/skeleton';
import ManageUserHeader from '@/components/ManageUserHeader';

interface Props {
    admin_users: Array<{
        id: number;
        name: string;
        email: string;
        is_loggedin: boolean;
    }>;
}

interface Users {
    id: number;
    name: string;
    email: string;
    is_loggedin: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Users',
        href: '/admin/users',
    },
];

const index = ({ admin_users = [] }: Props) => {
    const [userList, setUserList] = useState(admin_users);

    const data = userList;

    const columns: ColumnDef<Users>[] = [
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
            accessorKey: 'mobile',
            header: 'Mobile',
            cell: ({ row }) => <div className="capitalize">09051234567</div>,
        },
        {
            accessorKey: 'email',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Email
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
        },
        {
            accessorKey: 'is_loggedin',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Status
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <Badge
                    variant={'default'}
                    className={`${row.getValue('is_loggedin') ? 'bg-green-600 dark:bg-green-300' : 'bg-red-600 dark:bg-red-300'}`}
                >
                    <span className="text-xs">{row.getValue('is_loggedin') ? 'Active' : 'Inactive'}</span>
                </Badge>
            ),
        },
        {
            accessorKey: 'action',
            header: 'Action',
            cell: ({ row }) => (
                <div className="flex">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="hover:bg-muted-foreground/30 rounded-full">
                                <Link href="#">
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
                            <TooltipTrigger className="hover:bg-muted-foreground/30 rounded-full">
                                <Link href="#">
                                    <Trash className="p-[5px]" />
                                </Link>
                            </TooltipTrigger>
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

    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPages = table.getPageCount();
    const maxVisiblePages = 3;

    const getPageNumbers = () => {
        let pages: (number | string)[] = [];
        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage < totalPages) {
            pages = [...Array(endPage - startPage + 1).keys()].map((i) => startPage + i);
            if (endPage < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        } else {
            pages = [...Array(totalPages - startPage + 1).keys()].map((i) => startPage + i);
        }
        return pages;
    };

    const columnDisplayNames = {
        email: 'Email',
        name: 'Name',
        mobile: 'Mobile',
        is_loggedin: 'Status',
    };

    const url = usePage().url;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin users" />
            <WhenVisible
                data="userList"
                fallback={
                    <div className="w-full p-4">
                        <div className="flex gap-2">
                            <Skeleton className="h-12 w-[80px]" />
                            <Skeleton className="h-12 w-[80px]" />
                        </div>
                        <div className="flex justify-between">
                            <Skeleton className="mt-3 h-10 w-[380px]" />
                            <Skeleton className="mt-3 h-10 w-[100px]" />
                        </div>
                        <Skeleton className="mt-3 h-[450px] w-full" />
                        <div className="flex justify-between">
                            <Skeleton className="mt-3 h-8 w-[180px]" />
                            <Skeleton className="mt-3 h-8 w-[410px]" />
                        </div>
                    </div>
                }
            >
                <div className="w-full p-4">
                    <ManageUserHeader url={url} />
                    <div className="flex items-center py-4">
                        <Input
                            placeholder="Search by email, name, or mobile..."
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
                                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                    <div className="flex items-center justify-between py-4">
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
                            <Button variant="outline" size="sm" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
                                {'<<'}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                                Previous
                            </Button>

                            {getPageNumbers().map((page, index) => (
                                <Button
                                    key={index}
                                    variant={page === currentPage ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => typeof page === 'number' && table.setPageIndex(page - 1)}
                                    disabled={page === '...'}
                                >
                                    {page}
                                </Button>
                            ))}

                            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                                Next
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
                                {'>>'}
                            </Button>
                        </div>
                    </div>
                </div>
            </WhenVisible>
        </AppLayout>
    );
};

export default index;
