import React, { useState, useMemo } from 'react';
import { diffs } from './mockDiffs';
import FileTree from './components/FileTree';
import DiffViewer from './components/DiffViewer';
import DiffStats from './components/DiffStats';
import './diff.css';
import DiffPanel from './components/DiffPanel';

const countDiffStats = (diffText) => {
  const lines = diffText.split('\n');
  let additions = 0, deletions = 0;
  for (const line of lines) {
    if (line.startsWith('+') && !line.startsWith('+++')) additions++;
    if (line.startsWith('-') && !line.startsWith('---')) deletions++;
  }
  return { additions, deletions };
};

const App = () => {
  const [selectedPath, setSelectedPath] = useState(diffs[0]?.new_path || '');
  const [comments, setComments] = useState({});
  const [collapsed, setCollapsed] = useState({});

  const diffMap = useMemo(() => {
    const map = {};
    diffs.forEach(f => { map[f.new_path] = f; });
    return map;
  }, []);

  const handleAddComment = (lineId, text) => {
    setComments(prev => ({ ...prev, [lineId]: text }));
  };

  const handleSelect = (fullPath) => {
    setSelectedPath(fullPath);
    setTimeout(() => {
      const el = document.getElementById("diff-" + fullPath.replace(/[^\w-]/g, '_'));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  return (
    <div className="app-root">
      <FileTree diffs={diffs} selectedPath={selectedPath} onSelect={handleSelect} />
      <div className="app-main">
        <div className="app-main__container">
          {diffs.map(file => {
            const stats = countDiffStats(file.diff);
            const isCollapsed = collapsed[file.new_path];
            return (
              <DiffPanel
                key={file.new_path}
                file={file}
                stats={stats}
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setCollapsed(c => ({ ...c, [file.new_path]: !isCollapsed }))}
                comments={comments}
                onAddComment={handleAddComment}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
