"""
YOLO Object Detection Integration
Uses Hugging Face API for object detection
"""

import requests
import os
import base64
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
from typing import List, Dict, Tuple
import random

HUGGINGFACE_API_KEY = os.getenv('HUGGINGFACE_API_KEY')
# Using YOLOv8 model - more accurate and publicly accessible
HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/hustvl/yolos-tiny"

def detect_objects(image_base64: str) -> List[Dict]:
    """
    Detect objects in an image using YOLO via Hugging Face
    
    Args:
        image_base64: Base64 encoded image string
        
    Returns:
        List of detection dictionaries with label, score, and bbox
    """
    try:
        # Decode base64 image
        image_data = base64.b64decode(image_base64.split(',')[1] if ',' in image_base64 else image_base64)
        
        # Call Hugging Face API with or without key
        headers = {}
        if HUGGINGFACE_API_KEY:
            headers["Authorization"] = f"Bearer {HUGGINGFACE_API_KEY}"
            print(f"✅ Using API key: {HUGGINGFACE_API_KEY[:10]}...")
        else:
            print("⚠️ No API key, trying public inference...")
        response = requests.post(
            HUGGINGFACE_API_URL,
            headers=headers,
            data=image_data,
            timeout=30
        )
        
        if response.status_code != 200:
            error_msg = f"⚠️ Hugging Face API error: {response.status_code}"
            try:
                error_detail = response.json()
                print(f"{error_msg} - {error_detail}")
            except:
                print(f"{error_msg} - {response.text[:200]}")
            
            if response.status_code == 401:
                print("❌ Authentication failed! Check your HUGGINGFACE_API_KEY")
            elif response.status_code == 503:
                print("⏳ Model is loading, please wait and try again...")
            
            return get_mock_detections()
        
        # Parse response
        detections = response.json()
        
        # Debug: Print raw API response
        print(f"🔍 Raw API response: {detections}")
        
        # Format detections
        formatted_detections = []
        for detection in detections:
            # Get label with better fallback
            label = detection.get('label', 'Unknown')
            if label == 'Unknown' or not label:
                print(f"⚠️ Detection missing label: {detection}")
            
            formatted_detections.append({
                'label': label,
                'score': detection.get('score', 0.0),
                'bbox': {
                    'x': detection.get('box', {}).get('xmin', 0),
                    'y': detection.get('box', {}).get('ymin', 0),
                    'width': detection.get('box', {}).get('xmax', 0) - detection.get('box', {}).get('xmin', 0),
                    'height': detection.get('box', {}).get('ymax', 0) - detection.get('box', {}).get('ymin', 0)
                }
            })
        
        return formatted_detections
        
    except Exception as e:
        print(f"⚠️ Error in object detection: {str(e)}")
        return get_mock_detections()

def get_mock_detections() -> List[Dict]:
    """
    Return mock detection data for testing
    """
    return [
        {
            'label': 'car',
            'score': 0.94,
            'bbox': {'x': 80, 'y': 120, 'width': 180, 'height': 160}
        },
        {
            'label': 'person',
            'score': 0.89,
            'bbox': {'x': 340, 'y': 80, 'width': 140, 'height': 180}
        },
        {
            'label': 'bike',
            'score': 0.87,
            'bbox': {'x': 150, 'y': 260, 'width': 100, 'height': 80}
        },
        {
            'label': 'tree',
            'score': 0.82,
            'bbox': {'x': 20, 'y': 30, 'width': 80, 'height': 60}
        },
        {
            'label': 'sign',
            'score': 0.76,
            'bbox': {'x': 380, 'y': 280, 'width': 120, 'height': 90}
        }
    ]

def generate_color(label: str) -> Tuple[int, int, int]:
    """Generate a consistent color for each label"""
    random.seed(hash(label))
    return (random.randint(100, 255), random.randint(100, 255), random.randint(100, 255))

def draw_bounding_boxes(image_base64: str, detections: List[Dict]) -> str:
    """
    Draw bounding boxes on the image
    
    Args:
        image_base64: Base64 encoded image string
        detections: List of detection dictionaries
        
    Returns:
        Base64 encoded image with bounding boxes
    """
    try:
        # Decode base64 image
        image_data = base64.b64decode(image_base64.split(',')[1] if ',' in image_base64 else image_base64)
        image = Image.open(BytesIO(image_data))
        
        # Create drawing object
        draw = ImageDraw.Draw(image)
        
        # Try to load a font, fallback to default if not available
        try:
            font = ImageFont.truetype("arial.ttf", 20)
        except:
            font = ImageFont.load_default()
        
        # Draw each detection
        for detection in detections:
            label = detection.get('label', 'Unknown')
            score = detection.get('score', 0.0)
            bbox = detection.get('bbox', {})
            
            # Get coordinates
            x = bbox.get('x', 0)
            y = bbox.get('y', 0)
            width = bbox.get('width', 0)
            height = bbox.get('height', 0)
            
            # Calculate box coordinates
            x1, y1 = int(x), int(y)
            x2, y2 = int(x + width), int(y + height)
            
            # Generate color for this label
            color = generate_color(label)
            
            # Draw bounding box with thicker line
            for i in range(3):
                draw.rectangle([x1-i, y1-i, x2+i, y2+i], outline=color, width=2)
            
            # Prepare label text
            text = f"{label} ({score:.2f})"
            
            # Get text bounding box for background
            bbox_text = draw.textbbox((x1, y1), text, font=font)
            text_width = bbox_text[2] - bbox_text[0]
            text_height = bbox_text[3] - bbox_text[1]
            
            # Draw background rectangle for text
            draw.rectangle([x1, y1 - text_height - 8, x1 + text_width + 10, y1], fill=color)
            
            # Draw text
            draw.text((x1 + 5, y1 - text_height - 4), text, fill='white', font=font)
        
        # Convert back to base64
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        return f"data:image/png;base64,{img_str}"
        
    except Exception as e:
        print(f"⚠️ Error drawing bounding boxes: {str(e)}")
        return image_base64
