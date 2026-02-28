import { backendbasename, error, info } from "./params";

export const backendURL = "http://localhost:8765" + backendbasename;

const client = new (class BackendClient {
    #csrfToken = null;
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    async refreshCsrfToken() {
        try {
            const res = await fetch(`${this.baseUrl}csrf`);
            const data = await res.json();
            if (data && data.csrfToken) this.#csrfToken = data.csrfToken;
        } catch (e) {
            console.error(e);
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
            if (method !== "GET" && body !== undefined)
                options.body = JSON.stringify({
                    ...body,
                    ...(this.#csrfToken && { csrfToken: this.#csrfToken }),
                });
            return fetch(`${this.baseUrl}${url}`, options);
        };
        let res = await makeRequest(),
            data;
        try {
            data = await res.json();
        } catch {
            return res;
        }
        if (
            data?.status === error &&
            (data?.message === "Invalid CSRF Token" ||
                data?.message === "CSRF Token Missing")
        ) {
            console.log("refetching ");
            await this.refreshCsrfToken();
            res = await makeRequest();
            try {
                await this.refreshCsrfToken();
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
            status: info,
            message: "Password must be at least 8 characters",
        };
    if (!/[A-Z]/.test(pwd))
        return {
            status: info,
            message: "Password must contain at least one uppercase letter",
        };
    if (!/[a-z]/.test(pwd))
        return {
            status: info,
            message: "Password must contain at least one lowercase letter",
        };
    if (!/[0-9]/.test(pwd))
        return {
            status: info,
            message: "Password must contain at least one number",
        };
    if (!/[^A-Za-z0-9]/.test(pwd))
        return {
            status: info,
            message: "Password must contain at least one special character",
        };
    return { status: info, message: null };
};
