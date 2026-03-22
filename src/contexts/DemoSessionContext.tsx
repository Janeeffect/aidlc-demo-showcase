'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  DemoSessionState, 
  Phase, 
  Stage, 
  FileTreeNode, 
  AIResponse, 
  DemoResult 
} from '@/types/demo';

// Initial State
const initialState: DemoSessionState = {
  sessionId: '',
  projectIdea: '',
  scenarioId: '',
  currentPhase: 'INCEPTION',
  currentStage: 'requirements',
  files: [],
  aiResponses: [],
  animationProgress: 0,
  isComplete: false,
  startTime: new Date(),
  result: null,
};

// Action Types
type Action =
  | { type: 'INIT_SESSION'; payload: { projectIdea: string } }
  | { type: 'SET_PHASE'; payload: Phase }
  | { type: 'SET_STAGE'; payload: Stage }
  | { type: 'SET_SCENARIO_ID'; payload: string }
  | { type: 'ADD_FILE'; payload: FileTreeNode }
  | { type: 'UPDATE_FILE'; payload: { path: string; updates: Partial<FileTreeNode> } }
  | { type: 'ADD_AI_RESPONSE'; payload: AIResponse }
  | { type: 'SET_PROGRESS'; payload: number }
  | { type: 'SET_RESULT'; payload: DemoResult }
  | { type: 'COMPLETE_DEMO' }
  | { type: 'RESET_SESSION' };

// Reducer
function demoReducer(state: DemoSessionState, action: Action): DemoSessionState {
  switch (action.type) {
    case 'INIT_SESSION':
      return {
        ...initialState,
        sessionId: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
        projectIdea: action.payload.projectIdea,
        startTime: new Date(),
        files: [
          {
            name: 'aidlc-docs',
            path: 'aidlc-docs',
            type: 'folder',
            isExpanded: true,
            children: [],
          },
        ],
      };

    case 'SET_PHASE':
      return { ...state, currentPhase: action.payload };

    case 'SET_STAGE':
      return { ...state, currentStage: action.payload };

    case 'SET_SCENARIO_ID':
      return { ...state, scenarioId: action.payload };

    case 'ADD_FILE':
      return {
        ...state,
        files: addFileToTree(state.files, action.payload),
      };

    case 'UPDATE_FILE':
      return {
        ...state,
        files: updateFileInTree(state.files, action.payload.path, action.payload.updates),
      };

    case 'ADD_AI_RESPONSE':
      return {
        ...state,
        aiResponses: [...state.aiResponses, action.payload],
      };

    case 'SET_PROGRESS':
      return { ...state, animationProgress: action.payload };

    case 'SET_RESULT':
      return { ...state, result: action.payload };

    case 'COMPLETE_DEMO':
      return { ...state, isComplete: true };

    case 'RESET_SESSION':
      return initialState;

    default:
      return state;
  }
}

// Helper: Add file to tree (prevents duplicates)
function addFileToTree(files: FileTreeNode[], newFile: FileTreeNode): FileTreeNode[] {
  const pathParts = newFile.path.split('/');
  
  if (pathParts.length === 1) {
    // Check if file already exists
    const existingIndex = files.findIndex(f => f.name === newFile.name && f.path === newFile.path);
    if (existingIndex !== -1) {
      // Update existing file instead of adding duplicate
      return files.map((f, i) => i === existingIndex ? { ...f, ...newFile, isNew: true } : f);
    }
    return [...files, { ...newFile, isNew: true }];
  }

  const folderName = pathParts[0];
  const existingFolder = files.find(f => f.type === 'folder' && f.name === folderName);
  
  if (existingFolder) {
    return files.map(file => {
      if (file.type === 'folder' && file.name === folderName) {
        const remainingPath = pathParts.slice(1).join('/');
        const childFile = { ...newFile, path: remainingPath, name: pathParts[pathParts.length - 1] };
        
        return {
          ...file,
          isExpanded: true,
          children: addFileToTree(file.children || [], childFile),
        };
      }
      return file;
    });
  } else {
    // Create new folder and add file
    const remainingPath = pathParts.slice(1).join('/');
    const childFile = { ...newFile, path: remainingPath, name: pathParts[pathParts.length - 1] };
    const newFolder: FileTreeNode = {
      name: folderName,
      path: folderName,
      type: 'folder',
      isExpanded: true,
      children: addFileToTree([], childFile),
    };
    return [...files, newFolder];
  }
}

// Helper: Update file in tree
function updateFileInTree(
  files: FileTreeNode[], 
  path: string, 
  updates: Partial<FileTreeNode>
): FileTreeNode[] {
  return files.map(file => {
    if (file.path === path) {
      return { ...file, ...updates };
    }
    if (file.type === 'folder' && file.children) {
      return {
        ...file,
        children: updateFileInTree(file.children, path, updates),
      };
    }
    return file;
  });
}

// Context
interface DemoSessionContextType {
  state: DemoSessionState;
  initSession: (projectIdea: string) => void;
  setPhase: (phase: Phase) => void;
  setStage: (stage: Stage) => void;
  setScenarioId: (scenarioId: string) => void;
  addFile: (file: FileTreeNode) => void;
  updateFile: (path: string, updates: Partial<FileTreeNode>) => void;
  addAIResponse: (response: AIResponse) => void;
  setProgress: (progress: number) => void;
  setResult: (result: DemoResult) => void;
  completeDemo: () => void;
  resetSession: () => void;
}

const DemoSessionContext = createContext<DemoSessionContextType | undefined>(undefined);

// Provider
export function DemoSessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, initialState);

  const value: DemoSessionContextType = {
    state,
    initSession: (projectIdea) => dispatch({ type: 'INIT_SESSION', payload: { projectIdea } }),
    setPhase: (phase) => dispatch({ type: 'SET_PHASE', payload: phase }),
    setStage: (stage) => dispatch({ type: 'SET_STAGE', payload: stage }),
    setScenarioId: (scenarioId) => dispatch({ type: 'SET_SCENARIO_ID', payload: scenarioId }),
    addFile: (file) => dispatch({ type: 'ADD_FILE', payload: file }),
    updateFile: (path, updates) => dispatch({ type: 'UPDATE_FILE', payload: { path, updates } }),
    addAIResponse: (response) => dispatch({ type: 'ADD_AI_RESPONSE', payload: response }),
    setProgress: (progress) => dispatch({ type: 'SET_PROGRESS', payload: progress }),
    setResult: (result) => dispatch({ type: 'SET_RESULT', payload: result }),
    completeDemo: () => dispatch({ type: 'COMPLETE_DEMO' }),
    resetSession: () => dispatch({ type: 'RESET_SESSION' }),
  };

  return (
    <DemoSessionContext.Provider value={value}>
      {children}
    </DemoSessionContext.Provider>
  );
}

// Hook
export function useDemoSession() {
  const context = useContext(DemoSessionContext);
  if (context === undefined) {
    throw new Error('useDemoSession must be used within a DemoSessionProvider');
  }
  return context;
}
