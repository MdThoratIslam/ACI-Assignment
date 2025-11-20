"""Test login functionality"""
import requests
import json

# Test login
url = "http://localhost:5000/api/auth/login"
data = {
    "email": "thoratislam@example.com",
    "password": "password"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    if response.status_code == 200:
        print("\n✅ Login successful!")
        result = response.json()
        print(f"User: {result.get('user')}")
        print(f"Token: {result.get('token')[:50]}...")
    else:
        print(f"\n❌ Login failed: {response.json().get('error')}")
except Exception as e:
    print(f"❌ Error: {str(e)}")
