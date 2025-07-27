import React, { useState } from 'react';
import './css/KubernetesPods.css';

const KubernetesPods = () => {
  const [selectedPods, setSelectedPods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNamespace, setSelectedNamespace] = useState('all');

  // Pod 데이터
  const pods = [
    {
      id: '1',
      name: 'nginx-deployment-7d4c8b9c5-abc12',
      namespace: 'default',
      status: 'Running',
      ready: '1/1',
      restarts: 0,
      age: '2h',
      ip: '10.244.0.5',
      node: 'worker-node-1',
      created: '2024-01-15 10:30:00'
    },
    {
      id: '2',
      name: 'nginx-deployment-7d4c8b9c5-def34',
      namespace: 'default',
      status: 'Running',
      ready: '1/1',
      restarts: 0,
      age: '2h',
      ip: '10.244.0.6',
      node: 'worker-node-2',
      created: '2024-01-15 10:30:00'
    },
    {
      id: '3',
      name: 'mongo-pod',
      namespace: 'default',
      status: 'Pending',
      ready: '0/1',
      restarts: 0,
      age: '30m',
      ip: '<none>',
      node: '<none>',
      created: '2024-01-15 12:00:00'
    },
    {
      id: '4',
      name: 'redis-pod',
      namespace: 'default',
      status: 'CrashLoopBackOff',
      ready: '0/1',
      restarts: 5,
      age: '1h',
      ip: '10.244.0.7',
      node: 'worker-node-1',
      created: '2024-01-15 11:00:00'
    },
    {
      id: '5',
      name: 'kube-apiserver-control-plane-1',
      namespace: 'kube-system',
      status: 'Running',
      ready: '1/1',
      restarts: 0,
      age: '2d',
      ip: '192.168.1.5',
      node: 'control-plane-1',
      created: '2024-01-13 10:00:00'
    },
    {
      id: '6',
      name: 'prometheus-server-0',
      namespace: 'monitoring',
      status: 'Running',
      ready: '1/1',
      restarts: 1,
      age: '1d',
      ip: '10.244.1.10',
      node: 'worker-node-1',
      created: '2024-01-14 15:30:00'
    }
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPods(pods.map(p => p.id));
    } else {
      setSelectedPods([]);
    }
  };

  const handleSelectPod = (podId, checked) => {
    if (checked) {
      setSelectedPods([...selectedPods, podId]);
    } else {
      setSelectedPods(selectedPods.filter(id => id !== podId));
    }
  };

  // 사용 가능한 namespace 목록
  const availableNamespaces = ['all', ...new Set(pods.map(pod => pod.namespace))];

  const filteredPods = pods.filter(pod => {
    const matchesSearch = pod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pod.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pod.namespace.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pod.node.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesNamespace = selectedNamespace === 'all' || pod.namespace === selectedNamespace;
    
    return matchesSearch && matchesNamespace;
  });

  return (
    <div className="kubernetes-pods">
      {/* Header */}
      <div className="pods-header">
        <h2>Pods</h2>

        {/* Search and Options */}
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search pods..."
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
        <table className="pods-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedPods.length === pods.length}
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
              <th>Restarts</th>
              <th>Age</th>
              <th>IP</th>
              <th>Node</th>
              <th>Namespace</th>
            </tr>
          </thead>
          <tbody>
            {filteredPods.map((pod) => (
              <tr key={pod.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedPods.includes(pod.id)}
                    onChange={(e) => handleSelectPod(pod.id, e.target.checked)}
                  />
                </td>
                <td className="pod-name">{pod.name}</td>
                <td>
                  <span className={`status-badge ${pod.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {pod.status}
                  </span>
                </td>
                <td>
                  <div className="quick-actions">
                    <button className="action-btn" title="Logs">
                      📄
                    </button>
                    <button className="action-btn" title="Terminal">
                      &gt;_
                    </button>
                    <button className="action-btn" title="Delete">
                      🗑
                    </button>
                  </div>
                </td>
                <td className="ready-count">{pod.ready}</td>
                <td>
                  <span className={`restart-count ${pod.restarts > 0 ? 'warning' : ''}`}>
                    {pod.restarts}
                  </span>
                </td>
                <td className="age">{pod.age}</td>
                <td className="ip-address">{pod.ip}</td>
                <td className="node-name">{pod.node}</td>
                <td className="namespace">{pod.namespace}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredPods.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No pods found</h3>
          <p>Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default KubernetesPods; 