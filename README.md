# 🚀 Project Management System

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

<img src="https://readme-typing-svg.demolab.com?font=Space+Grotesk&weight=700&size=24&duration=2800&pause=900&color=7C3AED&center=true&vCenter=true&width=760&lines=Plan+projects.+Manage+teams.+Ship+work.;Projects+%7C+Tasks+%7C+Subtasks+%7C+Notes;Built+with+React+%2B+TypeScript+%2B+Node.js" alt="Typing animation" />

**A modern full-stack project management system for teams to organize projects, tasks, subtasks, members, and notes.**

</div>

---

## ✨ What is it?

Project Management System is a full-stack application designed around a simple workflow:

**Create a project → add your team → manage tasks → track progress → keep project notes together.**

The frontend uses a playful purple/fuchsia Tailwind UI, while the backend provides a REST API with authentication, project-level permissions, task management, notes, and file attachments.

## 🎯 Core Features

- 🔐 JWT authentication with access/refresh tokens
- 📧 Email verification and password reset
- 👥 Project members and project-level roles
- 📁 Project creation and management
- ✅ Tasks with status tracking
- 🧩 Subtasks and completion tracking
- 📎 Multiple task attachments
- 📝 Project notes
- 🛡️ Role-based authorization
- 🌈 Responsive, animated Tailwind CSS interface
- 🩺 API health check

## 🧑‍💻 Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS 4

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT
- Nodemailer
- Multer

## 🏗️ Project Structure

\`\`\`text
project_management_system/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── PRD.md
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── types/
│   └── package.json
│
└── README.md
\`\`\`

## 🚦 Getting Started

### 1. Clone

\`\`\`bash
git clone https://github.com/iamsyedbilal/project_management_system.git
cd project_management_system
\`\`\`

### 2. Backend

\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`

Create \`.env\` using the variables documented by the backend configuration.

Backend runs locally on:

\`\`\`text
http://localhost:8000
\`\`\`

### 3. Frontend

Open another terminal:

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

Then open the Vite development URL shown in the terminal.

## 🔑 Roles & Permissions

| Role | Scope |
|---|---|
| **Admin** | Full system and project administration |
| **Project Admin** | Manage project tasks and subtasks |
| **Member** | View project content and update subtask status |

Project permissions are enforced by the backend rather than relying only on frontend UI restrictions.

## 🔌 Main API Areas

\`\`\`text
/api/v1/auth
/api/v1/projects
/api/v1/tasks
/api/v1/notes
/api/v1/healthcheck
\`\`\`

For the complete API requirements and route definitions, see [\`backend/PRD.md\`](./backend/PRD.md).

## 🔒 Security

- JWT-based authentication
- Refresh-token session flow
- Protected API routes
- Role-based authorization
- Project-level permission checks
- Input validation
- Secure password flows
- Multer-based attachment uploads
- CORS configuration

## 🎨 Design

The frontend follows a **funky, friendly workspace aesthetic**:

- 💜 Violet + fuchsia gradients
- ✨ Soft animated visual accents
- 🔵 Colorful status indicators
- 🪩 Rounded cards and playful interactions
- 🔤 Space Grotesk + DM Sans typography

## 📌 Project Status

**Active development** — backend APIs and the frontend application are being built together against the project PRD.

---

<div align="center">

### Built to turn scattered work into one organized workspace. 🚀

**Project Management System**

</div>
