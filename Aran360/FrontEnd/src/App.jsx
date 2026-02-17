import "./App.css";
import ContextProvider from "./modals/ContextProvider/ContextProvider";
import AuthPage from "./pages/AuthPage/AuthPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { frontendbasename } from "./utils/params";
import XSSMain from "./component/LearningMaterials/XSS/XSSMain";
import Dashboard from "./pages/Dashboard/Dashboard";

import { ToastProvider } from "./component/Toast/ToastContext";

import QuizMain from "./component/Quiz/QuizMain";
import NotFound_404 from "./pages/NotFound_404/NotFound_404";
import QuizResult from "./component/Quiz/QuizResult";

export default function App() {
    return (
        <>
            <ContextProvider>
                <ToastProvider>
                    <BrowserRouter basename={frontendbasename}>
                        <Routes>
                        <Route path="/learning-material/xss" element={<XSSMain/>}/>
                        <Route path="/accounts" element={<AuthPage/>}/>
                        <Route path="/dashboard" element={<Dashboard/>}/>
                        <Route path="/test" element={<QuizMain/>}/>
                        <Route path="/result" element={<QuizResult/>}/>
                        <Route path="*" element={<NotFound_404/>}/>
                    </Routes>
                    </BrowserRouter>
                </ToastProvider>
            </ContextProvider>
        </>
    );
}
