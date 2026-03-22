import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { StartDemoRequest, StartDemoResponse } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    const body: StartDemoRequest = await request.json();
    const { projectIdea } = body;

    if (!projectIdea || projectIdea.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: '프로젝트 아이디어를 입력해주세요' },
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
      { success: false, message: '데모 시작에 실패했습니다' },
      { status: 500 }
    );
  }
}
