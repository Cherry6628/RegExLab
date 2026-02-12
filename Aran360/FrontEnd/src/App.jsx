import "./App.css";
import Quiz from "./component/Quiz/Quiz";
import Sidebar from "./component/Sidebar/Sidebar";
import AuthModal from "./modals/AuthModal/AuthModal";
import AuthPage from "./pages/AuthPage/AuthPage";

export default function App() {
    return (
        <>
        {/* <div style={{display: "flex"}}>
                <Sidebar/>
                <Quiz></Quiz>
        </div> */}
            <AuthPage />
        </>
    );
}
