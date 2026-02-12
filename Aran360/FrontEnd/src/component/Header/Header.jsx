import Logo from "../Logo/Logo";
import "./Header.css";

export default function Header() {
    return (
        <header className="header-navbar">
            <div className="header-nav-logo">
                <Logo showTagline={false} />
            </div>
            <nav>
                {/* <ul className="navlist">
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
                </ul> */}
            </nav>
        </header>
    );
}
