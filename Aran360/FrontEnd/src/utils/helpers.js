import { backendbasename, error, info } from "./params";

export const backendURL = "http://localhost:8765" + backendbasename;

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
                this.#expiry = Date.now() + (data.expiry || 3600) * 1000;
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

    async fetch(endpoint, { method = "GET", body = {}, headers } = {}) {
        const url = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

        const makeRequest = async () => {
            const options = {
                method,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    ...headers,
                },
            };

            if (this.#csrfToken)
                options.headers["X-CSRF-Token"] = this.#csrfToken;

            if (method !== "GET" && body !== undefined) {
                options.body = JSON.stringify({
                    ...body,
                    ...(this.#csrfToken && { csrfToken: this.#csrfToken }),
                });
            }

            return fetch(`${this.baseUrl}${url}`, options);
        };

        let res = await makeRequest();
        let data;

        try {
            data = await res.json();
        } catch {
            return res;
        }
        console.log("data: "+data);
        if (
            data?.status === error &&
            data?.message === "Invalid CSRF Token"
        ) {
            console.log("refetching "+ data);
            await this.refreshCsrfToken();
            res = await makeRequest();
            try {
                return await res.json();
            } catch {
                return res;
            }
        }

        return data;
    }
})(backendURL);

export const backendFetch = client.fetch.bind(client);
export const refreshCsrfToken = client.refreshCsrfToken.bind(client);

export const isValidPassword = function (pwd) {
    if (pwd.length < 8)
        return {
            valid: false,
            message: "Password must be at least 8 characters",
        };
    if (!/[A-Z]/.test(pwd))
        return {
            valid: false,
            message: "Password must contain at least one uppercase letter",
        };
    if (!/[a-z]/.test(pwd))
        return {
            valid: false,
            message: "Password must contain at least one lowercase letter",
        };
    if (!/[0-9]/.test(pwd))
        return {
            valid: false,
            message: "Password must contain at least one number",
        };
    if (!/[^A-Za-z0-9]/.test(pwd))
        return {
            valid: false,
            message: "Password must contain at least one special character",
        };
    return { valid: true, message: null };
};
