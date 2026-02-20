import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Redirect({path="/dashboard"}){
    const navigate = useNavigate();
    useEffect(
        ()=>navigate(path||"/dashboard"),[]
    )
}