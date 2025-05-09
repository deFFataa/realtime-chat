import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Post, Props } from '@/types/post';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
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
import { format } from 'date-fns';
import { ArrowUpDown, ChevronDown, ChevronLeftIcon, ChevronRightIcon, Eye, FileUpIcon, LoaderCircle, Plus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Discussion Board',
        href: '/admin/discussion-board',
    },
];

const index = ({ posts = [] }: Props) => {
    const [post, setPost] = useState(posts);
    const data = post;

    useEffect(() => {
        setPost(posts);
    }, [posts]);

    const { processing, delete: destroy } = useForm();

    const handleDelete = (id: number, e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        destroy(route('admin.discussion-board.destroy', id), {
            onSuccess: () => {
                toast.success('Post deleted successfully');
            },
            onError: (errors) => {
                toast.error('Error deleting the post. Please try again.');
                console.log(errors);
            },
        });
    };

    const { auth } = usePage<SharedData>().props;
    const is_super_admin = auth.user.role === 'super-admin';

    const columns: ColumnDef<Post>[] = [
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
            accessorKey: 'user_name',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Name
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="text-sm font-medium">{row.getValue('user_name')}</div>,
        },
        {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => (
                <div
                    className="prose prose-sm max-w-none text-sm"
                    dangerouslySetInnerHTML={{
                        __html: (() => {
                            const title = String(row.getValue('title') ?? '').trim();
                            if (!title) return '--';
                            return title.length > 20 ? title.slice(0, 20) + '…' : title;
                        })(),
                    }}
                />
            ),
        },
        {
            accessorKey: 'body',
            header: 'Body',
            cell: ({ row }) => (
                <div
                    className="prose prose-sm max-w-none text-sm"
                    dangerouslySetInnerHTML={{
                        __html: String(row.getValue('body')).length > 50 ? String(row.getValue('body')).slice(0, 50) + '…' : row.getValue('body'),
                    }}
                />
            ),
        },
        {
            accessorKey: 'media_location',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        File/Image
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const imageExtensionName = ['jpeg', 'jpg', 'png'];
                const fileExtensionName = ['pdf', 'doc', 'docx'];
                const mediaLocation = row.getValue('media_location');
                const file_extension = typeof mediaLocation === 'string' ? mediaLocation.split('.').pop() : undefined;

                const fileName = String(row.getValue('media_location') || '-');

                if (file_extension && imageExtensionName.includes(file_extension)) {
                }

                const fileUrl = `/${file_extension && imageExtensionName.includes(file_extension) ? 'image_media' : 'file_media'}/${fileName}`;

                return (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size={'sm'} className="">
                                {file_extension && imageExtensionName.includes(file_extension) ? 'Image' : 'File'}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-transparent p-0 backdrop-blur-sm sm:max-h-full sm:max-w-full">
                            <div className="flex h-screen w-screen items-center justify-center bg-white/50">
                                {file_extension && imageExtensionName.includes(file_extension) ? (
                                    // Image preview
                                    <img src={fileUrl} alt={fileUrl} className="h-auto max-h-full w-auto max-w-full p-0" />
                                ) : file_extension === 'pdf' ? (
                                    // PDF preview
                                    <iframe
                                        src={`/file_media/${row.getValue('media_location')}`}
                                        className="h-full w-full rounded pt-10"
                                        title="PDF Preview"
                                    />
                                ) : (
                                    // Fallback for other file types
                                    <div>
                                        {row.getValue('media_location') !== null ? (
                                            <>
                                                <h1>File unsupported</h1>

                                                <div className="flex items-center gap-2">
                                                    <FileUpIcon className="" />
                                                    <p className="text-sm">{row.getValue('media_location')}</p>
                                                </div>
                                            </>
                                        ) : (
                                            'No file found'
                                        )}
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                );
            },
        },
        {
            accessorKey: 'created_at',
            header: 'Posted On',
            cell: ({ row }) => <span>{format(new Date(row.getValue('created_at')), 'MMM d, yyyy - h:mm a')}</span>,
        },
        {
            accessorKey: 'id',
            header: 'Action',
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="hover:bg-muted-foreground/30 rounded-full">
                                <a href={route('discussion-board.show', row.getValue('id'))} target="_blank">
                                    <Eye className="p-[5px]" />
                                </a>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>View</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {is_super_admin && (
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
                                            <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
                                            <DialogDescription>
                                                All of the data that is associated with this post will be deleted. This action cannot be undone.
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
                    )}
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
        user_name: 'Name',
        title: 'Title',
        media_location: 'File/Image',
        id: 'Action',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Agenda" />
            <div className="w-full p-4">
                <div>
                    <Button asChild>
                        <Link href={route('admin.discussion-board.create')}>
                            Create Post <Plus />
                        </Link>
                    </Button>
                </div>
                {post.length === 0 && (
                    <div className="text-muted-foreground flex h-100 items-center justify-center text-lg font-medium">No posts found.</div>
                )}
                {post.length > 0 && (
                    <>
                        <div className="flex items-center py-4">
                            <Input
                                placeholder="Search..."
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
