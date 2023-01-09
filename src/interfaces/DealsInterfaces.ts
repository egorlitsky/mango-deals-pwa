export interface IDeal {
    id: string;
    date: Date;
    value: number;
}

export interface IDealFromServer {
    id: string;
    date: string;
    value: number;
}
