import React, { useState } from 'react';
import './css/KubernetesSidebar.css';

const KubernetesSidebar = ({ onMenuClick }) => {
  const [expandedSections, setExpandedSections] = useState({
    cluster: true,
    workload: true
  });

  const kubernetesMenus = {
    cluster: {
      label: 'Cluster',
      subItems: ['node', 'namespace', 'event']
    },
    workload: {
      label: 'Workload',
      subItems: ['pods', 'deployments', 'services', 'configmaps', 'secrets']
    }
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  return (
    <div className="kubernetes-sidebar">
      <div className="sidebar-section">
        <button 
          className="section-header"
          onClick={() => toggleSection('cluster')}
        >
          <span className="section-title">Cluster</span>
          <span className={`expand-icon ${expandedSections.cluster ? 'expanded' : ''}`}>
            ▼
          </span>
        </button>
        <div className={`section-items ${expandedSections.cluster ? 'expanded' : 'collapsed'}`}>
          {kubernetesMenus.cluster.subItems.map((item, index) => (
            <button
              key={index}
              className="sidebar-item"
              onClick={() => onMenuClick(`kubernetes-cluster-${item}`)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      
      <div className="sidebar-section">
        <button 
          className="section-header"
          onClick={() => toggleSection('workload')}
        >
          <span className="section-title">Workload</span>
          <span className={`expand-icon ${expandedSections.workload ? 'expanded' : ''}`}>
            ▼
          </span>
        </button>
        <div className={`section-items ${expandedSections.workload ? 'expanded' : 'collapsed'}`}>
          {kubernetesMenus.workload.subItems.map((item, index) => (
            <button
              key={index}
              className="sidebar-item"
              onClick={() => onMenuClick(`kubernetes-workload-${item}`)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KubernetesSidebar; 