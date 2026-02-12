import "./Button.css";
export default function Button({ children, icon, onClick, className }) {
  return (
    <button onClick={onClick} className={className}>
      {children}
      {icon && <span className="material-symbols-outlined">{icon}</span>}
    </button>
  );
}