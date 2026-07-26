# Stainless Study Guard - Next-Gen AI Study Monitor & Attention Activator

## Overview

Stainless Study Guard is an AI-powered web application that monitors student attention during online learning using real-time face tracking. The system detects sleep and absence through webcam analysis and instantly re-engages students by triggering an alarm and displaying a subject-specific quiz.

The project is lightweight, browser-based, and privacy-friendly because all face processing happens locally without storing user data.

---

## Problem Statement

Students often lose focus during online classes and self-study sessions due to sleep, distractions, or leaving their study area. Traditional learning platforms cannot detect these situations in real time.

Stainless Study Guard provides an AI-powered solution that monitors student attention and immediately alerts the learner through an interactive quiz whenever inattentiveness is detected.

---

## Features

- 🎥 Real-time webcam monitoring
- 👁️ AI-based face and eye tracking
- 😴 Sleep detection
- 🚶 Absence detection
- 🔔 Automatic alarm notification
- ❓ Interactive MCQ quiz activation
- 📚 Multiple study domains
  - Python
  - Data Science
  - Artificial Intelligence
  - Digital Marketing
  - DevOps & Cloud
- 📊 Live study dashboard
- 🔒 Privacy-friendly browser processing

---

## Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### AI Library
- MediaPipe Face Mesh

---

## Project Structure

```
Stainless-Study-Guard/
│
├── index.html
├── style.css
├── app.js
├── questions.js
├── server.js
├── package.json
├── package-lock.json
├── alert.mp3
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/stainless-study-guard.git
```

### Navigate to Project

```bash
cd stainless-study-guard
```

### Install Dependencies

```bash
npm install
```

### Start Server

```bash
npm start
```

Open your browser:

```
http://localhost:3000
```

---

## How It Works

1. Select a study domain.
2. Grant webcam permission.
3. AI continuously monitors facial landmarks.
4. If sleep or absence is detected:
   - Alarm starts.
   - Subject-specific quiz appears.
5. Answer the quiz correctly to stop the alarm.
6. Dashboard updates focus statistics in real time.

---

## Dashboard Metrics

- Study Time
- Alerts Triggered
- Quiz Count
- Focus Rating

---

## Future Enhancements

- Parent/Guardian WhatsApp notifications
- Cloud analytics dashboard
- Personalized learning recommendations
- Mobile application support
- AI-based emotion and fatigue analysis

---

## Demo

### Live Deployment

[https://study-guard-yevzedvk.onslate.in/](https://study-guard-yevzedvk.onslate.in/)

### Demo Video

 (https://drive.google.com/file/d/1sZHZDpkDU8XEB4XQ_IzAR6W7PGJ9RN1d/view)

---

## Author

**Ashika S**

B.Tech Artificial Intelligence & Data Science

---

## License

This project was developed as a prototype for **Datathon 2026**.
