# HandiHelper

**A full-stack, mobile-first accessibility app that gives people with disabilities an interface adapted to their needs, and lets their caregivers support them remotely.**

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4-6DB33F?logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-764ABC?logo=redux&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)

Final-year project (PFE), Software Development degree, Faculty of Sciences Ben M'Sik, Hassan II University of Casablanca, 2025-2026.

---

## Overview

Most digital tools for people with disabilities are fragmented and built for one need at a time. HandiHelper brings them together in one application with **six dedicated interfaces**, each designed around a specific profile, and a **parent/caregiver link** so a relative can follow and manage the daily life of the person in their care.

## Supported profiles

| Profile | Interface highlights |
|---|---|
| **Autism Spectrum Disorder (ASD)** | Calming pastel palette, emotion picker, icon-based routines |
| **Reduced mobility** | Interactive map of accessible places with GPS and radius filter |
| **Visually impaired** | Large fonts, high contrast, Text-to-Speech and Speech-to-Text, prominent SOS button |
| **Deaf** | Visual flash alerts, device vibration, predefined quick messages |
| **Cognitive impairment** | Simplified tasks with progress bars, clear medication reminders |
| **Parent / Caregiver** | Overview of linked relatives, remote management of their routines, medications and emotional journal |

## Features

- **Role-based authentication** with JWT access and refresh tokens (`ROLE_USER`, `ROLE_PARENT`, `ROLE_ADMIN`)
- **Daily routines**: create, view, edit and delete
- **Emotional journal** with six states: happy, sad, anxious, calm, angry, tired
- **Medication management**: name, dosage, schedule and instructions
- **Geolocated SOS alerts** with alert history
- **Accessible places map** built with Leaflet and OpenStreetMap, with nearby search
- **Parent-relative linking** by email, with remote follow-up of the relative's data
- **Interactive API documentation** with Swagger UI

## Architecture

A three-layer client-server architecture with a stateless REST API.

```
React SPA  --(REST + JWT Bearer)-->  Spring Boot API  --(JPA/Hibernate)-->  MySQL
```

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Redux Toolkit, React Router, Axios, Tailwind CSS 3 |
| Backend | Spring Boot 4, Spring Security, Spring Data JPA (Hibernate), Lombok |
| Database | MySQL 8 |
| Security | JWT (jjwt), BCrypt password hashing, CORS restricted to the frontend origin |
| Maps | Leaflet + OpenStreetMap |

### Project structure

```
backend/
  config/        Spring beans and security configuration (CORS, filters)
  controller/    9 REST controllers
  service/       Business logic, one service per controller
  repository/    Spring Data JPA repositories
  entity/        8 JPA entities
  dto/           Request and response objects
  security/      JwtService, JwtAuthenticationFilter
  enums/         HandicapType, Role, Emotion

frontend/
  src/api/         Axios instance with automatic JWT interceptor
  src/store/       Redux store (authSlice, userSlice)
  src/pages/       14 pages, including the 6 profile dashboards
  src/components/  PrivateRoute, DashboardHeader, BoutonSOS
  src/App.jsx      Router with protected and role-based routes
```

### Security

- Stateless authentication: a 24-hour access token and a 7-day refresh token
- Passwords are never stored in plain text; they are hashed with BCrypt
- A custom filter validates the signature and expiry of every request and returns `401` for invalid tokens
- Role-based access control on protected endpoints

## API overview

The API exposes **20 REST endpoints** across 9 controllers. Full interactive documentation is available through Swagger UI once the backend is running.

| Module | Endpoints |
|---|---|
| **Auth** | `POST /api/auth/register`, `POST /api/auth/login` |
| **Profile** | `GET /api/profile/{profileId}`, `GET /api/profile/user/{userId}`, `PUT /api/profile/{profileId}` |
| **Routines** | `GET`, `POST /api/routines/{profileId}`, `PUT`, `DELETE /api/routines/{routineId}` |
| **Emotions** | `GET`, `POST /api/emotions/{profileId}` |
| **Medications** | `GET`, `POST /api/medications/{profileId}`, `DELETE /api/medications/{id}` |
| **SOS** | `POST /api/sos/alert/{userId}`, `GET /api/sos/history/{userId}` |
| **Places** | `GET /api/places/accessible`, `GET /api/places/nearby?lat=&lng=&rayon=` |
| **Parent** | `POST /api/parent/{parentId}/lier`, `GET /api/parent/{parentId}/proches` |

## Getting started

### Prerequisites

- Java 17 or later
- Node.js 18 or later
- MySQL 8

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/handihelper.git
cd handihelper
```

### 2. Configure the backend

Create a MySQL user, then set your credentials and a JWT secret in the backend's `application.properties` (or as environment variables). Do not commit real secrets.

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/handihelper_db?createDatabaseIfNotExist=true
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD
spring.jpa.hibernate.ddl-auto=update
```

Then start the API:

```bash
cd backend
./mvnw spring-boot:run
```

The backend runs on `http://localhost:8080` and the Swagger UI is at `http://localhost:8080/swagger-ui.html`.

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

## Screenshots

<!-- Add your screenshots to a /docs/screenshots folder, then uncomment and adjust the lines below. -->
<!--
| Login | Profile selection | ASD dashboard |
|---|---|---|
| ![Login](docs/screenshots/login.png) | ![Profiles](docs/screenshots/profiles.png) | ![ASD](docs/screenshots/asd.png) |

| Reduced mobility | Visually impaired | Parent dashboard |
|---|---|---|
| ![Map](docs/screenshots/mobility.png) | ![Visual](docs/screenshots/visual.png) | ![Parent](docs/screenshots/parent.png) |
-->

## Roadmap

- Cloud deployment with a CI/CD pipeline
- Native mobile app (React Native) with push notifications
- AI-based routine recommendations from emotional history
- Real-time secure chat between caregiver and relative (WebSocket)
- Offline mode with local data sync, especially for SOS
- Admin dashboard to moderate community-submitted places
- Automated tests: JUnit and Mockito (backend), React Testing Library (frontend)

## Author

**Sahar Tzouly**
Software Development graduate, Hassan II University of Casablanca
Email: sahar.travail2024@gmail.com

Supervised by Pr. Sara Ouahabi, co-supervised by Mme Hanane Abourifa.
