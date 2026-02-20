import { createContext, useState, useContext } from "react";
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

const GlobalContext = createContext();

export default function ContextProvider({ children }) {
  const [uname, setUname] = useState(undefined);
  const [email, setEmail] = useState(undefined);
  const [darkTheme, setDarkTheme] = useState(true);
  const [csrfToken, setCSRFToken] = useState(undefined);
  const learningData = {
    "Cross Site Scripting (XSS)": {
      url: "xss",
      subTitles: {
        "What is XSS": { comp: XSSMaterial },
        "How does XSS works?": { comp: XSSMaterial, hash: "xss-works" },
        "Proof of Concept": { comp: XSSMaterial, hash: "xss-poc" },
        "Impact of an attack": { comp: XSSMaterial, hash: "xss-impact" },
        Testing: { comp: XSSMaterial, hash: "xss-test" },
        "Reflected XSS": { comp: ReflectedXSSMaterial },
        "Stored XSS": { comp: StoredXSSMaterial },
        "DOM-based XSS": { comp: DOMBasedXSSMaterial },
        "XSS Contexts": { comp: XSSContexts },
        "Exploiting XSS Vulnerabilities": { comp: ExploitingXSSMaterial },
        "Dangling Markup Injection": { comp: DanglingMarkupInjection },
        "Content Security Policy (CSP)": { comp: ContentSecurityPolicy },
        "Preventing XSS Attacks": { comp: XSSPrevention },
        "View All XSS Labs": { url: frontendbasename + "all-labs#xss" },
      },
    },
    "SQL Injection (SQLi)": {
      url: "sql-injection",
      subTitles: {
        "SQL-Injection":{comp: SQLMain},
        "Examining the database":{comp:ExaminingDatabase},
        "UNION Attacks":{comp:UnionAttack},
        "Blind SQL Injection":{comp:BlindSql},
        "View All XSS Labs": { url: frontendbasename + "all-labs#sql-injection" },
      },
    },
    "Access Control": {
      url: "access-control",
      subTitles: {
        "Access Control":{comp: AccessControl},
        "Insecure direct object references (IDOR)":{comp: IDOR},
        "View All XSS Labs": { url: frontendbasename + "all-labs#access-control" },
      },
    },
    "Authentication": {
      url: "authentication",
      subTitles: {
        "Authentication":{comp: Authentication},
        "Password-based Authentication":{comp:passwordAuth},
        "Multi-factor Authentication":{comp:MultiFactor},
        "Other Authentication":{comp:OtherAuth},
        "View All XSS Labs": { url: frontendbasename + "all-labs#authentication" },
      },
    },
    "Path Traversal": {
      url: "path-traversal",
      subTitles: {
        "Path Traversal":{comp: PathTraversalMaterial},
        "View All XSS Labs": { url: frontendbasename + "all-labs#path-traversal" },
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
    csrfToken,
    setCSRFToken,
    learningData,
  };
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(GlobalContext);
