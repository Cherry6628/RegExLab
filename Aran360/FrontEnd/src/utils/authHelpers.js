import { backendFetch } from "./helpers";
export const login = async function (username, password) {
    return await backendFetch("/login", {
        method: "POST",
        body: {
            username,
            password,
        },
    });
};
export const signup = async function (username, email, password) {
    return await backendFetch("/signup", {
        method: "POST",
        body: {
            username,
            email,
            password,
        },
    });
};
