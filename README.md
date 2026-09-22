# 🚗 DriverHub

### Full-Stack Job & Driver Hiring Platform

DriverHub is a full-stack web application that connects professional drivers with employers. Candidates can create profiles, upload resumes, search for jobs, and apply for suitable positions. Employers can post jobs, review applications, view candidate profiles and resumes, and manage the hiring process.

The platform also provides an administration workflow for managing candidates, employers, jobs, and applications.

---

## 🌐 Live Demo

**Frontend:**  
https://driver-hub-livid.vercel.app/

**Backend API:**  
https://driverhub-api-y8lx.onrender.com/

**GitHub:**  
https://github.com/PallaviVasanth/DriverHub

---

## ✨ Features

### 👤 Candidate

- Candidate registration and login
- Candidate profile management
- Professional driver information
- Resume upload and viewing
- Profile photo upload
- Job search and filtering
- Job details
- Job applications
- Duplicate application prevention
- Application status tracking
- Notifications

### 🏢 Employer

- Employer registration and login
- Company profile management
- Company logo upload
- Create job postings
- Edit job postings
- Close job postings
- View received applications
- View application details
- Search candidates
- View candidate profiles
- View candidate resumes
- Shortlist candidates
- Reject candidates
- Hire candidates
- Contact candidates

### 🛠️ Admin

- Platform dashboard
- Candidate management
- Employer management
- Job management
- Application management
- Block/unblock accounts
- Approve/reject jobs
- Close jobs
- Update application statuses
- Monitor platform activity

---

## 🔄 Hiring Workflow

```text
Candidate
   ↓
Register
   ↓
Create Profile
   ↓
Upload Resume
   ↓
Search Jobs
   ↓
Apply
   ↓
Employer Reviews Application
   ↓
Shortlisted / Rejected / Hired
   ↓
Candidate Tracks Status
🏗️ Architecture

DriverHub follows a three-tier full-stack architecture:

┌─────────────────────────┐
│      React Frontend     │
│                         │
│ Candidate / Employer    │
│ / Admin Interfaces      │
└────────────┬────────────┘
             │
             │ REST API
             ▼
┌─────────────────────────┐
│   Django REST Backend   │
│                         │
│ Authentication          │
│ Authorization           │
│ Business Logic          │
│ Validation              │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│       PostgreSQL        │
│                         │
│ Users                   │
│ Profiles                │
│ Jobs                    │
│ Applications            │
│ Notifications           │
└─────────────────────────┘
🛠️ Technology Stack
Frontend
React
Vite
JavaScript
Tailwind CSS
Axios
React Router
Backend
Python
Django
Django REST Framework
Simple JWT
Gunicorn
WhiteNoise
django-cors-headers
Database
PostgreSQL
Deployment
Vercel — Frontend
Render — Backend
PostgreSQL — Database
🔐 Authentication & Authorization

DriverHub uses JWT authentication.

Protected requests use:

Authorization: Bearer <access_token>

The system provides role-based access for:

Candidate
Employer
Admin

Backend permissions are used to protect resources and ensure users can only perform actions allowed for their role.

📄 Resume Management

Candidates can upload a resume from their profile.

The resume can be accessed through authorized candidate and employer workflows.

The application supports:

Resume upload
Resume storage
Resume viewing
File validation
Protected access

Candidates can update their profile information and uploaded documents through the profile section.

🧑‍💼 Employer Application Management

Employers can view applications submitted for their jobs.

For each application, employers can review available candidate information and resume details.

Application statuses include:

Applied
Shortlisted
Rejected
Hired

This provides a complete hiring workflow from application submission to final decision.

🔔 Notifications

The platform provides notifications for important application events.

Example:

Candidate applies
       ↓
Employer reviews application
       ↓
Employer updates status
       ↓
Candidate receives notification

Candidates can view notifications and mark them as read.

🔎 Job Search

Candidates can search and filter available jobs based on supported job information such as:

Job title
Location
Experience
Skills
Employment information

Only appropriate job postings are presented through the candidate workflow.

👨‍💼 Candidate Search

Employers can search candidates using permitted profile information.

Candidate search can use information such as:

Location
Experience
Skills
License information
Search terms

Private information is protected through backend authorization.

🗄️ Database

DriverHub uses PostgreSQL for persistent application data.

Major entities include:

User
Candidate Profile
Employer Profile
Job
Application
Notification

The main relationships are:

User
 ├── Candidate Profile
 └── Employer Profile

Employer
   ↓
Jobs
   ↓
Applications
   ↓
Candidates
📁 Project Structure
DriverHub/
│
├── backend/
│   ├── apps/
│   │   ├── accounts/
│   │   ├── candidates/
│   │   ├── employers/
│   │   ├── jobs/
│   │   ├── applications/
│   │   ├── notifications/
│   │   ├── common/
│   │   └── seed_data/
│   │
│   ├── config/
│   ├── manage.py
│   └── requirements.txt
│
├── web/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── routes/
│   │   └── utils/
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── docs/
├── API.md
└── README.md
⚙️ Local Setup
1. Clone Repository
git clone https://github.com/PallaviVasanth/DriverHub.git
cd DriverHub
2. Backend Setup
cd backend
python -m venv venv

Windows:

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt
3. Configure Environment

Create a .env file in the backend directory.

Example:

DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=True

POSTGRES_DB=driverhub
POSTGRES_USER=driverhub
POSTGRES_PASSWORD=your-password
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432

JWT_ACCESS_MINUTES=30
JWT_REFRESH_DAYS=7

Never commit the real .env file.

4. Database Migration
python manage.py migrate
5. Seed Demo Data
python manage.py seed_demo
6. Run Backend
python manage.py runserver

Backend:

http://127.0.0.1:8000/

Django Admin:

http://127.0.0.1:8000/admin/
🌐 Frontend Setup

Open another terminal:

cd web
npm install

Start development server:

npm run dev

The Vite development server will provide the frontend URL in the terminal.

🏭 Production Build

To create a production build:

npm run build

The generated files are placed inside:

web/dist/

The production build was verified successfully during development.

☁️ Deployment
Frontend

The React application is deployed using Vercel.

Production URL:

https://driver-hub-livid.vercel.app/

Backend

The Django REST API is deployed using Render.

Production URL:

https://driverhub-api-y8lx.onrender.com/

Database

PostgreSQL is used for persistent production data.

📦 Static Files

The Django backend uses WhiteNoise for production static file handling.

Static files are configured using:

STATIC_URL
STATIC_ROOT

The production configuration uses compressed manifest static files.

🔒 Security

DriverHub includes several security measures:

JWT authentication
Role-based authorization
Django password hashing
Backend permission checks
Ownership validation
File upload validation
Protected candidate information
Environment-based configuration
CORS configuration
Production debug configuration

Sensitive configuration should always be stored using environment variables.

🚨 Environment Security

Do not commit:

.env

Do not expose:

Database passwords
Django secret keys
Access tokens
Refresh tokens
API keys
Production credentials

Use .env.example with dummy values when configuration documentation is required.

🧪 Testing Checklist

Before submitting or deploying DriverHub, verify the following workflows.

Authentication
 Candidate registration
 Employer registration
 Login
 Invalid login
 Protected pages
 JWT authentication
 Logout
Candidate
 Profile creation
 Profile update
 Resume upload
 Resume viewing
 Profile photo upload
 Job search
 Job filtering
 Job details
 Apply for job
 Duplicate application prevention
 Application list
 Application status
 Notifications
Employer
 Company profile
 Company logo
 Create job
 Edit job
 Close job
 Application list
 Application details
 Candidate search
 Candidate profile
 Resume viewing
 Shortlist candidate
 Reject candidate
 Hire candidate
Admin
 Dashboard
 View candidates
 View employers
 Manage accounts
 Block/unblock users
 View jobs
 Approve jobs
 Reject jobs
 Close jobs
 View applications
 Update application status
🧭 Main User Journeys
Candidate Journey
Register
   ↓
Login
   ↓
Complete Profile
   ↓
Upload Resume
   ↓
Search Jobs
   ↓
Apply
   ↓
Track Application
   ↓
Receive Notification
Employer Journey
Register
   ↓
Login
   ↓
Create Company Profile
   ↓
Post Job
   ↓
Receive Applications
   ↓
Review Candidates
   ↓
View Resume
   ↓
Shortlist / Reject / Hire
Admin Journey
Login
   ↓
Dashboard
   ↓
Manage Candidates
   ↓
Manage Employers
   ↓
Manage Jobs
   ↓
Manage Applications
🛠️ Troubleshooting
Backend does not start

Check Python:

python --version

Activate the virtual environment:

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Run Django checks:

python manage.py check
Database connection problem

Verify:

POSTGRES_DB
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_HOST
POSTGRES_PORT

Then run:

python manage.py migrate
Frontend cannot connect to backend

Check that the frontend API configuration points to:

https://driverhub-api-y8lx.onrender.com/

For local development:

http://127.0.0.1:8000/

Check the browser Network tab if API requests fail.

Resume upload problem

Check:

User is logged in.
File type is supported.
File size is within the configured limit.
Backend is running.
API request is successful.
Browser Network tab for errors.
Backend logs for server-side errors.
📚 Additional Documentation

The repository also contains API documentation:

API.md

This can be used as a reference for available backend endpoints and API usage.

🔗 Important Links
Resource	Link
Live Website	https://driver-hub-livid.vercel.app/
Backend API	https://driverhub-api-y8lx.onrender.com/
GitHub Repository	https://github.com/PallaviVasanth/DriverHub
📌 Project Information
Item	Details
Project	DriverHub
Type	Full-Stack Web Application
Frontend	React + Vite
Backend	Django REST Framework
Database	PostgreSQL
Authentication	JWT
Frontend Hosting	Vercel
Backend Hosting	Render
🚀 Future Enhancements

Potential improvements include:

Advanced candidate matching
Improved job recommendations
Employer analytics
Advanced search
Additional notification preferences
Expanded mobile application
More automated tests
Enhanced accessibility
Additional reporting features
👩‍💻 Author
Pallavi V.

MCA Graduate
The Oxford College of Engineering

GitHub:

https://github.com/PallaviVasanth

📄 License

This project was developed as a full-stack application and portfolio project.

🚗 DriverHub

Connecting professional drivers with employment opportunities.


This is the **size I recommend**: roughly **400-ish lines**, not 1,000+. It documents the project properly withou
