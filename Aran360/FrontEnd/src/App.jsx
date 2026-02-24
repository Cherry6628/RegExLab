import "./App.css";
import ContextProvider from "./modals/ContextProvider/ContextProvider";
import { ToastProvider } from "./component/Toast/ToastContext";
import NavigationModal from "./modals/NavigationModal/NavigationModal";

export default function App() {
    return (
        <>
            <ContextProvider>
                <ToastProvider>
                    <NavigationModal />
                </ToastProvider>
            </ContextProvider>
        </>
    );
}
