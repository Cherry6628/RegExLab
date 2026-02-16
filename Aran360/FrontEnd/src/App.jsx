import "./App.css";

import ContextProvider from "./modals/ContextProvider/ContextProvider";
import AuthPage from "./pages/AuthPage/AuthPage";
import {BrowserRouter, Routes, Route } from "react-router-dom";
import { frontendbasename } from "./utils/params";

// import Header from "./component/Header/Header";
// import XSSMaterial from "./component/LearningMaterials/XSSMaterial";
// import Quiz from "./component/Quiz/Quiz";
// import Sidebar from "./component/Sidebar/Sidebar";
// import ContextProvider from "./modals/ContextProvider/ContextProvider";
// import AuthPage from "./pages/AuthPage/AuthPage";
// import LearningPage from "./pages/LearningPage/LearningPage";
// import {BrowserRouter, Routes, Route } from "react-router-dom";
// import Main from "./component/LearningMaterials/XSS/XSSMain";
import XSSMain from "./component/LearningMaterials/XSS/XSSMain";
import Dashboard from "./pages/Dashboard/Dashboard";
export default function App() {
    return (
        <>
            <ContextProvider>
                <BrowserRouter basename={frontendbasename}>
                    <Routes>
                        <Route path="/learning-material/xss" element={<XSSMain/>}/>
                        <Route path="/accounts" element={<AuthPage/>}/>


                        <Route path="*" element={<Dashboard/>}/>
                    </Routes>
                </BrowserRouter>
            </ContextProvider>
        </>
    );
}
