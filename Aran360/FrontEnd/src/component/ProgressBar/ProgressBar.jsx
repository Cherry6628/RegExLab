import { useEffect, useState } from "react";
import "./ProgressBar.css";
export default function ProgressBar({ answer, value, isPass }) {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        setProgress(0);
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= value) {
                    clearInterval(interval);
                    return value;
                }
                return prev + 2;
            });
        }, 40);
        return () => clearInterval(interval);
    }, [value]);
    let color = isPass ? "var(--action-color)" : "var(--text-dim)";
    return (
        <>
            <div className="answerType">
                <div>{answer}</div>
                <div>{progress.toFixed(1)}%</div>
            </div>
            <div id="bar">
                <div
                    className="progress"
                    style={{ width: `${progress}%`, backgroundColor: color }}
                ></div>
            </div>
        </>
    );
}
