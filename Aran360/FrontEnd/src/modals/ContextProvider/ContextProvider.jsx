import { createContext, useState, useContext } from "react";

const GlobalContext = createContext();

export default function ContextProvider({ children }) {
    const [uname, setUname] = useState(undefined);
    const [email, setEmail] = useState(undefined);
    const [darkTheme, setDarkTheme] = useState(true);
    const [csrfToken, setCSRFToken] = useState(undefined);
    const value = {
        uname,
        setUname,
        email,
        setEmail,
        darkTheme,
        setDarkTheme,
        csrfToken,
        setCSRFToken,
    };
    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
}

export const useGlobalContext = () => useContext(GlobalContext);
