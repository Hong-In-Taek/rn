import React from 'react';
import DiffStats from './DiffStats';
import DiffViewer from './DiffViewer';

const DiffPanel = ({
  file,
  stats,
  isCollapsed,
  onToggleCollapse,
  comments,
  onAddComment,
}) => (
  <div
    id={"diff-" + file.new_path.replace(/[^\w-]/g, '_')}
    className="diff-panel"
  >
    <div className="diff-panel__header">
      <div className="diff-panel__title">
        <span>{file.new_path}</span>
        <DiffStats additions={stats.additions} deletions={stats.deletions} />
      </div>
      <div className="diff-panel__toolbar">
        <button
          className="diff-panel__collapse-btn"
          title={isCollapsed ? '펼치기' : '접기'}
          onClick={onToggleCollapse}
        >
          {isCollapsed ? '▼' : '▲'}
        </button>
        <button
          className="diff-panel__more-btn"
          title="더보기"
        >
          ⋮
        </button>
      </div>
    </div>
    {!isCollapsed && (
      <div className="diff-panel__body">
        <DiffViewer
          fileId={file.new_path}
          diffText={file.diff}
          comments={comments}
          onAddComment={onAddComment}
        />
      </div>
    )}
  </div>
);

export default DiffPanel; 