import React from 'react';
import '../diff.css';

const DiffStats = ({ additions, deletions }) => {
  return (
    <div className="diff-stats">
      <span className="diff-stats__add">+{additions}</span>
      <span className="diff-stats__del">-{deletions}</span>
    </div>
  );
};

export default DiffStats; 