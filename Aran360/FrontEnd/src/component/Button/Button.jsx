import "./Button.css";

export default function Button({
    children,
    icon,
    onClick,
    className = "",
    ...props
}) {
    return (
        <button
            onClick={onClick}
            className={`button-component ${className}`}
            {...props}
        >
            {children}
            {icon && <span className="material-symbols-outlined">{icon}</span>}
        </button>
    );
}
