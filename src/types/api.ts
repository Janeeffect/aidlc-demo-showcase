// API Types

import { Phase, Stage, AWSArchitecture, ProductionEstimate, DemoLog } from './demo';

// /api/demo/start
export interface StartDemoRequest {
  projectIdea: string;
}

export interface StartDemoResponse {
  sessionId: string;
  status: 'started';
}

// /api/demo/stream
export interface StreamParams {
  sessionId: string;
  phase: Phase;
  stage: Stage;
  projectIdea: string;
}

export interface AIChunk {
  type: 'text' | 'code' | 'file' | 'done';
  content: string;
  fileName?: string;
}

// /api/demo/estimate
export interface EstimateRequest {
  sessionId: string;
  projectIdea: string;
  requirements: string;
  design: string;
}

export interface EstimateResponse extends ProductionEstimate {
  mvpCode: string;
  awsArchitecture: AWSArchitecture;
}

// /api/log
export interface LogRequest {
  sessionId: string;
  projectIdea: string;
  completed: boolean;
  durationMs: number;
  industry?: string;
}

export interface LogResponse {
  status: 'logged';
}

// Log Statistics
export interface LogStatistics {
  totalSessions: number;
  completedSessions: number;
  completionRate: number;
  averageDuration: number;
  popularKeywords: { keyword: string; count: number }[];
}


// Unified Error Response
export interface ApiErrorResponse {
  success: false;
  message: string;
}

export interface IndustryDistribution {
  industry: string;
  count: number;
  percentage: number;
}

export interface SessionTrend {
  hour: string;
  count: number;
}

export interface PopularIdea {
  idea: string;
  count: number;
}
