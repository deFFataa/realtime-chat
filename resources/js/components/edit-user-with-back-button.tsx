import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface Props {
    href: string;
}

const EditUserWithBackButton = ({ href }: Props) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant={'outline'} asChild>
                        <Link href={href}>
                            <ArrowLeft />
                        </Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Go Back</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default EditUserWithBackButton;
