import { useEffect, useState } from 'react';
import './ProgressBar.css';
export default function ProgressBar({progress}){
    const[progress,setProgress] = useState(0);
    useEffect(()=>{
        const interval = setInterval(()=>{
            setProgress((prev)=>{
               if(prev >= 100){
                clearInterval(interval);
                return 100;
               }
               return prev+1;
            })
        },30);
        return ()=>clearInterval(interval);
    },[]);
    return(
        <div id='bar'>
            <div className='progress' style={{ width: `${progress}%` }}></div>
        </div>
    );
}