import { useForm, usePage } from '@inertiajs/react';
import { CircleCheck, LoaderCircle, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';

interface Props {
    user_id: number;
}

const FeedbackCardDialog = ({ user_id }: Props) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: user_id,
        rating: 0,
        comment: '',
    });

    const popupThankYou = (usePage() as any).props.flash.popupThankyou;

    console.log(popupThankYou);

    const [openDialog, setOpenDialog] = useState(false);
    const [openDialog2, setOpenDialog2] = useState(false);

    useEffect(() => {
        if (user_id !== null) {
            setOpenDialog(true);
        }
    }, [user_id]);

    useEffect(() => {
        if (popupThankYou !== null) {
            setOpenDialog2(true);
        }
    }, [popupThankYou]);

    const [hover, setHover] = useState(0);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('feedback.store', user_id), {
            onSuccess: () => {
                reset();
                setOpenDialog(false);
            },
        });
    };

    return (
        <>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="mx-auto">
                        <DialogTitle>Your Feedback Matters! {data.rating}</DialogTitle>
                        <DialogDescription>How satisfied are you with eCollab?</DialogDescription>
                    </DialogHeader>
                    <form id="submitFeedback" onSubmit={handleSubmit}>
                        <div className="flex items-center justify-around">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-7.5 w-7.5 cursor-pointer transition-colors ${
                                        (hover || data.rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-muted'
                                    }`}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    onClick={() => setData('rating', star)}
                                />
                            ))}
                        </div>

                        <div className="mt-4">
                            <Textarea
                                className="min-h-[150px]"
                                placeholder="Leave a message if you want!"
                                value={data.comment}
                                onChange={(e) => setData('comment', e.target.value)}
                            />
                        </div>
                    </form>
                    <DialogFooter>
                        <Button form="submitFeedback" type="submit" disabled={processing}>
                            {processing ? (
                                <div className="flex gap-2">
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    <span>Submitting...</span>
                                </div>
                            ) : (
                                'Submit'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={openDialog2} onOpenChange={setOpenDialog2}>
                <DialogContent className="sm:max-w-[350px]">
                    <DialogHeader className="mx-auto space-y-4">
                        <div className="grid place-items-center">
                            <CircleCheck size={50} />
                        </div>
                        <DialogTitle>Thank you for your feedback!</DialogTitle>
                        <Button variant={'outline'} size={'sm'} type="button" onClick={() => setOpenDialog2(false)}>
                            Close
                        </Button>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default FeedbackCardDialog;
