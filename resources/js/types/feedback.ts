export interface Props {
    feedbacks?: Array<Feedback>;
    rating_today: number;
    overall_rating: number;
}

export interface Feedback {
    id: number;
    user: {
        name: string;
    };
    rating: number;
    comment: string;
    created_at: string;
}