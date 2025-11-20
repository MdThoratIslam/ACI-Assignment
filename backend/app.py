"""
AI Vision Platform - Flask Backend
Main application entry point
"""

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from routes.auth import auth_bp
from routes.detect import detect_bp
from routes.qa import qa_bp
from utils.database import init_db

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET', 'your-secret-key')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ai_vision.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
init_db(app)

# Enable CORS for Next.js frontend
CORS(app, origins=['http://localhost:3000', 'http://localhost:3001'])

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(detect_bp, url_prefix='/api')
app.register_blueprint(qa_bp, url_prefix='/api')

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return {'status': 'ok', 'message': 'AI Vision Platform API is running'}, 200

@app.errorhandler(404)
def not_found(error):
    return {'error': 'Endpoint not found'}, 404

@app.errorhandler(500)
def internal_error(error):
    return {'error': 'Internal server error'}, 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    print(f"🚀 Starting AI Vision Platform API on port {port}")
    print(f"📍 Health check: http://localhost:{port}/health")
    print(f"🔐 Auth endpoints: http://localhost:{port}/api/auth/*")
    print(f"🎯 Detection endpoint: http://localhost:{port}/api/detect")
    print(f"💬 Q&A endpoint: http://localhost:{port}/api/qa")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
