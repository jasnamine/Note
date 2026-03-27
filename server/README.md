# 🗄️ NoteSpace Backend API

Backend server for **NoteSpace**, a Google Keep–inspired note-taking application.  
This backend provides all core APIs for authentication, notes, labels, reminders, collaboration, notifications, images, and version history.

The project is built with **Node.js + Express**, following a modular, basic secure, and scalable architecture.

---

## 🔗 Related Project

- 🎨 **Frontend (React + Vite + MUI)**  
  👉 https://github.com/jasnamine/NoteSpace-FrontEnd/tree/main

---

## 🚀 Main Features

- 🔐 User authentication (Register / Login / Logout)
- 🔑 JWT access & refresh token handling
- 🔐 Google OAuth 2.0 login
- 📧 Forgot & reset password via email
- 📝 CRUD notes (create, edit, delete)
- 📌 Pin / archive / trash / restore notes
- 🔍 Search notes
- ☑️ Checklist notes
- 🗂️ Tags & note–tag management
- ⏰ Reminders (CRUD)
- 👥 Collaboration system (invite, accept, permissions)
- 🧑‍🤝‍🧑 Role-based access control (owner / collaborator)
- 🖼️ Image upload for notes (Cloudinary)
- 🕒 Note version history
- 🔔 Notifications system
- 👤 User profile
- 🛡️ Secure middleware validation & global error handling

---

## 🛠️ Tech Stack

- **Node.js**
- **Express**
- **Sequelize (MySQL)**
- **Redis**
- **JWT (jsonwebtoken)**
- **Passport (Google OAuth 2.0)**
- **Joi** (request validation)
- **Multer + Cloudinary** (image upload)
- **bcryptjs** (password hashing)
- **Nodemailer** (email service)

---

## 🗄️ Database Design

The database for **NoteSpace** is designed to support a full-featured note-taking system similar to Google Keep, including notes, labels, reminders, collaboration, notifications, and version history.

The schema follows a **relational design**, optimized for scalability and data consistency, and is implemented using **MySQL + Sequelize**.

### 📌 Key Design Concepts

- Users own notes and labels
- Notes support soft delete, pin, archive, reminders, images, and history
- Tags are user-specific and linked to notes via a many-to-many relationship
- Collaboration supports multiple users with permission control (`view`, `edit`)
- History stores snapshots of notes for version tracking
- Notifications are generated for invitations and collaboration events
- Images are stored externally (Cloudinary), only URLs are saved in the database

---

### 🧩 Entity Relationship Diagram (ERD)

The ERD is created using **dbdiagram.io**.

👉 **View / Edit the database diagram here:**  
🔗 https://dbdocs.io/jasnaminemine/NoteSpace?view=relationships

> ⚠️ *Note:* The database design represents a **basic and simplified structure** of NoteSpace, focusing on core features and relationships.

---

## 📡 API Overview

### Auth
`/api/v1/auth`  
Register, login, Google OAuth, refresh token, logout, forgot/reset password

### Notes
`/api/v1/notes`  
Create, edit, delete, pin, archive, trash, restore, search, collaboration notes

### Checklist
`/api/v1/checklists`  
Add, update, delete checklist items

### Tags
`/api/v1/tags`  
Create, edit, delete tags  

`/api/v1/noteTags`  
Attach / detach tags from notes

### Collaboration
`/api/v1/collaborators`  
Invite, accept, remove collaborators, manage permissions

### Reminders
`/api/v1/reminders`  
Create, update, delete reminders (single & bulk)

### Notifications
`/api/v1/notifications`  
Get notifications, mark as read, delete notifications

### Images
`/api/v1/images`  
Upload & delete images in notes

### History
`/api/v1/histories`  
View note version history

### User
`/api/v1/user`  
User profile & settings

---

## ⚙️ Installation & Setup

Clone repository:
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_BACKEND_REPO_URL.git
cd server
npm install
npm start
