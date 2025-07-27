import React, { useState } from 'react';
import './css/DockerContainers.css';

const DockerContainers = () => {
  const [selectedContainers, setSelectedContainers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedContainer, setExpandedContainer] = useState(null);

  // 컨테이너 데이터
  const containers = [
    {
      id: '1',
      name: 'peaceful_blackburn',
      state: 'running',
      stack: '-',
      image: 'portainer/portainer',
      created: '2019-02-01 11:36:32',
      ipAddress: '172.17.0.3',
      publishedPorts: '9000->9000'
    },
    {
      id: '2',
      name: 'mongo',
      state: 'running',
      stack: '-',
      image: 'mongo:3.4.18',
      created: '2019-01-31 15:33:05',
      ipAddress: '172.17.0.2',
      publishedPorts: '27017->27017'
    },
    {
      id: '3',
      name: 'haproxy_haproxy_1',
      state: 'running',
      stack: 'haproxy',
      image: 'haproxy-alpine',
      created: '2018-10-11 19:41:18',
      ipAddress: '-',
      publishedPorts: '-'
    }
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedContainers(containers.map(c => c.id));
    } else {
      setSelectedContainers([]);
    }
  };

  const handleSelectContainer = (containerId, checked) => {
    if (checked) {
      setSelectedContainers([...selectedContainers, containerId]);
    } else {
      setSelectedContainers(selectedContainers.filter(id => id !== containerId));
    }
  };

  const handleContainerClick = (containerId) => {
    setExpandedContainer(expandedContainer === containerId ? null : containerId);
  };

  const filteredContainers = containers.filter(container =>
    container.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    container.image.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="docker-containers">
      {/* Header */}
      <div className="containers-header">
        <h2>Containers</h2>
        
        {/* Action Buttons - Only Add Container */}
        <div className="action-buttons">
          <button className="btn btn-primary" title="Add Container">
            <span className="btn-icon">+</span>
            + Add container
          </button>
        </div>

        {/* Search and Options */}
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search..."
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
        <table className="containers-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedContainers.length === containers.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>Name</th>
              <th>
                State
                <span className="sort-icon">↕</span>
                <span className="filter-icon">🔽</span>
              </th>
              <th>Actions</th>
              <th>Stack</th>
              <th>Image</th>
              <th>Created</th>
              <th>IP Address</th>
              <th>Published Ports</th>
            </tr>
          </thead>
          <tbody>
            {filteredContainers.map((container) => (
              <React.Fragment key={container.id}>
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedContainers.includes(container.id)}
                      onChange={(e) => handleSelectContainer(container.id, e.target.checked)}
                    />
                  </td>
                  <td 
                    className="container-name clickable"
                    onClick={() => handleContainerClick(container.id)}
                  >
                    {container.name}
                  </td>
                  <td>
                    <span className={`state-badge ${container.state}`}>
                      {container.state}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="action-btn log" title="Logs">
                        📄
                      </button>
                      <button className="action-btn terminal" title="Terminal">
                        &gt;_
                      </button>
                    </div>
                  </td>
                  <td>{container.stack}</td>
                  <td className="image-name">{container.image}</td>
                  <td>{container.created}</td>
                  <td>{container.ipAddress}</td>
                  <td>
                    {container.publishedPorts !== '-' ? (
                      <a href="#" className="port-link">{container.publishedPorts}</a>
                    ) : (
                      container.publishedPorts
                    )}
                  </td>
                </tr>
                {expandedContainer === container.id && (
                  <tr className="expanded-row">
                    <td colSpan="9">
                      <div className="expanded-actions">
                        <button className="expanded-btn start" title="Start">
                          <span className="btn-icon">▶</span>
                          Start
                        </button>
                        <button className="expanded-btn stop" title="Stop">
                          <span className="btn-icon">⏹</span>
                          Stop
                        </button>
                        <button className="expanded-btn kill" title="Kill">
                          <span className="btn-icon">⏹</span>
                          Kill
                        </button>
                        <button className="expanded-btn restart" title="Restart">
                          <span className="btn-icon">🔄</span>
                          Restart
                        </button>
                        <button className="expanded-btn pause" title="Pause">
                          <span className="btn-icon">⏸</span>
                          Pause
                        </button>
                        <button className="expanded-btn resume" title="Resume">
                          <span className="btn-icon">▶</span>
                          Resume
                        </button>
                        <button className="expanded-btn remove" title="Remove">
                          <span className="btn-icon">🗑</span>
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DockerContainers; 