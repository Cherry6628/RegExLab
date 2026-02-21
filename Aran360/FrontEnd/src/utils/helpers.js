import { backendbasename, info } from "./params";

export const backendURL = "http://localhost:8765"+backendbasename;

const client = new (class BackendClient {
    #csrfToken = null;
    #expiry = 0;

    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async refreshCsrfToken() {
        try {
            const res = await fetch(`${this.baseUrl}csrf`);
            const data = await res.json();
            if (data && data.csrfToken) {
                this.#csrfToken = data.csrfToken;
                this.#expiry = Date.now() + ((data.expiry || 3600) * 1000);
                console.log(this.#csrfToken+" csrftoken fetched")
            }
        } catch (e) {
            console.error(e);
        }
    }

    async #ensureValidToken() {
        if (!this.#csrfToken || Date.now() >= this.#expiry) {
            await this.refreshCsrfToken();
        }
    }

    async fetch(endpoint, { method = "GET", body, headers } = {}) {
        await this.#ensureValidToken();
        
        const options = {
            method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                ...headers,
            }
        };

        if (this.#csrfToken) options.headers["X-CSRF-Token"] = this.#csrfToken;

        const url = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

        if (method !== "GET" && body !== undefined) {
            options.body = JSON.stringify({ ...body, ...(this.#csrfToken && { csrfToken: this.#csrfToken }) });
        }

        const res = await fetch(`${this.baseUrl}${url}`, options);

        try {
            const data = await res.json();
            if (data?.csrfToken) {
                this.#csrfToken = data.csrfToken;
                if (data.expiry) this.#expiry = Date.now() + (data.expiry * 1000);
            }
            return data;
        } catch (e) {
            return res;
        }
    }
})(backendURL);

export const backendFetch = client.fetch.bind(client);
export const refreshCsrfToken = client.refreshCsrfToken.bind(client);


export const isValidPassword = function (pwd){
    return true;
    // TODO
}