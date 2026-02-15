import "./Sidebar.css";

const Sidebar = ({ list = {}, activeId, setActiveId }) => {
    const handleNavigation = (key) => {
        const item = list[key];
        if (item.url) {
            window.location.href = item.url;
            return;
        }
        setActiveId(key);
        if (item.hash) {
            setTimeout(() => {
                const element = document.getElementById(item.hash);
                if (element) element.scrollIntoView();
            }, 0);
        } else window.scrollTo(0, 0);
    };
    return (
        <>
            <aside className="sidebar">
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
