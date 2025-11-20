"""
Q&A route
AI-powered question answering with detection context
"""

from flask import Blueprint, request, jsonify

from utils.auth import token_required
from utils.gemini import ask_gemini

qa_bp = Blueprint('qa', __name__)

@qa_bp.route('/qa', methods=['POST'])
@token_required
def qa():
    """
    Ask AI a question about detected objects
    
    Headers:
        Authorization: Bearer <token>
        
    Request body:
        {
            "question": "What objects do you see?",
            "detections": [
                {
                    "label": "person",
                    "score": 0.95,
                    "bbox": { "x": 100, "y": 50, "width": 200, "height": 300 }
                },
                ...
            ]
        }
        
    Returns:
        {
            "answer": "I can see a person, a car, and a dog in the image..."
        }
    """
    try:
        data = request.get_json()
        
        # Validate input
        if not data:
            print("❌ No request body")
            return jsonify({'error': 'Request body is required'}), 400
        
        question = data.get('question', '').strip()
        detections = data.get('detections', [])
        
        print(f"📝 Q&A Request - Question: {question}")
        print(f"📝 Q&A Request - Detections count: {len(detections)}")
        
        if not question:
            print("❌ No question provided")
            return jsonify({'error': 'Question is required'}), 400
        
        if not isinstance(detections, list):
            print("❌ Detections is not a list")
            return jsonify({'error': 'Detections must be an array'}), 400
        
        # Get AI answer
        print(f"🤖 Calling ask_gemini...")
        answer = ask_gemini(question, detections)
        print(f"✅ Answer generated: {answer[:100]}...")
        
        return jsonify({'answer': answer}), 200
        
    except Exception as e:
        print(f"❌ Error in Q&A: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500
