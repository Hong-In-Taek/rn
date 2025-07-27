import React, { useState, useEffect, useRef } from 'react';

const KanbanModal = ({ card, columnId, isOpen, onClose, onUpdate, users }) => {
  const [editedCard, setEditedCard] = useState(card);
  const [newComment, setNewComment] = useState('');
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [mentionText, setMentionText] = useState('');
  const assigneeInputRef = useRef(null);

  useEffect(() => {
    if (card) {
      setEditedCard(card);
    }
  }, [card]);

  const handleAssigneeChange = (e) => {
    const inputValue = e.target.value;
    
    // 현재 태그들 가져오기 (빈 태그 제외)
    const currentTags = editedCard.assignee ? editedCard.assignee.split(' ').filter(part => part.startsWith('@') && part.length > 1) : [];
    
    // @ 기호가 포함되어 있는지 확인
    const atIndex = inputValue.lastIndexOf('@');
    if (atIndex !== -1) {
      const searchText = inputValue.substring(atIndex + 1);
      setMentionText(searchText);
      
      // 현재 등록된 사용자들 가져오기
      const currentUserNames = editedCard.assignee ? 
        editedCard.assignee.split(' ').filter(part => part.startsWith('@') && part.length > 1).map(part => part.substring(1)) : 
        [];
      
      // 사용자 필터링 (이미 등록된 사용자 제외)
      const filtered = Object.values(users).filter(user =>
        !currentUserNames.includes(user.name) && (
          user.name.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase())
        )
      );
      
      if (filtered.length > 0) {
        setFilteredUsers(filtered);
        setShowUserSuggestions(true);
        setSuggestionIndex(0);
      } else {
        setShowUserSuggestions(false);
      }
    } else {
      setShowUserSuggestions(false);
    }
    
    // 태그와 입력값을 합쳐서 저장 (입력값이 있을 때만)
    const newValue = inputValue.trim() ? [...currentTags, inputValue].join(' ').trim() : currentTags.join(' ');
    setEditedCard({ ...editedCard, assignee: newValue });
    onUpdate(columnId, card.id, { ...editedCard, assignee: newValue });
  };

  const selectUser = (user) => {
    const currentTags = editedCard.assignee ? editedCard.assignee.split(' ').filter(part => part.startsWith('@') && part.length > 1) : [];
    const newTags = [...currentTags, `@${user.name}`];
    const newValue = newTags.join(' ');
    
    setEditedCard({ ...editedCard, assignee: newValue });
    onUpdate(columnId, card.id, { ...editedCard, assignee: newValue });
    setShowUserSuggestions(false);
    setMentionText('');
    
    // 입력 필드 비우기
    if (assigneeInputRef.current) {
      assigneeInputRef.current.value = '';
      assigneeInputRef.current.focus();
    }
  };

  const removeAssignee = (userName) => {
    const currentValue = editedCard.assignee || '';
    const newValue = currentValue.replace(`@${userName}`, '').replace(/\s+/g, ' ').trim();
    setEditedCard({ ...editedCard, assignee: newValue });
    onUpdate(columnId, card.id, { ...editedCard, assignee: newValue });
  };

  const handleKeyDown = (e) => {
    if (showUserSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSuggestionIndex(prev => 
          prev < filteredUsers.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : filteredUsers.length - 1
        );
      } else if (e.key === 'Enter' && filteredUsers.length > 0) {
        e.preventDefault();
        selectUser(filteredUsers[suggestionIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowUserSuggestions(false);
        setMentionText('');
      } else if (e.key === 'Backspace' && mentionText === '') {
        setShowUserSuggestions(false);
        setMentionText('');
      }
    }
  };

  const handleInputChange = (field, value) => {
    const updatedCard = { ...editedCard, [field]: value };
    setEditedCard(updatedCard);
    
    // 실시간으로 부모 컴포넌트에 업데이트
    onUpdate(columnId, card.id, updatedCard);
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: Date.now(),
      text: newComment,
      author: '현재 사용자',
      date: new Date().toISOString().split('T')[0]
    };

    const updatedCard = {
      ...editedCard,
      comments: [...(editedCard.comments || []), newCommentObj],
      stats: { 
        ...(editedCard.stats || {}), 
        comments: (editedCard.stats?.comments || 0) + 1 
      }
    };

    setEditedCard(updatedCard);
    onUpdate(columnId, card.id, updatedCard);
    setNewComment('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (!isOpen || !card || !editedCard) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <input
            type="text"
            value={editedCard.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="modal-title-input"
            placeholder="칸반 제목을 입력하세요"
          />
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="modal-main">
            <div className="modal-section">
              <label>담당자:</label>
              <div className="assignee-input-container">
                {editedCard.assignee && editedCard.assignee.includes('@') ? (
                  <div className="assignee-tags-container">
                    {editedCard.assignee.split(' ').filter(part => part.startsWith('@') && part.length > 1).map((assignee, index) => {
                      const userName = assignee.substring(1);
                      return (
                        <div key={index} className="assignee-tag">
                          <div className="assignee-tag-content">
                            <div className="assignee-avatar">
                              {userName.charAt(0)}
                            </div>
                            <span className="assignee-name">{userName}</span>
                          </div>
                          <button 
                            className="assignee-remove"
                            onClick={() => removeAssignee(userName)}
                            title="담당자 제거"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                    <input
                      ref={assigneeInputRef}
                      type="text"
                      value=""
                      onChange={handleAssigneeChange}
                      onKeyDown={handleKeyDown}
                      onBlur={() => {
                        // 약간의 지연을 두어 클릭 이벤트가 먼저 처리되도록 함
                        setTimeout(() => {
                          setShowUserSuggestions(false);
                          setMentionText('');
                        }, 150);
                      }}
                      className="assignee-input-inline"
                      placeholder="담당자를 입력하세요 (@로 멘션)"
                    />
                  </div>
                ) : (
                  <input
                    ref={assigneeInputRef}
                    type="text"
                    value={editedCard.assignee || ''}
                    onChange={handleAssigneeChange}
                    onKeyDown={handleKeyDown}
                    onBlur={() => {
                      setTimeout(() => {
                        setShowUserSuggestions(false);
                        setMentionText('');
                      }, 150);
                    }}
                    className="assignee-input"
                    placeholder="담당자를 입력하세요 (@로 멘션)"
                  />
                )}
                {showUserSuggestions && (
                  <div 
                    className="user-suggestions"
                    onMouseDown={(e) => e.preventDefault()} // onBlur 이벤트 방지
                  >
                    {filteredUsers.map((user, index) => (
                      <div
                        key={user.id}
                        className={`user-suggestion ${index === suggestionIndex ? 'selected' : ''}`}
                        onClick={() => selectUser(user)}
                      >
                        <div className="user-avatar">{user.avatar}</div>
                        <div className="user-info">
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-section">
              <label>칸반 내용</label>
              <div className="content-field">
                <textarea
                  value={editedCard.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="content-textarea"
                  placeholder="칸반 내용을 입력하세요"
                />
                <div className="card-meta">
                  <span className="card-date">{formatDate(editedCard.date || new Date())}</span>
                  <div className="card-stats">
                    <span className="card-stat">👁️ {editedCard.stats?.views || 0}</span>
                    <span className="card-stat">🔗 {editedCard.stats?.links || 0}</span>
                    <span className="card-stat">💬 {editedCard.stats?.comments || 0}</span>
                  </div>
                </div>
                <div className="card-tags">
                  {(editedCard.tags || []).map((tag, index) => (
                    <span key={index} className="card-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-sidebar">
            <div className="modal-section">
              <label>댓글 달기</label>
              <div className="comment-input-container">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                  className="comment-input"
                />
                <button 
                  className="comment-submit"
                  onClick={addComment}
                  disabled={!newComment.trim()}
                >
                  등록
                </button>
              </div>
            </div>
            
            <div className="modal-section">
              <label>댓글 목록</label>
              <div className="comments-list">
                {(editedCard.comments || []).length === 0 ? (
                  <p className="no-comments">댓글이 없습니다.</p>
                ) : (
                  (editedCard.comments || []).map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author}</span>
                        <span className="comment-date">{formatDate(comment.date)}</span>
                      </div>
                      <div className="comment-text">{comment.text}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanModal; 