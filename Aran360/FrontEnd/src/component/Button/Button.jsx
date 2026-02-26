import { useState } from "react";
import "./Button.css";
import Spinner from "../Spinner/Spinner";

export default function Button({
    children,
    icon,
    onClick,
    className = "",
    left = false,
    ...props
}) {
    const [clicked, setClicked] = useState(false);
    async function onClickHandler() {
        if (clicked) return;
        setClicked(true);
        await onClick();
        setClicked(false);
    }
    return (
        <button
            onClick={onClickHandler}
            className={`button-component ${className}`}
            {...props}
        >
            {left &&
                (clicked ? (
                    <Spinner size={16} />
                ) : (
                    icon && (
                        <span className="material-symbols-outlined">
                            {icon}
                        </span>
                    )
                ))}
            {children}
            {!left &&
                (clicked ? (
                    <Spinner size={16} />
                ) : (
                    icon && (
                        <span className="material-symbols-outlined">
                            {icon}
                        </span>
                    )
                ))}
        </button>
    );
}
