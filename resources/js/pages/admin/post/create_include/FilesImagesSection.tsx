import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInitials } from '@/hooks/use-initials';
import { SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { AvatarImage } from '@radix-ui/react-avatar';
import {
    $getRoot,
    $isTextNode,
    DOMConversionMap,
    DOMExportOutput,
    DOMExportOutputMap,
    isHTMLElement,
    Klass,
    LexicalEditor,
    LexicalNode,
    ParagraphNode,
    TextNode,
} from 'lexical';
import { CloudUpload, FileUpIcon, LoaderCircle } from 'lucide-react';
import { URL_MATCHER } from './url-matcher';

import InputError from '@/components/input-error';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import ToolbarPlugin from '../plugins/ToolbarPlugin';
import { parseAllowedColor, parseAllowedFontSize } from '../styleConfig';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { $generateHtmlFromNodes } from '@lexical/html';
import { AutoLinkNode, LinkNode } from '@lexical/link';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

const placeholder = 'Tell something here...';

const removeStylesExportDOM = (editor: LexicalEditor, node: LexicalNode): DOMExportOutput => {
    const output = node.exportDOM(editor);
    if (output && isHTMLElement(output.element)) {
        const element = output.element as HTMLElement;

        const textAlign = element.style.textAlign;

        for (const el of [element, ...element.querySelectorAll('[style],[class],[dir="ltr"]')]) {
            const htmlEl = el as HTMLElement;
            const hasTextAlign = htmlEl.style.textAlign;

            el.removeAttribute('class');
            el.removeAttribute('style');
            if (el.getAttribute('dir') === 'ltr') {
                el.removeAttribute('dir');
            }

            if (hasTextAlign) {
                htmlEl.style.textAlign = hasTextAlign;
            }
        }

        if (textAlign) {
            element.style.textAlign = textAlign;
        }
    }
    return output;
};

const exportMap: DOMExportOutputMap = new Map<Klass<LexicalNode>, (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput>([
    [ParagraphNode, removeStylesExportDOM],
    [TextNode, removeStylesExportDOM],
]);

const getExtraStyles = (element: HTMLElement): string => {
    let extraStyles = '';
    const fontSize = parseAllowedFontSize(element.style.fontSize);
    const backgroundColor = parseAllowedColor(element.style.backgroundColor);
    const color = parseAllowedColor(element.style.color);
    if (fontSize !== '' && fontSize !== '15px') {
        extraStyles += `font-size: ${fontSize};`;
    }
    if (backgroundColor !== '' && backgroundColor !== 'rgb(255, 255, 255)') {
        extraStyles += `background-color: ${backgroundColor};`;
    }
    if (color !== '' && color !== 'rgb(0, 0, 0)') {
        extraStyles += `color: ${color};`;
    }
    return extraStyles;
};

const constructImportMap = (): DOMConversionMap => {
    const importMap: DOMConversionMap = {};

    for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
        importMap[tag] = (importNode) => {
            const importer = fn(importNode);
            if (!importer) {
                return null;
            }
            return {
                ...importer,
                conversion: (element) => {
                    const output = importer.conversion(element);
                    if (output === null || output.forChild === undefined || output.after !== undefined || output.node !== null) {
                        return output;
                    }
                    const extraStyles = getExtraStyles(element);
                    if (extraStyles) {
                        const { forChild } = output;
                        return {
                            ...output,
                            forChild: (child, parent) => {
                                const textNode = forChild(child, parent);
                                if ($isTextNode(textNode)) {
                                    textNode.setStyle(textNode.getStyle() + extraStyles);
                                }
                                return textNode;
                            },
                        };
                    }
                    return output;
                },
            };
        };
    }

    return importMap;
};

const editorConfig = {
    html: {
        export: exportMap,
        import: constructImportMap(),
    },
    namespace: 'React.js Demo',
    nodes: [ParagraphNode, TextNode, LinkNode, AutoLinkNode],
    onError(error: Error) {
        throw error;
    },
};
const FilesImagesSection = () => {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: auth.user.id,
        title: '',
        body: '',
        media_location: null as File | null,
    });

    const getInitials = useInitials();

    const [editor, setEditor] = useState<LexicalEditor | null>(null);

    useEffect(() => {
        if (!editor) return;

        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const html = $generateHtmlFromNodes(editor, null);
                setData('body', html);
            });
        });
    }, [editor, setData]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('discussion-board.store-with-media'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                if (editor) {
                    editor.update(() => {
                        const root = $getRoot();
                        root.clear();
                    });
                }
            },
            onFinish: () => {
                toast.success('Post created successfully!');
            },
            onError: () => {
                toast.error('Something went wrong. Please try again.');
            },
        });
    };

    const addTargetBlankToLinks = (htmlContent: string) => {
        const div = document.createElement('div');
        div.innerHTML = htmlContent;

        const links = div.querySelectorAll('a');
        links.forEach((link) => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });

        return div.innerHTML;
    };

    const modifiedBody = addTargetBlankToLinks(data.body);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const [files, setFiles] = useState<{ name: string; size: number; preview: string }[]>([]);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);

        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles) {
            const fileList = Array.from(droppedFiles).map((file) => ({
                name: file.name,
                size: file.size,
                preview: URL.createObjectURL(file),
            }));
            setFiles(fileList);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            const fileList = Array.from(selectedFiles).map((file) => ({
                name: file.name,
                size: file.size,
                preview: URL.createObjectURL(file),
            }));
            setFiles(fileList);
            if (e.target.files && e.target.files[0]) {
                setData('media_location', e.target.files[0]);
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        // <div className="grid grid-cols-2">

        <ResizablePanelGroup direction="horizontal" className="rounded-lg">
            <ResizablePanel defaultSize={50}>
                <form onSubmit={handleSubmit} className="grid w-full grid-cols-1 gap-2 ps-2 pe-4">
                    <div
                        className={`outline-primary/50 mt-3 grid w-full place-content-center items-center rounded p-5 duration-300 outline-dashed ${
                            dragActive ? 'bg-muted-foreground/10' : ''
                        }`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        <div className="flex w-full flex-col items-center justify-center">
                            <FileUpIcon className="mb-2" />
                            <Label htmlFor="picture" className="text-sm">
                                Drag and Drop or upload media
                            </Label>

                            <input ref={fileInputRef} name="media_location" id="picture" type="file" className="hidden" onChange={handleChange} />
                            <p className="text-muted-foreground text-sm">Files Supported: pdf, word, image (png, jpg, jpeg)</p>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="mt-3" onClick={handleClick}>
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
                    <InputError
                        message={errors.media_location && 'The file field must be a type: jpeg, jpg, png, doc, docx, pdf.'}
                        className="mt-2 text-sm"
                    />

                    {files.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage src="" alt="@shadcn" />
                                <AvatarFallback>
                                    <CloudUpload />
                                </AvatarFallback>
                            </Avatar>
                            <div className="leading-none">
                                {files.map((file, idx) => (
                                    <div key={idx} className="mt-1 text-sm font-medium">
                                        <span className="block truncate">{file.name}</span>
                                        <span className="text-muted-foreground text-xs">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-3 grid w-full items-center gap-1.5">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            type="text"
                            value={data.title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('title', e.target.value)}
                            id="title"
                        />
                        <InputError message={errors.title} className="mt-2 text-sm" />
                    </div>

                    <div className="mt-3 grid w-full items-center gap-1.5">
                        <Label htmlFor="body">Body</Label>

                        <LexicalComposer initialConfig={editorConfig}>
                            <div className="rounded-md border">
                                <ToolbarPlugin />

                                <div className="editor-inner">
                                    <RichTextPlugin
                                        contentEditable={
                                            <ContentEditable
                                                className="editor-input"
                                                aria-placeholder={placeholder}
                                                placeholder={<div className="editor-placeholder">{placeholder}</div>}
                                            />
                                        }
                                        ErrorBoundary={LexicalErrorBoundary}
                                    />
                                    <HistoryPlugin />
                                    <AutoFocusPlugin />
                                    <LinkPlugin />
                                    <AutoLinkPlugin matchers={[URL_MATCHER]} />
                                    <OnChangePlugin
                                        onChange={(editorState, editor) => {
                                            editorState.read(() => {
                                                const html = $generateHtmlFromNodes(editor, null);
                                                setData('body', html);
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                        </LexicalComposer>
                    </div>

                    <div className="flex justify-end">
                        <Button disabled={processing || data.body == '<p><br></p>'}>
                            {processing ? (
                                <div className="flex items-center gap-2">
                                    <LoaderCircle className="animate-spin" />
                                    Posting..
                                </div>
                            ) : (
                                'Post'
                            )}
                        </Button>
                    </div>
                </form>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
                <section className="ms-5">
                    <h1 className="mb-4 font-bold">Preview:</h1>
                    <div className="flex items-center">
                        <Avatar className="mr-2">
                            <AvatarImage src="" alt="@shadcn" />
                            <AvatarFallback>{getInitials(auth.user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <span className="text-sm font-medium">{auth.user.name}</span>
                            <p className="text-muted-foreground text-xs">less than 5 seconds</p>
                        </div>
                    </div>
                    <div className="mt-1">
                        <h1 className="font-bold">{data.title}</h1>
                        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: modifiedBody }} />
                        {files.map((file, index) => (
                            <div key={index} className="mt-2 flex items-center gap-2 rounded border p-2">
                                {file.name.match(/\.(jpeg|jpg|png)$/i) ? (
                                    <img src={file.preview} alt={file.name} className="mt-2 h-80 w-full rounded object-cover" />
                                ) : file.name.match(/\.(pdf|doc|docx)$/i) ? (
                                    <div className="flex items-center gap-2">
                                        <FileUpIcon className="text-muted-foreground" />
                                        <p className="text-muted-foreground text-sm">{file.name}</p>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <FileUpIcon className="text-muted-foreground" />
                                        <p className="text-muted-foreground text-sm">Unsupported file type: {file.name}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </ResizablePanel>
        </ResizablePanelGroup>

        // </div>
    );
};

export default FilesImagesSection;
