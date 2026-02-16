import Vulnerable from "./vulnerability/Vulnerability";
import './QuizMain.css';
export default function QuizMain(){
    return(
        <div id="QuizMain">
            <main className="content">
                <h1>What would you like to master today?</h1>
                <p>Select a vulnerability domain to begin your interactive training session.Each<br/>path contains hands-onlabs and theoretical assesments.</p>
                <div className="separate">
                    <Vulnerable icon={<span class="material-symbols-outlined">terminal</span>} heading="Cross-Site Scripting (XSS)" content="Cross Site Scripting (XSS) allows attackers to inject malicious JavaScript into web pages. When other users visit the page, the script executes in their browser and can steal cookies, session tokens, or sensitive data." />
                    <Vulnerable icon={<span class="material-symbols-outlined">database</span>} heading="SQL Injection" content="SQL Injection is a vulnerability where attackers insert malicious SQL queries into input fields to manipulate or access unauthorized database data."/>
                </div>
            </main>
        </div>
    );
}