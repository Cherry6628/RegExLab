import { useState } from 'react';
import './Sidebar.css';

const OWASP_DATA = [
  { name: 'What is XSS'},
  { name: 'How does XSS works?'},
  { name: 'Impact of an attack'},
  { name: 'Proof of Concept'},
  { name: 'Testing'},
  { name: 'Reflected XSS'},
  { name: 'Stored XSS'},
  { name: 'DOM-based XSS'},
  { name: 'XSS Contexts'},
  { name: 'Exploiting XSS Vulnerabilities'},
  { name: 'Dangling Markup Injection'},
  { name: 'Content Security Policy (CSP)'},
  { name: 'Preventing XSS Attacks'},
  { name: 'View All XSS Labs'},
];

const Sidebar = () => {
  const [activeId, setActiveId] = useState('A03');

  return (<>
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {OWASP_DATA.map((item, index) => (
          <button
            key={index}
            className={`nav-item ${activeId === item.id ? 'active' : ''}`}
            onClick={() => setActiveId(item.id)}
          >
            {item.icon&&<span className="material-symbols-outlined icon">{item.icon}</span>}
            <span className="label">{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
    <div id="clear-sidebar-position"></div>
    </>
  );
};

export default Sidebar;