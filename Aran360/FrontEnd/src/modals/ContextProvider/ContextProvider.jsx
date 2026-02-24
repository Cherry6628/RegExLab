import { createContext, useState, useContext, useEffect } from "react";
import { frontendbasename } from "../../utils/params";
import ReflectedXSSMaterial from "../../component/LearningMaterials/XSS/ReflectedXSSMaterial";
import XSSMaterial from "../../component/LearningMaterials/XSS/XSSMaterial";
import StoredXSSMaterial from "../../component/LearningMaterials/XSS/StoredXSSMaterial";
import DOMBasedXSSMaterial from "../../component/LearningMaterials/XSS/DOMBasedXSSMaterial";
import XSSContexts from "../../component/LearningMaterials/XSS/XSSContexts";
import ExploitingXSSMaterial from "../../component/LearningMaterials/XSS/ExploitingXSSMaterial";
import DanglingMarkupInjection from "../../component/LearningMaterials/XSS/DanglingMarkupInjection";
import ContentSecurityPolicy from "../../component/LearningMaterials/XSS/ContentSecurityPolicy";
import XSSPrevention from "../../component/LearningMaterials/XSS/XSSPrevention";
import SQLMain from "../../component/LearningMaterials/SQL/SQLMain";
import BlindSql from "../../component/LearningMaterials/SQL/BlindSql";
import UnionAttack from "../../component/LearningMaterials/SQL/UnionAttack";
import ExaminingDatabase from "../../component/LearningMaterials/SQL/ExaminingDatabase";
import PathTraversalMaterial from "../../component/LearningMaterials/Path/PathTraversalMaterial";
import AccessControl from "../../component/LearningMaterials/AccessControl/AccessControl";
import IDOR from "../../component/LearningMaterials/AccessControl/IDOR";
import Authentication from "../../component/LearningMaterials/Authentication/Authentication";
import passwordAuth from "../../component/LearningMaterials/Authentication/PasswordAuth";
import MultiFactor from "../../component/LearningMaterials/Authentication/MultiFactor";
import OtherAuth from "../../component/LearningMaterials/Authentication/OtherAuth";
import SecureAuthentication from "../../component/LearningMaterials/Authentication/SecureAuthentication";
import { backendFetch } from "../../utils/helpers";

const GlobalContext = createContext();

const isValidCache = (data) => {
    return (
        data &&
        typeof data.uname === "string" &&
        data.uname.trim() !== "" &&
        typeof data.email === "string" &&
        data.email.trim() !== "" &&
        data.labsStat &&
        typeof data.labsStat.labsCompleted === "number"
    );
};

export default function ContextProvider({ children }) {
    const [uname, setUname] = useState(undefined);
    const [email, setEmail] = useState(undefined);
    const [darkTheme, setDarkTheme] = useState(true);
    const [labs, setLabs] = useState({});
    const [labsStat, setLabsStat] = useState({
        labsCompleted: 0,
        labsAbandoned: 0,
        labsAttempted: 0,
        totalLabs: 0,
    });

    const fetchUserData = () => {
        try {
            const cached = sessionStorage.getItem("userData");
            if (cached) {
                const data = JSON.parse(cached);
                if (isValidCache(data)) {
                    setUname(data.uname);
                    setEmail(data.email);
                    setLabsStat((prev) => ({ ...prev, ...data.labsStat }));
                    return;
                }
                sessionStorage.removeItem("userData");
            }
        } catch {
            sessionStorage.removeItem("userData");
        }

        backendFetch("/user-data", { method: "GET" }).then((r) => {
            setUname(r.uname);
            setEmail(r.email);
            setLabsStat((prev) => ({
                ...prev,
                labsCompleted: r.labsCompleted,
                labsAbandoned: r.labsAbandoned,
                labsAttempted: r.labsAttempted,
            }));
            sessionStorage.setItem(
                "userData",
                JSON.stringify({
                    uname: r.uname,
                    email: r.email,
                    labsStat: {
                        labsCompleted: r.labsCompleted,
                        labsAbandoned: r.labsAbandoned,
                        labsAttempted: r.labsAttempted,
                    },
                }),
            );
        });
    };

    const clearUserData = () => {
        sessionStorage.removeItem("userData");
        setUname(undefined);
        setEmail(undefined);
        setLabsStat((prev) => ({
            labsCompleted: 0,
            labsAbandoned: 0,
            labsAttempted: 0,
            totalLabs: prev.totalLabs,
        }));
    };

    useEffect(() => {
        fetchUserData();
        backendFetch("/info", { method: "GET" }).then((r) => {
            setLabsStat((prev) => ({ ...prev, totalLabs: r.totalLabs }));
        });
    }, []);
    useEffect(() => {
        backendFetch("/all-labs-data").then((r) => {
            if (r.status === "success") setLabs(r.data);
        });
    }, []);
    const learningData = {
        "Cross Site Scripting (XSS)": {
            url: "xss",
            subTitles: {
                "What is XSS": { comp: XSSMaterial },
                "How does XSS works?": { comp: XSSMaterial, hash: "xss-works" },
                "Proof of Concept": { comp: XSSMaterial, hash: "xss-poc" },
                "Impact of an attack": {
                    comp: XSSMaterial,
                    hash: "xss-impact",
                },
                Testing: { comp: XSSMaterial, hash: "xss-test" },
                "Reflected XSS": { comp: ReflectedXSSMaterial },
                "Stored XSS": { comp: StoredXSSMaterial },
                "DOM-based XSS": { comp: DOMBasedXSSMaterial },
                "XSS Contexts": { comp: XSSContexts },
                "Exploiting XSS Vulnerabilities": {
                    comp: ExploitingXSSMaterial,
                },
                "Dangling Markup Injection": { comp: DanglingMarkupInjection },
                "Content Security Policy (CSP)": {
                    comp: ContentSecurityPolicy,
                },
                "Preventing XSS Attacks": { comp: XSSPrevention },
                "View All XSS Labs": { url: frontendbasename + "all-labs#xss" },
            },
        },
        "SQL Injection (SQLi)": {
            url: "sql-injection",
            subTitles: {
                "SQL-Injection": { comp: SQLMain },
                "Examining the database": { comp: ExaminingDatabase },
                "UNION Attacks": { comp: UnionAttack },
                "Blind SQL Injection": { comp: BlindSql },
                "View All XSS Labs": {
                    url: frontendbasename + "all-labs#sql-injection",
                },
            },
        },
        "Access Control": {
            url: "access-control",
            subTitles: {
                "Access Control": { comp: AccessControl },
                "Insecure direct object references (IDOR)": { comp: IDOR },
                "View All XSS Labs": {
                    url: frontendbasename + "all-labs#access-control",
                },
            },
        },
        Authentication: {
            url: "authentication",
            subTitles: {
                Authentication: { comp: Authentication },
                "Password-based Authentication": { comp: passwordAuth },
                "Multi-factor Authentication": { comp: MultiFactor },
                "Other Authentication": { comp: OtherAuth },
                "Secure authentication mechanisms": {
                    comp: SecureAuthentication,
                },
                "View All XSS Labs": {
                    url: frontendbasename + "all-labs#authentication",
                },
            },
        },
        "Path Traversal": {
            url: "path-traversal",
            subTitles: {
                "Path Traversal": { comp: PathTraversalMaterial },
                "View All XSS Labs": {
                    url: frontendbasename + "all-labs#path-traversal",
                },
            },
        },
    };

    const value = {
        uname,
        setUname,
        email,
        setEmail,
        darkTheme,
        setDarkTheme,
        learningData,
        labsStat,
        setLabsStat,
        fetchUserData,
        clearUserData,
        labs,
        setLabs,
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
}

export const useGlobalContext = () => useContext(GlobalContext);
