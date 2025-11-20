"""
Authentication routes
Sign up, login, and verify endpoints
"""

from flask import Blueprint, request, jsonify
import jwt

from utils.auth import generate_token, verify_token, token_required
from utils.database import create_user, find_user_by_email, find_user_by_id, verify_password

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """
    Register a new user
    
    Request body:
        {
            "name": "Md Thorat Islam",
            "email": "thoratislam@example.com",
            "password": "password"
        }
        
    Returns:
        {
            "user": { "id": "...", "name": "...", "email": "..." },
            "token": "jwt-token"
        }
    """
    try:
        data = request.get_json()
        
        # Validate input
        if not data:
            return jsonify({'error': 'Request body is required'}), 400
        
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        if not name:
            return jsonify({'error': 'Name is required'}), 400
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        if not password:
            return jsonify({'error': 'Password is required'}), 400
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        # Create user
        user = create_user(name, email, password)
        
        # Generate token
        token = generate_token(user['id'], user['email'])
        
        return jsonify({
            'user': user,
            'token': token
        }), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"Error in signup: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Login existing user
    
    Request body:
        {
            "email": "thoratislam@example.com",
            "password": "password"
        }
        
    Returns:
        {
            "user": { "id": "...", "name": "...", "email": "..." },
            "token": "jwt-token"
        }
    """
    try:
        data = request.get_json()
        
        # Validate input
        if not data:
            return jsonify({'error': 'Request body is required'}), 400
        
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        if not password:
            return jsonify({'error': 'Password is required'}), 400
        
        # Find user
        user = find_user_by_email(email)
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Verify password
        if not verify_password(password, user.password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Generate token
        token = generate_token(user.id, user.email)
        
        # Return user without password
        user_data = {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'createdAt': user.created_at.isoformat() if user.created_at else None
        }
        
        return jsonify({
            'user': user_data,
            'token': token
        }), 200
        
    except Exception as e:
        print(f"Error in login: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/verify', methods=['GET'])
@token_required
def verify():
    """
    Verify JWT token and return user info
    
    Headers:
        Authorization: Bearer <token>
        
    Returns:
        {
            "user": { "id": "...", "name": "...", "email": "..." }
        }
    """
    try:
        user_id = request.user.get('userId')
        
        # Find user
        user = find_user_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user}), 200
        
    except Exception as e:
        print(f"Error in verify: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500
