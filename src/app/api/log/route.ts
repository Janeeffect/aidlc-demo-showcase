import { NextRequest, NextResponse } from 'next/server';
import { LogRequest, LogResponse } from '@/types/api';
import { DemoLog } from '@/types/demo';

// In-memory log storage (in production, use a database)
const logs: DemoLog[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: LogRequest = await request.json();
    const { sessionId, projectIdea, completed, durationMs } = body;

    const log: DemoLog = {
      id: `log-${Date.now()}`,
      sessionId,
      projectIdea,
      completed,
      durationMs,
      timestamp: new Date().toISOString(),
    };

    logs.push(log);

    // Log to console (in production, save to database)
    console.log('[Demo Log]', JSON.stringify(log, null, 2));

    const response: LogResponse = {
      status: 'logged',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error logging:', error);
    return NextResponse.json(
      { error: 'Failed to log' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return all logs (in production, add authentication and pagination)
    const statistics = {
      totalSessions: logs.length,
      completedSessions: logs.filter(l => l.completed).length,
      completionRate: logs.length > 0 
        ? (logs.filter(l => l.completed).length / logs.length) * 100 
        : 0,
      averageDuration: logs.length > 0
        ? logs.reduce((sum, l) => sum + l.durationMs, 0) / logs.length
        : 0,
      recentLogs: logs.slice(-10).reverse(),
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}
