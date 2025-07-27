import React from 'react';
import './css/DockerDashboard.css';

const DockerDashboard = () => {
  // Docker 대시보드 데이터
  const dockerMetrics = {
    stack: 1,
    containers: {
      total: 3,
      running: 3,
      stopped: 0
    },
    images: {
      total: 28,
      size: '10 GB'
    },
    volumes: 148,
    networks: 9
  };

  return (
    <div className="docker-dashboard">
      <div className="metrics-grid">
        {/* Stack Card */}
        <div className="metric-card">
          <div className="metric-icon stack-icon">
            <div className="icon-content">📋</div>
          </div>
          <div className="metric-content">
            <div className="metric-value">{dockerMetrics.stack}</div>
            <div className="metric-label">Stack</div>
          </div>
        </div>

        {/* Containers Card */}
        <div className="metric-card">
          <div className="metric-icon container-icon">
            <div className="icon-content">📦</div>
          </div>
          <div className="metric-content">
            <div className="metric-value">{dockerMetrics.containers.total}</div>
            <div className="metric-label">Containers</div>
            <div className="metric-status">
              <div className="status-item running">
                <span className="status-icon">▲</span>
                <span className="status-text">{dockerMetrics.containers.running} running</span>
              </div>
              <div className="status-item stopped">
                <span className="status-icon">▼</span>
                <span className="status-text">{dockerMetrics.containers.stopped} stopped</span>
              </div>
            </div>
          </div>
        </div>

        {/* Images Card */}
        <div className="metric-card">
          <div className="metric-icon image-icon">
            <div className="icon-content">🖼️</div>
          </div>
          <div className="metric-content">
            <div className="metric-value">{dockerMetrics.images.total}</div>
            <div className="metric-label">Images</div>
            <div className="metric-storage">
              <span className="storage-icon">🌐</span>
              <span className="storage-text">{dockerMetrics.images.size}</span>
            </div>
          </div>
        </div>

        {/* Volumes Card */}
        <div className="metric-card">
          <div className="metric-icon volume-icon">
            <div className="icon-content">💾</div>
          </div>
          <div className="metric-content">
            <div className="metric-value">{dockerMetrics.volumes}</div>
            <div className="metric-label">Volumes</div>
          </div>
        </div>

        {/* Networks Card */}
        <div className="metric-card">
          <div className="metric-icon network-icon">
            <div className="icon-content">🌐</div>
          </div>
          <div className="metric-content">
            <div className="metric-value">{dockerMetrics.networks}</div>
            <div className="metric-label">Networks</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DockerDashboard; 