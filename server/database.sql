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
--     uni_id INT REFERENCES universities(uni_id) ON DELETE CASCADE
-- );

-- -- Table to store modules within each course
-- CREATE TABLE modules (
--     module_id SERIAL PRIMARY KEY,
--     module_name TEXT NOT NULL,
--     course_id INT REFERENCES courses(course_id) ON DELETE CASCADE
-- );

-- -- Table to store post information (PDFs, JPEGs, PNGs)
-- CREATE TABLE posts (
--     post_id SERIAL PRIMARY KEY,
--     post_type TEXT CHECK (post_type IN ('pdf', 'jpeg', 'png')) NOT NULL,
--     post_content BYTEA NOT NULL, -- Can store binary files like PDFs or images
--     module_id INT REFERENCES modules(module_id) ON DELETE CASCADE,
--     user_id uuid REFERENCES users(user_id) ON DELETE CASCADE, -- Changed to UUID
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Table to store upvotes and downvotes for posts
-- CREATE TABLE post_votes (
--     vote_id SERIAL PRIMARY KEY,
--     post_id INT REFERENCES posts(post_id) ON DELETE CASCADE,
--     user_id uuid REFERENCES users(user_id) ON DELETE CASCADE, -- Changed to UUID
--     vote_type BOOLEAN NOT NULL, -- TRUE for upvote, FALSE for downvote
--     UNIQUE (post_id, user_id) -- Ensure one vote per post per user
-- );

-- -- Table to store random words for username and password generation
-- CREATE TABLE words (
--     word_id SERIAL PRIMARY KEY,
--     word TEXT NOT NULL,
--     type VARCHAR(10) NOT NULL
-- );
-- -- Table to store course enrollments
-- CREATE TABLE enrollments (
--     enrollment_id SERIAL PRIMARY KEY,
--     user_id uuid REFERENCES users(user_id) ON DELETE CASCADE, -- Changed to UUID
--     course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
--     UNIQUE (user_id, course_id) -- One user can enroll in each course only once
-- );

-- -- Optional: Table for additional information about users and their activity
-- CREATE TABLE user_activity (
--     activity_id SERIAL PRIMARY KEY,
--     user_id uuid REFERENCES users(user_id) ON DELETE CASCADE, -- Changed to UUID
--     last_login TIMESTAMP,
--     account_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );


INSERT INTO words (word, type) VALUES
('astronaut', 'noun'), ('galaxy', 'noun'), ('hive', 'noun'), ('honey', 'noun'), ('nebula', 'noun'),
('pollen', 'noun'), ('queen', 'noun'), ('planet', 'noun'), ('satellite', 'noun'), ('pupil', 'noun'),
('beam', 'noun'), ('alien', 'noun'), ('adventurer', 'noun'), ('solar', 'noun'), ('rocket', 'noun'),
('quiz', 'noun'), ('cosmos', 'noun'), ('constellation', 'noun'), ('library', 'noun'), ('asteroid', 'noun'),
('drone', 'noun'), ('beehive', 'noun'), ('star', 'noun'), ('horizon', 'noun'), ('scholar', 'noun'),
('explorer', 'noun'), ('comet', 'noun'), ('moon', 'noun'), ('apiary', 'noun'), ('neuron', 'noun'),
('force', 'noun'), ('eclipse', 'noun'), ('king', 'noun'), ('spaceship', 'noun'), ('shuttle', 'noun'),
('switch', 'noun'), ('gravity', 'noun'), ('experiment', 'noun'), ('lab', 'noun'), ('planetarium', 'noun'),
('adventure', 'noun'), ('universe', 'noun'), ('innovation', 'noun'), ('mentorship', 'noun'), ('diploma', 'noun'),
('encyclopedia', 'noun'), ('blackhole', 'noun'), ('stardust', 'noun'), ('cat', 'noun'), ('colony', 'noun'),
('cow', 'noun'), ('blueprint', 'noun'), ('hound', 'noun'), ('wold', 'noun'), ('discovery', 'noun'),
('puzzle', 'noun'), ('thinker', 'noun'), ('meteor', 'noun'), ('dream', 'noun'), ('book', 'noun'),
('prodigy', 'noun'), ('focus', 'noun'), ('journey', 'noun'), ('mission', 'noun'), ('game', 'noun'),
('void', 'noun'), ('framework', 'noun'), ('guardian', 'noun'), ('strategy', 'noun'), ('spectrum', 'noun'),
('wolf', 'noun'), ('particle', 'noun'), ('theory', 'noun'), ('mate', 'noun'), ('buddy', 'noun'),
('workshop', 'noun'), ('ocean', 'noun'), ('wizard', 'noun'), ('synapse', 'noun'), ('spacecraft', 'noun'),
('capsule', 'noun'), ('suit', 'noun'), ('leader', 'noun'), ('ruler', 'noun'), ('peasant', 'noun'),
('weakling', 'noun'), ('jedi', 'noun'), ('padawan', 'noun'), ('worker', 'noun'), ('ewok', 'noun'),
('conference', 'noun'), ('lecture', 'noun'), ('diagram', 'noun'), ('formula', 'noun'), ('hypothesis', 'noun'),
('fire', 'noun'), ('ice', 'noun'), ('prince', 'noun'), ('princess', 'noun'), ('quizmaster', 'noun');


-- INSERT INTO words (word, type) VALUES
-- ('buzzing', 'adjective'), ('galactic', 'adjective'), ('radiant', 'adjective'), ('cosmic', 'adjective'),
-- ('intelligent', 'adjective'), ('stellar', 'adjective'), ('inquisitive', 'adjective'), ('studious', 'adjective'),
-- ('celestial', 'adjective'), ('exploratory', 'adjective'), ('busy', 'adjective'), ('bright', 'adjective'),
-- ('vibrant', 'adjective'), ('academic', 'adjective'), ('gravitational', 'adjective'), ('inquisitive', 'adjective'),
-- ('brilliant', 'adjective'), ('creative', 'adjective'), ('energetic', 'adjective'), ('infinite', 'adjective'),
-- ('diligent', 'adjective'), ('mysterious', 'adjective'), ('enthusiastic', 'adjective'), ('observant', 'adjective'),
-- ('adventurous', 'adjective'), ('scholarly', 'adjective'), ('luminous', 'adjective'), ('educational', 'adjective'),
-- ('provoking', 'adjective'), ('magnetic', 'adjective'), ('cooperative', 'adjective'), ('aspiring', 'adjective'),
-- ('reflective', 'adjective'), ('astronomical', 'adjective'), ('industrious', 'adjective'), ('brave', 'adjective'),
-- ('strong', 'adjective'), ('blazing', 'adjective'), ('thoughtful', 'adjective'), ('trailblazing', 'adjective'),
-- ('resourceful', 'adjective'), ('scientific', 'adjective'), ('analytical', 'adjective'), ('productive', 'adjective'),
-- ('innovative', 'adjective'), ('perseverant', 'adjective'), ('solar', 'adjective'), ('quantum', 'adjective'),
-- ('careful', 'adjective'), ('meticulous', 'adjective'), ('dynamic', 'adjective'), ('orbital', 'adjective'),
-- ('perceptive', 'adjective'), ('imaginary', 'adjective'), ('engaging', 'adjective'), ('timeless', 'adjective'),
-- ('challenging', 'adjective'), ('spatial', 'adjective'), ('experimental', 'adjective'), ('daring', 'adjective'),
-- ('interactive', 'adjective'), ('focused', 'adjective'), ('practical', 'adjective'), ('bold', 'adjective'),
-- ('independent', 'adjective'), ('futuristic', 'adjective'), ('optimistic', 'adjective'), ('insightful', 'adjective'),
-- ('persistent', 'adjective'), ('glowing', 'adjective'), ('ambitious', 'adjective'), ('precise', 'adjective'),
-- ('adaptive', 'adjective'), ('systematic', 'adjective'), ('pioneering', 'adjective'), ('invisible', 'adjective'),
-- ('locked', 'adjective'), ('reliable', 'adjective'), ('versatile', 'adjective'), ('proactive', 'adjective'),
-- ('mindful', 'adjective'), ('demure', 'adjective'), ('tactical', 'adjective'), ('inclusive', 'adjective'),
-- ('strategic', 'adjective'), ('supportive', 'adjective'), ('curious', 'adjective'), ('motivated', 'adjective'),
-- ('driven', 'adjective'), ('spacey', 'adjective'), ('conceptual', 'adjective'), ('expansive', 'adjective'),
-- ('theoretical', 'adjective'), ('visionary', 'adjective'), ('logical', 'adjective'), ('constructive', 'adjective'),
-- ('methodical', 'adjective'), ('detailed', 'adjective'), ('observational', 'adjective'), ('mathematical', 'adjective');

