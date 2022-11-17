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
    updateWall: async (id: string, data: Object) => {
        const token = window.localStorage.getItem('token');           
        const json: Promise<any> = await request('put', `/wall/${id}`, data, token);
        return json;
    },
    addWall: async (data: Object) => {
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
    addDocument: async (data: Object) => {
        
    },
    updateDocument: async (id: string, data: Object) => {

    }
}