import { useState } from 'react';
import './Sidebar.css';
import XSSMaterial from '../LearningMaterials/XSS/XSSMaterial';
import ReflectedXSSMaterial from "../LearningMaterials/XSS/ReflectedXSSMaterial";
import DOMBasedXSSMaterial from '../LearningMaterials/XSS/DOMBasedXSSMaterial';
import XSSContexts from '../LearningMaterials/XSS/XSSContexts';
import ExploitingXSSMaterial from '../LearningMaterials/XSS/ExploitingXSSMaterial';
import DanglingMarkupInjection from '../LearningMaterials/XSS/DanglingMarkupInjection';
import ContentSecurityPolicy from '../LearningMaterials/XSS/ContentSecurityPolicy';
import StoredXSSMaterial from '../LearningMaterials/XSS/StoredXSSMaterial';
import XSSAttacks from '../LearningMaterials/XSS/XSSAttacks';

const OWASP_DATA = [
  { name: 'What is XSS', comp: XSSMaterial},
  { name: 'How does XSS works?', comp: XSSMaterial, hash: "xss-works"},
  { name: 'Proof of Concept', comp: XSSMaterial, hash: "xss-poc"},
  { name: 'Impact of an attack', comp: XSSMaterial, hash: "xss-impact"},
  { name: 'Testing', comp: XSSMaterial, hash: "xss-test"},
  { name: 'Reflected XSS', comp: ReflectedXSSMaterial},
  { name: 'Stored XSS', comp: StoredXSSMaterial},
  { name: 'DOM-based XSS', comp: DOMBasedXSSMaterial},
  { name: 'XSS Contexts', comp: XSSContexts},
  { name: 'Exploiting XSS Vulnerabilities', comp: ExploitingXSSMaterial},
  { name: 'Dangling Markup Injection', comp: DanglingMarkupInjection},
  { name: 'Content Security Policy (CSP)', comp: ContentSecurityPolicy},
  { name: 'Preventing XSS Attacks', comp: XSSAttacks},
  { name: 'View All XSS Labs'},
];

const Sidebar = ({list}) => {
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