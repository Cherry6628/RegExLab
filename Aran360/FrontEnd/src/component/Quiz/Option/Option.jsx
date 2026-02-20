import './Option.css';
export default function Option({id,children, name}){
    return(
        <label htmlFor={id} className="box">
            <p>{children}</p>
            <input id={id} name={name} type="radio" className='click'/>
        </label>
    );
}