import React, { useState } from 'react';
import './css/DockerImages.css';

const DockerImages = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 이미지 데이터
  const images = [
    {
      id: '1',
      name: 'portainer/portainer',
      tag: 'latest',
      size: '78.5 MB',
      created: '2 weeks ago',
      digest: 'sha256:abc123...',
      status: 'pulled'
    },
    {
      id: '2',
      name: 'mongo',
      tag: '3.4.18',
      size: '380.2 MB',
      created: '3 months ago',
      digest: 'sha256:def456...',
      status: 'pulled'
    },
    {
      id: '3',
      name: 'haproxy',
      tag: 'alpine',
      size: '15.8 MB',
      created: '1 month ago',
      digest: 'sha256:ghi789...',
      status: 'pulled'
    },
    {
      id: '4',
      name: 'nginx',
      tag: '1.19-alpine',
      size: '22.1 MB',
      created: '1 week ago',
      digest: 'sha256:jkl012...',
      status: 'pulled'
    },
    {
      id: '5',
      name: 'redis',
      tag: '6.0-alpine',
      size: '27.3 MB',
      created: '2 weeks ago',
      digest: 'sha256:mno345...',
      status: 'pulled'
    }
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedImages(images.map(img => img.id));
    } else {
      setSelectedImages([]);
    }
  };

  const handleSelectImage = (imageId, checked) => {
    if (checked) {
      setSelectedImages([...selectedImages, imageId]);
    } else {
      setSelectedImages(selectedImages.filter(id => id !== imageId));
    }
  };

  const handleCopyImageName = (imageName, tag) => {
    const fullImageName = `${imageName}:${tag}`;
    navigator.clipboard.writeText(fullImageName);
    // 여기에 복사 완료 알림을 추가할 수 있습니다
  };

  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="docker-images">
      {/* Header */}
      <div className="images-header">
        <h2>Images</h2>

        {/* Search */}
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-options">
            <select className="filter-select">
              <option>All Images</option>
              <option>Dangling</option>
              <option>Used</option>
            </select>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      <div className="images-grid">
        {filteredImages.map((image) => (
          <div key={image.id} className="image-card">
            <div className="image-header">
              <input
                type="checkbox"
                checked={selectedImages.includes(image.id)}
                onChange={(e) => handleSelectImage(image.id, e.target.checked)}
                className="image-checkbox"
              />
              <div className="image-actions">
                <button 
                  className="action-btn copy" 
                  title="Copy Image Name"
                  onClick={() => handleCopyImageName(image.name, image.tag)}
                >
                  📋
                </button>
              </div>
            </div>
            
            <div className="image-content">
              <div className="image-name">
                <span className="repository">{image.name}</span>
                <span className="tag">:{image.tag}</span>
              </div>
              
              <div className="image-details">
                <div className="detail-item">
                  <span className="detail-label">Size:</span>
                  <span className="detail-value">{image.size}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Created:</span>
                  <span className="detail-value">{image.created}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Digest:</span>
                  <span className="detail-value digest">{image.digest}</span>
                </div>
              </div>
              
              <div className="image-status">
                <span className={`status-badge ${image.status}`}>
                  {image.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No images found</h3>
          <p>Try adjusting your search criteria or pull a new image.</p>
        </div>
      )}
    </div>
  );
};

export default DockerImages; 