import './Lab.css';
import { Link } from "react-router-dom";
export default function Lab({link,children}){
    return(
        <div id='lab'>
            <div className="practice">
                <div className="leftColor">
                    <span className="material-symbols-outlined">experiment</span>LAB
                </div>
                <div className="rightColor">
                    <Link to={link} target="_blank" rel="noopener noreferrer" >{children}</Link>
                    <span className="material-symbols-outlined">trending_flat</span>
                </div>
            </div>
        </div>
    );
}