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
import { Dot, LoaderCircle } from 'lucide-react';
import { URL_MATCHER } from './url-matcher'; // You'll define this next

import InputError from '@/components/input-error';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ToolbarPlugin from '../plugins/ToolbarPlugin';
import { parseAllowedColor, parseAllowedFontSize } from '../styleConfig';

import { $generateHtmlFromNodes } from '@lexical/html';
import { AutoLinkNode, LinkNode } from '@lexical/link';

const placeholder = 'Tell something here...';

const removeStylesExportDOM = (editor: LexicalEditor, node: LexicalNode): DOMExportOutput => {
    const output = node.exportDOM(editor);
    if (output && isHTMLElement(output.element)) {
        const element = output.element as HTMLElement; // 👉 CAST here

        // Capture text-align first
        const textAlign = element.style.textAlign;

        // Clean all style/class/dir but retain text-align manually
        for (const el of [element, ...element.querySelectorAll('[style],[class],[dir="ltr"]')]) {
            const htmlEl = el as HTMLElement; // 👉 CAST here
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

    // Wrap all TextNode importers with a function that also imports
    // the custom styles implemented by the playground
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
const TextSection = () => {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: auth.user.id,
        title: '',
        body: '',
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
        post(route('discussion-board.store'), {
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
        links.forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    
        return div.innerHTML;
    };

    const modifiedBody = addTargetBlankToLinks(data.body);

    return (
        <div className="grid grid-cols-2">
            <form onSubmit={handleSubmit} className="grid w-full max-w-lg grid-cols-1 gap-2">
                {/* Title input remains the same */}
                <div className="mt-3 grid w-full max-w-lg items-center gap-1.5">
                    <Label htmlFor="title">
                        Title <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Input
                        type="text"
                        value={data.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('title', e.target.value)}
                        id="title"
                    />
                    <InputError message={errors.title} className="mt-2 text-sm" />
                </div>

                <div className="mt-3 grid w-full max-w-lg items-center gap-1.5">
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

            <section>
                <h1 className="mb-4 font-bold">Preview:</h1>
                <div className="flex items-center">
                    <Avatar className="mr-2">
                        <AvatarImage src="" alt="@shadcn" />
                        <AvatarFallback>{getInitials(auth.user.name)}</AvatarFallback>
                    </Avatar>
                    <span>{auth.user.name}</span>
                    <Dot className="m-0 p-0" />
                    <span>a while ago.</span>
                </div>

                <div className="mt-1">
                    <h1 className="font-medium">{data.title}</h1>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: modifiedBody }} />
                </div>
            </section>
        </div>
    );
};

export default TextSection;
