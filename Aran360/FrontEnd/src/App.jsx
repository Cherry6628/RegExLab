import "./App.css";
import ContextProvider from "./modals/ContextProvider/ContextProvider";
import AuthPage from "./pages/AuthPage/AuthPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { frontendbasename } from "./utils/params";
// import XSSMain from "./component/LearningMaterials/XSS/XSSMain";
import Dashboard from "./pages/Dashboard/Dashboard";

import { ToastProvider } from "./component/Toast/ToastContext";

import QuizMain from "./component/Quiz/QuizMain";
import NotFound_404 from "./pages/NotFound_404/NotFound_404";
import QuizResult from "./component/Quiz/QuizResult";
import NavigationModal from "./modals/NavigationModal/NavigationModal";

export default function App() {
  return (
    <>
      <ContextProvider>
        <ToastProvider>
          <NavigationModal/>
        </ToastProvider>
      </ContextProvider>
    </>
  );
}
