import { backendFetch } from "./helpers"
export const login = function (username, password){
    backendFetch("/login", {
        method: "POST",
        body: {
            username,
            password,
        }
    }).then(x=>console.log(x));
}
export const signup = function (username, email, password){
    backendFetch("/signup", {
        method: "POST",
        body: {
            username, email, password
        }
    })
}