export default function Icon({ size = "44px" }) {
    return (
        <span
            className="material-symbols-outlined"
            style={{
                color: "var(--action-color)",
                fontSize: "var(--large-size)",
            }}
        >
            frame_bug
        </span>
    );
}
