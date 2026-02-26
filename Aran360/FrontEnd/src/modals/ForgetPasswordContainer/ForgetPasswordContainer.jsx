import Button from "../../component/Button/Button.jsx";
import "./ForgetPasswordContainer.css";
import { useRef } from "react";
import { backendFetch, refreshCsrfToken } from "../../utils/helpers.js";
import { error } from "../../utils/params.js";
import { useToast } from "../../component/Toast/ToastContext.jsx";
import { useGlobalContext } from "../ContextProvider/ContextProvider.jsx";

export default function ForgetPasswordContainer({ setModal }) {
    const context = useGlobalContext();
    const email = useRef(null);
    const { showToast } = useToast();
    async function forgetPasswordCallback(email) {
        await backendFetch("/forget-password", {
            method: "POST",
            body: { email },
        })
            .then((r) => {
                showToast(r.message, r.status);
            })
            .catch((r) => {
                showToast(r.message, error);
            });
    }

    refreshCsrfToken();
    return (
        <div className="forget-password-container">
            <div className="forget-password-header">
                <h1 className="forget-password-title">
                    Want to reset your password ?
                </h1>
            </div>

            <form
                className="forget-password-form"
                onSubmit={(e) => e.preventDefault()}
            >
                <div className="forget-password-input-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        ref={email}
                        autoFocus
                        onLoad={focus}
                    />
                </div>

                <Button
                    onClick={async () => {
                        await forgetPasswordCallback(email.current.value);
                    }}
                    icon="arrow_forward_ios"
                >
                    Get Password Reset Email
                </Button>
            </form>

            <div className="forget-password-divider">
                <span>OR CONTINUE WITH</span>
            </div>

            <p className="forget-password-footer">
                Remember your password ?{" "}
                <a href="#" onClick={() => setModal("login")}>
                    Login
                </a>
            </p>
        </div>
    );
}
