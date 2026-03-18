// Demo Session Types

export type Phase = 'INCEPTION' | 'CONSTRUCTION' | 'OPERATIONS';

export type Stage = 
  | 'requirements'
  | 'design'
  | 'code'
  | 'infrastructure'
  | 'deployment';

export interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileTreeNode[];
  isExpanded?: boolean;
  isNew?: boolean;
}

export interface AIResponse {
  phase: Phase;
  stage: Stage;
  content: string;
  timestamp: Date;
}

export interface DemoResult {
  sessionId: string;
  projectIdea: string;
  mvpCode: string;
  awsArchitecture: AWSArchitecture;
  estimate: ProductionEstimate;
  durationMs: number;
  generatedFiles: FileTreeNode[];
}

export interface AWSService {
  id: string;
  name: string;
  icon: string;
  x: number;
  y: number;
}

export interface ServiceConnection {
  from: string;
  to: string;
  label?: string;
}

export interface AWSArchitecture {
  services: AWSService[];
  connections: ServiceConnection[];
}

export interface TeamMember {
  role: string;
  count: number;
  reason?: string;
}

export interface ProductionEstimate {
  traditionalDays: number;
  teamComposition: TeamMember[];
  estimatedDuration: string;
  estimatedTeamSize: number;
}

export interface DemoSessionState {
  sessionId: string;
  projectIdea: string;
  currentPhase: Phase;
  currentStage: Stage;
  files: FileTreeNode[];
  aiResponses: AIResponse[];
  animationProgress: number;
  isComplete: boolean;
  startTime: Date;
  result: DemoResult | null;
}

export interface DemoLog {
  id?: string;
  sessionId: string;
  projectIdea: string;
  completed: boolean;
  durationMs: number;
  timestamp: string;
}
