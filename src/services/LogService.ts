import { DemoLog } from '@/types/demo';
import { LogRequest, LogStatistics } from '@/types/api';

export class LogService {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  // Save a log entry
  async saveLog(log: LogRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    });

    if (!response.ok) {
      throw new Error(`Failed to save log: ${response.statusText}`);
    }
  }

  // Get log statistics
  async getStatistics(): Promise<LogStatistics & { recentLogs: DemoLog[] }> {
    const response = await fetch(`${this.baseUrl}/api/log`);

    if (!response.ok) {
      throw new Error(`Failed to get statistics: ${response.statusText}`);
    }

    return response.json();
  }

  // Log demo start
  async logStart(sessionId: string, projectIdea: string, industry?: string): Promise<void> {
    await this.saveLog({
      sessionId,
      projectIdea,
      completed: false,
      durationMs: 0,
      industry,
    });
  }

  // Log demo completion
  async logComplete(
    sessionId: string,
    projectIdea: string,
    durationMs: number
  ): Promise<void> {
    await this.saveLog({
      sessionId,
      projectIdea,
      completed: true,
      durationMs,
    });
  }
}

// Singleton instance
export const logService = new LogService();
