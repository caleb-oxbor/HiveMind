-- -- Create the hivemind database
-- -- CREATE DATABASE hivemind;

-- -- Switch to the hivemind database
-- -- \c hivemind

-- -- Download and set the uuid-ossp extension
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -- Table to store US universities
-- CREATE TABLE universities (
--     uni_id SERIAL PRIMARY KEY,
--     uni_name TEXT NOT NULL
-- );

-- -- Table to store user account information
-- CREATE TABLE users (
--     user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--     username VARCHAR(50) UNIQUE NOT NULL,
--     password TEXT NOT NULL,
--     email VARCHAR(100) UNIQUE NOT NULL
-- );

-- -- Table to store courses within universities
-- CREATE TABLE courses (
--     course_id SERIAL PRIMARY KEY,
--     course_name TEXT NOT NULL,
--     uni_id INT REFERENCES universities(

-- ALTER TABLE enrollments
-- DROP COLUMN user_id;

-- ALTER TABLE enrollments
-- ADD COLUMN user_id uuid;

-- ALTER TABLE posts
-- ADD CONSTRAINT posts_user_id_fkey
-- FOREIGN KEY (user_id) REFERENCES users(user_id);

-- ALTER TABLE post_votes
-- ADD CONSTRAINT post_votes_user_id_fkey
-- FOREIGN KEY (user_id) REFERENCES users(user_id);

-- ALTER TABLE user_activity
-- ADD CONSTRAINT user_activity_user_id_fkey
-- FOREIGN KEY (user_id) REFERENCES users(user_id);

-- ALTER TABLE enrollments
-- ADD CONSTRAINT enrollments_user_id_fkey
-- FOREIGN KEY (user_id) REFERENCES users(user_id);


INSERT INTO users (username, email, password)
VALUES ('alina', 'alina123@ufl.edu', '143033');