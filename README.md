# EMP Medical Management System

## Project Description

EMP Medical Management System is a web-based application designed to manage patients, visits, doctors, and medical records efficiently.  
The system includes authentication, role-based access control, session management, patient scanning, and visit tracking functionalities.

This project is built using Node.js, Express.js, MySQL, and custom HTML/CSS frontend pages.

---

## Technologies Used

- Node.js
- Express.js
- MySQL
- JavaScript
- HTML5
- CSS3
- Express Session
- dotenv
- CORS

---

## Requirements

Before running the project, make sure the following are installed:

- Node.js (v18 or higher recommended)
- MySQL Server
- npm (comes with Node.js)

---

## Installation Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/emp-medical-system.git

### 2. Navigate into the project folder

```bash
cd emp-medical-system
```

### 3. Install dependencies

```bash
npm install
```

---

## Database Setup

### 1. Create a MySQL database

Open MySQL and create a new database:

```sql
CREATE DATABASE emp_medical_system;
```

### 2. Configure environment variables

Create a `.env` file in the root directory of the project and add the following:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=emp_medical_system
PORT=3000
SESSION_SECRET=your_secret_key
```

Replace the values with your actual MySQL credentials.

### 3. Import the database schema

Import the provided SQL file into MySQL:

```bash
mysql -u root -p emp_medical_system < database.sql
```

Or import it manually using MySQL Workbench or phpMyAdmin.

### 4. Verify database connection

Make sure MySQL server is running before starting the application.

---

## Running the Application

Start the server using:

```bash
npm start
```

For development mode:

```bash
npm run dev
```

The application will run on:

```txt
http://localhost:3000
```

---

## Usage

- Login using your account credentials
- Manage patients and doctors
- Register visits and medical records
- Scan and upload patient-related files
- Track medical visit history

---