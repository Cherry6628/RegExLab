import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../modals/ContextProvider/ContextProvider";
import { backendFetch, isValidPassword } from "../../utils/helpers";
import { useToast } from "../../component/Toast/ToastContext";

export default function ResetPassword() {
    const token = new URLSearchParams(window.location.search).get("token");

    const navigate = useNavigate();
    const context = useGlobalContext();
    const pwd = useRef(null);
    const repwd = useRef(null);
    const { showToast } = useToast();
    useEffect(() => {
        if (context.uname) navigate("/dashboard");
        if (!token) navigate("/accounts");
    }, []);
    function sendResetReq() {
        const pass = pwd.current.value;
        const pass2 = repwd.current.value;
        if (pass == null || pass != pass2 || !isValidPassword(pass)) {
            showToast(
                "Please enter a Password with atleast 8 characters, 1 symbol, 1 capital letter, 1 small letter and 1 number",
            );
            return;
        }
        backendFetch("/reset-pwd", {
            method: "POST",
            body: { token, pass, repeat_pass: pass2 },
        })
            .then((r) => {
                showToast(r.message, r.status);
                if (r?.status === success) navigate("/accounts");
            })
            .catch((r) => {
                showToast(r, error);
            });
    }
    return (
        <>
            <div style={{ height: "100px" }}>
                <Header />
            </div>
            <div>
                <input type="password" id="pwd" name="pwd" ref={pwd} />
                <input type="password" id="repwd" name="repwd" ref={repwd} />
                <input onClick={sendResetReq} />
            </div>
        </>
    );
}
