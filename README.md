# ToDo App

## Overview

The ToDo App is a simple API for managing to-do items. Users can register, login, and perform CRUD operations on their to-do items.

## Features

- User registration and login with JWT authentication
- CRUD operations for to-do items
- Protected routes for authenticated users
- Swagger API documentation


## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/anjaneyaMishra/todo-app
    cd todo-app
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory with the following variables:

    ```plaintext
    MONGO_URI=mongodb://your-mongodb-uri
    JWT_SECRET=your-jwt-secret
    PORT=3000
    ```

4. Run the server:

    ```bash
    node app.js
    ```

5. Access the Swagger API documentation locally  at:

    ```
    http://localhost:3000/api-docs
    ```

### API Endpoints

#### Auth Routes

- **POST** `/api/auth/register`
  - Register a new user.
  - Request Body: `{ "username": "string", "password": "string" }`
  - Responses:
    - `201`: User registered successfully
    - `400`: Username is already taken

- **POST** `/api/auth/login`
  - Login a user.
  - Request Body: `{ "username": "string", "password": "string" }`
  - Responses:
    - `200`: User logged in successfully (returns a JWT token)
    - `400`: Invalid username or password

#### ToDo Routes

- **POST** `/api/todos`
  - Create a new todo (authenticated request).
  - Request Body: `{ "title": "string", "description": "string", "status": "string" }`
  - Responses:
    - `201`: Todo created successfully
    - `400`: Bad request

- **GET** `/api/todos`
  - Retrieve all todos (authenticated request).
  - Responses:
    - `200`: A list of todos
    - `500`: Server error

- **GET** `/api/todos/{id}`
  - Retrieve a todo by ID (authenticated request).
  - Responses:
    - `200`: Todo details
    - `404`: Todo not found
    - `400`: Invalid ID format

- **PUT** `/api/todos/{id}`
  - Update a todo by ID (authenticated request).
  - Request Body: `{ "title": "string", "description": "string", "status": "string" }`
  - Responses:
    - `200`: Todo updated successfully
    - `404`: Todo not found
    - `400`: Invalid ID format

- **DELETE** `/api/todos/{id}`
  - Delete a todo by ID (authenticated request).
  - Responses:
    - `200`: Todo deleted successfully
    - `404`: Todo not found
    - `400`: Invalid ID format

### Running Tests
For Testing Jest Framework is used, The tests are located in the `tests` folder
To run the tests, use the following command, 

```bash
npm test
