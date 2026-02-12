import { useState } from 'react';
import './Sidebar.css';
import Logo from '../Logo/Logo';

const OWASP_DATA = [
  { id: 'A01', name: 'Access Control', icon: 'shield' },
  { id: 'A02', name: 'Crypto Failures', icon: 'key' },
  { id: 'A03', name: 'Injection', icon: 'terminal' },
  { id: 'A04', name: 'Insecure Design', icon: 'palette' },
  { id: 'A05', name: 'Security Misconfig', icon: 'settings' },
  { id: 'A06', name: 'Vulnerable Comp.', icon: 'bug_report' },
];

const Sidebar = () => {
  const [activeId, setActiveId] = useState('A03');

  return (
    <aside className="sidebar">

      <nav className="sidebar-nav">
        {OWASP_DATA.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeId === item.id ? 'active' : ''}`}
            onClick={() => setActiveId(item.id)}
          >
            <span className="material-symbols-outlined icon">{item.icon}</span>
            <span className="label">{item.id}: {item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;