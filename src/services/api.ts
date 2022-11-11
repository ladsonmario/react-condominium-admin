const BASE = 'https://api.b7web.com.br/devcond/api/admin';

const request = async (method: string, endpoint: string, params: Object, token?: string) => {
    method = method.toUpperCase();
    let fullUrl = `${BASE}${endpoint}`;
    let body: string = '';

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
        let token = window.localStorage.getItem('token');
        if(token) {
            const json: Promise<any> = await request('post', '/auth/validate', {}, token);
            return json;
        }
    },
    login: async (email: string, password: string) => {    
        const json: Promise<any> = await request('post', '/auth/login', { email, password });
        return json;
    }
}