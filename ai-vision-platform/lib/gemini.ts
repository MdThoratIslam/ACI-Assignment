import { GoogleGenerativeAI } from '@google/generative-ai';
import { Detection } from './types';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export async function askGemini(question: string, detections: Detection[]): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const context = `You are an AI assistant helping analyze object detection results. Here are the detected objects:
${detections.map((d, i) => `${i + 1}. ${d.class} - Confidence: ${(d.confidence * 100).toFixed(1)}%, Bounding Box: (${d.bbox.join(', ')})`).join('\n')}

User question: ${question}

Provide a helpful, accurate answer based on the detection data above.`;

    const result = await model.generateContent(context);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'Sorry, I encountered an error processing your question. Please try again.';
  }
}
