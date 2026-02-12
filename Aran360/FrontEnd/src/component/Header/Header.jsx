import Logo from "../Logo/Logo";
import "./Header.css";
import { useRef } from "react";
export default function Header() {
    const ref = useRef(null);
    function log(){
        const element = ref.current;
        console.log(element);
        element.innerText = "";
        element.classList= "remove";
        element.innerHTML = `<span style="font-size:40px; " class="material-symbols-outlined">account_circle</span>`;
    }
    return (
        <header className="header-navbar">
            <div className="header-nav-logo">
                <Logo />
            </div>
            <nav>
                <ul className="navlist">
                    <li>
                        <p className="navitem">Dashboard</p>
                    </li>
                    <li>
                        <p className="navitem">Knowledge Base</p>
                    </li>
                    <li>
                        <p className="navitem">All Labs</p>
                    </li>
                    <li>
                        <p className="navitem">Take a Test</p>
                    </li>
                    <li>
                        <p id="login" className="nav-profile" ref={ref} onClick={log}>Login</p>
                    </li>
                </ul> 
            </nav>
        </header>
    );
}
