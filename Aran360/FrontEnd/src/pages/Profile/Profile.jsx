import { useNavigate } from "react-router-dom";
import Button from "../../component/Button/Button";
import Header from "../../component/Header/Header";
import { useGlobalContext } from "../../modals/ContextProvider/ContextProvider";
import { backendFetch } from "../../utils/helpers";
import "./Profile.css";
import { useToast } from "../../component/Toast/ToastContext";
export default function Profile() {
    const context = useGlobalContext();
    console.log(context);
    const navigate = useNavigate();
    const { showToast } = useToast();

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
                                    htmlFor="pwd"
                                    type="password"
                                    placeholder="••••••••"
                                    style={{ color: "var(--text-main)" }}
                                />
                            </div>
                            <div className="profile-input-group">
                                <label>New Password</label>
                                <input
                                    htmlFor="pwd"
                                    type="password"
                                    placeholder="••••••••"
                                    style={{ color: "var(--text-main)" }}
                                />
                                <span
                                    id="pwd"
                                    name="pwd"
                                    className="profile-input-hint"
                                >
                                    Must be at least 8 characters
                                </span>
                            </div>
                        </div>
                        <div className="updatePass">
                            <p>
                                Update your password regularly to keep your
                                account secure.
                            </p>
                            <Button>Update Password</Button>
                        </div>
                    </div>
                    <hr />
                    <div className="logOut">
                        <Button>Delete Account</Button>
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
