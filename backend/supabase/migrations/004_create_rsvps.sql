-- 004_create_rsvps.sql
-- This table tracks player RSVPs for each pickup game

CREATE TABLE rsvps (
    rsvp_id SERIAL PRIMARY KEY,                     -- internal ID for RSVP
    game_id INT NOT NULL REFERENCES pickup_games(game_id) ON DELETE CASCADE,  
    player_id INT NOT NULL REFERENCES players(player_id) ON DELETE CASCADE,  
    status VARCHAR(10) NOT NULL CHECK (status IN ('confirmed','maybe','declined')),  
    created_at TIMESTAMP DEFAULT now(),            -- timestamp of RSVP
    UNIQUE(game_id, player_id)                     -- each player can RSVP once per game
);

-- Index for querying RSVPs by game (useful for counting)
CREATE INDEX idx_rsvps_game ON rsvps(game_id);

-- Index for querying RSVPs by player (useful for listing games a player is attending)
CREATE INDEX idx_rsvps_player ON rsvps(player_id);