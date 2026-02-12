import Button from "../../component/Button/Button";
import "./SignupContainer.css";

export default function SignupContainer({ setModal }) {
    function signup() {
        console.log("signup");
    }
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
                    <label htmlFor="name">Full Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                    />
                </div>

                <div className="signup-input-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                    />
                </div>

                <div className="signup-input-group">
                    <label>Password</label>
                    <input
                        htmlFor="pwd"
                        type="password"
                        placeholder="••••••••"
                    />
                    <span id="pwd" name="pwd" className="signup-input-hint">
                        Must be at least 8 characters
                    </span>
                </div>

                
                <Button onClick={signup} icon="login">Sign Up</Button>
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
