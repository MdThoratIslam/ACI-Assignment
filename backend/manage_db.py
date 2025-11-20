"""
Database management utility
Commands: init, reset, show-users, create-admin
"""

import sys
import os
from flask import Flask
from dotenv import load_dotenv
import bcrypt

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.database import db, User, init_db

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ai_vision.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET', 'your-secret-key')

# Initialize database
db.init_app(app)

def init_database():
    """Initialize/create database tables"""
    with app.app_context():
        db.create_all()
        print("✅ Database tables created successfully")

def reset_database():
    """Drop all tables and recreate"""
    with app.app_context():
        db.drop_all()
        print("🗑️  Dropped all tables")
        db.create_all()
        print("✅ Database reset successfully")

def show_users():
    """Display all users"""
    with app.app_context():
        users = User.query.all()
        if not users:
            print("No users found in database")
            return
        
        print(f"\n📊 Total Users: {len(users)}\n")
        print(f"{'ID':<38} {'Name':<20} {'Email':<30} {'Created':<20}")
        print("-" * 110)
        for user in users:
            created = user.created_at.strftime('%Y-%m-%d %H:%M:%S') if user.created_at else 'N/A'
            print(f"{user.id:<38} {user.name:<20} {user.email:<30} {created:<20}")
        print()

def create_admin():
    """Create an admin user"""
    with app.app_context():
        # Check if admin exists
        existing = User.query.filter_by(email='thoratislam@example.com').first()
        if existing:
            print("⚠️  Admin user already exists")
            return
        
        # Create admin
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw('password'.encode('utf-8'), salt)
        
        admin = User(
            name='Md Thorat Islam',
            email='thoratislam@example.com',
            password=hashed_password.decode('utf-8')
        )
        
        db.session.add(admin)
        db.session.commit()
        
        print("✅ Admin user created successfully")
        print("   Email: thoratislam@example.com")
        print("   Password: password")
        print("   ⚠️  Please change the password after first login!")

def main():
    """Main command handler"""
    if len(sys.argv) < 2:
        print("Usage: python manage_db.py <command>")
        print("\nAvailable commands:")
        print("  init         - Initialize database (create tables)")
        print("  reset        - Reset database (drop and recreate all tables)")
        print("  show-users   - Display all users in database")
        print("  create-admin - Create default admin user")
        return
    
    command = sys.argv[1]
    
    commands = {
        'init': init_database,
        'reset': reset_database,
        'show-users': show_users,
        'create-admin': create_admin
    }
    
    if command not in commands:
        print(f"❌ Unknown command: {command}")
        print(f"Available commands: {', '.join(commands.keys())}")
        return
    
    commands[command]()

if __name__ == '__main__':
    main()
