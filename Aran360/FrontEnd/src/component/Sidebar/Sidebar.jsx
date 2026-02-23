import { useState } from "react";
import "./Sidebar.css";

const Sidebar = ({ list = {}, activeId, setActiveId }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleNavigation = (key) => {
        const item = list[key];
        if (item.url) {
            window.location.href = item.url;
            return;
        }
        setActiveId(key);
        setIsExpanded(false);

        if (item.hash) {
            setTimeout(() => {
                const element = document.getElementById(item.hash);
                if (element) element.scrollIntoView();
            }, 0);
        } else window.scrollTo(0, 0);
    };
    return (
        <>
            <div
                className={`mobile-toggle-bar ${isExpanded ? "hidden" : ""}`}
                onClick={() => setIsExpanded(true)}
            >
                <span className="menu-text">» Menu</span>
            </div>

            <aside className={`sidebar ${isExpanded ? "expanded" : ""}`}>
                <div className="sidebar-header-mobile">
                    <button
                        className="close-btn"
                        onClick={() => setIsExpanded(false)}
                    >
                        ✕
                    </button>
                </div>
                <nav className="sidebar-nav">
                    {Object.keys(list).map((key, index) => (
                        <button
                            key={index}
                            className={`nav-item ${activeId === key ? "active" : ""}`}
                            onClick={() => handleNavigation(key)}
                        >
                            <label className="label">{key}</label>
                        </button>
                    ))}
                </nav>
            </aside>
            <div id="clear-sidebar-position"></div>
        </>
    );
};

export default Sidebar;
