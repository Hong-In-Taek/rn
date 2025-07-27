import React, { useState } from 'react';
import './css/KubernetesNamespace.css';

const KubernetesNamespace = () => {
  const [selectedNamespaces, setSelectedNamespaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 네임스페이스 데이터
  const namespaces = [
    {
      id: '1',
      name: 'default',
      status: 'Active',
      age: '2d',
      pods: 5,
      services: 3,
      deployments: 2,
      created: '2024-01-13 10:00:00'
    },
    {
      id: '2',
      name: 'kube-system',
      status: 'Active',
      age: '2d',
      pods: 8,
      services: 5,
      deployments: 4,
      created: '2024-01-13 10:00:00'
    },
    {
      id: '3',
      name: 'kube-public',
      status: 'Active',
      age: '2d',
      pods: 0,
      services: 0,
      deployments: 0,
      created: '2024-01-13 10:00:00'
    },
    {
      id: '4',
      name: 'kube-node-lease',
      status: 'Active',
      age: '2d',
      pods: 0,
      services: 0,
      deployments: 0,
      created: '2024-01-13 10:00:00'
    },
    {
      id: '5',
      name: 'monitoring',
      status: 'Active',
      age: '1d',
      pods: 12,
      services: 8,
      deployments: 6,
      created: '2024-01-14 15:30:00'
    },
    {
      id: '6',
      name: 'ingress-nginx',
      status: 'Active',
      age: '1d',
      pods: 3,
      services: 2,
      deployments: 1,
      created: '2024-01-14 16:00:00'
    }
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedNamespaces(namespaces.map(n => n.id));
    } else {
      setSelectedNamespaces([]);
    }
  };

  const handleSelectNamespace = (namespaceId, checked) => {
    if (checked) {
      setSelectedNamespaces([...selectedNamespaces, namespaceId]);
    } else {
      setSelectedNamespaces(selectedNamespaces.filter(id => id !== namespaceId));
    }
  };

  const filteredNamespaces = namespaces.filter(namespace =>
    namespace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    namespace.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="kubernetes-namespace">
      {/* Header */}
      <div className="namespace-header">
        <h2>Namespaces</h2>

        {/* Search and Options */}
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search namespaces..."
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
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="namespace-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedNamespaces.length === namespaces.length}
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
              <th>Age</th>
              <th>Pods</th>
              <th>Services</th>
              <th>Deployments</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredNamespaces.map((namespace) => (
              <tr key={namespace.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedNamespaces.includes(namespace.id)}
                    onChange={(e) => handleSelectNamespace(namespace.id, e.target.checked)}
                  />
                </td>
                <td className="namespace-name">{namespace.name}</td>
                <td>
                  <span className={`status-badge ${namespace.status.toLowerCase()}`}>
                    {namespace.status}
                  </span>
                </td>
                <td>
                  <div className="quick-actions">
                    <button className="action-btn" title="Describe">
                      📄
                    </button>
                    <button className="action-btn" title="Edit">
                      ✏️
                    </button>
                    <button className="action-btn" title="Delete">
                      🗑
                    </button>
                  </div>
                </td>
                <td className="age">{namespace.age}</td>
                <td>
                  <span className="resource-count pods">
                    {namespace.pods}
                  </span>
                </td>
                <td>
                  <span className="resource-count services">
                    {namespace.services}
                  </span>
                </td>
                <td>
                  <span className="resource-count deployments">
                    {namespace.deployments}
                  </span>
                </td>
                <td>{namespace.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredNamespaces.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>No namespaces found</h3>
          <p>Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default KubernetesNamespace; 