export type WallListType = {
    id: number;
    title: string;
    body: string;
    datecreated: string;
}

export type WallDataType = {
    title: string;
    body: string;
}

export type DocumentDataType = {
    title: string;
    file?: File;
}

export type ReservationsListType = {
    id: number;
    id_area: number;
    id_unit: number;
    name_area: string;
    name_unit: string;
    reservation_date: string;
    reservation_date_formatted: string;
}