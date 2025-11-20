"""
SQLite database with SQLAlchemy ORM
User management with proper database persistence
"""

import bcrypt
from typing import Optional, Dict
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

# Initialize SQLAlchemy
db = SQLAlchemy()

class User(db.Model):
    """User model for SQLite database"""
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<User {self.email}>'
    
    def to_dict(self):
        """Convert user to dictionary (without password)"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }

def init_db(app):
    """
    Initialize database with Flask app
    
    Args:
        app: Flask application instance
    """
    db.init_app(app)
    with app.app_context():
        db.create_all()
        print("✅ Database initialized successfully")

def create_user(name: str, email: str, password: str) -> Dict:
    """
    Create a new user
    
    Args:
        name: User's full name
        email: User's email address
        password: Plain text password (will be hashed)
        
    Returns:
        User dictionary without password
        
    Raises:
        ValueError: If email already exists
    """
    # Check if user already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        raise ValueError('User with this email already exists')
    
    # Hash password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    
    # Create user
    user = User(
        name=name,
        email=email,
        password=hashed_password.decode('utf-8')
    )
    
    db.session.add(user)
    db.session.commit()
    
    return user.to_dict()

def find_user_by_email(email: str) -> Optional[User]:
    """
    Find user by email address
    
    Args:
        email: User's email address
        
    Returns:
        User model instance or None if not found
    """
    return User.query.filter_by(email=email).first()

def find_user_by_id(user_id: str) -> Optional[Dict]:
    """
    Find user by ID
    
    Args:
        user_id: User's ID
        
    Returns:
        User dictionary without password, or None if not found
    """
    user = User.query.filter_by(id=user_id).first()
    if user:
        return user.to_dict()
    return None

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password against hash
    
    Args:
        plain_password: Plain text password
        hashed_password: Hashed password from database
        
    Returns:
        True if password matches, False otherwise
    """
    return bcrypt.checkpw(
        plain_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )
