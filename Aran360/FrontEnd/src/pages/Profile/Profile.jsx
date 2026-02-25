import { useNavigate } from "react-router-dom";
import Button from "../../component/Button/Button";
import Header from "../../component/Header/Header";
import { useGlobalContext } from "../../modals/ContextProvider/ContextProvider";
import { backendFetch, isValidPassword } from "../../utils/helpers";
import "./Profile.css";
import { useToast } from "../../component/Toast/ToastContext";
import { useState, useRef } from "react";

export default function Profile() {
    const context = useGlobalContext();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [oldPwd, setOldPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [pwdError, setPwdError] = useState(null);

    const oldPwdRef = useRef(null);
    const newPwdRef = useRef(null);

    const handleUpdatePassword = () => {
        setPwdError(null);

        if (!oldPwd.trim()) {
            setPwdError("Please enter your old password");
            return;
        }

        const validation = isValidPassword(newPwd);
        if (!validation.valid) {
            setPwdError(validation.message);
            return;
        }

        if (oldPwd === newPwd) {
            setPwdError("New password must be different from old password");
            return;
        }

        backendFetch("/update-password", {
            method: "POST",
            body: { oldPassword: oldPwd, newPassword: newPwd },
        }).then((r) => {
            showToast(r.message, r.status);
            if (r.status === "success") {
                setOldPwd("");
                setNewPwd("");
                setPwdError(null);
            } else {
                setPwdError(r.message);
            }
        });
    };

    return (
        <>
            <div style={{ height: "100px" }}>
                <Header />
            </div>
            <div id="profile">
                <section className="main">
                    <h1>Account Settings</h1>
                    <p>
                        Manage your personal information, security preferences,
                        and account status.
                    </p>
                    <div className="personInfo">
                        <i className="fa-solid fa-user"></i>
                        <h3>Personal Information</h3>
                    </div>
                    <hr />
                    <div className="secure">
                        <div className="profile-input-group">
                            <label htmlFor="name">Username</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                readOnly
                                value={context.uname}
                                autoComplete="off"
                                style={{ color: "var(--text-main)" }}
                            />
                        </div>
                        <div className="profile-input-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                readOnly
                                value={context.email}
                                autoComplete="off"
                                style={{ color: "var(--text-main)" }}
                            />
                        </div>
                    </div>
                    <div className="personInfo">
                        <i className="fa-solid fa-shield-halved"></i>
                        <h3>Security</h3>
                    </div>
                    <hr />
                    <div className="secure">
                        <div className="changePassword">
                            <div className="profile-input-group">
                                <label>Old Password</label>
                                <input
                                    ref={oldPwdRef}
                                    type="password"
                                    placeholder="••••••••"
                                    value={oldPwd}
                                    onChange={(e) => setOldPwd(e.target.value)}
                                    autoComplete="new-password"
                                    readOnly
                                    onFocus={(e) =>
                                        e.target.removeAttribute("readonly")
                                    }
                                    onBlur={(e) =>
                                        e.target.setAttribute("readonly", true)
                                    }
                                    style={{ color: "var(--text-main)" }}
                                />
                            </div>
                            <div className="profile-input-group">
                                <label>New Password</label>
                                <input
                                    ref={newPwdRef}
                                    type="password"
                                    placeholder="••••••••"
                                    value={newPwd}
                                    onChange={(e) => setNewPwd(e.target.value)}
                                    autoComplete="new-password"
                                    readOnly
                                    onFocus={(e) =>
                                        e.target.removeAttribute("readonly")
                                    }
                                    onBlur={(e) =>
                                        e.target.setAttribute("readonly", true)
                                    }
                                    style={{ color: "var(--text-main)" }}
                                />
                                <span className="profile-input-hint">
                                    Must be at least 8 characters with
                                    uppercase, lowercase, number and special
                                    character
                                </span>
                                {pwdError && (
                                    <span className="profile-input-error">
                                        {pwdError}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="updatePass">
                            <p>
                                Update your password regularly to keep your
                                account secure.
                            </p>
                            <Button onClick={handleUpdatePassword}>
                                Update Password
                            </Button>
                        </div>
                    </div>
                    <hr />
                    <div className="logOut">
                        <Button
                            onClick={() =>
                                backendFetch("/logout", {
                                    method: "POST",
                                }).then((r) => {
                                    context.clearUserData();
                                    showToast(r.message, r.status);
                                    navigate("/accounts");
                                })
                            }
                        >
                            Log Out{" "}
                            <i className="fa-solid fa-right-from-bracket"></i>
                        </Button>
                    </div>
                </section>
            </div>
        </>
    );
}
