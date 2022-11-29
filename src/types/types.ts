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

export type ResultReservationType = {
    error: string;
    list: ReservationsType[];
}

export type UnitType = {
    id: number;
    id_owner?: number;
    name: string;
    name_owner?: string;
}

export type UnitDataType = {
    name: string;
    id_owner: number;
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

export type AreaDataType = {
    allowed: number;
    title: string;
    days: string;
    start_time: string;
    end_time: string;
    cover?: File;
}

export type ResultAreaType = {
    error: string;
    list: AreaType[];
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

export type ResultFoundAndLostType = {
    error: string;
    list: FoundAndLostType[];
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