import "./LoginContainer.css";
import Button from "../../component/Button/Button";
import { login } from "../../utils/authHelpers";
import { useRef } from "react";
import { refreshCsrfToken } from "../../utils/helpers";
import {useNavigate} from "react-router-dom";
import {frontendbasename} from "../../utils/params.js";

export default function LoginContainer({ setModal }) {
    const navigate = useNavigate();
    const password = useRef(null);
    const username = useRef(null);
    function loginCallback(uname, pwd){
        login(uname, pwd).then(()=>{
            navigate(frontendbasename + "/dashboard");
        })
    }
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
                    loginCallback(username.current.value, password.current.value);
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
