export const BASE_URL = 'https://api.viriyalova-mesto.nomoredomains.work';

function handleResponse(res) {
    if (res.ok) { return res.json() }
    return Promise.reject(`Ошибка: ${res.status}`);
}


export const register = (password, email) => {
    return fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password, email })
        })
        .then(res => handleResponse(res))
};


export const authorize = (password, email) => {
    return fetch(`${BASE_URL}/signin`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ password, email })
        })
        .then(res => handleResponse(res))
        .then((data) => {
            return data;
        })
};


export const logout = () => {
    return fetch(`${BASE_URL}/signout`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        .then(res => handleResponse(res))
};


export const getContent = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        .then(res => handleResponse(res))
}