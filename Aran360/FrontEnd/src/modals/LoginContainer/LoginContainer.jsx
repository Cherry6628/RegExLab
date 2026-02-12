import "./LoginContainer.css";

export default function LoginContainer({ setModal }) {
    function login() {
        console.log("login");
    }
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
                    <label htmlFor="email">Email Address</label>
                    <input
                        name="email"
                        id="email"
                        type="email"
                        placeholder="name@example.com"
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
                    />
                    <a href="#" className="login-forgot-link">
                        Forgot Password?
                    </a>
                </div>

                <button
                    type="submit"
                    className="login-primary-btn"
                    onClick={login}
                >
                    Sign In
                    <span className="material-symbols-outlined">login</span>
                </button>
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
