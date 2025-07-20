import React, { useState } from 'react';
import '../diff.css';

const CommentInput = ({ onSave, onCancel, initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="diff-comment-input-row">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="코멘트 입력..."
      />
      <button onClick={() => { if (value.trim()) onSave(value); }}>저장</button>
      {onCancel && (
        <button onClick={onCancel} className="diff-comment-cancel-btn">취소</button>
      )}
    </div>
  );
};

export default CommentInput; 