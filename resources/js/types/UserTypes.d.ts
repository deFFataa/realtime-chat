import { ReactNode } from "react";

export interface Props {
    users?: Array<Users>;
    children: ReactNode;
    groups?: Array<any>;
}

export interface Users {
    id: number;
    name: string;
}

export interface Groups {
    conversation: [
        id: number,
        conversation_name: string,
    ],
    conversation_id: number,
}