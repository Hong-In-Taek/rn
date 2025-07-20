import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './App.css';

function App() {
  const [columns, setColumns] = useState({
    todo: {
      id: 'todo',
      title: '할 일',
      cards: [
        {
          id: 'card1',
          title: '프로젝트 기획서 작성',
          description: '새로운 프로젝트 기획서 작성 및 팀 리뷰',
          date: '2024-01-15',
          tags: ['기획', '문서'],
          stats: { views: 3, links: 2, comments: 0 }
        },
        {
          id: 'card2',
          title: 'UI/UX 디자인 검토',
          description: '사용자 인터페이스 디자인 검토 및 개선사항 도출',
          date: '2024-01-14',
          tags: ['디자인', '검토'],
          stats: { views: 5, links: 1, comments: 2 }
        }
      ]
    },
    'in-progress': {
      id: 'in-progress',
      title: '진행 중',
      cards: [
        {
          id: 'card3',
          title: 'React 컴포넌트 개발',
          description: '재사용 가능한 React 컴포넌트 라이브러리 구축',
          date: '2024-01-13',
          tags: ['개발', 'React'],
          stats: { views: 8, links: 4, comments: 5 }
        },
        {
          id: 'card4',
          title: '데이터베이스 설계',
          description: '새로운 기능을 위한 데이터베이스 스키마 설계',
          date: '2024-01-12',
          tags: ['DB', '설계'],
          stats: { views: 6, links: 3, comments: 1 }
        }
      ]
    },
    review: {
      id: 'review',
      title: '검토',
      cards: [
        {
          id: 'card5',
          title: '코드 리뷰',
          description: '팀원 코드 검토 및 피드백 제공',
          date: '2024-01-11',
          tags: ['코드', '리뷰'],
          stats: { views: 4, links: 2, comments: 3 }
        }
      ]
    },
    done: {
      id: 'done',
      title: '완료',
      cards: [
        {
          id: 'card6',
          title: '배포 완료',
          description: '프로덕션 환경 배포 및 모니터링 설정',
          date: '2024-01-10',
          tags: ['배포', '완료'],
          stats: { views: 12, links: 6, comments: 8 }
        }
      ]
    }
  });

  const [editingCard, setEditingCard] = useState(null);
  const [editingColumn, setEditingColumn] = useState(null);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    if (source.droppableId === destination.droppableId) {
      // 같은 컬럼 내에서 이동
      const newCards = Array.from(sourceColumn.cards);
      const [removed] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          cards: newCards
        }
      });
    } else {
      // 다른 컬럼으로 이동
      const sourceCards = Array.from(sourceColumn.cards);
      const destCards = Array.from(destColumn.cards);
      const [removed] = sourceCards.splice(source.index, 1);
      destCards.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          cards: sourceCards
        },
        [destination.droppableId]: {
          ...destColumn,
          cards: destCards
        }
      });
    }
  };

  const addCard = (columnId) => {
    const newCard = {
      id: `card-${Date.now()}`,
      title: '새 카드',
      description: '카드 설명을 입력하세요',
      date: new Date().toISOString().split('T')[0],
      tags: ['새'],
      stats: { views: 0, links: 0, comments: 0 }
    };

    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        cards: [...columns[columnId].cards, newCard]
      }
    });
  };

  const addColumn = () => {
    const newColumnId = `column-${Date.now()}`;
    const newColumn = {
      id: newColumnId,
      title: '새 컬럼',
      cards: []
    };

    setColumns({
      ...columns,
      [newColumnId]: newColumn
    });
  };

  const updateCard = (columnId, cardId, updates) => {
    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        cards: columns[columnId].cards.map(card =>
          card.id === cardId ? { ...card, ...updates } : card
        )
      }
    });
  };

  const updateColumn = (columnId, updates) => {
    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        ...updates
      }
    });
  };

  const deleteCard = (columnId, cardId) => {
    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        cards: columns[columnId].cards.filter(card => card.id !== cardId)
      }
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Editorial Calendar</h1>
        <div className="header-actions">
          <button>ℹ️</button>
          <button>+</button>
        </div>
      </header>
      <main className="App-main">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="kanban-board">
            {Object.values(columns).map((column) => (
              <div key={column.id} className="kanban-column">
                <div className="column-header">
                  {editingColumn === column.id ? (
                    <input
                      type="text"
                      value={column.title}
                      onChange={(e) => updateColumn(column.id, { title: e.target.value })}
                      onBlur={() => setEditingColumn(null)}
                      onKeyPress={(e) => e.key === 'Enter' && setEditingColumn(null)}
                      autoFocus
                    />
                  ) : (
                    <h3 onClick={() => setEditingColumn(column.id)}>{column.title}</h3>
                  )}
                  <div className="column-count">
                    <span className="total">{column.cards.length}</span>
                    <span>/ {column.cards.length}</span>
                  </div>
                </div>
                
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      className="column-content"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {column.cards.map((card, index) => (
                        <Draggable key={card.id} draggableId={card.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              className={`kanban-card ${snapshot.isDragging ? 'dragging' : ''}`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {editingCard === card.id ? (
                                <div className="card-edit">
                                  <input
                                    type="text"
                                    value={card.title}
                                    onChange={(e) => updateCard(column.id, card.id, { title: e.target.value })}
                                    onBlur={() => setEditingCard(null)}
                                    onKeyPress={(e) => e.key === 'Enter' && setEditingCard(null)}
                                    autoFocus
                                  />
                                  <textarea
                                    value={card.description}
                                    onChange={(e) => updateCard(column.id, card.id, { description: e.target.value })}
                                    onBlur={() => setEditingCard(null)}
                                    placeholder="카드 설명"
                                  />
                                  <div className="card-actions">
                                    <button onClick={() => setEditingCard(null)}>저장</button>
                                    <button onClick={() => deleteCard(column.id, card.id)}>삭제</button>
                                  </div>
                                </div>
                              ) : (
                                <div onClick={() => setEditingCard(card.id)}>
                                  <div className="card-avatar">U</div>
                                  <h4>{card.title}</h4>
                                  <p>{card.description}</p>
                                  <div className="card-preview"></div>
                                  <div className="card-meta">
                                    <span className="card-date">{formatDate(card.date)}</span>
                                    <div className="card-stats">
                                      <span className="card-stat">👁️ {card.stats.views}</span>
                                      <span className="card-stat">🔗 {card.stats.links}</span>
                                      <span className="card-stat">💬 {card.stats.comments}</span>
                                    </div>
                                  </div>
                                  <div className="card-tags">
                                    {card.tags.map((tag, index) => (
                                      <span key={index} className="card-tag">{tag}</span>
                                    ))}
                                  </div>
                                  {column.id === 'done' && (
                                    <div className="card-status">✓</div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                
                <button className="add-card-btn" onClick={() => addCard(column.id)}>
                  + 카드 추가
                </button>
              </div>
            ))}
            
            <div className="add-column">
              <button onClick={addColumn}>+ 컬럼 추가</button>
            </div>
          </div>
        </DragDropContext>
      </main>
    </div>
  );
}

export default App; 