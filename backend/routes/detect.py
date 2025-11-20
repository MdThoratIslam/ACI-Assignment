"""
Object detection route
YOLO-based image analysis
"""

from flask import Blueprint, request, jsonify

from utils.auth import token_required
from utils.yolo import detect_objects, draw_bounding_boxes

detect_bp = Blueprint('detect', __name__)

@detect_bp.route('/detect', methods=['POST'])
@token_required
def detect():
    """
    Detect objects in an uploaded image
    
    Headers:
        Authorization: Bearer <token>
        
    Request body:
        {
            "image": "data:image/jpeg;base64,..."
        }
        
    Returns:
        {
            "detections": [
                {
                    "label": "person",
                    "score": 0.95,
                    "bbox": { "x": 100, "y": 50, "width": 200, "height": 300 }
                },
                ...
            ]
        }
    """
    try:
        data = request.get_json()
        
        # Validate input
        if not data:
            return jsonify({'error': 'Request body is required'}), 400
        
        image = data.get('image')
        if not image:
            return jsonify({'error': 'Image is required'}), 400
        
        # Validate base64 format
        if not image.startswith('data:image'):
            return jsonify({'error': 'Invalid image format. Expected base64 data URL'}), 400
        
        # Detect objects
        detections = detect_objects(image)
        
        # Draw bounding boxes on the image
        annotated_image = draw_bounding_boxes(image, detections)
        
        return jsonify({
            'detections': detections,
            'annotatedImage': annotated_image
        }), 200
        
    except Exception as e:
        print(f"Error in detection: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500
