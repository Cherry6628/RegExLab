import React from "react";
import Icon from "./Icon.jsx";

export default function Logo({ showTitle = true, showTagline = true }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                userSelect: "none",
            }}
        >
            <Icon size="40px" />

            {(showTagline || showTitle) && (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        lineHeight: "1.1",
                    }}
                >
                    {showTitle && (
                        <span
                            style={{
                                fontSize: "22px",
                                fontWeight: "800",
                                color: "var(--text-main)",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            Aran&nbsp;360
                        </span>
                    )}

                    {showTagline && (
                        <span
                            style={{
                                fontSize: "12px",
                                fontWeight: "600",
                                color: "var(--text-dim)",
                                opacity: "0.8",
                            }}
                        >
                            The Art of Digital Defense
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
