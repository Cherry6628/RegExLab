import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../Logo/Logo";
import "./Header.css";
import { useGlobalContext } from "../../modals/ContextProvider/ContextProvider";
import { backendFetch } from "../../utils/helpers";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const context = useGlobalContext();
    const navigate = useNavigate();
    const listRef = useRef(null);

    const closeAll = () => {
        setMenuOpen(false);
        setDropdownOpen(false);
        setProfileOpen(false);
    };

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setDropdownOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) closeAll();
        };

        const handleClose = (e) => {
            if (
                !listRef.current?.contains(e.target) &&
                !profileRef.current?.contains(e.target)
            ) {
                setDropdownOpen(false);
                setProfileOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("click", handleClose);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("click", handleClose);
        };
    }, []);

    return (
        <>
            <header className="header-navbar">
                <div className="header-nav-logo">
                    <Logo />
                </div>

                <div
                    className="hamburger"
                    onClick={() => setMenuOpen((prev) => !prev)}
                >
                    <span className="material-symbols-outlined">
                        {menuOpen ? "close" : "menu"}
                    </span>
                </div>

                {menuOpen && (
                    <div className="nav-overlay" onClick={closeAll}></div>
                )}

                <nav className={`nav-menu ${menuOpen ? "open" : ""}`}>
                    <ul className="navlist">
                        <li>
                            <NavLink
                                to="/dashboard"
                                end
                                className={({ isActive }) =>
                                    `navitem ${isActive ? "active" : ""}`
                                }
                                onClick={() => {
                                    context.fetchUserData();
                                    closeAll();
                                }}
                            >
                                Dashboard
                            </NavLink>
                        </li>

                        <li className="navitem-container" ref={listRef}>
                            <p
                                className={`navitem ${
                                    dropdownOpen ? "active" : ""
                                }`}
                                onClick={toggleDropdown}
                            >
                                Knowledge Base
                            </p>

                            <ul
                                className={`dropdown-menu ${
                                    dropdownOpen ? "show" : ""
                                }`}
                            >
                                {Object.keys(context.learningData).map(
                                    (key) => (
                                        <li key={key}>
                                            <NavLink
                                                to={
                                                    "/learning-material/" +
                                                    context.learningData[key]
                                                        .url
                                                }
                                                className={({ isActive }) =>
                                                    isActive ? "active" : ""
                                                }
                                                onClick={closeAll}
                                            >
                                                {key}
                                            </NavLink>
                                        </li>
                                    ),
                                )}
                            </ul>
                        </li>

                        <li>
                            <NavLink
                                to="/all-labs"
                                className={({ isActive }) =>
                                    `navitem ${isActive ? "active" : ""}`
                                }
                                onClick={closeAll}
                            >
                                All Labs
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/test"
                                className={({ isActive }) =>
                                    `navitem ${isActive ? "active" : ""}`
                                }
                                onClick={closeAll}
                            >
                                Take a Test
                            </NavLink>
                        </li>

                        <li ref={profileRef} className="navitem-container">
                            {context.uname ? (
                                <>
                                    <span
                                        className="material-symbols-outlined"
                                        style={{
                                            fontSize: "40px",
                                            cursor: "pointer",
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setProfileOpen((prev) => !prev);
                                        }}
                                    >
                                        account_circle
                                    </span>

                                    <ul
                                        className={`dropdown-menu ${
                                            profileOpen ? "show" : ""
                                        }`}
                                style={{width: "100px", marginTop: "15px !important"}}
                                    >
                                        <li>
                                            <NavLink
                                                to="/accounts"
                                                onClick={closeAll}
                                            >
                                                Profile
                                            </NavLink>
                                        </li>

                                        <li>
                                            <NavLink
                                            
                                                className="logout-btn"
                                                onClick={() => {
                                                    backendFetch("/logout", {
                                                        method: "POST",
                                                    }).then((r) => {
                                                        context.clearUserData();
                                                        showToast(
                                                            r.message,
                                                            r.status,
                                                        );
                                                        closeAll();
                                                        navigate("/accounts");
                                                    });
                                                }}
                                            >
                                                Logout
                                            </NavLink>
                                        </li>
                                    </ul>
                                </>
                            ) : (
                                <NavLink
                                    to="/accounts"
                                    className={({ isActive }) =>
                                        `navitem ${isActive ? "active" : ""}`
                                    }
                                    onClick={closeAll}
                                >
                                    Login
                                </NavLink>
                            )}
                        </li>
                    </ul>
                </nav>
            </header>
            <div id="clear-header-position"></div>
        </>
    );
}
