import ResetPassword from "../../pages/ResetPassword/ResetPassword";
import ForgetPasswordContainer from "../ForgetPasswordContainer/ForgetPasswordContainer";
import LoginContainer from "../LoginContainer/LoginContainer";
import SignupContainer from "../SignupContainer/SignupContainer";
import { useState } from "react";

export default function AuthModal({ defaultModal = "login" }) {
    const [modal, setModal] = useState(defaultModal);
    if (modal == "signup")
        return <SignupContainer setModal={setModal}></SignupContainer>;
    else if (modal == "login")
        return <LoginContainer setModal={setModal}></LoginContainer>;
    else if (modal == "forget-password"){
        return <ForgetPasswordContainer setModal={setModal}/>
    }
    else if (modal=="reset-password"){
        return <ResetPassword/>
    }
}
