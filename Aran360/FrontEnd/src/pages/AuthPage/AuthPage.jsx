import "./AuthPage.css";
import AuthModal from "../../modals/AuthModal/AuthModal.jsx";
import Header from "../../component/Header/Header.jsx";

export default function AuthPage({modal=undefined}) {
    return (
        <div className="auth-page-wrapper">
            <Header />

            <main className="auth-main-content">
                <div className="auth-branding-section">
                    <div
                        className="auth-illustration-container"
                        style={{ position: "relative", zIndex: 0 }}
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{
                                position: "absolute",
                                transform: "scale(19)",
                                zIndex: -1,
                                color: "var(--action-color2)",
                            }}
                        >
                            fingerprint
                        </span>
                        <div className="auth-mockup-card" style={{ zIndex: 1 }}>
                            <div className="auth-mockup-check">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 -960 960 960"
                                    fill="var(--action-color)"
                                    style={{
                                        height: "var(--large-size)",
                                        width: "var(--large-size)",
                                    }}
                                >
                                    <path d="M480-200q66 0 113-47t47-113v-160q0-66-47-113t-113-47q-66 0-113 47t-47 113v160q0 66 47 113t113 47Zm-80-120h160v-80H400v80Zm0-160h160v-80H400v80Zm80 40Zm0 320q-65 0-120.5-32T272-240H160v-80h84q-3-20-3.5-40t-.5-40h-80v-80h80q0-20 .5-40t3.5-40h-84v-80h112q14-23 31.5-43t40.5-35l-64-66 56-56 86 86q28-9 57-9t57 9l88-86 56 56-66 66q23 15 41.5 34.5T688-640h112v80h-84q3 20 3.5 40t.5 40h80v80h-80q0 20-.5 40t-3.5 40h84v80H688q-32 56-87.5 88T480-120ZM40-720v-120q0-33 23.5-56.5T120-920h120v80H120v120H40ZM240-40H120q-33 0-56.5-23.5T40-120v-120h80v120h120v80Zm480 0v-80h120v-120h80v120q0 33-23.5 56.5T840-40H720Zm120-680v-120H720v-80h120q33 0 56.5 23.5T920-840v120h-80Z" />
                                </svg>
                            </div>
                            <div className="auth-mockup-lines">
                                <div className="auth-m-line auth-m-line-sm"></div>
                                <div className="auth-m-line auth-m-line-lg"></div>
                                <div className="auth-m-line auth-m-line-lg"></div>
                            </div>
                        </div>
                    </div>
                    <div className="auth-branding-text">
                        <h2>The Art of Digital Defense</h2>
                        <p>Learn the art of digital defense</p>
                    </div>
                </div>

                <div className="auth-form-section">
                    {modal?<AuthModal defaultModal={modal}/>: <AuthModal/>}
                </div>
            </main>

            <footer className="auth-footer-bar">
                <p className="auth-copyright-text">
                    ©&nbsp;2026&nbsp;Aran&nbsp;360&nbsp;
                    All&nbsp;rights&nbsp;reserved.
                </p>
                <div className="auth-legal-links">
                    <a href="#terms">Terms of Service</a>
                    <a href="#privacy">Privacy Policy</a>
                    <a href="#cookies">Cookie Settings</a>
                </div>
            </footer>
        </div>
    );
}
