import { useNavigate } from "react-router-dom";

export default function Redirect({path="/dashboard"}){
    const navigate = useNavigate();
    navigate(path||"/dashboard");
}