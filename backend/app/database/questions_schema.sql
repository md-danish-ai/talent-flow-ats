-- Drop existing tables to ensure a clean state
DROP TABLE IF EXISTS question_answers;
DROP TABLE IF EXISTS question_options;
DROP TABLE IF EXISTS questions;

-- Create Questions table with options as JSONB
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    question_type VARCHAR(50) NOT NULL,
    question_text TEXT NOT NULL,
    subject VARCHAR(100),
    image_url TEXT,
    passage TEXT,
    marks INTEGER,
    difficulty_level VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    options JSONB, -- Storing MCQ options directly in the table
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Question Answers table (for Subjective/Explanations)
CREATE TABLE IF NOT EXISTS question_answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    answer_text TEXT,
    explanation TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
