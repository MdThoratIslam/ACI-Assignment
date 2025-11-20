import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { askGemini } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get question and detections
    const { question, detections } = await request.json();
    if (!question || !detections) {
      return NextResponse.json(
        { success: false, message: 'Question and detections required' },
        { status: 400 }
      );
    }

    // Ask Gemini
    const answer = await askGemini(question, detections);

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error('Q&A error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process question' },
      { status: 500 }
    );
  }
}
