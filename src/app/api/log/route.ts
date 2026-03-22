import { NextRequest, NextResponse } from 'next/server';
import { LogRequest, LogResponse } from '@/types/api';
import { DemoLog } from '@/types/demo';
import {
  calculateIndustryDistribution,
  calculateSessionTrend,
  extractPopularIdeas,
} from '@/services/StatisticsService';

// In-memory log storage (in production, use a database)
const logs: DemoLog[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: LogRequest = await request.json();
    const { sessionId, projectIdea, completed, durationMs, industry } = body;

    const log: DemoLog = {
      id: `log-${Date.now()}`,
      sessionId,
      projectIdea,
      completed,
      durationMs,
      timestamp: new Date().toISOString(),
      industry,
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
      { success: false, message: '로그 기록에 실패했습니다' },
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
      industryDistribution: calculateIndustryDistribution(logs),
      sessionTrend: calculateSessionTrend(logs),
      popularIdeas: extractPopularIdeas(logs),
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { success: false, message: '로그 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}
