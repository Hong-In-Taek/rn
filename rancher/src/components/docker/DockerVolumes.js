import React, { useState } from 'react';
import './css/DockerVolumes.css';

const DockerVolumes = () => {
  const [selectedVolumes, setSelectedVolumes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 볼륨 데이터
  const volumes = [
    {
      id: '1',
      name: 'portainer_data',
      driver: 'local',
      mountpoint: '/var/lib/docker/volumes/portainer_data/_data',
      size: '2.1 GB',
      containers: 1,
      created: '2019-02-01 11:36:32',
      status: 'in-use'
    },
    {
      id: '2',
      name: 'mongo_data',
      driver: 'local',
      mountpoint: '/var/lib/docker/volumes/mongo_data/_data',
      size: '156.7 MB',
      containers: 1,
      created: '2019-01-31 15:33:05',
      status: 'in-use'
    },
    {
      id: '3',
      name: 'haproxy_config',
      driver: 'local',
      mountpoint: '/var/lib/docker/volumes/haproxy_config/_data',
      size: '45.2 KB',
      containers: 1,
      created: '2018-10-11 19:41:18',
      status: 'in-use'
    },
    {
      id: '4',
      name: 'nginx_logs',
      driver: 'local',
      mountpoint: '/var/lib/docker/volumes/nginx_logs/_data',
      size: '1.2 MB',
      containers: 0,
      created: '2019-01-15 10:20:45',
      status: 'unused'
    },
    {
      id: '5',
      name: 'redis_data',
      driver: 'local',
      mountpoint: '/var/lib/docker/volumes/redis_data/_data',
      size: '89.3 KB',
      containers: 1,
      created: '2019-01-20 14:30:12',
      status: 'in-use'
    }
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedVolumes(volumes.map(v => v.id));
    } else {
      setSelectedVolumes([]);
    }
  };

  const handleSelectVolume = (volumeId, checked) => {
    if (checked) {
      setSelectedVolumes([...selectedVolumes, volumeId]);
    } else {
      setSelectedVolumes(selectedVolumes.filter(id => id !== volumeId));
    }
  };

  const filteredVolumes = volumes.filter(volume =>
    volume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volume.driver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="docker-volumes">
      {/* Header */}
      <div className="volumes-header">
        <h2>Volumes</h2>

        {/* Search and Options */}
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search volumes..."
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
        <table className="volumes-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedVolumes.length === volumes.length}
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
              <th>Driver</th>
              <th>Size</th>
              <th>Containers</th>
              <th>Mountpoint</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredVolumes.map((volume) => (
              <tr key={volume.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedVolumes.includes(volume.id)}
                    onChange={(e) => handleSelectVolume(volume.id, e.target.checked)}
                  />
                </td>
                <td className="volume-name">{volume.name}</td>
                <td>
                  <span className={`status-badge ${volume.status}`}>
                    {volume.status}
                  </span>
                </td>
                <td>
                  <div className="quick-actions">
                    <button className="action-btn" title="Inspect">
                      🔍
                    </button>
                    <button className="action-btn" title="Backup">
                      💾
                    </button>
                    <button className="action-btn" title="Remove">
                      🗑
                    </button>
                  </div>
                </td>
                <td className="driver-name">{volume.driver}</td>
                <td className="volume-size">{volume.size}</td>
                <td>
                  <span className="containers-count">
                    {volume.containers}
                  </span>
                </td>
                <td className="mountpoint">
                  <span className="mountpoint-text">{volume.mountpoint}</span>
                </td>
                <td>{volume.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredVolumes.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">💾</div>
          <h3>No volumes found</h3>
          <p>Try adjusting your search criteria or create a new volume.</p>
        </div>
      )}
    </div>
  );
};

export default DockerVolumes; 