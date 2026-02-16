import { backendFetch } from "./helpers"
export const login = function (username, password){
    return backendFetch("/login", {
        method: "POST",
        body: {
            username,
            password,
        }
    })
}
export const signup = function (username, email, password){
    return backendFetch("/signup", {
        method: "POST",
        body: {
            username, email, password
        }
    })
}