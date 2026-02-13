import "./App.css";
import Header from "./component/Header/Header";
import XSSMaterial from "./component/LearningMaterials/XSSMaterial";
import Quiz from "./component/Quiz/Quiz";
import Sidebar from "./component/Sidebar/Sidebar";
import AuthModal from "./modals/AuthModal/AuthModal";
import ContextProvider from "./modals/ContextProvider/ContextProvider";
import AuthPage from "./pages/AuthPage/AuthPage";
import LearningPage from "./pages/LearningPage/LearningPage";

export default function App() {
    return (
        <>
            <ContextProvider></ContextProvider>
        </>
    );
}
