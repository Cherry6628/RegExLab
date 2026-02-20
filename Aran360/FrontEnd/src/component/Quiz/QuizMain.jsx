import VulnerabilityTopic from "./VulnerabilityTopic/VulnerabilityTopic";
import "./QuizMain.css";
import { useState } from "react";
import QuizContainer from "./QuizContainer";
import Header from "../Header/Header";
export default function QuizMain() {
    const [display, setDisplay] = useState(0);
    return (
        <>
            <div style={{ height: "100px" }}>
                <Header />
            </div>
            <div id="QuizMain">
                {display == 0 && (
                    <main className="content">
                        <h1>What would you like to master today?</h1>
                        <p>
                            Select a vulnerability domain to begin your
                            interactive training session. Each
                            <br />
                            path contains hands-on labs and theoretical
                            assessments.
                        </p>
                        <div className="separate">
                            <VulnerabilityTopic
                                onClick={() => setDisplay(1)}
                                icon="terminal"
                                heading="Cross-Site Scripting (XSS)"
                                content="Cross Site Scripting (XSS) allows attackers to inject malicious JavaScript into web pages. When other users visit the page, the script executes in their browser and can steal cookies, session tokens, or sensitive data."
                            />
                            <VulnerabilityTopic
                                icon="database"
                                heading="SQL Injection"
                                content="SQL Injection is a vulnerability where attackers insert malicious SQL queries into input fields to manipulate or access unauthorized database data."
                            />
                            <VulnerabilityTopic
                                icon="terminal"
                                heading="Cross-Site Scripting (XSS)"
                                content="Cross Site Scripting (XSS) allows attackers to inject malicious JavaScript into web pages. When other users visit the page, the script executes in their browser and can steal cookies, session tokens, or sensitive data."
                            />
                            <VulnerabilityTopic
                                onClick={() => setDisplay(1)}
                                icon="terminal"
                                heading="Cross-Site Scripting (XSS)"
                                content="Cross Site Scripting (XSS) allows attackers to inject malicious JavaScript into web pages. When other users visit the page, the script executes in their browser and can steal cookies, session tokens, or sensitive data."
                            />
                            <VulnerabilityTopic
                                icon="database"
                                heading="SQL Injection"
                                content="SQL Injection is a vulnerability where attackers insert malicious SQL queries into input fields to manipulate or access unauthorized database data."
                            />
                            <VulnerabilityTopic
                                icon="terminal"
                                heading="Cross-Site Scripting (XSS)"
                                content="Cross Site Scripting (XSS) allows attackers to inject malicious JavaScript into web pages. When other users visit the page, the script executes in their browser and can steal cookies, session tokens, or sensitive data."
                            />
                            <VulnerabilityTopic
                                onClick={() => setDisplay(1)}
                                icon="terminal"
                                heading="Cross-Site Scripting (XSS)"
                                content="Cross Site Scripting (XSS) allows attackers to inject malicious JavaScript into web pages. When other users visit the page, the script executes in their browser and can steal cookies, session tokens, or sensitive data."
                            />
                            <VulnerabilityTopic
                                icon="database"
                                heading="SQL Injection"
                                content="SQL Injection is a vulnerability where attackers insert malicious SQL queries into input fields to manipulate or access unauthorized database data."
                            />
                            <VulnerabilityTopic
                                icon="terminal"
                                heading="Cross-Site Scripting (XSS)"
                                content="Cross Site Scripting (XSS) allows attackers to inject malicious JavaScript into web pages. When other users visit the page, the script executes in their browser and can steal cookies, session tokens, or sensitive data."
                            />
                        </div>
                    </main>
                )}
                {display == 1 && <QuizContainer />}
            </div>
        </>
    );
}
