
import './Sidebar.css';
const Sidebar = ({list={}, activeId, setActiveId}) => {
  return (<>
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {Object.keys(list).map((key, index)=>
          <button key={index}
          className={`nav-item ${activeId===key? 'active': ''}`}
          onClick={()=>{
            setActiveId(key);
            
          }}><label className='label'>{key}</label></button>
        )}
      </nav>
    </aside>
    <div id="clear-sidebar-position"></div>
    </>
  );
};

export default Sidebar;