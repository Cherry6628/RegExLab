import { useState } from "react";
import XSSMaterial from './XSSMaterial';
import ReflectedXSSMaterial from "./ReflectedXSSMaterial";
import DOMBasedXSSMaterial from './DOMBasedXSSMaterial';
import XSSContexts from './XSSContexts';
import ExploitingXSSMaterial from './ExploitingXSSMaterial';
import DanglingMarkupInjection from './DanglingMarkupInjection';
import ContentSecurityPolicy from './ContentSecurityPolicy';
import XSSPrevention from './XSSPrevention';
import StoredXSSMaterial from "./StoredXSSMaterial";
import { frontendbasename } from "../../../utils/params";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";
import QuizMain from "../../Quiz/QuizMain";
import Quiz from "../../Quiz/Quiz";

const list = {
    "What is XSS": { comp: XSSMaterial },
    "How does XSS works?": { comp: XSSMaterial, hash: "xss-works" },
    "Proof of Concept": { comp: XSSMaterial, hash: "xss-poc" },
    "Impact of an attack": { comp: XSSMaterial, hash: "xss-impact" },
    "Testing": { comp: XSSMaterial, hash: "xss-test" },
    "Reflected XSS": { comp: ReflectedXSSMaterial },
    "Stored XSS": { comp: StoredXSSMaterial },
    "DOM-based XSS": { comp: DOMBasedXSSMaterial },
    "XSS Contexts": { comp: XSSContexts },
    "Exploiting XSS Vulnerabilities": { comp: ExploitingXSSMaterial },
    "Dangling Markup Injection": { comp: DanglingMarkupInjection },
    "Content Security Policy (CSP)": { comp: ContentSecurityPolicy },
    "Preventing XSS Attacks": { comp: XSSPrevention },
    "View All XSS Labs": { url: frontendbasename + "all-labs" },
    "View All XSS Labs": { url: basename + "all-labs" },
    "QuizMain":{comp: QuizMain},
    "Quiz":{comp:Quiz},
};
export default function XSSMain() {
    const [activeId, setActiveId] = useState(Object.keys(list)[0]);
    const activeItem = list[activeId];
    const ActiveComponent = activeItem?.comp;
    return (
        <>
            <div style={{height: "100px"}}>
                <Header/>
            </div>
            <div
                style={{
                    width: "100vw",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Sidebar list={list} activeId={activeId} setActiveId={setActiveId}></Sidebar>
                
                <ActiveComponent/>
            </div>
        </>
    );
}
