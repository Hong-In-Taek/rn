import React, { useState } from 'react';
import './css/KubernetesConfigMaps.css';

const KubernetesConfigMaps = () => {
  const [selectedConfigMaps, setSelectedConfigMaps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNamespace, setSelectedNamespace] = useState('all');

  // ConfigMap 데이터
  const configMaps = [
    {
      id: '1',
      name: 'nginx-config',
      namespace: 'default',
      data: 3,
      age: '2h',
      created: '2024-01-15 10:30:00'
    },
    {
      id: '2',
      name: 'mongo-config',
      namespace: 'default',
      data: 2,
      age: '30m',
      created: '2024-01-15 12:00:00'
    },
    {
      id: '3',
      name: 'kube-root-ca.crt',
      namespace: 'default',
      data: 1,
      age: '2d',
      created: '2024-01-13 10:00:00'
    },
    {
      id: '4',
      name: 'prometheus-config',
      namespace: 'monitoring',
      data: 5,
      age: '1d',
      created: '2024-01-14 15:30:00'
    },
    {
      id: '5',
      name: 'grafana-config',
      namespace: 'monitoring',
      data: 4,
      age: '1d',
      created: '2024-01-14 15:35:00'
    },
    {
      id: '6',
      name: 'ingress-nginx-config',
      namespace: 'ingress-nginx',
      data: 2,
      age: '1d',
      created: '2024-01-14 16:00:00'
    }
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedConfigMaps(configMaps.map(c => c.id));
    } else {
      setSelectedConfigMaps([]);
    }
  };

  const handleSelectConfigMap = (configMapId, checked) => {
    if (checked) {
      setSelectedConfigMaps([...selectedConfigMaps, configMapId]);
    } else {
      setSelectedConfigMaps(selectedConfigMaps.filter(id => id !== configMapId));
    }
  };

  // 사용 가능한 namespace 목록
  const availableNamespaces = ['all', ...new Set(configMaps.map(configMap => configMap.namespace))];

  const filteredConfigMaps = configMaps.filter(configMap => {
    const matchesSearch = configMap.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         configMap.namespace.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesNamespace = selectedNamespace === 'all' || configMap.namespace === selectedNamespace;
    
    return matchesSearch && matchesNamespace;
  });

  return (
    <div className="kubernetes-configmaps">
      {/* Header */}
      <div className="configmaps-header">
        <h2>ConfigMaps</h2>

        {/* Search and Options */}
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search configmaps..."
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
        <table className="configmaps-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedConfigMaps.length === configMaps.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>Name</th>
              <th>Quick actions</th>
              <th>Data</th>
              <th>Age</th>
              <th>Namespace</th>
            </tr>
          </thead>
          <tbody>
            {filteredConfigMaps.map((configMap) => (
              <tr key={configMap.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedConfigMaps.includes(configMap.id)}
                    onChange={(e) => handleSelectConfigMap(configMap.id, e.target.checked)}
                  />
                </td>
                <td className="configmap-name">{configMap.name}</td>
                <td>
                  <div className="quick-actions">
                    <button className="action-btn" title="Edit">
                      ✏️
                    </button>
                    <button className="action-btn" title="Describe">
                      📄
                    </button>
                    <button className="action-btn" title="Delete">
                      🗑
                    </button>
                  </div>
                </td>
                <td>
                  <span className="data-count">
                    {configMap.data}
                  </span>
                </td>
                <td className="age">{configMap.age}</td>
                <td className="namespace">{configMap.namespace}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredConfigMaps.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">⚙️</div>
          <h3>No configmaps found</h3>
          <p>Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default KubernetesConfigMaps; 