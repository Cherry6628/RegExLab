import "./Button.css";

export default function Button({
  children,
  icon,
  onClick,
  className = "",
  left = false,
  ...props
}) {
  return (
    <button
      onClick={onClick}
      className={`button-component ${className}`}
      {...props}
    >
      {left && icon && (
        <span className="material-symbols-outlined">{icon}</span>
      )}
      {children}
      {!left && icon && (
        <span className="material-symbols-outlined">{icon}</span>
      )}
    </button>
  );
}
