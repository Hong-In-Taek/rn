import React, { useState } from 'react';
import './css/KubernetesServices.css';

const KubernetesServices = () => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNamespace, setSelectedNamespace] = useState('all');

  // Service 데이터
  const services = [
    {
      id: '1',
      name: 'nginx-service',
      namespace: 'default',
      type: 'ClusterIP',
      clusterIP: '10.96.1.10',
      externalIP: '<none>',
      ports: '80:80/TCP',
      age: '2h',
      created: '2024-01-15 10:30:00'
    },
    {
      id: '2',
      name: 'mongo-service',
      namespace: 'default',
      type: 'ClusterIP',
      clusterIP: '10.96.1.11',
      externalIP: '<none>',
      ports: '27017:27017/TCP',
      age: '30m',
      created: '2024-01-15 12:00:00'
    },
    {
      id: '3',
      name: 'kubernetes',
      namespace: 'default',
      type: 'ClusterIP',
      clusterIP: '10.96.0.1',
      externalIP: '<none>',
      ports: '443:443/TCP',
      age: '2d',
      created: '2024-01-13 10:00:00'
    },
    {
      id: '4',
      name: 'prometheus-service',
      namespace: 'monitoring',
      type: 'ClusterIP',
      clusterIP: '10.96.2.10',
      externalIP: '<none>',
      ports: '9090:9090/TCP',
      age: '1d',
      created: '2024-01-14 15:30:00'
    },
    {
      id: '5',
      name: 'grafana-service',
      namespace: 'monitoring',
      type: 'ClusterIP',
      clusterIP: '10.96.2.11',
      externalIP: '<none>',
      ports: '3000:3000/TCP',
      age: '1d',
      created: '2024-01-14 15:35:00'
    },
    {
      id: '6',
      name: 'ingress-nginx-controller',
      namespace: 'ingress-nginx',
      type: 'LoadBalancer',
      clusterIP: '10.96.3.10',
      externalIP: '203.0.113.100',
      ports: '80:80/TCP, 443:443/TCP',
      age: '1d',
      created: '2024-01-14 16:00:00'
    }
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedServices(services.map(s => s.id));
    } else {
      setSelectedServices([]);
    }
  };

  const handleSelectService = (serviceId, checked) => {
    if (checked) {
      setSelectedServices([...selectedServices, serviceId]);
    } else {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    }
  };

  // 사용 가능한 namespace 목록
  const availableNamespaces = ['all', ...new Set(services.map(service => service.namespace))];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.namespace.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesNamespace = selectedNamespace === 'all' || service.namespace === selectedNamespace;
    
    return matchesSearch && matchesNamespace;
  });

  return (
    <div className="kubernetes-services">
      {/* Header */}
      <div className="services-header">
        <h2>Services</h2>

        {/* Search and Options */}
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search services..."
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
        <table className="services-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedServices.length === services.length}
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
              <th>Cluster-IP</th>
              <th>External-IP</th>
              <th>Port(s)</th>
              <th>Age</th>
              <th>Namespace</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((service) => (
              <tr key={service.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.id)}
                    onChange={(e) => handleSelectService(service.id, e.target.checked)}
                  />
                </td>
                <td className="service-name">{service.name}</td>
                <td>
                  <span className={`type-badge ${service.type.toLowerCase()}`}>
                    {service.type}
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
                <td className="cluster-ip">{service.clusterIP}</td>
                <td className="external-ip">{service.externalIP}</td>
                <td className="ports">{service.ports}</td>
                <td className="age">{service.age}</td>
                <td className="namespace">{service.namespace}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔗</div>
          <h3>No services found</h3>
          <p>Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default KubernetesServices; 