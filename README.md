1. Requesting data for user authentication
   To request data from microserice, you will need to send a POST request to either the /register or /login endpoint
   For example, when you was to register a user
   import requests

# Define the base URL of the microservice
BASE_URL = "http://127.0.0.1:5000"

# python dict that contains the username and password
register_data = {
    "username": "testuser1",
    "password": "password123"
}

# send the POST request
response = requests.post(f"{BASE_URL}/register", json=register_data)

In this code, you will define the URL of the running Flask app. After that, create a dictionary with user data and make the POST request to the endpoints using requests.post() and pass register_data in JSON format.

2. Receiving data for user authentication
   When making a request, the Flask app will send a response. The response will be in JSON format and you can access the data using .json() on the object.
   status_code: HTTP status code (200 for valid, 400 for bad request)
response = requests.post(f"{BASE_URL}/register", json=register_data)

# example
if response.status_code == 201:
    print("User registered successfully!")
    print(response.json())   #should access the JSON response
else:
    print("Error occurred:", response.status_code)
    print(response.json())  #error otherwise

SEE UML.png in Microservice/Microservice for UML reference.


   
   




