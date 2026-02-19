import { use, useState } from "react"
import Quiz from "./Quiz";

export default function QuizContainer(){
    let quiz = [
        {
            headline: "1. DOM-based XSS Vulnerability",
            describe: "User input is directly inserted into the DOM without sanitization.",
            question: "Which line contains the vulnerability?",
            isCode: false,
            language: "javascript",
            options: [
                "element.textContent = userInput;",
                "element.innerHTML = userInput;",
                "element.setAttribute('class', userInput);",
                "console.log(userInput);"
            ]
        },
        {
            headline: "2. Reflected XSS in URL Parameter",
            describe: "Data from URL parameters is written directly into the page.",
            question: "Which line contains the vulnerability?",
            isCode: false,
            language: "javascript",
            options: [
                "const name = new URLSearchParams(window.location.search).get('name');",
                "document.getElementById('output').innerHTML = name;",
                "document.getElementById('output').textContent = name;",
                "encodeURIComponent(name);"
            ]
        },
        {
            headline: "3. Stored XSS from Database",
            describe: "Data stored in a database is rendered without escaping.",
            question: "Which line contains the vulnerability?",
            isCode: false,
            language: "javascript",
            options: [
                "res.send('<h1>' + user.comment + '</h1>');",
                "res.send(escape(user.comment));",
                "res.json(user.comment);",
                "console.log(user.comment);"
            ]
        },
        {
            headline: "4. Inline Event Handler Injection",
            describe: "User input is injected into an HTML attribute.",
            question: "Which line contains the vulnerability?",
            isCode: false,
            language: "javascript",
            options: [
                "button.setAttribute('onclick', userInput);",
                "button.addEventListener('click', handleClick);",
                "button.disabled = true;",
                "console.log('clicked');"
            ]
        },
        {
            headline: "5. React dangerouslySetInnerHTML Usage",
            describe: "React provides a way to render raw HTML directly into components.",
            question: "Which line contains the vulnerability?",
            isCode: false,
            language: "javascript",
            options: [
                "<div>{userInput}</div>",
                "<div dangerouslySetInnerHTML={{ __html: userInput }} />",
                "<div>{sanitize(userInput)}</div>",
                "<div>{escape(userInput)}</div>"
            ]
        },
        {
            headline: "6. Improper Use of document.write",
            describe: "Writing user input directly into the document.",
            question: "Which line contains the vulnerability?",
            isCode: false,
            language: "javascript",
            options: [
                "document.write(userInput);",
                "document.createElement('p');",
                "console.log(userInput);",
                "alert('Hello');"
            ]
        },
        {
            headline: "7. Injecting into Script Tag",
            describe: "User input is embedded inside a script block.",
            question: "Which line contains the vulnerability?",
            isCode: false,
            language: "javascript",
            options: [
                "let data = JSON.stringify(userInput);",
                "res.send('<script>var msg = ' + userInput + '</script>');",
                "console.log(userInput);",
                "res.json(userInput);"
            ]
        },
        {
            headline: "8. Using eval with User Input",
            describe: "Executing user input as JavaScript code.",
            question: "Which line contains the vulnerability?",
            isCode: false,
            language: "javascript",
            options: [
                "eval(userInput);",
                "parseInt(userInput);",
                "Number(userInput);",
                "JSON.parse(userInput);"
            ]
        },
        {
            headline: "9. Unsafe innerHTML in Loop",
            describe: "Rendering multiple user comments dynamically.",
            question: "Which line contains the vulnerability?",
            isCode: false,
            language: "javascript",
            options: [
                "comments.forEach(c => list.innerHTML += '<li>' + c + '</li>');",
                "comments.forEach(c => console.log(c));",
                "comments.forEach(c => list.appendChild(document.createElement('li')));",
                "comments.forEach(c => list.textContent += c);"
            ]
        },
        {
            headline: "10. Image src Attribute Injection",
            describe: "User input is assigned to an image source attribute.",
            question: "Which line contains the vulnerability?",
            isCode: false,
            language: "javascript",
            options: [
                "img.src = userInput;",
                "img.alt = userInput;",
                "img.width = 200;",
                "console.log(userInput);"
            ]
        }
    ]
    
    const [currentQuestion, setCurrentQuestion] = useState(0);
    function incrementQuestion(){
        setCurrentQuestion(currentQuestion+1);
    };
    return <Quiz {...quiz[currentQuestion]} next={incrementQuestion} quizId={Math.floor(Math.random()*10000)}/>
    
}