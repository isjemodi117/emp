-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 23, 2026 at 08:57 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `medical_portal`
--

-- --------------------------------------------------------

--
-- Table structure for table `allergies`
--

CREATE TABLE `allergies` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `allergies`
--

INSERT INTO `allergies` (`id`, `name`) VALUES
(1, 'Peanuts'),
(2, 'Dust'),
(3, 'Milk'),
(4, 'Pollen'),
(5, 'Penicillin');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `szf_code` varchar(30) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `gender` varchar(20) NOT NULL,
  `birth_date` date NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `emergency_contact` varchar(50) DEFAULT NULL,
  `blood_type` varchar(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `szf_code`, `first_name`, `last_name`, `gender`, `birth_date`, `phone`, `address`, `emergency_contact`, `blood_type`, `created_at`) VALUES
(1, 'SZF10001', 'Marvin', 'Latchmansing', 'Male', '1999-05-12', '7273468', 'Paramaribo', '7654832', 'O+', '2026-05-13 11:56:27'),
(2, 'SZF10002', 'Ravi', 'Singh', 'Male', '2001-08-20', '8123456', 'Wanica', '8547691', 'A+', '2026-05-13 11:56:27'),
(3, 'SZF10003', 'Priya', 'Ramdas', 'Female', '1998-11-02', '7456123', 'Commewijne', '7654321', 'B+', '2026-05-13 11:56:27'),
(4, 'SZF10004', 'Anjali', 'Persad', 'Female', '1997-01-15', '7123456', 'Paramaribo', '7894561', 'AB+', '2026-05-13 11:56:27'),
(5, 'SZF10005', 'Kevin', 'Bisoen', 'Male', '1988-03-22', '7456789', 'Wanica', '7654987', 'O-', '2026-05-13 11:56:27'),
(6, 'SZF10006', 'Sara', 'Janki', 'Female', '2000-07-19', '7561234', 'Nickerie', '7234567', 'A-', '2026-05-13 11:56:27'),
(7, 'SZF10007', 'Ryan', 'Algoe', 'Male', '1995-11-08', '8123457', 'Commewijne', '7543210', 'B-', '2026-05-13 11:56:27'),
(8, 'SZF10008', 'Melissa', 'Baldewsing', 'Female', '1992-09-10', '8234567', 'Saramacca', '7999999', 'O+', '2026-05-13 11:56:27'),
(9, 'SZF10009', 'John', 'Smith', 'Male', '1985-12-01', '8345678', 'Paramaribo', '7111111', 'A+', '2026-05-13 11:56:27'),
(10, 'SZF10010', 'Lisa', 'Williams', 'Female', '1999-05-17', '8456789', 'Wanica', '7222222', 'AB-', '2026-05-13 11:56:27');

-- --------------------------------------------------------

--
-- Table structure for table `client_allergies`
--

CREATE TABLE `client_allergies` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `allergy_id` int(11) NOT NULL,
  `severity` varchar(100) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `client_allergies`
--

INSERT INTO `client_allergies` (`id`, `client_id`, `allergy_id`, `severity`, `notes`) VALUES
(1, 1, 1, 'High', 'Carries medication'),
(2, 2, 2, 'Medium', 'Avoid dusty rooms');

-- --------------------------------------------------------

--
-- Table structure for table `client_medications`
--

CREATE TABLE `client_medications` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `medicine_id` int(11) NOT NULL,
  `usage_instruction` varchar(255) DEFAULT NULL,
  `collect_date` date DEFAULT NULL,
  `expire_date` date DEFAULT NULL,
  `dosage` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `client_medications`
--

INSERT INTO `client_medications` (`id`, `client_id`, `medicine_id`, `usage_instruction`, `collect_date`, `expire_date`, `dosage`, `status`) VALUES
(1, 1, 1, 'After meals', '2026-05-01', '2026-06-01', '500mg', 'Active'),
(2, 2, 2, 'Morning only', '2026-05-02', '2026-07-02', '250mg', 'Completed');

-- --------------------------------------------------------

--
-- Table structure for table `medicines`
--

CREATE TABLE `medicines` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `default_usage` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `medicines`
--

INSERT INTO `medicines` (`id`, `name`, `description`, `default_usage`) VALUES
(1, 'Paracetamol', 'Pain relief medicine', '2 times daily'),
(2, 'Amoxicillin', 'Antibiotic medicine', '3 times daily'),
(3, 'Ibuprofen', 'Inflammation medicine', 'After meals'),
(4, 'Cetirizine', 'Allergy medicine', '1 daily'),
(5, 'Vitamin C', 'Supplement', 'Morning');

-- --------------------------------------------------------

--
-- Table structure for table `scan_logs`
--

CREATE TABLE `scan_logs` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `scanned_by` varchar(100) DEFAULT NULL,
  `scan_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `device` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `scan_logs`
--

INSERT INTO `scan_logs` (`id`, `client_id`, `scanned_by`, `scan_time`, `device`) VALUES
(1, 1, 'Reception', '2026-05-13 11:56:27', 'Desktop Scanner'),
(2, 2, 'Nurse Kelly', '2026-05-13 11:56:27', 'Samsung Tablet');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `client_id`, `email`, `password`, `role`, `created_at`) VALUES
(1, 1, 'marvin@example.com', 'password123', 'admin', '2026-05-13 11:56:27'),
(2, 2, 'ravi@example.com', 'password123', 'client', '2026-05-13 11:56:27'),
(3, 3, 'priya@example.com', 'password123', 'client', '2026-05-13 11:56:27'),
(4, 4, 'anjali@example.com', 'password123', 'client', '2026-05-13 11:56:27'),
(5, 5, 'kevin@example.com', 'password123', 'client', '2026-05-13 11:56:27'),
(6, 6, 'sara@example.com', 'password123', 'doctor', '2026-05-13 11:56:27'),
(7, 7, 'ryan@example.com', 'password123', 'client', '2026-05-13 11:56:27'),
(8, 8, 'melissa@example.com', 'password123', 'nurse', '2026-05-13 11:56:27'),
(9, 9, 'john@example.com', 'password123', 'admin', '2026-05-13 11:56:27'),
(10, 10, 'lisa@example.com', 'password123', 'client', '2026-05-13 11:56:27');

-- --------------------------------------------------------

--
-- Table structure for table `visits`
--

CREATE TABLE `visits` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `visit_type` varchar(100) DEFAULT NULL,
  `visit_date` date DEFAULT NULL,
  `visit_time` time DEFAULT NULL,
  `doctor_name` varchar(100) DEFAULT NULL,
  `results` text DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `visits`
--

INSERT INTO `visits` (`id`, `client_id`, `visit_type`, `visit_date`, `visit_time`, `doctor_name`, `results`, `notes`) VALUES
(1, 1, 'General Checkup', '2026-05-01', '10:00:00', 'Dr. Smith', 'Healthy', 'No issues'),
(2, 2, 'Dental', '2026-05-02', '09:00:00', 'Dr. Wilson', 'Cavity detected', 'Follow-up needed');

-- --------------------------------------------------------

--
-- Table structure for table `visit_medications`
--

CREATE TABLE `visit_medications` (
  `id` int(11) NOT NULL,
  `visit_id` int(11) NOT NULL,
  `medicine_id` int(11) NOT NULL,
  `dosage` varchar(100) DEFAULT NULL,
  `usage_instruction` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `visit_medications`
--

INSERT INTO `visit_medications` (`id`, `visit_id`, `medicine_id`, `dosage`, `usage_instruction`) VALUES
(1, 1, 1, '500mg', 'Twice daily'),
(2, 2, 2, '250mg', 'Morning');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `allergies`
--
ALTER TABLE `allergies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `szf_code` (`szf_code`);

--
-- Indexes for table `client_allergies`
--
ALTER TABLE `client_allergies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_client_allergies_client` (`client_id`),
  ADD KEY `fk_client_allergies_allergy` (`allergy_id`);

--
-- Indexes for table `client_medications`
--
ALTER TABLE `client_medications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_client_medications_client` (`client_id`),
  ADD KEY `fk_client_medications_medicine` (`medicine_id`);

--
-- Indexes for table `medicines`
--
ALTER TABLE `medicines`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `scan_logs`
--
ALTER TABLE `scan_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_scan_logs_client` (`client_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_users_client` (`client_id`);

--
-- Indexes for table `visits`
--
ALTER TABLE `visits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_visits_client` (`client_id`);

--
-- Indexes for table `visit_medications`
--
ALTER TABLE `visit_medications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_visit_medications_visit` (`visit_id`),
  ADD KEY `fk_visit_medications_medicine` (`medicine_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `allergies`
--
ALTER TABLE `allergies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `client_allergies`
--
ALTER TABLE `client_allergies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `client_medications`
--
ALTER TABLE `client_medications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `medicines`
--
ALTER TABLE `medicines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `scan_logs`
--
ALTER TABLE `scan_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `visits`
--
ALTER TABLE `visits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `visit_medications`
--
ALTER TABLE `visit_medications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `client_allergies`
--
ALTER TABLE `client_allergies`
  ADD CONSTRAINT `fk_client_allergies_allergy` FOREIGN KEY (`allergy_id`) REFERENCES `allergies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_client_allergies_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `client_medications`
--
ALTER TABLE `client_medications`
  ADD CONSTRAINT `fk_client_medications_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_client_medications_medicine` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `scan_logs`
--
ALTER TABLE `scan_logs`
  ADD CONSTRAINT `fk_scan_logs_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `visits`
--
ALTER TABLE `visits`
  ADD CONSTRAINT `fk_visits_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `visit_medications`
--
ALTER TABLE `visit_medications`
  ADD CONSTRAINT `fk_visit_medications_medicine` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_visit_medications_visit` FOREIGN KEY (`visit_id`) REFERENCES `visits` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
