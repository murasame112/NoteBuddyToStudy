# NoteBuddyToStudy Backend

---
## Overview

This repository showcases **my backend contribution** to an university team project I've done with Michał Stasiowski.
I was responsible for designing and implementing the server-side application, including the REST API, database layer and business logic used by the client application.
The backend provides CRUD operations for the application's core entities, exposes a structured REST API and manages data persistence using MongoDB.

---
## Tech Stack

**Backend**
- Node.js
- Express
- TypeScript
- REST API

**Database**
- MongoDB
- MongoDB Atlas
- Mongoose

**Development Tools**
- Nodemon

---
## Features

### REST API
- RESTful endpoint architecture
- CRUD operations for application resources
- JSON request and response handling
- Modular endpoint organization

### Data Management
- Notes management
- Categories and subcategories
- Flashcards
- User management
- Study groups
- Notifications
- Hints
- Activity logs

### Database
- MongoDB integration
- Mongoose models
- Centralized database connection
- Persistent document storage

---

## Architecture
The backend follows a modular architecture where each domain entity is separated into its own endpoint and model.

```
Client Application
        │
        ▼
   Express REST API
        │
 ┌──────┼──────────────┐
 │      │              │
Notes  Users      Categories
 │      │              │
 └──────┼──────────────┘
        │
     Mongoose
        │
        ▼
   MongoDB Atlas
```


## Setup & Installation

### 1. Clone repository
```
git clone https://github.com/murasame112/NoteBuddyToStudy.git

```

### 2. Install dependencies
```
cd backend
npm install
cd frontend
npm install
```

### 3. Configure MongoDB
Create a `.env` file (recommended) containing your MongoDB connection string.

Example:

```
MONGODB_URI=<your_connection_string>
```

### 4. Run the server
```
cd backend
npm run start
cd frontend
npm run start
```

The API starts on:
```
http://localhost:3000
```

Frontend starts on:
```
http://localhost:4200
```


---

## Engineering Highlights
- Designed and implemented a modular Express backend.
- Built a REST API exposing CRUD operations for multiple application entities.
- Structured the project into separate endpoint and model layers.
- Integrated MongoDB using Mongoose.
- Implemented reusable database access patterns across multiple resources.

---

## Contribution
This repository represents **my backend contribution** to a university team project.

My responsibilities included:

- backend architecture
- REST API implementation
- Express server
- MongoDB integration
- database models
- business logic
- endpoint implementation

The frontend application was developed by another team member.

---

## Author
Backend developed by Tomasz Więsek
