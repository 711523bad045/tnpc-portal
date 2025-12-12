<img width="1919" height="964" alt="image" src="https://github.com/user-attachments/assets/5335259d-04d8-45c0-abe3-40632ebe2398" />TNPSC Group 4 Study and Practice Portal

A full-stack web application built for TNPSC Group 4 exam preparation. The platform allows students to practice daily tests, browse a structured question bank, watch subject-wise video lessons, track study time, and manage their personal account.
An admin panel is included for uploading questions into the database.

This project uses React (Vite) for the frontend and Node.js/Express with MongoDB for the backend.
<img width="1899" height="971" alt="Screenshot 2025-12-12 210418" src="https://github.com/user-attachments/assets/ca455729-1db2-4834-98ed-8625a9de9954" />

Key Features
User Authentication
Register and Login with JWT authentication
Proper validation for incorrect login attempts
Error messages displayed centrally
Secure logout (token cleared and browser back button prevented from returning to protected pages)

Dashboard
<img width="1892" height="972" alt="Screenshot 2025-12-12 210440" src="https://github.com/user-attachments/assets/3ec07f87-5a92-4d78-bba0-0faf1febcd53" />

Shows daily study duration
Weekly progress visualized using a bar chart
Monthly total study time
Day streak tracking
All analytics retrieved from the backend and stored in the database

Daily Test
<img width="1902" height="925" alt="Screenshot 2025-12-12 210457" src="https://github.com/user-attachments/assets/b7afd318-6e14-489e-a5fc-8957912b3fc4" />

Admin uploaded  question is convereted to test questions
Timer included
Clean layout with selectable options
Questions fetched from subject-wise collections in MongoDB

Question Bank
<img width="1900" height="939" alt="Screenshot 2025-12-12 210508" src="https://github.com/user-attachments/assets/3abf34c1-cb5e-421b-aaaa-ac31be17c0c5" />

Four categories: Tamil, English, Maths, Social
Each category displays all questions stored in the database
we have admin section for question upload 
Questions are formatted with Q, Options, and Answer

Video Classes
<img width="1894" height="966" alt="Screenshot 2025-12-12 210528" src="https://github.com/user-attachments/assets/9d2cfdea-316b-4dc0-b2d1-c58d351b2144" />
<img width="1905" height="971" alt="Screenshot 2025-12-12 210536" src="https://github.com/user-attachments/assets/b814480f-be5b-4592-bdb7-8ba900d48abc" />

Subject list with a dedicated page for each subject
Video player uses YouTube videoId
Organized layout for lessons

Account Page
<img width="1919" height="984" alt="Screenshot 2025-12-12 210550" src="https://github.com/user-attachments/assets/5f17759f-26fa-4f36-9b50-7824737ba4e0" />

Displays user profile: name, email, phone, location, bio
Edit mode for updating details
Avatar automatically generated from user initials
No subscription or settings sections (removed as requested)

Admin Panel
<img width="1919" height="964" alt="Screenshot 2025-12-12 211457" src="https://github.com/user-attachments/assets/592c23ac-b035-4789-b724-e9751356442b" />

Admin can upload questions for Tamil, English, Maths, and Social
Admin pastes prepared text; backend handles formatting and storage
Upload response shows total questions processed
Fully connected to database

Technology Stack
Frontend

React (Vite)
React Router DOM
Axios
Recharts
Lucide Icons
Custom CSS

Backend

Node.js
Express.js
Sql / Mongoose
JWT authentication
Middleware-protected routes

Folder Structure 
frontend/
  src/
    components/
    pages/
      Account.jsx
      Dashboard.jsx
      DailyTest.jsx
      Login.jsx
      Register.jsx
      QuestionBank.jsx
      VideoClasses.jsx
    context/StudyTimerContext.jsx
    App.jsx

backend/
  routes/
    auth.js
    text-upload.js
    study.js
  middleware/
    auth.js
  models/
  server.js

Installation Instructions
1. Clone the project
git clone <repository-url>
cd tnpsc-portal

2. Install and run the backend
cd backend
npm install
npm start


Backend runs on:
http://localhost:5000

3. Install and run the frontend
cd frontend
npm install
npm run dev


Frontend runs on:
http://localhost:5173

Environment Variables

Create a .env file inside the backend folder:

SQL=your_SQL_connection_string
JWT_SECRET=your_secret_key
PORT=5000

API Overview (Short Summary)
Authentication

POST /api/auth/register
POST /api/auth/login

Study Tracking

GET /api/study/weekly
GET /api/study/monthly
GET /api/study/streak

Question Upload (Admin)

POST /api/text-upload/upload/:subject

Notes on Security

JWT stored in localStorage
All protected pages check for a valid token
Logout clears authentication and prevents navigating back
Backend rejects invalid or missing tokens
Login returns proper error messages such as “User does not exist” or “Incorrect password”

Project Status

This project is fully developed and connected end-to-end (frontend, backend, and database).
All features including account management, study dashboard, question bank, daily test, video classes, and admin uploads are complete and functional.
