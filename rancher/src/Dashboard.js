import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [rightSidebar, setRightSidebar] = useState(null);

  const clusterData = [
    {
      status: 'ACTIVE',
      name: 'Docker',
      provider: 'Docker',
      version: '1.19',
      cpu: '8',
      mem: '16',
      containers: '5'
    },
    {
      status: 'ACTIVE',
      name: 'Kube',
      provider: 'Kubernetes',
      version: '1.30',
      cpu: '16',
      mem: '126',
      containers: '6/10'
    }
  ];

  const menuItems = {
    home: {
      icon: '🏠',
      label: 'Home',
      subItems: []
    },
    cluster: {
      icon: '🏢',
      label: 'cluster',
      subItems: ['namespace', 'node', 'event']
    },
    docker: {
      icon: '🐳',
      label: 'Docker',
      subItems: ['containers', 'images', 'volumes', 'networks']
    },
    kubernetes: {
      icon: '⚓',
      label: 'workload',
      subItems: ['pods', 'deployments', 'services', 'configmaps', 'secrets']
    }
  };

  const handleMenuClick = (menuKey) => {
    if (menuKey === 'home') {
      setActiveTab('home');
      setRightSidebar(null);
      return;
    }
    
    setActiveTab(menuKey);
    setRightSidebar(menuKey);
  };

  const renderTable = () => (
    <div className="table-container">
      <table className="cluster-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Name</th>
            <th>Provider</th>
            <th>Version</th>
            <th>CPU</th>
            <th>MEM</th>
            <th>컨테이너/POD</th>
          </tr>
        </thead>
        <tbody>
          {clusterData.map((cluster, index) => (
            <tr key={index}>
              <td>
                <span className={`status ${cluster.status.toLowerCase()}`}>
                  {cluster.status}
                </span>
              </td>
              <td>{cluster.name}</td>
              <td>{cluster.provider}</td>
              <td>{cluster.version}</td>
              <td>{cluster.cpu}</td>
              <td>{cluster.mem}</td>
              <td>{cluster.containers}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>컨테이너 통합 관리 포탈</h1>
          <button className="logout-button" onClick={onLogout}>
            로그아웃
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            {Object.entries(menuItems).map(([key, menu]) => (
              <button
                key={key}
                className={`nav-item ${activeTab === key ? 'active' : ''}`}
                onClick={() => handleMenuClick(key)}
              >
                <div className="nav-icon">{menu.icon}</div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Right Sidebar */}
        {rightSidebar && (
          <aside className="right-sidebar">
            <div className="right-sidebar-header">
              <h3>{menuItems[rightSidebar].label}</h3>
              <button 
                className="close-sidebar"
                onClick={() => setRightSidebar(null)}
              >
                ×
              </button>
            </div>
            <nav className="right-sidebar-nav">
              {menuItems[rightSidebar].subItems.map((subItem, index) => (
                <button
                  key={index}
                  className="right-nav-item"
                  onClick={() => setActiveTab(`${rightSidebar}-${subItem}`)}
                >
                  {subItem}
                </button>
              ))}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="main-content">
          <div className="content-header">
            <h2>Cluster 2</h2>
          </div>
          <div className="content-body">
            {renderTable()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 