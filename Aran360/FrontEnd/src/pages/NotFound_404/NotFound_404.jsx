import Button from "../../component/Button/Button";
import Header from "../../component/Header/Header";
import { useNavigate } from "react-router-dom";
import "./NotFound_404.css";
export default function NotFound_404() {
    const navigate = useNavigate();
    const goDashboard = async () => {
        await navigate("/dashboard");
    };
    return (
        <>
            <div style={{ height: "100px" }}>
                <Header />
            </div>
            <div id="notFound">
                <h1 className="found">404</h1>
                <h1>Not Found</h1>
                <p style={{ width: "min(535px, 100%)" }}>
                    The resource you are looking for has been moved, deleted, or
                    never existed. please verify the URL and try again.
                </p>
                <Button
                    onClick={async () => await goDashboard()}
                    icon="dashboard"
                >
                    Back to Dashboard
                </Button>
            </div>
        </>
    );
}
