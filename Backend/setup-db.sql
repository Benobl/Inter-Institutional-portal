-- Database Schema for Inter-Institutional Data Exchange Portal (MySQL)
-- Run this script to create the necessary tables.

CREATE DATABASE IF NOT EXISTS data_exchanger_portal;
USE data_exchanger_portal;

-- 1. Institutions Table
CREATE TABLE IF NOT EXISTS institutions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  username VARCHAR(255) NULL,
  services TEXT NULL, -- stores JSON string
  status VARCHAR(50) DEFAULT 'Active',
  approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  institution_id INT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL
);

-- 3. Requests Table
CREATE TABLE IF NOT EXISTS requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  institutionId INT NULL, -- recipient institution (provider)
  institutionName VARCHAR(255) NULL,
  providerId INT NULL, -- alias for institutionId
  from_institution_id INT NULL,
  to_institution_id INT NULL,
  subject VARCHAR(255) NULL,
  services TEXT NULL, -- stores JSON array of services
  title VARCHAR(255) NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Submitted',
  adminNote TEXT NULL,
  conversationActive BOOLEAN DEFAULT TRUE,
  decisionDate TIMESTAMP NULL,
  reason TEXT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (institutionId) REFERENCES institutions(id) ON DELETE SET NULL
);

-- 4. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  requestId INT NULL,
  institution_id INT NULL,
  user_id INT NULL,
  userId INT NULL, -- alias for user_id
  title VARCHAR(255) NULL,
  message TEXT NULL,
  isRead BOOLEAN DEFAULT FALSE,
  is_read BOOLEAN DEFAULT FALSE, -- alias for isRead
  type VARCHAR(50) DEFAULT 'info',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (requestId) REFERENCES requests(id) ON DELETE CASCADE,
  FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. Universal Submissions Table
CREATE TABLE IF NOT EXISTS universal (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  customer_name VARCHAR(255) NOT NULL,
  national_id_path VARCHAR(255) NOT NULL,
  supporting_docs TEXT NULL, -- stores JSON array
  institution_ids TEXT NULL, -- stores JSON array
  status VARCHAR(50) DEFAULT 'Pending',
  is_notified TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 6. Provider Table
CREATE TABLE IF NOT EXISTS provider (
  id INT AUTO_INCREMENT PRIMARY KEY,
  institution_id INT NULL,
  institution_name VARCHAR(255) NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(50) NULL,
  address TEXT NULL,
  status VARCHAR(50) DEFAULT 'active',
  FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL
);

-- 7. Providers View (Maps institutions to providers for queries that join providers table)
CREATE OR REPLACE VIEW providers AS 
SELECT id, name, type, contact_person, phone, address, status 
FROM institutions;

-- 8. Activity Log Table
CREATE TABLE IF NOT EXISTS activity_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  request_id INT NULL,
  notification_id INT NULL,
  provider_id INT NULL,
  institution_id INT NULL,
  action VARCHAR(255) NOT NULL,
  details TEXT NULL,
  type VARCHAR(50) NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE SET NULL,
  FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL
);
