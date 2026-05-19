DROP DATABASE IF EXISTS medical_portal;
CREATE DATABASE medical_portal;
USE medical_portal;

-- =========================
-- Rollen
-- =========================
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE -- patient, hulpverlener, doctor, admin
);

INSERT INTO roles (role_name) VALUES
('patient'),
('hulpverlener'),
('doctor'),
('admin');

-- =========================
-- Gebruikers
-- =========================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    client_id INT NULL, -- alleen gevuld als user een patient is
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- =========================
-- Patiënten
-- =========================
CREATE TABLE clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    szf_code VARCHAR(30) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    gender VARCHAR(20),
    birth_date DATE,
    phone VARCHAR(50),
    address VARCHAR(255),
    emergency_contact VARCHAR(50),
    blood_type VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- Medicijnen
-- =========================
CREATE TABLE medicines (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    default_usage VARCHAR(255)
);

-- =========================
-- Allergieën
-- =========================
CREATE TABLE allergies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- =========================
-- Consulten / visits
-- =========================
CREATE TABLE visits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    staff_id INT NOT NULL, -- arts of hulpverlener
    visit_type VARCHAR(100),
    visit_date DATE,
    visit_time TIME,
    results TEXT,
    notes TEXT,
    is_emergency BOOLEAN DEFAULT FALSE, -- flag voor noodmodus
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (staff_id) REFERENCES users(id)
);

-- =========================
-- Acties tijdens een visit (notes/treatments)
-- =========================
CREATE TABLE visit_actions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visit_id INT NOT NULL,
    staff_id INT NOT NULL,
    action_type VARCHAR(100), -- bv. 'first aid', 'note', 'treatment'
    description TEXT,
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visit_id) REFERENCES visits(id),
    FOREIGN KEY (staff_id) REFERENCES users(id)
);

-- =========================
-- Medicatie per patiënt
-- =========================
CREATE TABLE client_medications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    medicine_id INT NOT NULL,
    usage_instruction VARCHAR(255),
    collect_date DATE,
    expire_date DATE,
    dosage VARCHAR(100),
    status VARCHAR(50),
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (medicine_id) REFERENCES medicines(id)
);

-- =========================
-- Allergieën per patiënt
-- =========================
CREATE TABLE client_allergies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    allergy_id INT NOT NULL,
    severity VARCHAR(100),
    notes VARCHAR(255),
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (allergy_id) REFERENCES allergies(id)
);

-- =========================
-- Notificaties
-- =========================
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    seen BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================
-- Scan logs
-- =========================
CREATE TABLE scan_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    scanned_by VARCHAR(100),
    scan_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    device VARCHAR(100),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- =========================
-- Noodmodus logs (audit trail)
-- =========================
CREATE TABLE emergency_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,       -- patiënt waarvoor noodmodus is gebruikt
    staff_id INT NOT NULL,        -- arts of hulpverlener die noodmodus activeerde
    activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason VARCHAR(255),          -- optioneel: reden of context
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (staff_id) REFERENCES users(id)
);
select *from roles