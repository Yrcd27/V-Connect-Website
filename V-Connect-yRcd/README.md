# V-Connect Frontend – Backend Integration Guide  

V-Connect is a volunteer management platform that connects **organizations** with **volunteers**.  
This document provides backend developers with the details needed to build fully compatible API endpoints for the React-based frontend.  

---

## 🛠 Tech Stack  

- **Frontend:** React.js, Tailwind CSS, Framer Motion  
- **Backend (Expected):** RESTful API (any language/framework)  
- **Data Format:** JSON  
- **Authentication:** JWT-based system  

---

## 📂 Project Structure  

frontend/
├── src/
│ ├── components/ # Reusable UI components
│ ├── pages/ # Page components
│ │ ├── admin/ # Admin-specific pages
│ │ ├── organization/ # Organization-specific pages
│ │ └── volunteer/ # Volunteer-specific pages
│ ├── services/ # API and mock data services
│ ├── utils/ # Utility functions
│ ├── App.js # Application root
│ └── index.js # Entry point
└── public/ # Static assets


## 🔑 Required API Endpoints  

### Authentication  

| Endpoint        | Method | Description          | Request Body                     | Response               |
|-----------------|--------|----------------------|----------------------------------|------------------------|
| `/auth/login`   | POST   | User login           | `{ email, password, userType }`  | `{ token, user }`      |
| `/auth/register`| POST   | User registration    | User details (role-based)        | `{ success, message }` |
| `/auth/refresh` | POST   | Refresh auth token   | `{ refreshToken }`               | `{ token }`            |

### Events  

| Endpoint                  | Method | Description |
|---------------------------|--------|-------------|
| `/events`                 | GET    | List events (filters: `status`, `page`, `limit`, `search`) |
| `/events`                 | POST   | Create event |
| `/events/:id`             | GET    | Get event details |
| `/events/:id`             | PUT    | Update event |
| `/events/:id/applications`| GET    | List applications for event |

### Volunteers  

| Endpoint             | Method | Description |
|----------------------|--------|-------------|
| `/volunteers`        | GET    | List volunteers (`search`, `page`, `limit`) |
| `/volunteers/:id`    | GET    | Get volunteer details (skills, badges) |
| `/volunteers/:id`    | PUT    | Update volunteer details |
| `/volunteers/:id/events` | GET | Get volunteer’s events (by status) |

### Applications  

| Endpoint           | Method | Description |
|--------------------|--------|-------------|
| `/applications`    | GET    | List applications (`status`, `eventId`, `volunteerId`) |
| `/applications`    | POST   | Create application `{ eventId, volunteerId, message }` |
| `/applications/:id`| PUT    | Update application status `{ status, message }` |

### Organizations  

| Endpoint                 | Method | Description |
|--------------------------|--------|-------------|
| `/organizations`         | GET    | List organizations (`search`, `page`, `limit`) |
| `/organizations/:id`     | GET    | Get organization details |
| `/organizations/:id`     | PUT    | Update organization |
| `/organizations/:id/events` | GET | Get organization’s events |

### Badges  

| Endpoint            | Method | Description |
|---------------------|--------|-------------|
| `/badges`           | GET    | List badges (`search`, `page`, `limit`) |
| `/badges`           | POST   | Create badge |
| `/badges/:id`       | GET    | Get badge details |
| `/badges/:id`       | PUT    | Update badge |
| `/badges/:id/award` | POST   | Award badge to volunteers `{ volunteerIds: [] }` |

### Admin Dashboard  

| Endpoint                          | Method | Description |
|-----------------------------------|--------|-------------|
| `/admin/dashboard/stats`          | GET    | Get dashboard stats (`timeRange`) |
| `/admin/dashboard/top-volunteers` | GET    | Get top volunteers (`limit`) |
| `/admin/dashboard/popular-skills` | GET    | Get popular skills (`limit`) |
| `/admin/dashboard/monthly-activity` | GET  | Get monthly activity (`year`) |

---

## 📌 Pages & API Dependencies  

### **Admin Pages**  
- **AdminDashboard.jsx** → `/admin/dashboard/*` endpoints  
- **BadgeManagement.jsx** → `/badges` (CRUD), `/badges/:id/award`, `/volunteers` (search)  

### **Organization Pages**  
- **EventManagement.jsx** → `/events` (CRUD), `/events/:id/applications`  
- **OrganizationProfile.jsx** → `/organizations/:id` (GET/PUT), file upload for media  
- **VolunteerApplications.jsx** → `/applications`, `/applications/:id`, `/volunteers/:id`  

### **Volunteer Pages**  
- **VolunteerEvents.jsx** → `/events` (GET with filters), `/applications` (POST)  
- **VolunteerProfile.jsx** → `/volunteers/:id` (GET/PUT), badges & skills, profile image upload  

---

## 🎯 Components with Backend Integration Needs  

- **High Priority:**  
  - `EventManagement.jsx` – Event CRUD + Applications  
  - `VolunteerEvents.jsx` – Event discovery + Apply to events  
  - `BadgeManagement.jsx` – Badge CRUD + Award system  
  - `VolunteerApplications.jsx` – Manage applications  

- **Medium Priority:**  
  - `VolunteerProfile.jsx` – Profile info, skills, badges  
  - `OrganizationProfile.jsx` – Org info + media  
  - `AdminDashboard.jsx` – Statistics + Analytics  

- **No Backend Needed:**  
  - `Modal.jsx`, `Loading.jsx`, `FormElements.jsx`, `EmptyState.jsx`, `Pagination.jsx` (UI only)  

---

## 📎 File Upload Support  

- **FileUpload.jsx** component requires backend endpoints for:  
  - **Profile images (volunteers)**  
  - **Logos and cover images (organizations)**  
  - **Badge icons**  

Expected: `multipart/form-data` handling with image preview support.  

---

✅ This README ensures backend developers can build API endpoints that align perfectly with the V-Co
