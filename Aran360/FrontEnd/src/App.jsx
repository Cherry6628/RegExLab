import "./App.css";
import ContextProvider from "./modals/ContextProvider/ContextProvider";
import AuthPage from "./pages/AuthPage/AuthPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { frontendbasename } from "./utils/params";
import XSSMain from "./component/LearningMaterials/XSS/XSSMain";
import Dashboard from "./pages/Dashboard/Dashboard";
import { ToastProvider } from "./component/Toast/ToastContext";
export default function App() {
    return (
        <>
            <ContextProvider>
                <ToastProvider>
                    <BrowserRouter basename={frontendbasename}>
                        <Routes>
                            <Route
                                path="/learning-material/xss"
                                element={<XSSMain />}
                            />
                            <Route path="/accounts" element={<AuthPage />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="*" element={<Dashboard />} />
                        </Routes>
                    </BrowserRouter>
                </ToastProvider>
            </ContextProvider>
        </>
    );
}
