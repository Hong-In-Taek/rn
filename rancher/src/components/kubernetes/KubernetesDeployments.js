import React, { useState } from 'react';
import './css/KubernetesDeployments.css';

const KubernetesDeployments = () => {
  const [selectedDeployments, setSelectedDeployments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNamespace, setSelectedNamespace] = useState('all');

  // Deployment 데이터
  const deployments = [
    {
      id: '1',
      name: 'nginx-deployment',
      namespace: 'default',
      status: 'Available',
      ready: '2/2',
      upToDate: 2,
      available: 2,
      age: '2h',
      created: '2024-01-15 10:30:00'
    },
    {
      id: '2',
      name: 'mongo-deployment',
      namespace: 'default',
      status: 'Progressing',
      ready: '0/3',
      upToDate: 0,
      available: 0,
      age: '30m',
      created: '2024-01-15 12:00:00'
    },
    {
      id: '3',
      name: 'redis-deployment',
      namespace: 'default',
      status: 'Failed',
      ready: '0/1',
      upToDate: 0,
      available: 0,
      age: '1h',
      created: '2024-01-15 11:00:00'
    },
    {
      id: '4',
      name: 'prometheus-server',
      namespace: 'monitoring',
      status: 'Available',
      ready: '1/1',
      upToDate: 1,
      available: 1,
      age: '1d',
      created: '2024-01-14 15:30:00'
    },
    {
      id: '5',
      name: 'grafana',
      namespace: 'monitoring',
      status: 'Available',
      ready: '1/1',
      upToDate: 1,
      available: 1,
      age: '1d',
      created: '2024-01-14 15:35:00'
    },
    {
      id: '6',
      name: 'ingress-nginx-controller',
      namespace: 'ingress-nginx',
      status: 'Available',
      ready: '1/1',
      upToDate: 1,
      available: 1,
      age: '1d',
      created: '2024-01-14 16:00:00'
    }
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedDeployments(deployments.map(d => d.id));
    } else {
      setSelectedDeployments([]);
    }
  };

  const handleSelectDeployment = (deploymentId, checked) => {
    if (checked) {
      setSelectedDeployments([...selectedDeployments, deploymentId]);
    } else {
      setSelectedDeployments(selectedDeployments.filter(id => id !== deploymentId));
    }
  };

  // 사용 가능한 namespace 목록
  const availableNamespaces = ['all', ...new Set(deployments.map(deployment => deployment.namespace))];

  const filteredDeployments = deployments.filter(deployment => {
    const matchesSearch = deployment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deployment.namespace.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deployment.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesNamespace = selectedNamespace === 'all' || deployment.namespace === selectedNamespace;
    
    return matchesSearch && matchesNamespace;
  });

  return (
    <div className="kubernetes-deployments">
      {/* Header */}
      <div className="deployments-header">
        <h2>Deployments</h2>

        {/* Search and Options */}
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search deployments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="options">
            <button className="option-btn">
              <span className="option-icon">📊</span>
              Columns
            </button>
            <button className="option-btn">
              <span className="option-icon">⚙</span>
              Settings
            </button>
          </div>
        </div>

        {/* Namespace Filter */}
        <div className="namespace-filter-section">
          <div className="namespace-filter">
            <label htmlFor="namespace-select">Namespace:</label>
            <select
              id="namespace-select"
              value={selectedNamespace}
              onChange={(e) => setSelectedNamespace(e.target.value)}
            >
              {availableNamespaces.map(namespace => (
                <option key={namespace} value={namespace}>
                  {namespace === 'all' ? 'All Namespaces' : namespace}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="deployments-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedDeployments.length === deployments.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>Name</th>
              <th>
                Status
                <span className="sort-icon">↕</span>
                <span className="filter-icon">🔽</span>
              </th>
              <th>Quick actions</th>
              <th>Ready</th>
              <th>Up-to-date</th>
              <th>Available</th>
              <th>Age</th>
              <th>Namespace</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeployments.map((deployment) => (
              <tr key={deployment.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedDeployments.includes(deployment.id)}
                    onChange={(e) => handleSelectDeployment(deployment.id, e.target.checked)}
                  />
                </td>
                <td className="deployment-name">{deployment.name}</td>
                <td>
                  <span className={`status-badge ${deployment.status.toLowerCase()}`}>
                    {deployment.status}
                  </span>
                </td>
                <td>
                  <div className="quick-actions">
                    <button className="action-btn" title="Edit">
                      ✏️
                    </button>
                    <button className="action-btn" title="Scale">
                      📊
                    </button>
                    <button className="action-btn" title="Delete">
                      🗑
                    </button>
                  </div>
                </td>
                <td className="ready-count">{deployment.ready}</td>
                <td className="up-to-date">{deployment.upToDate}</td>
                <td className="available">{deployment.available}</td>
                <td className="age">{deployment.age}</td>
                <td className="namespace">{deployment.namespace}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredDeployments.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🚀</div>
          <h3>No deployments found</h3>
          <p>Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default KubernetesDeployments; 