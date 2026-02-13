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
            <Icon size="var(--large-size)" />

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
                                fontSize: "var(--normal-size)",
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
                                fontSize: "var(--small-size)",
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
