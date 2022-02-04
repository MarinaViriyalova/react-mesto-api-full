class Api {
    constructor(config) {
        this._baseUrl = config.baseUrl;
        this._headers = config.headers
    }

    getInitialCards() {
        return fetch(`${this._baseUrl}/cards`, {
                method: 'GET',
                headers: this._headers,
                credentials: 'include',
            })
            .then(res => this._handleResponse(res))
    }

    _handleResponse(res) {
        if (res.ok) { return res.json() }
        return Promise.reject(`Ошибка: ${res.status}`);
    }

    getUserInfo() {
        return fetch(`${this._baseUrl}/users/me`, {
                method: 'GET',
                headers: this._headers
            })
            .then(res => this._handleResponse(res))
    }

    editUserInfo(data) {
        return fetch(`${this._baseUrl}/users/me`, {
                method: 'PATCH',
                headers: this._headers,
                body: JSON.stringify({
                    name: data.name,
                    about: data.about
                }),
                credentials: 'include',
            })
            .then(res => this._handleResponse(res))
    }

    editUserAvatar(data) {
        return fetch(`${this._baseUrl}/users/me/avatar`, {
                method: 'PATCH',
                headers: this._headers,
                body: JSON.stringify({
                    avatar: data.avatar,
                }),
                credentials: 'include',
            })
            .then(res => this._handleResponse(res))
    }

    postCard(data) {
        return fetch(`${this._baseUrl}/cards`, {
                method: 'POST',
                headers: this._headers,
                body: JSON.stringify({
                    name: data.name,
                    link: data.link
                }),
                credentials: 'include',
            })
            .then(res => this._handleResponse(res))
    }

    deleteCard(cardId) {
        return fetch(`${this._baseUrl}/cards/${cardId}`, {
                method: 'DELETE',
                headers: this._headers,
                credentials: 'include',
            })
            .then(res => this._handleResponse(res))
    }

    _makeLike(cardId) {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
                method: 'PUT',
                headers: this._headers,
                credentials: 'include',
            })
            .then(res => this._handleResponse(res))
    }

    _makeUnlike(cardId) {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
                method: 'DELETE',
                headers: this._headers,
                credentials: 'include',
            })
            .then(res => this._handleResponse(res))
    }

    changeLikeCardStatus(cardId, isLiked) {
        if (isLiked) {
            return this._makeUnlike(cardId)
        } else {
            return this._makeLike(cardId)
        }
    }

}

const configApi = {
    baseUrl: 'https://api.viriyalova-mesto.nomoredomains.work',
    headers: {
        'Content-Type': 'application/json'
    }
}

export const api = new Api(configApi);