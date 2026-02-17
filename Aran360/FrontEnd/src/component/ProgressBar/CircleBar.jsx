import './CircleBar.css';
import { useState, useEffect } from "react";
export default function CircularBar(){
    const[progress,setProgress] = useState(0);
    useEffect(()=>{
        const interval = setInterval(()=>{
            setProgress((prev)=>{
               if(prev >= 60){
                clearInterval(interval);
                return 60;
               }
               return prev+2;
            })
        },40);
        return ()=>clearInterval(interval);
    },[]);
    const radius = 60;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    return(
        <div id='circle'>
            <svg width="150" height="150">
                <circle
                    cx="75"
                    cy="75"
                    r={radius}
                    stroke="#eee"
                    strokeWidth={strokeWidth}
                    fill="transparent"/>
                <circle
                    cx="75"
                    cy="75"
                    r={radius}
                    stroke="dodgerblue"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 75 75)"/>
            </svg>
            <div className="progress">{progress}%</div>
        </div>
    );
}