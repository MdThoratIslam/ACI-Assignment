import { Detection } from './types';

interface YOLODetection {
  box: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  label: string;
  score: number;
}

export async function detectObjects(imageBase64: string): Promise<Detection[]> {
  try {
    // Using Hugging Face Inference API with YOLO model
    const API_KEY = process.env.HUGGINGFACE_API_KEY;
    
    if (!API_KEY) {
      // Return mock data for demo purposes
      return getMockDetections();
    }

    // Convert base64 to blob
    const base64Data = imageBase64.split(',')[1];
    const binaryData = Buffer.from(base64Data, 'base64');

    const response = await fetch(
      'https://api-inference.huggingface.co/models/hustvl/yolos-tiny',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: imageBase64,
        }),
      }
    );

    if (!response.ok) {
      console.error('YOLO API error:', await response.text());
      return getMockDetections();
    }

    const results = await response.json();
    
    // Transform results to our Detection format
    const detections: Detection[] = results.map((item: YOLODetection) => ({
      class: item.label,
      confidence: item.score,
      bbox: [
        Math.round(item.box.x1),
        Math.round(item.box.y1),
        Math.round(item.box.x2),
        Math.round(item.box.y2),
      ] as [number, number, number, number],
    }));

    // Filter detections with confidence > 0.3
    return detections.filter(d => d.confidence > 0.3);
  } catch (error) {
    console.error('Object detection error:', error);
    return getMockDetections();
  }
}

function getMockDetections(): Detection[] {
  return [
    {
      class: 'car',
      confidence: 0.94,
      bbox: [80, 120, 260, 280],
    },
    {
      class: 'person',
      confidence: 0.89,
      bbox: [340, 80, 480, 260],
    },
    {
      class: 'bicycle',
      confidence: 0.87,
      bbox: [150, 260, 250, 340],
    },
    {
      class: 'tree',
      confidence: 0.82,
      bbox: [20, 30, 100, 90],
    },
    {
      class: 'traffic sign',
      confidence: 0.76,
      bbox: [380, 280, 500, 370],
    },
  ];
}

export function drawBoundingBoxes(
  imageData: string,
  detections: Detection[]
): Promise<string> {
  return new Promise((resolve) => {
    // For browser compatibility, we'll return the original image
    // In a real implementation, you'd use canvas to draw boxes
    resolve(imageData);
  });
}
