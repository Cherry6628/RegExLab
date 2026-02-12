import "./LoginContainer.css";

export default function LoginContainer({setModal}) {
    function login(){
        console.log("login");
        
    }
    return (
        <div className="login-container">
            <div className="login-header">
                <h1 className="login-title">Welcome back</h1>
                <p className="login-subtitle">Please enter your details to sign in.</p>
            </div>

            <form className="login-form" onSubmit={e=>e.preventDefault()}>
                <div className="login-input-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="name@example.com" />
                </div>

                <div className="login-input-group">
                    <div className="login-label-row">
                        <label>Password</label>
                    </div>
                    <input type="password" placeholder="••••••••" />
                    <a href="#" className="login-forgot-link">Forgot Password?</a>
                </div>

                <button type="submit" className="login-primary-btn" onClick={login}>
                    Sign In 
                    <span className="material-symbols-rounded">login</span>
                </button>
            </form>

            <div className="login-divider">
                <span>OR CONTINUE WITH</span>
            </div>

            <p className="login-footer">
                Don't have an account? <a href="#" onClick={()=>setModal("signup")}>Sign Up</a>
            </p>
        </div>
    );
}