export interface Props {
    agendas: Array<Agendas>;
}

export interface Agendas {
    id: number;
    user_id: number | string;
    title: string;
    agenda_file_loc: string;
}