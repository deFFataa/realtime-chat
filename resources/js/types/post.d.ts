import { ReactNode } from "react";

export interface Props {
    post: Post;
    comments: Array<Comments>;
    comments_count: any;
    posts: Array<Post>;
    upcoming_meetings: Array<Meetings>;
    total_posts: number;
    total_likes: number;
}

export interface Post {
    user: {
        id: number;
        name: string;
    };
    comments?: Array<Comments>
    is_liked?: boolean
    post_likes?: Array<Likes>
    id: number;
    title: string;
    body: string;
    media_location?: string;
    url?: string;
    comments_count?: number;
    likes_count?: number;
    created_at: string;
}

export interface Meetings {
    id: number;
    title: string;
    description: string;
    date_of_meeting: string;
    start_time: string;
    end_time: string;
}

export interface Comments{
    id: number;
    likes_count?: number;
    comment_likes_count?: number;
    is_liked?: boolean;
    comments_count?: number;
    user?: {
        id: number;
        name: string;
    };
    comment: string ;
    url?: string;
    media_location?: string;
    children?: Array<T>;
    created_at: string;

}

export interface Likes {
    id: number;
    user_id: number;
    post_id: number; 
}