import { 
    DocumentDataType, 
    WallDataType, 
    ReservationDataType, 
    UserDataType,
    AreaDataType 
} from "src/types/types";

const BASE = 'https://api.b7web.com.br/devcond/api/admin';

const request = async (method: string, endpoint: string, params: Object, token?: string) => {
    method = method.toUpperCase();
    let fullUrl = `${BASE}${endpoint}`;
    let body = null;

    switch(method) {
        case 'GET':
            let queryString = new URLSearchParams(params.toString()).toString();
            fullUrl += `?${queryString}`;            
        break;
        case 'POST':
        case 'PUT':
        case 'DELETE':
            body = JSON.stringify(params);
        break;
    }
    
    let req = await fetch(fullUrl, {
        method,
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : `${token ? `Bearer ${token}` : ''}`
        },
        body
    });

    return req.json();
}
const requestFormData = async (method: string, endpoint: string, formData: FormData, token) => {
    method.toUpperCase();
    const req = await fetch(`${BASE}${endpoint}`, {
        method,
        headers: { 'Authorization' : `${token ? `Bearer ${token}` : ''}` },
        body: formData
    });

    return req.json();
}

export const useAPI = {
    getToken: () => {
        return window.localStorage.getItem('token');
    },
    validateToken: async () => {
        const token = window.localStorage.getItem('token');        
        const json: Promise<any> = await request('post', '/auth/validate', {}, token);
        return json;
        
    },
    login: async (email: string, password: string) => {    
        const json: Promise<any> = await request('post', '/auth/login', { email, password });
        return json;
    },
    logout: async () => {
        const token = window.localStorage.getItem('token');        
        const json: Promise<any> = await request('post', '/auth/logout', {}, token);
        window.localStorage.removeItem('token');
        return json;        
    },
    getWall: async () => {
        const token = window.localStorage.getItem('token');        
        const json: Promise<any> = await request('get', '/walls', {}, token);
        return json;
    },
    updateWall: async (id: string, data: WallDataType) => {
        const token = window.localStorage.getItem('token');           
        const json: Promise<any> = await request('put', `/wall/${id}`, data, token);
        return json;
    },
    addWall: async (data: WallDataType) => {
        const token = window.localStorage.getItem('token');           
        const json: Promise<any> = await request('post', '/walls', data, token);
        return json;
    },
    removeWall: async (id: string) => {
        const token = window.localStorage.getItem('token');           
        const json: Promise<any> = await request('delete', `/wall/${id}`, {}, token);
        return json;
    },
    getDocuments: async () => {
        const token = window.localStorage.getItem('token');        
        const json: Promise<any> = await request('get', '/docs', {}, token);
        return json;
    },
    addDocument: async (data: DocumentDataType) => {
        const token = window.localStorage.getItem('token'); 
        const formData = new FormData();
        formData.append('title', data.title);
        if(data.file) {
            formData.append('file', data.file);
        }
        const json: Promise<any> = await requestFormData('post', '/docs', formData, token);
        return json;
    },
    updateDocument: async (id: string, data: DocumentDataType) => {
        const token = window.localStorage.getItem('token'); 
        const formData = new FormData();
        formData.append('title', data.title);
        if(data.file) {
            formData.append('file', data.file);
        }
        const json: Promise<any> = await requestFormData('post', `/doc/${id}`, formData, token);
        return json;
    },
    removeDocument: async (id: string) => {
        const token = window.localStorage.getItem('token');        
        const json: Promise<any> = await request('delete', `/doc/${id}`, {}, token);
        return json;
    },
    getReservations: async () => {
        const token = window.localStorage.getItem('token');        
        const json: Promise<any> = await request('get', '/reservations', {}, token);
        return json;
    },
    getUnits: async () => {
        const token = window.localStorage.getItem('token');        
        const json: Promise<any> = await request('get', '/units', {}, token);
        return json;
    },    
    addReservation: async (data: ReservationDataType) => {
        const token = window.localStorage.getItem('token'); 
        const json: Promise<any> = await request('post', '/reservations', data, token);
        return json;    
    },
    updateReservation: async (id: string, data: ReservationDataType) => {        
        const token = window.localStorage.getItem('token');     
        const json: Promise<any> = await request('put', `/reservation/${id}`, data, token);
        return json;
    },
    removeReservation: async (id: string) => {
        const token = window.localStorage.getItem('token');
        const json: Promise<any> = await request('delete', `/reservation/${id}`, {}, token);
        return json;
    },
    getWarnings: async () => {
        const token = window.localStorage.getItem('token');        
        const json: Promise<any> = await request('get', '/warnings', {}, token);
        return json;
    },
    updateWarning: async (id: string) => {
        const token = window.localStorage.getItem('token');        
        const json: Promise<any> = await request('put', `/warning/${id}`, {}, token);
        return json;
    },
    getFoundAndLost: async () => {
        const token = window.localStorage.getItem('token');        
        const json: Promise<any> = await request('get', '/foundandlost', {}, token);
        return json;
    },
    updateFoundAndLost: async (id: string) => {
        const token = window.localStorage.getItem('token');        
        const json: Promise<any> = await request('put', `/foundandlost/${id}`, {}, token);
        return json;
    },
    getUsers: async () => {
        const token = window.localStorage.getItem('token');        
        const json: Promise<any> = await request('get', '/users', {}, token);
        return json;
    },
    removeUser: async (id: string) => {
        const token = window.localStorage.getItem('token');        
        const json: Promise<any> = await request('delete', `/user/${id}`, {}, token);
        return json;
    },
    addUser: async (data: UserDataType) => {
        const token = window.localStorage.getItem('token');        
        const json: Promise<any> = await request('post', '/users', data, token);
        return json;
    },
    updateUser: async (id: string, data: UserDataType) => {
        const token = window.localStorage.getItem('token');        
        const json: Promise<any> = await request('put', `/user/${id}`, data, token);
        return json;
    },
    getAreas: async () => {
        const token = window.localStorage.getItem('token');        
        const json: Promise<any> = await request('get', '/areas', {}, token);
        return json;
    },
    removeArea: async (id: string) => {
        const token = window.localStorage.getItem('token');        
        const json: Promise<any> = await request('delete', `/area/${id}`, {}, token);
        return json;
    },
    addArea: async (data: AreaDataType) => {
        const token = window.localStorage.getItem('token'); 
        const formData = new FormData();
        for(let i in data) {
            formData.append(i, data[i]);
        }        
        const json: Promise<any> = await requestFormData('post', '/areas', formData, token);
        return json;
    },
    updateArea: async (id: string ,data: AreaDataType) => {
        const token = window.localStorage.getItem('token'); 
        const formData = new FormData();
        for(let i in data) {
            formData.append(i, data[i]);
        }
        const json: Promise<any> = await requestFormData('post', `/area/${id}`, formData, token);
        return json;
    },
    updateAreaAllowed: async (id: string) => {
        const token = window.localStorage.getItem('token');        
        const json: Promise<any> = await request('put', `/area/${id}/allowed`, {}, token);
        return json; 
    }
}