import LoginContainer from "../LoginContainer/LoginContainer";
import SignupContainer from "../SignupContainer/SignupContainer";
import { useState } from "react";

export default function AuthModal({ defaultModal = "login" }) {
    const hash = location.hash.slice(1);
    const [modal, setModal] = useState(defaultModal);
    if (hash == "signup" || hash == "login") setModal(hash);
    if (modal == "signup")
        return <SignupContainer setModal={setModal}></SignupContainer>;
    else if (modal == "login")
        return <LoginContainer setModal={setModal}></LoginContainer>;
}
