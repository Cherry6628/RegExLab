import "./Option.css";
export default function Option({
    id,
    children,
    name,
    value,
    checked,
    onChange,
}) {
    const addSpace = (text, ch)=>text.replaceAll(ch, "\u200B"+ch);
    children = addSpace(children, ".");
    children = addSpace(children, "(");
    children = addSpace(children, "-");
    return (
        <label htmlFor={id} className="box">
            <p>{children}</p>
            <input
                id={id}
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                type="radio"
                className="click"
            />
        </label>
    );
}
