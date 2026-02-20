-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    mobile VARCHAR(10) UNIQUE NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    testlevel VARCHAR(50),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);
