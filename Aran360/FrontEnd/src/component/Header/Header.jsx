import { useState, useEffect } from "react";
import Logo from "../Logo/Logo";
import "./Header.css";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const loggedin = true;

    const closeAll = () => {
        setMenuOpen(false);
        setDropdownOpen(false);
    };

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) closeAll();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    function login(){
        console.log("login");
    }
    return (
        <header className="header-navbar">
            <div className="header-nav-logo">
                <Logo />
            </div>

            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                <span className="material-symbols-outlined">
                    {menuOpen ? "close" : "menu"}
                </span>
            </div>

            {menuOpen && <div className="nav-overlay" onClick={closeAll}></div>}

            <nav className={`nav-menu ${menuOpen ? "open" : ""}`}>
                <ul className="navlist">
                    <li><p className="navitem" onClick={closeAll}>Dashboard</p></li>
                    
                    <li className="navitem-container">
                        <p className={`navitem ${dropdownOpen ? "active" : ""}`} onClick={toggleDropdown}>
                            Knowledge Base
                        </p>
                        <ul className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
                            <li><a href="#link1">Vulnerability Docs</a></li>
                            <li><a href="#link2">Security Standards</a></li>
                            <li><a href="#link3">Best Practices</a></li>
                        </ul>
                    </li>

                    <li><p className="navitem" onClick={closeAll}>All Labs</p></li>
                    <li><p className="navitem" onClick={closeAll}>Take a Test</p></li>
                    <li className="profile-container">
                        {loggedin ? (
                            <span style={{ fontSize: '40px', cursor: 'pointer' }} className="material-symbols-outlined">
                                account_circle
                            </span>
                        ) : (
                            <p className="nav-profile" onClick={login}>Login</p>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
}