# D&D Modular Character Creator

## Overview

The D&D Modular Character Creator is a web application built with Node.js, Express, EJS, and PostgreSQL. The application allows users to create accounts, log in securely, and build customizable Dungeons & Dragons characters.

The project follows an MVC (Model–View–Controller) architecture and separates user authentication, character management, and administrative tools into distinct components.

---

## Features

### User Accounts

* User registration and login
* Secure password hashing with bcrypt
* Session-based authentication
* Logout functionality
* Protected routes

### Character Management

* Create new characters
* View character sheets
* Edit existing characters
* Delete characters
* Characters are associated with the account that created them
* Ownership checks prevent users from modifying other users' characters

### Administrative Features

* Owner and moderator roles
* Admin dashboard
* User management tools
* Role assignment system
* Protected administrator routes

### Validation and Security

* Server-side validation using express-validator
* PostgreSQL parameterized queries
* Session protection with express-session
* Authorization middleware
* Role-based access control

---

## Technologies Used

### Backend

* Node.js
* Express
* PostgreSQL

### Frontend

* EJS templates
* HTML5
* CSS3

### Authentication and Security

* bcrypt
* express-session
* connect-pg-simple

### Validation

* express-validator

---

## Database Design

The application uses PostgreSQL and follows a relational database design.

### Core Tables

#### Users

Stores account information:

* id
* name
* email
* password
* role
* created_at

#### Characters

Stores player characters:

* id
* user_id
* name
* race_id
* class_id
* level
* strength
* dexterity
* constitution
* intelligence
* wisdom
* charisma

#### Supporting Tables

* races
* classes
* subclasses
* class_levels
* class_resources
* backgrounds
* feats
* character_items
* character_spells
* character_proficiencies
* character_languages
* character_feats
* character_spellbooks
* character_spellbook_spells

---

## Project Structure

```text
Character-sheet-creator/

├── server.js
├── package.json
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── views/
│
├── public/
│   ├── css/
│   ├── images/
│   └── js/
│
└── scripts/
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/MYST-Drakonoid/Character-sheet-creator
```

Move into the project directory:

```bash
cd Character-sheet-creator
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and configure:

```env
PORT=3000
DB_URL=your_database_connection_string
SESSION_SECRET=your_secret_key
NODE_ENV=development
```

Start the application:

```bash
npm start
```

For development mode:

```bash
npm run dev
```

---

## Test Accounts

The project includes optional seeded accounts for demonstration purposes.

### Administrator

```text
Email: Admin@test.com
Password: P@$$w0rd!
Role: Owner
```

### Moderator

```text
Email: Mod@test.com
Password: P@$$w0rd!
Role: Moderator
```

---

## Security Features

* Passwords are hashed with bcrypt.
* Sessions are stored securely.
* Users may only access their own characters.
* Administrator pages require elevated permissions.
* Input validation protects against malformed requests.
* SQL injection risks are reduced through parameterized queries.

---

## Known Limitations

* The character workflow system has not yet been implemented.
* Character data is currently simplified compared to full D&D rules.
* Spell and item systems are still under development.
* Administrative tools are limited to user and role management.

---

## Future Improvements

* Full spell database
* Equipment and inventory management
* Character approval workflow
* Search and filtering
* Expanded administrator tools
* Mobile-friendly interface
* Character export options

---

## Author

Anthony Peterson

Created for coursework and educational purposes.
