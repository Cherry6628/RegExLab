import { useEffect, useState } from 'react';
import './ProgressBar.css';
export default function ProgressBar({answer}){
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
    return(
        <>
            <div className='answerType'>
                <div>{answer}</div>
                <div>{progress}%</div>
            </div>
            <div id='bar'>
                <div className='progress' style={{ width: `${progress}%` }}></div>
            </div>
        </>
    );
}