# 🎓 ORYN Campus Hub

> A comprehensive student campus management portal — providing a unified digital space for campus bookings, events, services, and community engagement.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

-----

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [My UI Contributions](#-my-ui-contributions)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Team](#-team)
- [Project Management](#-project-management)
- [Sprint Progress](#-sprint-progress)
- [License](#-license)

-----

## 🏫 About the Project

**ORYN Campus Hub** is an MVP web application developed as part of the **5CS024 — Collaborative Software Development** module. The platform serves as a one-stop digital hub for university students, enabling them to access campus facilities, book resources, stay informed about events, and engage with campus services — all from a single interface.

The system is built with a **Node.js/Express** backend, a **MySQL** relational database, and a **vanilla HTML/CSS/JavaScript** frontend.

> 👩‍💻 **My Role:** I am the **UI Developer** on this project — responsible for the entire front-end design system, all page layouts, interactive components, responsive design, and API integration collaboration.

-----

## ✨ My UI Contributions

### 🎨 Wireframing & Prototyping

- Designed the overall layout, user flow and navigation structure for all major pages
- Created wireframes and mockups using **Figma** before implementation
- Established the visual identity and dark-theme design language for the platform

### 🧩 Interactive UI Components

- Built a **live event feed** with real-time updates
- Developed a responsive **navigation bar** consistent across all pages
- Implemented **hero slideshows** with CSS transitions, dot indicators and auto-advance
- Created **glassmorphism card components** with hover lift animations
- Designed and built **modal forms** with scale-in animations
- Implemented **toast notification system** for user feedback

### 📱 Responsive Design

- Mobile-first approach applied across all pages
- Tested and optimised layouts for desktop, tablet and mobile breakpoints
- Used CSS Grid and Flexbox for fluid, adaptive layouts

### 🗂️ Reusable Component Library

- Established a unified **design system** with CSS custom properties
- Dark background with orange accent (`#FF6B35`) and glassmorphism cards
- Consistent typography using **Inter**, **Plus Jakarta Sans**, **Fraunces** and **Playfair Display**
- Reusable button, card, modal and tab components across all pages

### 🔗 API Integration Collaboration

- Worked closely with the backend developer to connect frontend forms to REST API endpoints
- Used **Postman** to test and verify API responses before integration
- Handled dynamic data binding, error states and loading indicators in the UI

-----

## ✨ Features

|Module                |Description                                                                                     |
|----------------------|------------------------------------------------------------------------------------------------|
|🏠 Home Portal         |Central landing page with navigation to all campus services                                     |
|🔐 Student Login       |Secure student authentication portal                                                            |
|📝 Student Registration|Full student account creation with personal and academic details                                |
|📅 Facility Booking    |Book campus facilities (sports halls, labs, meeting rooms, study spaces) and register for events|
|🎉 Campus Events       |Browse and register for upcoming campus events                                                  |
|📚 Digital Library     |Access library resources, extend loans, and reserve study rooms                                 |
|☕ ORYN Café           |View the campus café menu — main dishes, snacks, hot drinks, and desserts                       |
|🏋️ Fitness Centre      |Explore gym facilities and fitness class schedules                                              |
|🏛️ Clubs & Societies   |Discover and join student clubs and societies                                                   |
|🗺️ Campus Map          |Interactive campus navigation and building directory                                            |
|🚌 Transit             |Campus bus routes and transport schedules                                                       |
|🛒 Marketplace         |Student peer-to-peer marketplace for buying and selling items                                   |
|🎁 Rewards             |Student loyalty rewards and points system                                                       |
|💼 Careers             |Internship listings and career opportunity board                                                |
|💬 Social Feedback     |Student feedback and social interaction module                                                  |
|ℹ️ About               |Campus information and university overview                                                      |

-----

## 🛠️ Tech Stack

### Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)

|Technology|Purpose                                         |
|----------|------------------------------------------------|
|Node.js   |Server-side JavaScript runtime                  |
|Express.js|REST API framework and middleware               |
|MySQL     |Relational database for student and booking data|
|mysql2    |Node.js MySQL client with connection pooling    |
|cors      |Cross-Origin Resource Sharing middleware        |

### Frontend

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

|Technology        |Purpose                                                      |
|------------------|-------------------------------------------------------------|
|HTML5             |Page structure and UI layout                                 |
|CSS3              |Styling, animations, glassmorphism effects, responsive design|
|Vanilla JavaScript|Client-side interactivity, modals, slideshows, API calls     |
|Google Fonts      |Inter · Plus Jakarta Sans · Fraunces · Playfair Display      |

### UI Design System

```css
/* Core CSS Variables — applied across all pages */
--background:    linear-gradient(135deg, #0a0a0a, #1a1a1a);
--orange-accent: #FF6B35;
--green-success: #4CAF50;
--glass:         rgba(255, 255, 255, 0.05);
--glass-border:  rgba(255, 255, 255, 0.1);
--font-primary:  'Inter', sans-serif;
```

### Development Tools

|Tool   |Purpose                                   |
|-------|------------------------------------------|
|VS Code|Primary code editor                       |
|Figma  |UI wireframing and prototyping            |
|Postman|API testing and endpoint verification     |
|GitHub |Version control and source code management|

### Project Management Tools

|Tool        |Purpose                                            |
|------------|---------------------------------------------------|
|Jira        |Sprint planning, issue tracking, velocity reporting|
|Trello      |Visual Kanban board for task management            |
|Basecamp    |Team communication, file sharing, meeting notes    |
|Excel       |Sprint progress tracker and workload distribution  |
|Google Forms|Weekly team check-in surveys                       |

-----

## 📁 Project Structure

```
oryn-campus-hub/
│
├── frontend/                        # All HTML/CSS/JS frontend pages
│   ├── home.html                    # Main student portal landing page
│   ├── student-login.html           # Student login page
│   ├── Register.html                # Student registration page
│   ├── Booking.html                 # Facility booking & event registration
│   ├── Events.html                  # Campus events listing
│   ├── LIBRARY.html                 # Digital library module
│   ├── Cafe.html                    # Campus café menu
│   ├── fitness.html                 # Fitness centre information
│   ├── clubs.html                   # Student clubs & societies
│   ├── map.html                     # Campus map
│   ├── transit.html                 # Campus transport
│   ├── Marketplace.html             # Student marketplace
│   ├── REWARD.html                  # Loyalty rewards system
│   ├── careers.html                 # Careers & internships board
│   ├── social_feedback.html         # Social feedback module
│   ├── About.html                   # About the campus
│   └── assets/                      # Images and media files
│
├── backend/                         # Node.js / Express server
│   ├── server.js                    # Main Express application entry point
│   ├── routes/                      # API route handlers
│   │   ├── auth.js                  # Login / registration routes
│   │   └── booking.js               # Booking routes
│   ├── db/
│   │   └── connection.js            # MySQL connection pool setup
│   └── package.json                 # Node dependencies
│
├── database/
│   └── schema.sql                   # MySQL database schema
│
└── README.md                        # This file
```

-----

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL](https://www.mysql.com/) (v8.0 or higher)
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/) *(recommended)*

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/oryn-campus-hub.git
cd oryn-campus-hub
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

Packages installed: `express` `mysql2` `cors` `dotenv`

-----

### Database Setup

**1. Start MySQL and log in**

```bash
mysql -u root -p
```

**2. Create the database**

```sql
CREATE DATABASE oryn_campus_hub;
USE oryn_campus_hub;
```

**3. Run the schema file**

```bash
mysql -u root -p oryn_campus_hub < database/schema.sql
```

**4. Students table schema**

```sql
CREATE TABLE students (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  fullName    VARCHAR(100)  NOT NULL,
  email       VARCHAR(100)  NOT NULL UNIQUE,
  mobile      VARCHAR(20),
  nic         VARCHAR(20),
  address     TEXT,
  indexNo     VARCHAR(30)   NOT NULL UNIQUE,
  faculty     VARCHAR(100),
  programme   VARCHAR(100),
  year        VARCHAR(10),
  username    VARCHAR(50)   NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  dob         DATE,
  gender      VARCHAR(20),
  createdAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

> ⚠️ **Security Note:** Password hashing (bcrypt) will be implemented in Sprint 2. Do not deploy with plain-text passwords in production.

**5. Configure environment variables**

Create a `.env` file in the `backend/` directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=oryn_campus_hub
PORT=3000
```

> ⚠️ **Important:** Never commit your `.env` file. It is listed in `.gitignore`.

-----

### Running the App

**1. Start the backend server**

```bash
cd backend
node server.js
```

You should see:

```
Server running on http://localhost:3000
Connected to MySQL database: oryn_campus_hub
```

**2. Open the frontend**

Open any HTML file in your browser, or use **Live Server** in VS Code:

```
frontend/home.html → Open with Live Server
```

The frontend connects to the backend at `http://localhost:3000`.

-----

## 🔌 API Endpoints

**Base URL:** `http://localhost:3000`

|Method|Endpoint       |Description                            |Request Body                                                                                                   |
|------|---------------|---------------------------------------|---------------------------------------------------------------------------------------------------------------|
|`POST`|`/register`    |Register a new student                 |`{ fullName, email, mobile, nic, address, indexNo, faculty, programme, year, username, password, dob, gender }`|
|`POST`|`/login`       |Student login *(Sprint 2)*             |`{ username, password }`                                                                                       |
|`POST`|`/booking`     |Create a facility booking *(Sprint 2)* |`{ studentId, facilityId, date, time }`                                                                        |
|`GET` |`/bookings/:id`|Get bookings for a student *(Sprint 2)*|—                                                                                                              |

### Example — Register Student

**Request:**

```http
POST /register
Content-Type: application/json

{
  "fullName": "Sanduni Priyalakshi",
  "email": "sanduni@university.ac.lk",
  "mobile": "0771234567",
  "indexNo": "CS2021001",
  "faculty": "Computing",
  "programme": "BSc Computer Science",
  "year": "2",
  "username": "sanduni21",
  "password": "securepassword",
  "dob": "2002-05-14",
  "gender": "Female"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Student registered successfully"
}
```

**Response (Error):**

```json
{
  "success": false,
  "message": "Username or email already exists"
}
```

-----

## 👥 Team

|Name                   |Role                                                |
|-----------------------|----------------------------------------------------|
|Medhani Niwoda         |📋 Project Manager                                   |
|Pulindu Balasooriya    |⚙️ Backend Developer                                 |
|**Sanduni Priyalakshi**|🎨 **UI Developer** *(Frontend Design & Development)*|
|Dewmi Umegha           |🧪 QA Tester                                         |
|Udara Nethmi           |🗄️ Database Administrator                            |
|Ginuka Weragoda        |📊 Business Analyst                                  |

-----

## 📊 Project Management

This project follows an **Agile Sprint** methodology.

|Tool    |Usage                                    |
|--------|-----------------------------------------|
|Jira    |Sprint planning, issue tracking, velocity|
|Trello  |Kanban task board                        |
|Basecamp|Team communication & file sharing        |
|GitHub  |Version control, pull requests, issues   |

### Branching Strategy

```
main                        ← stable, demo-ready code only
├── dev                     ← integration branch
│   ├── feature/registration-api
│   ├── feature/booking-ui
│   ├── feature/login-page
│   └── fix/cors-config
```

> All feature work is done on feature branches. PRs must be reviewed before merging into `dev`. `main` is only updated before demos.

-----

## 📅 Sprint Progress

### Sprint 1 — ✅ Complete

|Feature                           |Status|
|----------------------------------|------|
|Student Registration (Frontend)   |✅ Done|
|Student Registration (Backend API)|✅ Done|
|MySQL Database Setup              |✅ Done|
|Student Login Page (UI)           |✅ Done|
|Facility Booking Page (UI)        |✅ Done|
|Campus Events Page (UI)           |✅ Done|
|Home Portal                       |✅ Done|
|Café Menu Page                    |✅ Done|
|Library Page                      |✅ Done|
|Clubs & Societies Page            |✅ Done|

### Sprint 2 — 🔄 Planned

|Feature                  |Status   |
|-------------------------|---------|
|JWT Authentication       |🔄 Planned|
|Password Hashing (bcrypt)|🔄 Planned|
|Booking API (POST/GET)   |🔄 Planned|
|Student Dashboard        |🔄 Planned|
|Admin Panel              |🔄 Planned|
|Rewards System Backend   |🔄 Planned|

-----

## 📄 License

This project was developed for academic purposes as part of **5CS024 — Collaborative Software Development**.

-----

<p align="center">
  ORYN Campus Hub · Built with ❤️ by Medhani · Pulindu · <strong>Sanduni</strong> · Dewmi · Udara · Ginuka
  <br>
  5CS024 MVP — Sprint 1
</p>
