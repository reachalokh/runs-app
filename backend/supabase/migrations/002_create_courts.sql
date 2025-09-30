-- 002_create_courts.sql
-- This table stores all basketball courts with geolocation info

CREATE TABLE courts (
    court_id SERIAL PRIMARY KEY,              -- internal ID for the court
    name VARCHAR(100) NOT NULL,               -- court name
    address TEXT NOT NULL,                     -- full address
    latitude DECIMAL(9,6) NOT NULL,           -- for mapping
    longitude DECIMAL(9,6) NOT NULL,          -- for mapping
    court_type VARCHAR(50),                    -- e.g., outdoor, indoor, 3v3, 5v5
    created_at TIMESTAMP DEFAULT now()        -- timestamp of court creation
);

-- Index on latitude & longitude for fast geospatial queries
CREATE INDEX idx_courts_location ON courts(latitude, longitude);

-- Optional: index by name for searching courts
CREATE INDEX idx_courts_name ON courts(name);