import React, { useState } from 'react';
import './css/KubernetesEvent.css';

const KubernetesEvent = () => {
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 이벤트 데이터
  const events = [
    {
      id: '1',
      type: 'Normal',
      reason: 'Scheduled',
      object: 'pod/nginx-deployment-7d4c8b9c5',
      namespace: 'default',
      message: 'Successfully assigned default/nginx-deployment-7d4c8b9c5 to worker-node-1',
      count: 1,
      firstTimestamp: '2024-01-15 10:30:00',
      lastTimestamp: '2024-01-15 10:30:00'
    },
    {
      id: '2',
      type: 'Normal',
      reason: 'Pulling',
      object: 'pod/nginx-deployment-7d4c8b9c5',
      namespace: 'default',
      message: 'Pulling image "nginx:1.19-alpine"',
      count: 1,
      firstTimestamp: '2024-01-15 10:30:05',
      lastTimestamp: '2024-01-15 10:30:05'
    },
    {
      id: '3',
      type: 'Normal',
      reason: 'Pulled',
      object: 'pod/nginx-deployment-7d4c8b9c5',
      namespace: 'default',
      message: 'Successfully pulled image "nginx:1.19-alpine"',
      count: 1,
      firstTimestamp: '2024-01-15 10:30:15',
      lastTimestamp: '2024-01-15 10:30:15'
    },
    {
      id: '4',
      type: 'Normal',
      reason: 'Created',
      object: 'pod/nginx-deployment-7d4c8b9c5',
      namespace: 'default',
      message: 'Created container nginx',
      count: 1,
      firstTimestamp: '2024-01-15 10:30:16',
      lastTimestamp: '2024-01-15 10:30:16'
    },
    {
      id: '5',
      type: 'Normal',
      reason: 'Started',
      object: 'pod/nginx-deployment-7d4c8b9c5',
      namespace: 'default',
      message: 'Started container nginx',
      count: 1,
      firstTimestamp: '2024-01-15 10:30:17',
      lastTimestamp: '2024-01-15 10:30:17'
    },
    {
      id: '6',
      type: 'Warning',
      reason: 'FailedScheduling',
      object: 'pod/mongo-pod',
      namespace: 'default',
      message: '0/4 nodes are available: 4 Insufficient memory',
      count: 3,
      firstTimestamp: '2024-01-15 10:25:00',
      lastTimestamp: '2024-01-15 10:27:00'
    },
    {
      id: '7',
      type: 'Warning',
      reason: 'BackOff',
      object: 'pod/redis-pod',
      namespace: 'default',
      message: 'Back-off restarting failed container',
      count: 5,
      firstTimestamp: '2024-01-15 10:20:00',
      lastTimestamp: '2024-01-15 10:29:00'
    }
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedEvents(events.map(e => e.id));
    } else {
      setSelectedEvents([]);
    }
  };

  const handleSelectEvent = (eventId, checked) => {
    if (checked) {
      setSelectedEvents([...selectedEvents, eventId]);
    } else {
      setSelectedEvents(selectedEvents.filter(id => id !== eventId));
    }
  };

  const filteredEvents = events.filter(event =>
    event.object.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.namespace.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="kubernetes-event">
      {/* Header */}
      <div className="event-header">
        <h2>Events</h2>

        {/* Search and Options */}
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search events..."
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
        <table className="event-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedEvents.length === events.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>Type</th>
              <th>
                Reason
                <span className="sort-icon">↕</span>
                <span className="filter-icon">🔽</span>
              </th>
              <th>Quick actions</th>
              <th>Object</th>
              <th>Namespace</th>
              <th>Message</th>
              <th>Count</th>
              <th>First Seen</th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(event.id)}
                    onChange={(e) => handleSelectEvent(event.id, e.target.checked)}
                  />
                </td>
                <td>
                  <span className={`type-badge ${event.type.toLowerCase()}`}>
                    {event.type}
                  </span>
                </td>
                <td className="reason">{event.reason}</td>
                <td>
                  <div className="quick-actions">
                    <button className="action-btn" title="Describe">
                      📄
                    </button>
                    <button className="action-btn" title="Copy">
                      📋
                    </button>
                    <button className="action-btn" title="Delete">
                      🗑
                    </button>
                  </div>
                </td>
                <td className="object-name">{event.object}</td>
                <td className="namespace">{event.namespace}</td>
                <td className="message">
                  <span className="message-text">{event.message}</span>
                </td>
                <td>
                  <span className="count-badge">
                    {event.count}
                  </span>
                </td>
                <td className="timestamp">{event.firstTimestamp}</td>
                <td className="timestamp">{event.lastTimestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No events found</h3>
          <p>Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default KubernetesEvent; 