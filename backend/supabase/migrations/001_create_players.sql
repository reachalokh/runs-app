-- 001_create_players.sql
-- This table stores player profiles, linked to Supabase Auth users

CREATE TABLE players (
    player_id SERIAL PRIMARY KEY,             -- internal ID for players
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,  
    name VARCHAR(100) NOT NULL,               -- player's display name
    phone VARCHAR(20),                        -- optional phone number
    average_skill_level SMALLINT CHECK (average_skill_level BETWEEN 1 AND 10),  
    rating DECIMAL(3,2) CHECK (rating BETWEEN 0 AND 5),  
    created_at TIMESTAMP DEFAULT now()        -- timestamp of profile creation
);

-- Ensure each Auth user has only one player profile
CREATE UNIQUE INDEX idx_players_user_id ON players(user_id);

-- Optional: index for searching by name
CREATE INDEX idx_players_name ON players(name);