import { useEffect, useState } from "react";
import "./Toast.css";

export default function Toast({
    message,
    type = "info",
    duration = 3000,
    onClose,
}) {
    const [isVisible, setIsVisible] = useState(true);
    
    const iconMap = {
        error: "error",
        success: "check_circle",
        info: "info",
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleAnimationEnd = (e) => {
        if (!isVisible && e.animationName === "toastSlideUp") {
            onClose();
        }
    };

    return (
        <div
            className={`toast-container toast-${type} ${
                isVisible ? "slide-in" : "slide-out"
            }`}
            id="toast"
            onAnimationEnd={handleAnimationEnd}
        >
            <div className="toast-content">
                <span className="material-symbols-rounded toast-icon">
                    {iconMap[type]}
                </span>
                <p className="toast-message">{message}</p>
            </div>

            <div
                className="toast-progress"
                style={{ animationDuration: `${duration}ms` }}
            />
        </div>
    );
}
