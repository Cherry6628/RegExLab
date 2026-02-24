import VulnerabilityTopic from "./VulnerabilityTopic/VulnerabilityTopic";
import "./QuizMain.css";
import { useState } from "react";
import QuizContainer from "./QuizContainer";
import Header from "../Header/Header";
export default function QuizMain() {
    const [display, setDisplay] = useState(0);
    const handleClick = async(topicName) =>{
        try{
            const response = await fetch(" http://localhost:8765/quiz-questions",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    topic: topicName
                }),
            });
            const data = await response.json();
            console.log(data);
            setDisplay(1);
        }catch(err){
            console.log(err);
        }
    }
    return (
        <>
            <div style={{ height: "100px" }}>
                <Header />
            </div>
            <div id="QuizMain">
                {display == 0 && (
                    <main className="content">
                        <h1>What would you like to focus on today?</h1>
                        <p>
                            Select a vulnerability domain to begin your
                            interactive training session. Each
                            <br />
                            path contains hands-on labs and theoretical
                            assessments.
                        </p>
                        <div className="separate">
                            <VulnerabilityTopic
                                onClick={handleClick("Cross-Site Scripting (XSS)")}
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
                                icon="shield"
                                heading="Access Control"
                                content="Access Control vulnerabilities occur when an application fails to properly restrict what authenticated users are allowed to do. Attackers can exploit these weaknesses to access unauthorized resources, view or modify other users' data, or escalate privileges to perform administrative actions."
                            />
                            <VulnerabilityTopic
                                icon="key"
                                heading="Authentication"
                                content="Authentication vulnerabilities arise when an application improperly verifies a user's identity. Weak password policies, insecure session management, or flawed login mechanisms can allow attackers to bypass authentication, impersonate legitimate users, or gain unauthorized access to accounts."
                            />
                            <VulnerabilityTopic
                                icon="folder"
                                heading="Path Traversal"
                                content="Path Traversal (also known as Directory Traversal) is a vulnerability that allows attackers to access files and directories outside the intended web root folder. By manipulating file path inputs (e.g., using '../'), attackers can read sensitive files such as configuration files, system files, or application source code."
                            />
                        </div>
                    </main>
                )}
                {display == 1 && <QuizContainer />}
            </div>
        </>
    );
}
