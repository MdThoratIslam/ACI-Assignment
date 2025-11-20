import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { detectObjects } from '@/lib/yolo';

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

    // Get image data
    const { image } = await request.json();
    if (!image) {
      return NextResponse.json(
        { success: false, message: 'Image data required' },
        { status: 400 }
      );
    }

    // Perform object detection
    const detections = await detectObjects(image);

    return NextResponse.json({
      success: true,
      detections,
      annotatedImage: image, // In production, draw boxes on the image
    });
  } catch (error) {
    console.error('Detection error:', error);
    return NextResponse.json(
      { success: false, message: 'Detection failed' },
      { status: 500 }
    );
  }
}
