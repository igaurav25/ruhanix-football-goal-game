# ⚽ Ruhanix Football Goal Game

A 2D football goal-shooting mobile application built with **React Native + Expo** and a **PHP + MySQL backend**. The project was developed during my **IT Developer internship at Ruhanix Solutions (OPC) Private Limited**.

The repository demonstrates a complete mobile-app workflow around player accounts, gameplay, scoring, progression, leaderboard data, shop data, and supporting web/admin pages.

## 🎯 What I Built / Worked On

### Mobile App — React Native + Expo
- Built login, signup, forgot-password, lobby, match, and shop screens.
- Implemented navigation between authentication, lobby, gameplay, result, and shop flows.
- Added persistent login using **AsyncStorage**.
- Added player-level and XP information to the lobby experience.

### Football Gameplay System
- Implemented a **5-shot match system**.
- Added swipe-based shooting using `PanResponder`.
- Converted swipe direction into one of **9 target zones**.
- Added ball movement, scaling, rotation, depth and camera-style animations.
- Implemented goalkeeper movement and probabilistic keeper decision logic.
- Added shot result states: **goal, perfect, power, save, miss**.
- Added power, accuracy and curve calculations that influence shot outcomes.
- Implemented combo handling, XP/coin rewards and match win/lose logic.
- Match win condition in the current mobile implementation: **3 or more goals from 5 shots**.

### Backend — PHP + MySQL
- Built REST-style PHP endpoints for authentication and player/game data.
- Implemented user registration and login APIs.
- Added password-reset API flow.
- Added leaderboard retrieval endpoints.
- Added shop-data endpoint.
- Added profile read/update endpoints.
- Added match-history retrieval.
- Added challenge-start and score-submission endpoints.
- Used **PDO + prepared statements** for database operations.
- Added transactional score submission that updates match status, result data, user XP/level and leaderboard records.

### Supporting Web/Admin Work
- Added a static football landing page in `website/`.
- Added an HTML admin/data page in `backend/admin.html`.

---

## 🧩 Core Features

| Area | Implementation |
|---|---|
| Authentication | Signup, Login, Persistent Login, Logout, Password Reset |
| Gameplay | Swipe shooting, 9 target zones, goalkeeper logic, shot outcomes |
| Match | 5 shots, goal tracking, win/lose handling |
| Player Progression | XP, level calculation, combo/reward logic |
| Leaderboard | Player level, XP, highest score and accuracy data |
| Shop | Fetchable shop items with XP-based unlock UI |
| User Data | Profile and match history endpoints |
| Backend | PHP REST-style APIs + MySQL + PDO |
| Frontend | React Native, Expo, Expo Router, TypeScript |
| Web | Static HTML landing page |

---

## 🏗️ Application Flow

```text
              ┌───────────────┐
              │    Login      │
              └───────┬───────┘
                      │
              ┌───────▼───────┐
              │     Lobby     │
              └───────┬───────┘
                 ┌────┴────┐
                 │         │
          ┌──────▼─────┐ ┌─▼────────┐
          │   Match    │ │   Shop   │
          └──────┬─────┘ └──────────┘
                 │
          ┌──────▼─────┐
          │  Results   │
          └──────┬─────┘
                 │
          ┌──────▼────────────┐
          │ PHP + MySQL APIs  │
          │ XP / Level / Data │
          └───────────────────┘
```

---

## 🥅 Gameplay Logic

The current `match.tsx` implementation models a shot using several inputs:

```text
Swipe
  ↓
Direction + Distance
  ↓
Target Zone (9 zones)
  ↓
Power / Accuracy / Curve
  ↓
Goalkeeper Decision
  ↓
Shot Result
  ↓
Score + XP + Coins + Combo
```

### Shot result types

- **Perfect** — high-quality corner shot conditions
- **Power** — high-power successful shot
- **Goal** — normal successful shot
- **Save** — goalkeeper intercepts the attempt
- **Miss** — unsuccessful attempt

The backend score endpoint also calculates accuracy, final score, XP gained and the player's updated level when a score is submitted.

---

## 📁 Repository Structure

```text
Ruhanix-Football-Goal-Game/
│
├── frontend/
│   ├── app/
│   │   ├── index.tsx             # Login / session check
│   │   ├── signup.tsx            # Account creation
│   │   ├── forgot-password.tsx   # Password reset UI
│   │   ├── lobby.tsx             # Player lobby / leaderboard
│   │   ├── match.tsx             # Core football gameplay
│   │   ├── shop.tsx              # Shop UI
│   │   └── _layout.tsx           # Expo Router stack
│   ├── hooks/
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
│
├── backend/
│   ├── api/
│   │   ├── auth/                 # Auth, leaderboard, shop, score APIs
│   │   ├── game/                 # Challenge / score / leaderboard APIs
│   │   └── user/                 # Profile + history APIs
│   ├── config/
│   │   └── db.php                # PDO database connection
│   └── admin.html                # Admin/data page
│
├── website/
│   └── index.html                # Promotional web page
│
└── README.md
```

---

## 🛠️ Tech Stack

**Frontend**

`React Native` · `Expo` · `Expo Router` · `TypeScript` · `AsyncStorage`

**Backend**

`PHP` · `REST-style APIs` · `MySQL` · `PDO`

**Web**

`HTML` · `CSS` · `JavaScript`

**Development Tools**

`Git` · `GitHub` · `XAMPP`

---

## 🚀 Run the Frontend

```bash
cd frontend
npm install
npx expo start
```

Then open the app using Expo Go, an Android emulator, an iOS simulator, or the appropriate Expo development workflow for your device.

---

## 🗄️ Run the Backend Locally

1. Install **XAMPP** (Apache + PHP + MySQL).
2. Copy the `backend/` directory into your XAMPP `htdocs` folder.
3. Create/configure the MySQL database used by the PHP API files.
4. Update `backend/config/db.php` for your local database settings.
5. Start **Apache** and **MySQL** in XAMPP.
6. Update the frontend API URLs to the IP/hostname of your local backend server before running the app on another device.

> The checked source currently contains a local development IP in several frontend API calls. Do not treat that address as a deployable/public API endpoint.

---

## 🔌 Backend API Areas

The repository currently contains endpoints covering:

```text
Auth
├── login.php
├── register.php / signup.php
├── forgot-password.php
├── get_leaderboard.php
├── get_shop.php
├── save_history.php
└── update_score.php

Game
├── startChallenge.php
├── submitScore.php
└── getLeaderboard.php

User
├── getProfile.php
├── updateProfile.php
└── getHistory.php
```

---

## 🧠 Engineering Highlights

This project gave me hands-on experience with:

- Component-based mobile UI development
- Gesture-based interaction with `PanResponder`
- React state management for game state
- Animated UI/gameplay effects with React Native `Animated`
- Client-side session persistence with AsyncStorage
- REST API integration with `fetch`
- PHP backend development
- MySQL database integration through PDO
- Prepared SQL statements and database transactions
- Player progression and leaderboard logic
- Debugging and connecting frontend, backend and database layers

---

## ⚠️ Public Repository Checklist

Before deploying this project publicly, review:

- database credentials in `backend/config/db.php`
- hard-coded local API addresses in the frontend
- access control for admin-related endpoints
- CORS configuration for production
- input validation and authentication for production deployment

The current repository is best understood as an **internship/development project**, not a production-hardened public service.

---

## 👨‍💻 Developer

**Gaurav Joshi**  
B.Tech Computer Science & Engineering — Amrapali University

[GitHub](https://github.com/igaurav25) · [LinkedIn](https://linkedin.com/in/gaurav-joshi-31b256413)

---

## 📌 Internship Context

**Role:** IT Developer Intern  
**Organization:** Ruhanix Solutions (OPC) Private Limited  
**Period:** June 2026 – August 2026

I worked on frontend/mobile development, gameplay logic, backend API integration, database connectivity, authentication flows, testing and debugging for the football game project.
