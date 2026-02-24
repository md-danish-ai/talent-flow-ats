-- Create user_details table
CREATE TABLE IF NOT EXISTS user_details (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    personal_details JSONB,
    family_details JSONB,
    source_of_information JSONB,
    education_details JSONB,
    work_experience_details JSONB,
    other_details JSONB,
    is_submitted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for user_id
CREATE INDEX IF NOT EXISTS idx_user_details_user_id ON user_details(user_id);
