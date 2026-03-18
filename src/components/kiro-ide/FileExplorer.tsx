'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileTreeNode } from '@/types/demo';

interface FileExplorerProps {
  files: FileTreeNode[];
  selectedFile: string | null;
  onFileClick?: (path: string) => void;
}

export default function FileExplorer({ 
  files, 
  selectedFile, 
  onFileClick,
}: FileExplorerProps) {
  return (
    <div className="text-[13px]">
      {files.map((node) => (
        <FileNode
          key={node.path}
          node={node}
          depth={0}
          selectedFile={selectedFile}
          onFileClick={onFileClick}
        />
      ))}
    </div>
  );
}

interface FileNodeProps {
  node: FileTreeNode;
  depth: number;
  selectedFile: string | null;
  onFileClick?: (path: string) => void;
}

function FileNode({ node, depth, selectedFile, onFileClick }: FileNodeProps) {
  const [isExpanded, setIsExpanded] = useState(node.isExpanded ?? true);
  const isSelected = selectedFile === node.path;
  const paddingLeft = depth * 12 + 8;

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick?.(node.path);
    }
  };

  return (
    <div>
      <motion.div
        initial={node.isNew ? { opacity: 0, backgroundColor: 'rgba(124, 92, 252, 0.2)' } : false}
        animate={{ opacity: 1, backgroundColor: 'transparent' }}
        transition={{ duration: 0.8 }}
        className={`flex items-center py-1 cursor-pointer
          ${isSelected 
            ? 'bg-[#7c5cfc]/20 text-white' 
            : 'text-[#e4e4ed] hover:bg-[#1a1a25]'
          }`}
        style={{ paddingLeft }}
        onClick={handleClick}
      >
        {/* Expand/Collapse for folders */}
        {node.type === 'folder' ? (
          <span className="w-4 text-[10px] text-[#8888a0]">
            {isExpanded ? '▼' : '▶'}
          </span>
        ) : (
          <span className="w-4" />
        )}
        
        {/* Icon */}
        <span className="mr-2">
          {node.type === 'folder' ? (
            <FolderIcon isOpen={isExpanded} />
          ) : (
            <FileIcon fileName={node.name} />
          )}
        </span>
        
        {/* Name */}
        <span className={`truncate ${node.isNew ? 'text-[#9d85fc]' : ''}`}>
          {node.name}
        </span>
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {node.type === 'folder' && isExpanded && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {node.children.map((child) => (
              <FileNode
                key={child.path}
                node={child}
                depth={depth + 1}
                selectedFile={selectedFile}
                onFileClick={onFileClick}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FolderIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d={isOpen 
          ? "M1.5 3.5h4l1 1h7a1 1 0 011 1v7a1 1 0 01-1 1h-11a1 1 0 01-1-1v-8a1 1 0 011-1z"
          : "M1.5 3.5h4l1 1h7a1 1 0 011 1v7a1 1 0 01-1 1h-11a1 1 0 01-1-1v-8a1 1 0 011-1z"
        }
        fill={isOpen ? "#dcb67a" : "#c09553"}
      />
    </svg>
  );
}

function FileIcon({ fileName }: { fileName: string }) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  let color = '#808080';
  if (ext === 'md') color = '#519aba';
  if (ext === 'ts' || ext === 'tsx') color = '#3178c6';
  if (ext === 'js' || ext === 'jsx') color = '#f7df1e';
  if (ext === 'json') color = '#cbcb41';
  if (ext === 'yaml' || ext === 'yml') color = '#cb171e';
  if (ext === 'css') color = '#563d7c';

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 1.5h6.5l3 3v10a1 1 0 01-1 1h-8.5a1 1 0 01-1-1v-12a1 1 0 011-1z"
        fill={color}
        fillOpacity="0.8"
      />
      <path
        d="M9.5 1.5v3h3"
        stroke={color}
        strokeWidth="0.5"
      />
    </svg>
  );
}
