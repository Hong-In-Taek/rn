import React, { useState, useMemo } from 'react';
import '../diff.css';

// diff 배열을 계층 트리로 변환
const buildTree = (diffs) => {
  const root = {};
  diffs.forEach(file => {
    const parts = file.new_path.split('/');
    let node = root;
    parts.forEach((part, i) => {
      if (!node[part]) {
        node[part] = i === parts.length - 1 ? { __file: file } : {};
      }
      node = node[part];
    });
  });
  return root;
};

// 파일별 +, - 카운트 계산
const countStats = (diffText) => {
  const lines = diffText.split('\n');
  let additions = 0, deletions = 0;
  for (const line of lines) {
    if (line.startsWith('+') && !line.startsWith('+++')) additions++;
    if (line.startsWith('-') && !line.startsWith('---')) deletions++;
  }
  return { additions, deletions };
};

const getTreePrefix = (depth, isLast, parentLastArr) => {
  if (depth === 0) return '';
  let prefix = '';
  for (let i = 0; i < depth - 1; i++) {
    prefix += parentLastArr[i] ? '    ' : '|   ';
  }
  prefix += isLast ? '└── ' : '|-- ';
  return prefix;
};

const TreeNode = ({ name, node, path, selectedPath, onSelect, openFolders, setOpenFolders, depth, parentLastArr = [] }) => {
  const isFile = !!node.__file;
  const fullPath = path ? path + '/' + name : name;
  const isOpen = openFolders[fullPath] || false;
  const indent = 16 + (depth || 0) * 16;

  // Determine if this node is the last among siblings
  const siblings = path ? Object.keys(node.__file ? {} : node).filter(k => k !== '__file').sort() : [];
  const isLast = parentLastArr.length > 0 ? parentLastArr[parentLastArr.length - 1] : false;

  const prefix = getTreePrefix(depth || 0, isLast, parentLastArr);

  if (isFile) {
    const stats = countStats(node.__file.diff);
    return (
      <li
        className={
          'filetree-file' + (selectedPath === fullPath ? ' filetree-file--selected' : '')
        }
        style={{ padding: `6px 24px 6px ${indent + 20}px`, fontFamily: 'monospace' }}
        onClick={() => onSelect(fullPath)}
        onMouseOver={e => e.currentTarget.style.background = '#f0f0f3'}
        onMouseOut={e => e.currentTarget.style.background = selectedPath === fullPath ? '#f5f5f8' : 'transparent'}
      >
        <span style={{ marginRight: 6 }}>{prefix}📄</span>
        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
        <span className="filetree-file__add">+{stats.additions}</span>
        <span className="filetree-file__del">-{stats.deletions}</span>
      </li>
    );
  }

  // 폴더
  const children = Object.keys(node).filter(k => k !== '__file').sort();
  return (
    <li>
      <div
        className="filetree-folder"
        style={{ padding: `6px 24px 6px ${indent}px`, fontFamily: 'monospace' }}
        onClick={() => setOpenFolders(f => ({ ...f, [fullPath]: !isOpen }))}
      >
        <span className="filetree-folder__icon" style={{ marginRight: 6 }}>{getTreePrefix(depth || 0, isLast, parentLastArr)}{isOpen ? '📂' : '📁'}</span>
        <span>{name}</span>
      </div>
      {isOpen && (
        <ul className="filetree-folder__children">
          {children.map((child, idx) => (
            <TreeNode
              key={child}
              name={child}
              node={node[child]}
              path={fullPath}
              selectedPath={selectedPath}
              onSelect={onSelect}
              openFolders={openFolders}
              setOpenFolders={setOpenFolders}
              depth={(depth || 0) + 1}
              parentLastArr={[...(parentLastArr || []), idx === children.length - 1]}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const FileTree = ({ diffs, selectedPath, onSelect }) => {
  const tree = useMemo(() => buildTree(diffs), [diffs]);
  const [openFolders, setOpenFolders] = useState({});

  return (
    <aside className="filetree-aside">
      <div className="filetree-title">파일 목록</div>
      <ul className="filetree-list">
        {Object.keys(tree).sort().map(name => (
          <TreeNode
            key={name}
            name={name}
            node={tree[name]}
            path=""
            selectedPath={selectedPath}
            onSelect={onSelect}
            openFolders={openFolders}
            setOpenFolders={setOpenFolders}
            depth={0}
          />
        ))}
      </ul>
    </aside>
  );
};

export default FileTree; 