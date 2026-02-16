import Button from "../../component/Button/Button";
import { signup } from "../../utils/authHelpers";
import "./SignupContainer.css";
import { useRef } from "react";
import { refreshCsrfToken } from "../../utils/helpers";
// Import these two
import { useNavigate } from "react-router-dom";
import { frontendbasename } from "../../utils/params.js";

export default function SignupContainer({ setModal }) {
    const navigate = useNavigate();
    const password = useRef(null);
    const username = useRef(null);
    const email = useRef(null);
    function signupCallback(uname, mail, pwd) {
        signup(uname, mail, pwd).then(() => {
            navigate(frontendbasename + "/dashboard");
        });
    }

    refreshCsrfToken();
    return (
        <div className="signup-container">
            <div className="signup-header">
                <h1 className="signup-title">Create an account</h1>
                <p className="signup-subtitle">
                    Sign up to track your progress.
                </p>
            </div>

            <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
                <div className="signup-input-group">
                    <label htmlFor="name">Username</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        ref={username}
                    />
                </div>

                <div className="signup-input-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        ref={email}
                    />
                </div>

                <div className="signup-input-group">
                    <label>Password</label>
                    <input
                        htmlFor="pwd"
                        type="password"
                        placeholder="••••••••"
                        ref={password}
                    />
                    <span id="pwd" name="pwd" className="signup-input-hint">
                        Must be at least 8 characters
                    </span>
                </div>

                <Button onClick={() => {
                    signupCallback(username.current.value, email.current.value, password.current.value);
                }} icon="login">Sign Up</Button>
            </form>

            <div className="signup-divider">
                <span>OR CONTINUE WITH</span>
            </div>

            <p className="signup-footer">
                Already have an account?{" "}
                <a href="#" onClick={() => setModal("login")}>
                    Login
                </a>
            </p>
        </div>
    );
}