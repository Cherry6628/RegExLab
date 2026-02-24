import "./Payloads.css";
export default function Payloads({ children }) {
    return (
        <div id="payloads">
            <div className="code">
                <p>{children}</p>
            </div>
        </div>
    );
}
