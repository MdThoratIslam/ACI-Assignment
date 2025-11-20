# SQLite Database Setup

## Overview

The backend now uses **SQLite** for persistent data storage instead of in-memory storage. This provides:
- ✅ Data persistence across server restarts
- ✅ Better performance for production use
- ✅ Easy migration to PostgreSQL/MySQL later
- ✅ Built-in database management tools

## Database File

**Location:** `backend/ai_vision.db`

The database file is automatically created when you first run the application.

---

## Database Schema

### Users Table

| Column     | Type         | Constraints              | Description                    |
|------------|--------------|--------------------------|--------------------------------|
| id         | String(36)   | PRIMARY KEY              | UUID v4                        |
| name       | String(100)  | NOT NULL                 | User's full name               |
| email      | String(120)  | UNIQUE, NOT NULL, INDEX  | User's email address           |
| password   | String(255)  | NOT NULL                 | bcrypt hashed password         |
| created_at | DateTime     | DEFAULT now()            | Account creation timestamp     |

---

## Database Management

### Initialize Database

The database is automatically initialized when you start the server:

```bash
python app.py
```

Output:
```
✅ Database initialized successfully
🚀 Starting AI Vision Platform API on port 5000
```

### Manual Database Commands

Use the `manage_db.py` utility for database operations:

```bash
# Initialize/create tables
python manage_db.py init

# Reset database (drop all tables and recreate)
python manage_db.py reset

# Show all users
python manage_db.py show-users

# Create default admin user
python manage_db.py create-admin
```

---

## Usage Examples

### 1. Create Admin User

```bash
python manage_db.py create-admin
```

**Output:**
```
✅ Admin user created successfully
   Email: admin@example.com
   Password: admin123
   ⚠️  Please change the password after first login!
```

### 2. View All Users

```bash
python manage_db.py show-users
```

**Output:**
```
📊 Total Users: 2

ID                                     Name                 Email                          Created             
--------------------------------------------------------------------------------------------------------------
a1b2c3d4-e5f6-7890-abcd-ef1234567890  Admin User           admin@example.com             2025-11-20 10:30:45
```

### 3. Reset Database

```bash
python manage_db.py reset
```

**Output:**
```
🗑️  Dropped all tables
✅ Database reset successfully
```

---

## SQLAlchemy Configuration

### In `app.py`:

```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ai_vision.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
```

### In `utils/database.py`:

```python
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

---

## Migration to PostgreSQL/MySQL

To migrate from SQLite to PostgreSQL or MySQL, simply update the database URI:

### PostgreSQL:

```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@localhost/ai_vision'
```

### MySQL:

```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://user:password@localhost/ai_vision'
```

### Install Required Drivers:

```bash
# PostgreSQL
pip install psycopg2-binary

# MySQL
pip install PyMySQL
```

---

## Backup & Restore

### Backup Database

```bash
# Copy the SQLite file
cp ai_vision.db ai_vision_backup.db
```

### Restore Database

```bash
# Replace with backup
cp ai_vision_backup.db ai_vision.db
```

### Export to SQL

```bash
# Install sqlite3 (usually pre-installed)
sqlite3 ai_vision.db .dump > backup.sql
```

### Import from SQL

```bash
sqlite3 ai_vision.db < backup.sql
```

---

## Querying the Database

### Using Python Shell

```bash
cd backend
.\venv\Scripts\Activate.ps1
python
```

```python
from app import app
from utils.database import db, User

with app.app_context():
    # Get all users
    users = User.query.all()
    for user in users:
        print(f"{user.name} - {user.email}")
    
    # Find user by email
    user = User.query.filter_by(email='admin@example.com').first()
    print(user.name)
    
    # Count users
    count = User.query.count()
    print(f"Total users: {count}")
```

### Using SQLite CLI

```bash
# Open database
sqlite3 ai_vision.db

# Show tables
.tables

# Show schema
.schema users

# Query users
SELECT * FROM users;

# Exit
.quit
```

---

## Common Operations

### Add New User (Python)

```python
from app import app
from utils.database import db, User, create_user

with app.app_context():
    user = create_user('Jane Doe', 'jane@example.com', 'password123')
    print(f"Created user: {user['name']}")
```

### Delete User (Python)

```python
from app import app
from utils.database import db, User

with app.app_context():
    user = User.query.filter_by(email='jane@example.com').first()
    if user:
        db.session.delete(user)
        db.session.commit()
        print("User deleted")
```

### Update User (Python)

```python
from app import app
from utils.database import db, User

with app.app_context():
    user = User.query.filter_by(email='jane@example.com').first()
    if user:
        user.name = 'Jane Smith'
        db.session.commit()
        print("User updated")
```

---

## Security Best Practices

1. **Never commit `ai_vision.db` to git** - Already in `.gitignore`
2. **Backup regularly** - Automate backups in production
3. **Use environment variables** - Store sensitive config in `.env`
4. **Encrypt sensitive data** - Passwords are bcrypt hashed
5. **Use migrations** - For production, use Alembic for schema changes

---

## Troubleshooting

### Database locked error

```bash
# Close all connections and restart
rm ai_vision.db
python app.py
```

### Permission denied

```bash
# Check file permissions
chmod 644 ai_vision.db
```

### Table doesn't exist

```bash
# Reinitialize database
python manage_db.py reset
```

### Can't open database

```bash
# Ensure you're in the correct directory
cd backend
python app.py
```

---

## Production Recommendations

1. **Use PostgreSQL** for production (better concurrency)
2. **Set up automated backups** (cron job or scheduled task)
3. **Use connection pooling** (SQLAlchemy provides this)
4. **Monitor database performance** (query logging)
5. **Use Alembic** for database migrations
6. **Set up read replicas** for high traffic

---

## Next Steps

1. ✅ Database is set up and running
2. Create admin user: `python manage_db.py create-admin`
3. Test authentication endpoints
4. Monitor database file size
5. Set up automated backups
6. Consider migration to PostgreSQL for production

---

**Database Status: ✅ ACTIVE**

The SQLite database is now running and persisting all user data across server restarts!
