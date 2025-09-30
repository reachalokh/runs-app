-- 005_create_rsvp_triggers.sql
-- This trigger updates RSVP counts (confirmed, maybe, declined) on pickup_games

-- Create the function that updates counts
CREATE OR REPLACE FUNCTION update_rsvp_counts()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE pickup_games
    SET
        confirmed_count = (SELECT COUNT(*) FROM rsvps WHERE game_id = NEW.game_id AND status='confirmed'),
        maybe_count = (SELECT COUNT(*) FROM rsvps WHERE game_id = NEW.game_id AND status='maybe'),
        declined_count = (SELECT COUNT(*) FROM rsvps WHERE game_id = NEW.game_id AND status='declined')
    WHERE game_id = NEW.game_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for INSERT
CREATE TRIGGER rsvp_counts_after_insert
AFTER INSERT ON rsvps
FOR EACH ROW EXECUTE FUNCTION update_rsvp_counts();

-- Trigger for UPDATE
CREATE TRIGGER rsvp_counts_after_update
AFTER UPDATE ON rsvps
FOR EACH ROW EXECUTE FUNCTION update_rsvp_counts();

-- Trigger for DELETE
CREATE TRIGGER rsvp_counts_after_delete
AFTER DELETE ON rsvps
FOR EACH ROW EXECUTE FUNCTION update_rsvp_counts();
