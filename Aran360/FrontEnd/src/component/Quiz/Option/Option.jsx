import './Option.css';
export default function Option({children, name}){
    return(
        <div className="box">
            <p>{children}</p>
            <input name={name} type="radio" className='click'/>
        </div>
    );
}