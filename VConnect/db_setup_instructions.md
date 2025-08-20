# Database Setup for VConnect

## 1. Create / Select Database
If the database `bpwoq9itspvyqwdlrffe` already exists (Clever Cloud), skip create. Otherwise locally:
```sql
CREATE DATABASE vconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vconnect;
```

## 2. Run Schema
Execute the SQL in `db_setup.sql` (locally example):
```bash
mysql -u root -p vconnect < db_setup.sql
```
For Clever Cloud, use their console or a MySQL client and paste contents of `db_setup.sql`.

## 3. Admin User Seed (optional)
Generate a bcrypt hash (example placeholder only) and insert:
```sql
INSERT INTO users(name,email,password_hash,user_type) VALUES
 ('Admin','admin@example.com','$2a$10$replaceHashHere','admin');
```

## 4. Environment Config
Update `Config.toml` with correct host, database name, user, password, and `JWT_SECRET`.

## 5. Run App
```
bal build
bal run
```

## 6. Quick Smoke Tests (use returned JWT tokens)
1. Register volunteer -> login -> get token.
2. Register organization -> create org profile.
3. Create event -> volunteer apply.
4. Add feedback with rating>=4 -> check badges.

## 7. Tables Overview
- users
- organization_profiles
- events
- donation_requests
- donations
- feedback
- badges
- volunteer_profiles
- event_applications

## 8. Reset (Dangerous)
```sql
DROP TABLE event_applications;DROP TABLE volunteer_profiles;DROP TABLE badges;DROP TABLE feedback;DROP TABLE donations;DROP TABLE donation_requests;DROP TABLE events;DROP TABLE organization_profiles;DROP TABLE users;
```

## 9. Troubleshooting
- Empty applications list: ensure `event_applications` table exists and apply endpoint returns JSON.
- Badges missing: confirm feedback rows with rating >=4 exist.
- Foreign key errors: insert order matters (users before dependent tables).

