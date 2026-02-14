export const backendURL = "http://localhost:8765";

export const backendFetch = async function(endpoint, {
    method = "GET",
    body = undefined,
    headers = undefined,
    csrfToken = undefined
}) {
    if (method !== "GET" && !csrfToken) {
        console.warn("Cannot do sensitive operation without CSRF Token.");
    }

    const options = {
        method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            ...(headers || {}),
        }
    };

    if (method !== "GET" && csrfToken) {
        options.headers["X-CSRF-Token"] = csrfToken;
    }

    if (endpoint[0] === "/") {
        endpoint = endpoint.slice(1);
    }

    if (body !== undefined && method !== "GET") {
        const bodyWithCSRF = { ...body };
        if (csrfToken) bodyWithCSRF.csrfToken = csrfToken;
        options.body = JSON.stringify(bodyWithCSRF);
    }

    const res = await fetch(`${backendURL}/${endpoint}`, options);
    
    try {
        return await res.json();
    } catch (e) {
        console.error("Response is not JSON", e);
        return res;
    }
};
