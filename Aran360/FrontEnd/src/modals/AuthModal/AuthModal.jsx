import LoginContainer from "../LoginContainer/LoginContainer";
import SignupContainer from "../SignupContainer/SignupContainer";
import { useState } from "react";

export default function AuthModal({defaultModal="signup"}){
    const[modal,setModal]=useState(defaultModal);
    if(modal=="signup")
        return<SignupContainer setModal={setModal}></SignupContainer>
    else if (modal=="login")
        return <LoginContainer setModal={setModal}></LoginContainer>
}