import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem } from '@/types';
import axios from 'axios';
import {
    CloudUpload,
    FileUpIcon,
} from 'lucide-react';
import {
    ChangeEvent,
    DragEvent,
    FormEvent,
    useRef,
    useState,
} from 'react';

const Index = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [merging, setMerging] = useState<boolean>(false);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files) {
            const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
                file.type === 'application/pdf'
            );
            setFiles((prev) => [...prev, ...droppedFiles]);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!files.length) {
            alert('Please select at least one PDF file.');
            return;
        }

        const formData = new FormData();
        files.forEach((file) => {
            formData.append('documents[]', file);
        });

        try {
            setMerging(true);

            const response = await axios.post(route('pdf.merge'), formData, {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'merged.pdf';
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (error) {
            alert('Error merging PDF. Please make sure all files are valid PDFs.');
            console.error(error);
        } finally {
            setMerging(false);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'PDF Merger',
            href: '/admin/pdf-merger',
        },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-md p-4">
                <h1 className="mb-4 text-xl font-semibold">Merge PDFs</h1>
                <form onSubmit={handleSubmit}>
                    <div
                        className={`outline-primary/50 mt-3 grid w-full place-content-center items-center rounded p-5 duration-300 outline-dashed ${
                            dragActive ? 'bg-muted-foreground/10' : ''
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleClick}
                    >
                        <FileUpIcon className="mb-2" />
                        <Label htmlFor="documents" className="text-sm">
                            Drag and Drop or Click to Upload PDFs
                        </Label>

                        <input
                            ref={fileInputRef}
                            name="documents"
                            type="file"
                            className="hidden"
                            accept="application/pdf"
                            multiple
                            onChange={handleChange}
                        />
                        <p className="text-muted-foreground text-sm">
                            Files Supported: PDF only
                        </p>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button type="button" className="mt-3">
                                        <CloudUpload />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Click to upload files</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    {files.length > 0 && (
                        <div className="mt-4 flex flex-col space-y-2">
                            <h2 className="text-sm font-medium">Files to be merged:</h2>
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 rounded border p-2"
                                >
                                    <Avatar>
                                        <AvatarImage src="" alt="PDF" />
                                        <AvatarFallback>
                                            <CloudUpload />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col text-sm">
                                        <span className="block truncate font-medium">
                                            {file.name}
                                        </span>
                                        <span className="text-muted-foreground text-xs">
                                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        disabled={merging}
                    >
                        {merging ? 'Merging...' : 'Merge PDFs'}
                    </button>
                </form>
            </div>
        </AppSidebarLayout>
    );
};

export default Index;
