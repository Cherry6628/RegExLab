import "./LoginContainer.css";
import Button from "../../component/Button/Button";
import { login } from "../../utils/authHelpers";
import { useRef } from "react";
import { refreshCsrfToken } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { error, success } from "../../utils/params.js";
import { useToast } from "../../component/Toast/ToastContext.jsx";
import { useGlobalContext } from "../ContextProvider/ContextProvider.jsx";

export default function LoginContainer({ setModal }) {
    const context = useGlobalContext();
    const navigate = useNavigate();
    const password = useRef(null);
    const username = useRef(null);
    const { showToast } = useToast();
    function loginCallback(uname, pwd) {
        login(uname, pwd)
            .then((r) => {
                showToast(r.message, r.status);
                if (r?.status === success) {
                    context.fetchUserData();
                    navigate("/dashboard");
                }
            })
            .catch((r) => {
                console.log(r);
                console.log(typeof r);
                showToast(r.message, error);
            });
    }
    refreshCsrfToken();
    return (
        <div className="login-container">
            <div className="login-header">
                <h1 className="login-title">Welcome, Defender!</h1>
                <p className="login-subtitle">
                    Sign in to continue building your security skills.
                </p>
            </div>

            <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                <div className="login-input-group">
                    <label htmlFor="name">Username</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        ref={username}
                    />
                </div>

                <div className="login-input-group">
                    <div className="login-label-row">
                        <label htmlFor="pwd">Password</label>
                    </div>
                    <input
                        name="pwd"
                        id="pwd"
                        type="password"
                        placeholder="••••••••"
                        ref={password}
                    />
                    <a href="#" className="login-forgot-link" onClick={()=>setModal("forget-password")}>
                        Forgot Password?
                    </a>
                </div>

                <Button
                    onClick={() => {
                        loginCallback(
                            username.current.value,
                            password.current.value,
                        );
                    }}
                    icon="login"
                >
                    Sign In
                </Button>
            </form>

            <div className="login-divider">
                <span>OR CONTINUE WITH</span>
            </div>

            <p className="login-footer">
                Don't have an account?{" "}
                <a href="#" onClick={() => setModal("signup")}>
                    Sign Up
                </a>
            </p>
        </div>
    );
}
