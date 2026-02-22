import './Option.css';
export default function Option({id,children, name,value,checked,onChange}){
    return(
        <label htmlFor={id} className="box">
            <p>{children}</p>
            <input id={id} name={name} value={value} checked={checked} onChange={onChange} type="radio" className='click'/>
        </label>
    );
}