export interface AuthUser {
  email: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean; // <-- add this
}
export interface AuthUser {
  email: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean; // <-- add this
}

// /
//     "message": "Login successful",
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTI2OTI3MjVmNDg5NTBhN2FkNjUzZjYiLCJlbWFpbCI6InJhanVzaGFybWFkYXRhMTIzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzY1ODY5NjgyLCJleHAiOjE3NjU5NTYwODJ9.5NjjwZUdDh-FBA4pFLZpTo2lXGV5s-lMWTFOYmmcZNY",
//     "user": {
//         "_id": "692692725f48950a7ad653f6",
//         "firstName": "Raju",
//         "lastName": "Sharma",
//         "username": "rajusharma",
//         "email": "rajusharmadata123@gmail.com",
//         "role": "user",
//         "isEmailVerified": true
//     }
// }/ Example response from login API
export interface User{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  isEmailVerified: boolean;
  token: string;
  message: string;
}