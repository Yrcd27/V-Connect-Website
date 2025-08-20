-- Database schema for VConnect
-- Adjust engine/charset as needed

-- Users table
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  user_type ENUM('admin','organization','volunteer') NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Organization profiles
CREATE TABLE IF NOT EXISTS organization_profiles (
  organization_id INT PRIMARY KEY, -- FK to users.user_id
  description TEXT,
  contact_info VARCHAR(255),
  address VARCHAR(255),
  founded_year INT,
  FOREIGN KEY (organization_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  organization_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  event_date DATETIME,
  capacity INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_events_org (organization_id)
);

-- Donation requests
CREATE TABLE IF NOT EXISTS donation_requests (
  request_id INT AUTO_INCREMENT PRIMARY KEY,
  organization_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  target_amount DECIMAL(15,2),
  contact_info VARCHAR(255),
  status VARCHAR(30) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_dreq_org (organization_id)
);

-- Donations (summary records per donation)
CREATE TABLE IF NOT EXISTS donations (
  donation_id INT AUTO_INCREMENT PRIMARY KEY,
  organization_id INT NOT NULL,
  donor_name VARCHAR(150),
  amount DECIMAL(15,2) NOT NULL,
  donated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_don_org (organization_id)
);

-- Feedback (volunteer -> event/org)
CREATE TABLE IF NOT EXISTS feedback (
  feedback_id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  volunteer_id INT NOT NULL,
  organization_id INT NOT NULL,
  rating INT NOT NULL,
  comment TEXT,
  hours_worked INT,
  given_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_feedback_once (event_id, volunteer_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
  FOREIGN KEY (volunteer_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (organization_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_feedback_vol (volunteer_id),
  INDEX idx_feedback_org (organization_id)
);

-- Badges
CREATE TABLE IF NOT EXISTS badges (
  badge_id INT AUTO_INCREMENT PRIMARY KEY,
  volunteer_id INT NOT NULL,
  badge_name VARCHAR(150) NOT NULL,
  badge_description TEXT,
  earned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  awarded_by INT NULL, -- admin id or NULL for system/auto
  FOREIGN KEY (volunteer_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (awarded_by) REFERENCES users(user_id) ON DELETE SET NULL,
  INDEX idx_badges_vol (volunteer_id)
);

-- Volunteer profiles (extended)
CREATE TABLE IF NOT EXISTS volunteer_profiles (
  volunteer_id INT PRIMARY KEY, -- FK to users.user_id
  bio TEXT,
  skills TEXT,
  total_hours INT DEFAULT 0,
  avg_rating DECIMAL(4,2) DEFAULT 0.0,
  FOREIGN KEY (volunteer_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Event applications
CREATE TABLE IF NOT EXISTS event_applications (
  application_id INT AUTO_INCREMENT PRIMARY KEY,
  volunteer_id INT NOT NULL,
  event_id INT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_vol_event (volunteer_id, event_id),
  FOREIGN KEY (volunteer_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
  INDEX idx_app_event (event_id),
  INDEX idx_app_vol (volunteer_id)
);

-- Simple contributions view (could be computed from feedback hours)
-- If you track accepted hours separately, create a table; currently using feedback.hours_worked.

-- Seed an admin (replace password hash accordingly)
-- INSERT INTO users(name,email,password_hash,user_type) VALUES ('Admin','admin@example.com','<bcrypt-hash>','admin');

-- End of schema
