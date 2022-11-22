export type WallType = {
    id: number;
    title: string;
    body: string;
    datecreated: string;
}

export type WallDataType = {
    title: string;
    body: string;
}

export type DocumentType = {
    id: number;
    title: string;
    fileurl: string;
}

export type DocumentDataType = {
    title: string;
    file?: File;
}

export type ReservationsType = {
    id: number;
    id_area: number;
    id_unit: number;
    name_area: string;
    name_unit: string;
    reservation_date: string;
    reservation_date_formatted: string;
}

export type ReservationDataType = {
    id_area: number;
    id_unit: number;
    reservation_date: string;
}

export type UnitType = {
    id: number;
    id_owner: number;
    name: string;
    name_owner: string;
}

export type AreaType = {
    allowed: number;
    cover: string;
    days: string;
    end_time: string;
    id: number;
    start_time: string;
    title: string;
}

export type WarningType = {
    id: number;
    id_unit: number;
    title: string;
    status: string;
    datecreated: string;
    photos: string[];
    name_unit: string;
    datecreated_formatted: string;
}

export type FoundAndLostType = {
    id: number;
    status: string;
    photo: string;
    datecreted: string;
    datecreated_formatted: string;
    where: string;
}

export type UserType = {
    id: number;
    name: string;
    admin: number;
    email: string;
    cpf: string;
}

export type UserDataType = {
    name: string;
    email: string;
    cpf: string;
    password?: string;
}