-- 003_create_pickup_games.sql
-- This table stores all pickup basketball game invites

CREATE TABLE pickup_games (
    game_id SERIAL PRIMARY KEY,                   -- internal ID for the game
    host_id INT NOT NULL REFERENCES players(player_id) ON DELETE CASCADE,  
    court_id INT NOT NULL REFERENCES courts(court_id) ON DELETE CASCADE,  
    game_date DATE NOT NULL,                       -- date of the game
    game_time TIME NOT NULL,                       -- time of the game
    players_needed SMALLINT CHECK (players_needed > 0),  
    skill_level SMALLINT CHECK (skill_level BETWEEN 1 AND 10),  
    notes TEXT,                                    -- optional notes about the game
    created_at TIMESTAMP DEFAULT now(),            -- timestamp of creation
    confirmed_count INT DEFAULT 0,                 -- optional: pre-count RSVPs
    maybe_count INT DEFAULT 0,
    declined_count INT DEFAULT 0
);

-- Index for querying upcoming games efficiently
CREATE INDEX idx_games_date_time ON pickup_games(game_date, game_time);

-- Index for fast lookups by court
CREATE INDEX idx_games_court ON pickup_games(court_id);

-- Index for querying games hosted by a player
CREATE INDEX idx_games_host ON pickup_games(host_id);