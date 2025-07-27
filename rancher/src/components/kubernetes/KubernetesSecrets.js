import React, { useState } from 'react';
import './css/KubernetesSecrets.css';

const KubernetesSecrets = () => {
  const [selectedSecrets, setSelectedSecrets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNamespace, setSelectedNamespace] = useState('all');

  // Secret 데이터
  const secrets = [
    {
      id: '1',
      name: 'nginx-secret',
      namespace: 'default',
      type: 'Opaque',
      data: 2,
      age: '2h',
      created: '2024-01-15 10:30:00'
    },
    {
      id: '2',
      name: 'mongo-secret',
      namespace: 'default',
      type: 'Opaque',
      data: 2,
      age: '30m',
      created: '2024-01-15 12:00:00'
    },
    {
      id: '3',
      name: 'default-token-abc12',
      namespace: 'default',
      type: 'kubernetes.io/service-account-token',
      data: 3,
      age: '2d',
      created: '2024-01-13 10:00:00'
    },
    {
      id: '4',
      name: 'prometheus-secret',
      namespace: 'monitoring',
      type: 'Opaque',
      data: 3,
      age: '1d',
      created: '2024-01-14 15:30:00'
    },
    {
      id: '5',
      name: 'grafana-secret',
      namespace: 'monitoring',
      type: 'Opaque',
      data: 2,
      age: '1d',
      created: '2024-01-14 15:35:00'
    },
    {
      id: '6',
      name: 'ingress-nginx-tls',
      namespace: 'ingress-nginx',
      type: 'kubernetes.io/tls',
      data: 2,
      age: '1d',
      created: '2024-01-14 16:00:00'
    }
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedSecrets(secrets.map(s => s.id));
    } else {
      setSelectedSecrets([]);
    }
  };

  const handleSelectSecret = (secretId, checked) => {
    if (checked) {
      setSelectedSecrets([...selectedSecrets, secretId]);
    } else {
      setSelectedSecrets(selectedSecrets.filter(id => id !== secretId));
    }
  };

  // 사용 가능한 namespace 목록
  const availableNamespaces = ['all', ...new Set(secrets.map(secret => secret.namespace))];

  const filteredSecrets = secrets.filter(secret => {
    const matchesSearch = secret.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         secret.namespace.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         secret.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesNamespace = selectedNamespace === 'all' || secret.namespace === selectedNamespace;
    
    return matchesSearch && matchesNamespace;
  });

  return (
    <div className="kubernetes-secrets">
      {/* Header */}
      <div className="secrets-header">
        <h2>Secrets</h2>

        {/* Search and Options */}
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search secrets..."
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
        <table className="secrets-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedSecrets.length === secrets.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>Name</th>
              <th>
                Type
                <span className="sort-icon">↕</span>
                <span className="filter-icon">🔽</span>
              </th>
              <th>Quick actions</th>
              <th>Data</th>
              <th>Age</th>
              <th>Namespace</th>
            </tr>
          </thead>
          <tbody>
            {filteredSecrets.map((secret) => (
              <tr key={secret.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedSecrets.includes(secret.id)}
                    onChange={(e) => handleSelectSecret(secret.id, e.target.checked)}
                  />
                </td>
                <td className="secret-name">{secret.name}</td>
                <td>
                  <span className={`type-badge ${secret.type.replace(/[^a-zA-Z]/g, '-').toLowerCase()}`}>
                    {secret.type}
                  </span>
                </td>
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
                    {secret.data}
                  </span>
                </td>
                <td className="age">{secret.age}</td>
                <td className="namespace">{secret.namespace}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredSecrets.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔒</div>
          <h3>No secrets found</h3>
          <p>Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default KubernetesSecrets; 