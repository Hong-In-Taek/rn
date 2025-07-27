import React, { useState } from 'react';
import './css/KubernetesNode.css';

const KubernetesNode = () => {
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 노드 데이터
  const nodes = [
    {
      id: '1',
      name: 'worker-node-1',
      status: 'Ready',
      role: 'worker',
      version: 'v1.30.0',
      internalIP: '192.168.1.10',
      externalIP: '203.0.113.10',
      os: 'Ubuntu 22.04.3 LTS',
      kernel: '5.15.0-88-generic',
      containerRuntime: 'containerd://1.7.11',
      kubeletVersion: 'v1.30.0',
      created: '2024-01-15 10:30:00'
    },
    {
      id: '2',
      name: 'worker-node-2',
      status: 'Ready',
      role: 'worker',
      version: 'v1.30.0',
      internalIP: '192.168.1.11',
      externalIP: '203.0.113.11',
      os: 'Ubuntu 22.04.3 LTS',
      kernel: '5.15.0-88-generic',
      containerRuntime: 'containerd://1.7.11',
      kubeletVersion: 'v1.30.0',
      created: '2024-01-15 10:35:00'
    },
    {
      id: '3',
      name: 'control-plane-1',
      status: 'Ready',
      role: 'control-plane',
      version: 'v1.30.0',
      internalIP: '192.168.1.5',
      externalIP: '203.0.113.5',
      os: 'Ubuntu 22.04.3 LTS',
      kernel: '5.15.0-88-generic',
      containerRuntime: 'containerd://1.7.11',
      kubeletVersion: 'v1.30.0',
      created: '2024-01-15 10:00:00'
    },
    {
      id: '4',
      name: 'worker-node-3',
      status: 'NotReady',
      role: 'worker',
      version: 'v1.30.0',
      internalIP: '192.168.1.12',
      externalIP: '203.0.113.12',
      os: 'Ubuntu 22.04.3 LTS',
      kernel: '5.15.0-88-generic',
      containerRuntime: 'containerd://1.7.11',
      kubeletVersion: 'v1.30.0',
      created: '2024-01-15 10:40:00'
    }
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedNodes(nodes.map(n => n.id));
    } else {
      setSelectedNodes([]);
    }
  };

  const handleSelectNode = (nodeId, checked) => {
    if (checked) {
      setSelectedNodes([...selectedNodes, nodeId]);
    } else {
      setSelectedNodes(selectedNodes.filter(id => id !== nodeId));
    }
  };

  const filteredNodes = nodes.filter(node =>
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="kubernetes-node">
      {/* Header */}
      <div className="node-header">
        <h2>Nodes</h2>

        {/* Search and Options */}
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search nodes..."
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
        <table className="node-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedNodes.length === nodes.length}
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
              <th>Role</th>
              <th>Version</th>
              <th>Internal IP</th>
              <th>External IP</th>
              <th>OS</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredNodes.map((node) => (
              <tr key={node.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedNodes.includes(node.id)}
                    onChange={(e) => handleSelectNode(node.id, e.target.checked)}
                  />
                </td>
                <td className="node-name">{node.name}</td>
                <td>
                  <span className={`status-badge ${node.status.toLowerCase()}`}>
                    {node.status}
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
                <td>
                  <span className={`role-badge ${node.role}`}>
                    {node.role}
                  </span>
                </td>
                <td className="version">{node.version}</td>
                <td className="ip-address">{node.internalIP}</td>
                <td className="ip-address">{node.externalIP}</td>
                <td className="os-info">{node.os}</td>
                <td>{node.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredNodes.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🖥️</div>
          <h3>No nodes found</h3>
          <p>Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default KubernetesNode; 