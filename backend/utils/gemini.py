"""
Google Gemini AI Integration
Context-aware Q&A system
"""

import google.generativeai as genai
import os
from typing import List, Dict

GOOGLE_GEMINI_API_KEY = os.getenv('GOOGLE_GEMINI_API_KEY')

# Configure Gemini API
if GOOGLE_GEMINI_API_KEY:
    genai.configure(api_key=GOOGLE_GEMINI_API_KEY)

def ask_gemini(question: str, detections: List[Dict]) -> str:
    """
    Ask Gemini AI a question with detection context
    
    Args:
        question: User's question
        detections: List of detected objects
        
    Returns:
        AI-generated answer
    """
    try:
        print(f"🔍 ask_gemini called with question: '{question}'")
        print(f"🔍 Detections received: {len(detections)} items")
        
        # If API key is not set, return mock response
        if not GOOGLE_GEMINI_API_KEY:
            print("⚠️ GOOGLE_GEMINI_API_KEY not set, returning mock response")
            return get_mock_response(question, detections)
        
        # Build context from detections
        context = build_context(detections)
        
        # Create prompt
        prompt = f"""You are an AI assistant for an object detection system. You have access to the following detected objects in an image:

{context}

User question: {question}

Please provide a helpful, accurate, and concise answer based on the detected objects. If the question cannot be answered with the available information, politely explain what information is available."""
        
        # Generate response using Gemini 2.0 Flash
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        response = model.generate_content(prompt)
        
        return response.text
        
    except Exception as e:
        print(f"⚠️ Error calling Gemini API: {str(e)}")
        return get_mock_response(question, detections)

def build_context(detections: List[Dict]) -> str:
    """
    Build context string from detections
    
    Args:
        detections: List of detected objects
        
    Returns:
        Formatted context string
    """
    if not detections:
        return "No objects detected in the image."
    
    context_lines = []
    for i, detection in enumerate(detections, 1):
        label = detection.get('label', 'Unknown')
        score = detection.get('score', 0.0)
        bbox = detection.get('bbox', {})
        
        context_lines.append(
            f"{i}. {label} (confidence: {score:.1%}, "
            f"location: x={bbox.get('x', 0)}, y={bbox.get('y', 0)}, "
            f"width={bbox.get('width', 0)}, height={bbox.get('height', 0)})"
        )
    
    return "\n".join(context_lines)

def get_mock_response(question: str, detections: List[Dict]) -> str:
    """
    Generate intelligent mock response based on detections
    """
    if not detections:
        return "I don't see any objects in the image. Could you upload an image with detectable objects?"
    
    object_count = len(detections)
    # Handle both 'label' and 'class' keys, and both 'score' and 'confidence' keys
    objects = [d.get('label') or d.get('class', 'Unknown') for d in detections]
    objects_list = ", ".join(objects[:-1]) + (f", and {objects[-1]}" if len(objects) > 1 else objects[0])
    
    # Helper function to get confidence value
    def get_confidence(d):
        conf = d.get('score') or d.get('confidence', 0)
        return conf if conf <= 1 else conf / 100
    
    question_lower = question.lower()
    
    # Count questions with confidence threshold
    if any(word in question_lower for word in ["how many", "count", "number of"]):
        # Check if asking about specific confidence level
        import re
        confidence_match = re.search(r'(\d+)%?\s*(?:confidence|percent)', question_lower)
        
        if confidence_match and any(word in question_lower for word in ["above", "over", "more than", "greater than", "higher than"]):
            threshold = int(confidence_match.group(1)) / 100
            high_conf_objects = [d for d in detections if get_confidence(d) > threshold]
            count = len(high_conf_objects)
            if count > 0:
                high_conf_labels = [d.get('label') or d.get('class', 'Unknown') for d in high_conf_objects]
                return f"There are {count} objects detected with confidence above {int(threshold*100)}%: {', '.join(high_conf_labels)}."
            else:
                return f"No objects were detected with confidence above {int(threshold*100)}%."
        
        elif confidence_match and any(word in question_lower for word in ["below", "under", "less than", "lower than"]):
            threshold = int(confidence_match.group(1)) / 100
            low_conf_objects = [d for d in detections if get_confidence(d) < threshold]
            count = len(low_conf_objects)
            if count > 0:
                low_conf_labels = [d.get('label') or d.get('class', 'Unknown') for d in low_conf_objects]
                return f"There are {count} objects detected with confidence below {int(threshold*100)}%: {', '.join(low_conf_labels)}."
            else:
                return f"No objects were detected with confidence below {int(threshold*100)}%."
        
        # Default count response
        conf = get_confidence(detections[0])
        return f"I can see {object_count} objects in the image: {objects_list}. The most confident detection is {objects[0]} at {conf*100:.0f}% confidence."
    
    # What/Which questions
    elif any(word in question_lower for word in ["what", "which", "identify"]):
        return f"The image contains {objects_list}. These objects were detected with varying confidence levels, with {objects[0]} being the most prominent."
    
    # Highest confidence
    elif any(word in question_lower for word in ["highest", "most confident", "best"]):
        best = max(detections, key=lambda x: get_confidence(x))
        label = best.get('label') or best.get('class', 'Unknown')
        return f"The object detected with highest confidence is {label} at {get_confidence(best)*100:.0f}% confidence."
    
    # Lowest confidence
    elif any(word in question_lower for word in ["lowest", "least confident", "worst"]):
        worst = min(detections, key=lambda x: get_confidence(x))
        label = worst.get('label') or worst.get('class', 'Unknown')
        return f"The object with lowest confidence is {label} at {get_confidence(worst)*100:.0f}% confidence."
    
    # Largest/biggest object
    elif any(word in question_lower for word in ["largest", "biggest", "largest object", "biggest object"]):
        def get_area(d):
            bbox = d['bbox']
            if isinstance(bbox, dict):
                return bbox.get('width', 0) * bbox.get('height', 0)
            else:
                return (bbox[2] - bbox[0]) * (bbox[3] - bbox[1])
        
        largest = max(detections, key=lambda x: get_area(x))
        label = largest.get('label') or largest.get('class', 'Unknown')
        bbox = largest['bbox']
        area = get_area(largest)
        return f"The largest object is {label} with {get_confidence(largest)*100:.0f}% confidence. It has an area of {area:.0f} square pixels."
    
    # Smallest object
    elif any(word in question_lower for word in ["smallest", "tiniest", "smallest object"]):
        def get_area(d):
            bbox = d['bbox']
            if isinstance(bbox, dict):
                return bbox.get('width', 0) * bbox.get('height', 0)
            else:
                return (bbox[2] - bbox[0]) * (bbox[3] - bbox[1])
        
        smallest = min(detections, key=lambda x: get_area(x))
        label = smallest.get('label') or smallest.get('class', 'Unknown')
        return f"The smallest object is {label} with {get_confidence(smallest)*100:.0f}% confidence."
    
    # Specific object queries
    elif any(obj.lower() in question_lower for obj in objects):
        for detection in detections:
            label = detection.get('label') or detection.get('class', 'Unknown')
            if label.lower() in question_lower:
                bbox = detection['bbox']
                x = bbox.get('x') if isinstance(bbox, dict) else bbox[0]
                y = bbox.get('y') if isinstance(bbox, dict) else bbox[1]
                w = bbox.get('width') if isinstance(bbox, dict) else (bbox[2] - bbox[0])
                h = bbox.get('height') if isinstance(bbox, dict) else (bbox[3] - bbox[1])
                return f"Yes, I can see a {label} with {get_confidence(detection)*100:.0f}% confidence. It's located at position (x: {x}, y: {y}) with dimensions {w}x{h} pixels."
    
    # Location questions
    elif any(word in question_lower for word in ["where", "location", "position"]):
        bbox = detections[0]['bbox']
        x = bbox.get('x') if isinstance(bbox, dict) else bbox[0]
        y = bbox.get('y') if isinstance(bbox, dict) else bbox[1]
        return f"The detected objects are positioned throughout the image. {objects[0]} is at ({x}, {y}), while others are distributed across different areas."
    
    # Default intelligent response
    else:
        confidences = [get_confidence(d) for d in detections]
        return f"Based on the image analysis, I detected {object_count} objects: {objects_list}. The detection confidence ranges from {min(confidences)*100:.0f}% to {max(confidences)*100:.0f}%. What specific aspect would you like to know more about?"
