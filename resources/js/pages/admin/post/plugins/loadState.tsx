import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

interface Props {
    textFromInput: string;
}

const LoadState = ({textFromInput} : Props) => {

    const text = textFromInput

    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        const newState = editor.parseEditorState(text)

        editor.setEditorState(newState)
    })


    return <></>;
};

export default LoadState;
