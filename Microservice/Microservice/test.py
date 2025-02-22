import requests
import json
from time import sleep

def print_response(response):
    """Pretty print the response from the server"""
    print("\nStatus Code:", response.status_code)
    print("Response Content:", response.text)  # Print raw response text
    try:
        json_response = response.json()
        print("JSON Response:", json_response)
    except requests.exceptions.JSONDecodeError:
        print("Warning: Response was not valid JSON")
    print("-" * 50)

def test_auth_service():
    BASE_URL = "http://127.0.0.1:5000"
    
    print("\nTest Case 1: Registering new user 'testuser1'")
    register_data = {
        "username": "testuser1",
        "password": "password123"
    }
    try:
        response = requests.post(f"{BASE_URL}/register", json=register_data)
        print_response(response)
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the server. Make sure Flask is running.")
        return
    
    # Test Case 2: Try to register the same user again )
    print("\nTest Case 2: Attempting to register duplicate user")
    try:
        response = requests.post(f"{BASE_URL}/register", json=register_data)
        print_response(response)
    except requests.exceptions.ConnectionError:
        print("Error: Connection failed")
    
    # Test Case 3: Register another user
    print("\nTest Case 3: Registering second user 'testuser2'")
    register_data2 = {
        "username": "testuser2",
        "password": "password456"
    }
    try:
        response = requests.post(f"{BASE_URL}/register", json=register_data2)
        print_response(response)
    except requests.exceptions.ConnectionError:
        print("Error: Connection failed")
    
    # Test Case 4: Successful login
    print("\nTest Case 4: Logging in with correct credentials")
    login_data = {
        "username": "testuser1",
        "password": "password123"
    }
    try:
        response = requests.post(f"{BASE_URL}/login", json=login_data)
        print_response(response)
    except requests.exceptions.ConnectionError:
        print("Error: Connection failed")
    
    # Test Case 5: Failed login (wrong password)
    print("\nTest Case 5: Logging in with incorrect password")
    login_data_wrong = {
        "username": "testuser1",
        "password": "wrongpassword"
    }
    try:
        response = requests.post(f"{BASE_URL}/login", json=login_data_wrong)
        print_response(response)
    except requests.exceptions.ConnectionError:
        print("Error: Connection failed")
    

    print("\nCurrent contents of user.json:")
    try:
        with open("user.json", "r") as file:
            users = json.load(file)
            print(json.dumps(users, indent=4))
    except FileNotFoundError:
        print("user.json file not found")
    except json.JSONDecodeError:
        print("Error reading user.json file")

if __name__ == "__main__":
    print("Starting authentication service tests...")
    print("Make sure your Flask application is running!")
    print("Waiting 2 seconds before starting tests...")
    sleep(2)
    test_auth_service()