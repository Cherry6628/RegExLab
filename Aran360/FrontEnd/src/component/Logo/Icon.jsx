import { frontendbasename } from "../../utils/params"

export default function Icon({ size = "var(--large-size)" }) {
    return (
        <>
            <img src={frontendbasename+"static/Logo.png"} style={{height: "var(--extra-large-size)", width: "var(--extra-large-size)"}}></img>
        </>
    );
}
