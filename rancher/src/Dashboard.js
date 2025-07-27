import React, { useState } from 'react';
import DockerDashboard from './components/docker/DockerDashboard';
import DockerContainers from './components/docker/DockerContainers';
import DockerImages from './components/docker/DockerImages';
import DockerVolumes from './components/docker/DockerVolumes';
import KubernetesSidebar from './components/kubernetes/KubernetesSidebar';
import KubernetesNode from './components/kubernetes/KubernetesNode';
import KubernetesNamespace from './components/kubernetes/KubernetesNamespace';
import KubernetesEvent from './components/kubernetes/KubernetesEvent';
import KubernetesPods from './components/kubernetes/KubernetesPods';
import KubernetesDeployments from './components/kubernetes/KubernetesDeployments';
import KubernetesServices from './components/kubernetes/KubernetesServices';
import KubernetesConfigMaps from './components/kubernetes/KubernetesConfigMaps';
import KubernetesSecrets from './components/kubernetes/KubernetesSecrets';
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

  // 새로운 메뉴 구조
  const menuItems = {
    home: {
      icon: '🏠',
      label: 'Home',
      type: 'main'
    },
    docker: {
      icon: '🐳',
      label: 'Docker',
      type: 'cluster',
      subItems: ['dashboard', 'containers', 'images', 'volumes', 'networks']
    },
    kubernetes: {
      icon: '⚓',
      label: 'Kubernetes',
      type: 'cluster',
      subMenus: {
        cluster: {
          label: 'Cluster',
          subItems: ['node', 'namespace', 'event']
        },
        workload: {
          label: 'Workload',
          subItems: ['pods', 'deployments', 'services', 'configmaps', 'secrets']
        }
      }
    }
  };

  const handleMenuClick = (menuKey) => {
    if (menuKey === 'home') {
      setActiveTab('home');
      setRightSidebar(null);
      return;
    }
    
    if (menuKey === 'docker') {
      setActiveTab('docker');
      setRightSidebar('docker');
      return;
    }
    
    if (menuKey === 'kubernetes') {
      setActiveTab('kubernetes');
      setRightSidebar('kubernetes');
      return;
    }
  };

  const handleSidebarMenuClick = (menuKey) => {
    setActiveTab(menuKey);
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

  const renderContent = () => {
    switch (activeTab) {
      case 'docker-dashboard':
        return <DockerDashboard />;
      case 'docker-containers':
        return <DockerContainers />;
      case 'docker-images':
        return <DockerImages />;
      case 'docker-volumes':
        return <DockerVolumes />;
      case 'docker-networks':
        return <div>Docker Networks - Coming Soon</div>;
      case 'kubernetes-cluster-node':
        return <KubernetesNode />;
      case 'kubernetes-cluster-namespace':
        return <KubernetesNamespace />;
      case 'kubernetes-cluster-event':
        return <KubernetesEvent />;
      case 'kubernetes-workload-pods':
        return <KubernetesPods />;
      case 'kubernetes-workload-deployments':
        return <KubernetesDeployments />;
      case 'kubernetes-workload-services':
        return <KubernetesServices />;
      case 'kubernetes-workload-configmaps':
        return <KubernetesConfigMaps />;
      case 'kubernetes-workload-secrets':
        return <KubernetesSecrets />;
      default:
        return renderTable();
    }
  };

  const getContentTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'Dashboard';
      case 'docker-dashboard':
        return 'Docker Dashboard';
      case 'docker-containers':
        return 'Docker Containers';
      case 'docker-images':
        return 'Docker Images';
      case 'docker-volumes':
        return 'Docker Volumes';
      case 'docker-networks':
        return 'Docker Networks';
      case 'docker':
        return 'Docker';
      case 'kubernetes':
        return 'Kubernetes Cluster';
      case 'kubernetes-cluster-node':
        return 'Kubernetes Nodes';
      case 'kubernetes-cluster-namespace':
        return 'Kubernetes Namespaces';
      case 'kubernetes-cluster-event':
        return 'Kubernetes Events';
      case 'kubernetes-workload-pods':
        return 'Kubernetes Pods';
      case 'kubernetes-workload-deployments':
        return 'Kubernetes Deployments';
      case 'kubernetes-workload-services':
        return 'Kubernetes Services';
      case 'kubernetes-workload-configmaps':
        return 'Kubernetes ConfigMaps';
      case 'kubernetes-workload-secrets':
        return 'Kubernetes Secrets';
      default:
        return activeTab;
    }
  };

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
                title={menu.label}
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
              <h3>
                {rightSidebar === 'kubernetes' 
                  ? 'Kubernetes'
                  : menuItems[rightSidebar].label
                }
              </h3>
              <button 
                className="close-sidebar"
                onClick={() => setRightSidebar(null)}
              >
                ×
              </button>
            </div>
            <nav className="right-sidebar-nav">
              {rightSidebar === 'kubernetes' ? (
                <KubernetesSidebar onMenuClick={handleSidebarMenuClick} />
              ) : (
                menuItems[rightSidebar].subItems.map((subItem, index) => (
                  <button
                    key={index}
                    className="right-nav-item"
                    onClick={() => handleSidebarMenuClick(`${rightSidebar}-${subItem}`)}
                  >
                    {subItem}
                  </button>
                ))
              )}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="main-content">
          <div className="content-header">
            <h2>{getContentTitle()}</h2>
          </div>
          <div className="content-body">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 