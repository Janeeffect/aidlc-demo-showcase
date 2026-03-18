import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { StartDemoRequest, StartDemoResponse } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    const body: StartDemoRequest = await request.json();
    const { projectIdea } = body;

    if (!projectIdea || projectIdea.trim().length === 0) {
      return NextResponse.json(
        { error: 'Project idea is required' },
        { status: 400 }
      );
    }

    const sessionId = uuidv4();

    // Log session start (in production, save to database)
    console.log(`[Demo Start] Session: ${sessionId}, Idea: ${projectIdea}`);

    const response: StartDemoResponse = {
      sessionId,
      status: 'started',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error starting demo:', error);
    return NextResponse.json(
      { error: 'Failed to start demo' },
      { status: 500 }
    );
  }
}
