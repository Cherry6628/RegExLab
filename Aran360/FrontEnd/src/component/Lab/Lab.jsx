import './Lab.css';
export default function Lab({children}){
    return(
        <div id='lab'>
            <div class="practice">
                <div class="leftColor">
                    <span class="material-symbols-outlined">experiment</span>LAB
                </div>
                <div class="rightColor">
                    <p>{children}</p>
                    <span class="material-symbols-outlined">trending_flat</span>
                </div>
            </div>
        </div>
    );
}