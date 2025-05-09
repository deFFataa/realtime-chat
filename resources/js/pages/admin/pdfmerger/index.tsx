import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { CloudUpload, Download, FileUpIcon, LoaderCircle } from 'lucide-react';
import { ChangeEvent, DragEvent, FormEvent, useRef, useState } from 'react';
import { toast, Toaster } from 'sonner';

const Index = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [title, setTitle] = useState('');
    const [titleError, setTitleError] = useState('');

    const [merging, setMerging] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        setTitleError(''); // clear error when typing
        setFiles([]);
        setMergedBlobUrl(null);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
            setMergedBlob(null); // reset the previous merged result
        }
    };

    const handleClick = () => {
        if (!title.trim()) {
            setTitleError('Title is required.');
            toast.warning('Please enter a title before uploading files.');
            return;
        }

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

        if (!title.trim()) {
            setTitleError('Title is required.');
            toast.error('Please enter a title before uploading files.');
            return;
        }

        setDragActive(false);

        if (e.dataTransfer.files) {
            const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => file.type === 'application/pdf');
            setFiles((prev) => [...prev, ...droppedFiles]);
            setMergedBlob(null); // reset the merged result if dropping new files
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!files.length || !title.trim()) {
            toast.error('Please enter a title and select at least one PDF.');
            return;
        }

        if (!title.trim()) {
            setTitleError('Title is required.');
            toast.error('Please enter a title.');
            return;
        }

        const formData = new FormData();
        files.forEach((file) => {
            formData.append('documents[]', file);
        });
        formData.append('title', title);

        try {
            setMerging(true);

            const response = await axios.post(route('pdf.merge'), formData, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            setMergedBlob(blob); // Store for download
            toast.success('PDF merged successfully!');
        } catch (error) {
            toast.error('Failed to merge PDF. Please check your files.');
        } finally {
            setMerging(false);
        }

        setFiles([]);
        // setTitle('');
    };

    const handleDownload = () => {
        if (!mergedBlob) return;

        const link = document.createElement('a');
        link.href = URL.createObjectURL(mergedBlob);
        link.download = `${title.trim()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'PDF Merger',
            href: '/admin/pdf-merger',
        },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="PDF Merger" />
            <Toaster />
            <div className="p-4">
                <h1 className="font-semibold">Merge PDFs</h1>
                <p className="text-muted-foreground text-sm">Enter a title, then upload and merge your PDF files.</p>
                <form onSubmit={handleSubmit}>
                    {/* Title Input */}
                    <div className="mt-4 grid w-full max-w-sm items-start gap-1.5">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Enter the title of the merged PDF"
                            className={titleError ? 'border-red-500' : ''}
                            required
                        />
                        {titleError && <p className="text-xs text-red-500">{titleError}</p>}
                    </div>

                    {/* Upload Area */}
                    <div
                        className={`outline-primary/50 mt-3 grid w-full place-content-center items-center rounded p-5 duration-300 outline-dashed ${
                            dragActive ? 'bg-muted-foreground/10' : ''
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleClick}
                    >
                        <div className="flex justify-center">
                            <FileUpIcon className="mb-2" />
                        </div>
                        <div className="flex justify-center">
                            <Label htmlFor="documents" className="text-sm">
                                Drag and Drop or Click to Upload PDFs
                            </Label>
                        </div>

                        <input
                            ref={fileInputRef}
                            name="documents"
                            type="file"
                            className="hidden"
                            accept="application/pdf"
                            multiple
                            disabled={!title}
                            onChange={handleChange}
                        />
                        <p className="text-muted-foreground mx-auto text-sm">Files Supported: PDF only</p>
                        <div className="flex justify-center">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="mt-3" disabled={!title}>
                                            <CloudUpload />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Click to upload files</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    {/* File Preview */}
                    {files.length > 0 && (
                        <>
                            <div className="mt-4 flex flex-col space-y-2">
                                <h2 className="text-sm font-medium">Files to be merged:</h2>
                                {files.map((file, index) => (
                                    <div key={index} className="flex items-center gap-2 rounded border p-2">
                                        <Avatar>
                                            <AvatarImage src="" alt="PDF" />
                                            <AvatarFallback>
                                                <CloudUpload />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col text-sm">
                                            <span className="block truncate font-medium">{file.name}</span>
                                            <span className="text-muted-foreground text-xs">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex justify-end">
                                <Button type="submit" disabled={merging}>
                                    {merging ? (
                                        <div className="flex items-center justify-center">
                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                            <span>Merging...</span>
                                        </div>
                                    ) : (
                                        'Merge'
                                    )}
                                </Button>
                            </div>
                        </>
                    )}

                    {mergedBlob && (
                        <div className="mt-6 border-t pt-4 text-center">
                            <p className="mb-2 text-sm font-medium text-green-700">Merge complete!</p>
                            <Button variant="outline" onClick={handleDownload}>
                                <Download className="mr-2 h-4 w-4" />
                                Download "{title.trim() || 'merged'}.pdf"
                            </Button>
                        </div>
                    )}

                    {/* Download Button
                    {mergedBlobUrl && (
                        <div className="mt-6 border-t pt-4 text-center">
                            <p className="mb-2 text-sm font-medium text-green-700">Merge complete!</p>
                            <Button variant="outline" onClick={() => window.open(mergedBlobUrl, '_blank')}>
                                <Download className="mr-2 h-4 w-4" />
                                Download "{title.trim() || 'merged'}.pdf"
                            </Button>
                        </div>
                    )} */}
                </form>
            </div>
        </AppSidebarLayout>
    );
};

export default Index;
