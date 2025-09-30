import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { serve } from "https://deno.land/x/sift/mod.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // Use service role key for server-side operations
);

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "POST required" }), { status: 405 });
    }

    const body = await req.json();
    const { host_id, court_id, game_date, game_time, players_needed, skill_level, notes } = body;

    if (!host_id || !court_id || !game_date || !game_time || !players_needed || !skill_level) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Validate host exists
    const { data: hostData, error: hostError } = await supabase
      .from("players")
      .select("*")
      .eq("player_id", host_id)
      .single();

    if (hostError || !hostData) {
      return new Response(JSON.stringify({ error: "Host not found" }), { status: 400 });
    }

    // Validate court exists
    const { data: courtData, error: courtError } = await supabase
      .from("courts")
      .select("*")
      .eq("court_id", court_id)
      .single();

    if (courtError || !courtData) {
      return new Response(JSON.stringify({ error: "Court not found" }), { status: 400 });
    }

    // Insert new game
    const { data: gameData, error: insertError } = await supabase
      .from("pickup_games")
      .insert({
        host_id,
        court_id,
        game_date,
        game_time,
        players_needed,
        skill_level,
        notes
      })
      .select()
      .single();

    if (insertError || !gameData) {
      return new Response(JSON.stringify({ error: insertError?.message || "Failed to create game" }), { status: 500 });
    }

    // Automatically RSVP host as confirmed
    const { error: rsvpError } = await supabase
      .from("rsvps")
      .insert({ game_id: gameData.game_id, player_id: host_id, status: "confirmed" });

    if (rsvpError) {
      return new Response(JSON.stringify({ error: rsvpError.message }), { status: 500 });
    }

    return new Response(JSON.stringify(gameData), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
