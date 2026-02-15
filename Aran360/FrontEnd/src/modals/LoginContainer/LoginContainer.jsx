import "./LoginContainer.css";
import Button from "../../component/Button/Button";
import { useGlobalContext } from "../ContextProvider/ContextProvider";
import { login } from "../../utils/authHelpers";
import { useRef } from "react";
import { refreshCsrfToken } from "../../utils/helpers";

export default function LoginContainer({ setModal }) {
    const context = useGlobalContext();
    const password = useRef(null);
    const username = useRef(null);
    refreshCsrfToken();
    return (
        <div className="login-container">
            <div className="login-header">
                <h1 className="login-title">Welcome back</h1>
                <p className="login-subtitle">
                    Please enter your details to sign in.
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
                    <a href="#" className="login-forgot-link">
                        Forgot Password?
                    </a>
                </div>

                <Button onClick={()=>{
                    login(username.current.value, password.current.value)
                }} icon="login">Sign In</Button>
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
