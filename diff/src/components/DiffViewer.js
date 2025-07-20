import React, { useState } from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import CommentInput from './CommentInput';
import '../diff.css';

const getLineKey = (fileId, type, lineNumber) => {
  return `${fileId}:${type}:${lineNumber}`;
};

const splitDiff = (diffText) => {
  // git diff 포맷을 oldLines, newLines 배열로 변환 (아주 단순화)
  const oldLines = [];
  const newLines = [];
  const newLineTypes = [];
  const lines = diffText.split('\n');
  for (let line of lines) {
    if (line.startsWith('+++') || line.startsWith('---') || line.startsWith('diff') || line.startsWith('index') || line.startsWith('@@')) continue;
    if (line.startsWith('+')) {
      newLines.push(line.slice(1));
      newLineTypes.push('added');
    } else if (line.startsWith('-')) {
      oldLines.push(line.slice(1));
    } else {
      oldLines.push(line.replace(/^ /, ''));
      newLines.push(line.replace(/^ /, ''));
      newLineTypes.push('unchanged');
    }
  }
  return { oldLines, newLines, newLineTypes };
};

const DiffViewer = ({ diffText, comments, onAddComment, fileId }) => {
  const [commenting, setCommenting] = useState(null); // key string
  const [hovered, setHovered] = useState(null); // key string
  const { oldLines, newLines, newLineTypes } = splitDiff(diffText);

  // 인덱스 추적용 변수
  let oldLineIdx = 0;
  let newLineIdx = 0;

  // Only allow comments on 'old' (left) lines
  const renderContent = (type) => (str) => {
    let key;
    if (type === 'old') {
      oldLineIdx += 1;
      key = getLineKey(fileId, type, oldLineIdx);
    } else {
      newLineIdx += 1;
      key = getLineKey(fileId, type, newLineIdx);
    }
    if (type !== 'old') {
      return <span>{str || <span style={{ color: '#ccc' }}>·</span>}</span>;
    }
    const hasComment = !!comments[key];
    const isCommenting = commenting === key;
    const isHovered = hovered === key;
    return (
      <div
        key={key}
        className={`diff-line${hasComment ? ' diff-line--commented' : ''}`}
        onMouseEnter={() => setHovered(key)}
        onMouseLeave={() => setHovered(null)}
      >
        <span>{str || <span style={{ color: '#ccc' }}>·</span>}</span>
        {isHovered && !isCommenting && (
          <span
            className="diff-comment-btn"
            onClick={e => {
              e.stopPropagation();
              setCommenting(key);
            }}
            title="댓글 달기"
          >
            {'\u{1F4AC}'}
          </span>
        )}
        {isCommenting && (
          <div
            className="diff-comment-input"
            onClick={e => e.stopPropagation()}
          >
            <CommentInput
              onSave={text => {
                onAddComment(key, text);
                setCommenting(null);
              }}
              onCancel={() => setCommenting(null)}
            />
          </div>
        )}
        {hasComment && !isCommenting && (
          <div className="diff-comment-box">
            💬 {comments[key]}
          </div>
        )}
      </div>
    );
  };

  // GitLab 스타일 diff 테이블 커스텀
  const diffStyles = {
    variables: {
      light: {
        diffViewerBackground: '#fff',
        diffViewerColor: '#222',
        addedBackground: '#e6f4ea',
        addedColor: '#218838',
        removedBackground: '#fbeaea',
        removedColor: '#c82333',
        wordAddedBackground: '#b6f2d7',
        wordRemovedBackground: '#f7bfc3',
        addedGutterBackground: '#d2f4d2',
        removedGutterBackground: '#f7d6d9',
        gutterBackground: '#f5f5f8',
        gutterColor: '#888',
        codeFoldGutterBackground: '#f5f5f8',
        codeFoldBackground: '#f5f5f8',
        emptyLineBackground: '#fff',
        highlightBackground: '#fff8b3',
        highlightGutterBackground: '#fff8b3',
      },
    },
    diffContainer: {
      fontFamily: 'Roboto, Noto Sans KR, Apple SD Gothic Neo, 맑은 고딕, Arial, sans-serif',
      fontSize: 14,
      border: '1px solid #e5e5e5',
      borderRadius: 6,
      overflow: 'hidden',
      margin: 0,
    },
    line: {
      borderBottom: '1px solid #f0f0f0',
      minHeight: 24,
    },
    gutter: {
      minWidth: 44,
      textAlign: 'right',
      color: '#888',
      background: '#f5f5f8',
      borderRight: '1px solid #e5e5e5',
      fontSize: 13,
      userSelect: 'none',
    },
    contentText: {
      fontFamily: 'inherit',
      fontSize: 14,
    },
    marker: {
      width: 8,
    },
    emptyLine: {
      background: '#fff',
    },
  };

  return (
    <div>
      <ReactDiffViewer
        oldValue={oldLines.join('\n')}
        newValue={newLines.join('\n')}
        splitView={true}
        compareMethod={DiffMethod.LINES}
        renderContent={renderContent('old')}
        renderContentRight={renderContent('new')}
        hideLineNumbers={false}
        showDiffOnly={false}
        styles={diffStyles}
      />
    </div>
  );
};

export default DiffViewer; 