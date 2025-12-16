# GreenCity API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Table of Contents
1. [Authentication](#authentication)
2. [Users](#users)
3. [Organizations](#organizations)
4. [Issues](#issues)
5. [Transport](#transport)

## Authentication

### User Registration
```http
POST /api/auth/signup-user
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account.",
  "user": {
    "id": "60d5ec9f3e1a8c001f3e4a5c",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### User Login
```http
POST /api/auth/login-user
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec9f3e1a8c001f3e4a5c",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

## Organizations

### Organization Registration
```http
POST /api/organization/signup
```

**Request Body:**
```json
{
  "name": "Eco Warriors",
  "email": "info@ecowarriors.org",
  "password": "securepassword123",
  "phone": "+1987654321",
  "address": "123 Green St, Eco City",
  "registrationNumber": "ORG123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Organization registered successfully. Please check your email to verify your account.",
  "organization": {
    "id": "60d5ec9f3e1a8c001f3e4a5d",
    "name": "Eco Warriors",
    "email": "info@ecowarriors.org"
  }
}
```

### Organization Login
```http
POST /api/organization/login
```

**Request Body:**
```json
{
  "email": "info@ecowarriors.org",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "organization": {
    "id": "60d5ec9f3e1a8c001f3e4a5d",
    "name": "Eco Warriors",
    "email": "info@ecowarriors.org",
    "role": "organization"
  }
}
```

## Issues

### Report an Issue
```http
POST /api/issues
```

**Headers:**
```
Authorization: Bearer <user_jwt_token>
```

**Request Body (multipart/form-data):**
- `title`: String (required)
- `description`: String (required)
- `location`: Object (required)
  - `coordinates`: [longitude, latitude]
  - `address`: String
- `images`: Array of image files
- `category`: String (e.g., 'waste', 'pollution', 'deforestation')

**Response:**
```json
{
  "success": true,
  "issue": {
    "_id": "60d5ec9f3e1a8c001f3e4a5e",
    "title": "Illegal Dumping",
    "description": "Large amounts of construction waste dumped in the park",
    "status": "reported",
    "reportedBy": "60d5ec9f3e1a8c001f3e4a5c",
    "location": {
      "type": "Point",
      "coordinates": [72.8777, 19.0760],
      "address": "Central Park, Mumbai"
    },
    "images": [
      "https://storage.cloudprovider.com/images/dump1.jpg"
    ],
    "category": "waste"
  }
}
```

## Transport

### Create Transport Entry
```http
POST /api/transport-entries
```

**Headers:**
```
Authorization: Bearer <user_jwt_token>
```

**Request Body:**
```json
{
  "vehicleType": "bike",
  "distance": 15.5,
  "fuelType": "electric",
  "date": "2025-12-10T10:30:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "entry": {
    "_id": "60d5ec9f3e1a8c001f3e4a5f",
    "user": "60d5ec9f3e1a8c001f3e4a5c",
    "vehicleType": "bike",
    "distance": 15.5,
    "fuelType": "electric",
    "date": "2025-12-10T10:30:00.000Z",
    "carbonSaved": 2.5
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "field": "email",
      "message": "Please include a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

## Rate Limiting
- All endpoints are rate limited to 100 requests per 15 minutes per IP address.
- Authentication endpoints have a lower limit of 10 requests per minute to prevent brute force attacks.

## Security
- All API requests must be made over HTTPS
- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days (refresh tokens available)
- Input is sanitized to prevent XSS and NoSQL injection
- Rate limiting is implemented to prevent abuse
