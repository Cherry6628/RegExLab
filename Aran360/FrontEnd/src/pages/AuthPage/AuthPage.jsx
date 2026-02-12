import "./AuthPage.css";
// import Logo from "../../components/Logo/Logo.jsx";
import AuthModal from "../../modals/AuthModal/AuthModal.jsx";
import Logo from "../../component/Logo/Logo.jsx";
import Header from "../../component/Header/Header.jsx";

export default function AuthPage() {
    return (
        <div className="auth-page-wrapper">
            <Header></Header>

            <main className="auth-main-content">
                <div className="auth-branding-section">
                    <div className="auth-illustration-container">
                        <div className="auth-mockup-card">
                            <div className="auth-mockup-check">
                                <Logo
                                    showTitle={false}
                                    showTagline={false}
                                ></Logo>
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
                        <p>Learn to defend</p>
                    </div>
                </div>

                <div className="auth-form-section">
                    <AuthModal />
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
