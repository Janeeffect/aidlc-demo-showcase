import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, company, projectIdea, outputs, estimate } = body;

    // 로그 저장 (실제 환경에서는 DB에 저장)
    const logEntry = {
      timestamp: new Date().toISOString(),
      email,
      name,
      company,
      projectIdea,
      outputs,
      estimate,
    };

    console.log('[Report Request]', JSON.stringify(logEntry, null, 2));

    // 실제 환경에서는 여기서 이메일 전송 로직 구현
    // AWS SES, SendGrid 등 사용 가능
    
    // 데모용으로 성공 응답 반환
    return NextResponse.json({
      success: true,
      message: '리포트가 이메일로 전송되었습니다.',
      logId: `LOG-${Date.now()}`,
    });
  } catch (error) {
    console.error('[Report Error]', error);
    return NextResponse.json(
      { success: false, message: '리포트 전송에 실패했습니다.' },
      { status: 500 }
    );
  }
}
