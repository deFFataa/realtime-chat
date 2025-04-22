export interface Props {
    minutes_of_meeting: Array<AgMinutesOfMeetingendas>;
}

export interface MinutesOfMeeting {
    id: number;
    user_id: number | string;
    title: string;
    agenda_file_loc: string;
    agenda: {
        id: number;
        title: string;
    }
}