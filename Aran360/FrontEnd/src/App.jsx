import "./App.css";
import Header from "./component/Header/Header";
import XSSMaterial from "./component/LearningMaterials/XSSMaterial";
import Quiz from "./component/Quiz/Quiz";
import Sidebar from "./component/Sidebar/Sidebar";
import AuthModal from "./modals/AuthModal/AuthModal";
import ContextProvider from "./modals/ContextProvider/ContextProvider";
import AuthPage from "./pages/AuthPage/AuthPage";
import LearningPage from "./pages/LearningPage/LearningPage";
import {BrowserRouter, Routes, Route } from "react-router-dom";
import { basename } from "./utils/params";
import Main from "./component/LearningMaterials/XSS/XSSMain";
import XSSMain from "./component/LearningMaterials/XSS/XSSMain";
export default function App() {
    return (
        <>
            <ContextProvider>
                <BrowserRouter basename={basename}>
                    <Routes>
                        <Route path="/xss" element={<XSSMain/>}/>
                        <Route path="/accounts" element={<AuthPage/>}/>
                    </Routes>
                </BrowserRouter>
            </ContextProvider>
        </>
    );
}
