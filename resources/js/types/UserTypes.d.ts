import { ReactNode } from "react";

export interface Props {
    users?: Array<Users>;
    children: ReactNode;
}

export interface Users {
    id: number;
    name: string;
}