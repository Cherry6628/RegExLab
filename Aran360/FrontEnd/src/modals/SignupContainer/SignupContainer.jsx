import Button from "../../component/Button/Button";
import { signup } from "../../utils/authHelpers";
import "./SignupContainer.css";
import { useRef } from "react";
import { refreshCsrfToken } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { error, info, success } from "../../utils/params.js";
import { useToast } from "../../component/Toast/ToastContext.jsx";
import { useGlobalContext } from "../ContextProvider/ContextProvider.jsx";

export default function SignupContainer({ setModal }) {
    const context = useGlobalContext();
    const navigate = useNavigate();
    const password = useRef(null);
    const username = useRef(null);
    const email = useRef(null);
    const { showToast } = useToast();
    async function signupCallback(uname, mail, pwd) {
        await signup(uname, mail, pwd)
            .then((r) => {
                showToast(r.message, r.status);
                if (r?.status === success) {
                    context.fetchUserData();
                    navigate("/dashboard");
                }
            })
            .catch((r) => {
                showToast(r.message, error);
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
                        autoComplete="off"
                        autoFocus
                        onLoad={focus}
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
                        autoComplete="off"
                    />
                </div>

                <div className="signup-input-group">
                    <label>Password</label>
                    <input
                        htmlFor="pwd"
                        type="password"
                        placeholder="••••••••"
                        ref={password}
                        autoComplete="off"
                    />
                    <span id="pwd" name="pwd" className="signup-input-hint">
                        Must be at least 8 characters
                    </span>
                </div>

                <Button
                    onClick={async () => {
                        await signupCallback(
                            username.current.value,
                            email.current.value,
                            password.current.value,
                        );
                    }}
                    icon="login"
                >
                    Sign Up
                </Button>
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
