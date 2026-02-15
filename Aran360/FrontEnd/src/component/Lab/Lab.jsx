import './Lab.css';
export default function Lab({children}){
    return(
        <div id='lab'>
            <div className="practice">
                <div className="leftColor">
                    <span className="material-symbols-outlined">experiment</span>LAB
                </div>
                <div className="rightColor">
                    <p>{children}</p>
                    <span className="material-symbols-outlined">trending_flat</span>
                </div>
            </div>
        </div>
    );
}