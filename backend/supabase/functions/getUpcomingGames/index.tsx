import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { serve } from "https://deno.land/x/sift/mod.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit")) || 20;       // optional pagination
    const courtId = url.searchParams.get("court_id");                // optional filter by court
    const hostId = url.searchParams.get("host_id");                  // optional filter by host
    const now = new Date().toISOString().split("T")[0];              // today's date

    // Build query
    let query = supabase
      .from("pickup_games")
      .select(`
        game_id,
        host_id,
        court_id,
        game_date,
        game_time,
        players_needed,
        skill_level,
        notes,
        confirmed_count,
        maybe_count,
        declined_count
      `)
      .gte("game_date", now)
      .order("game_date", { ascending: true })
      .limit(limit);

    if (courtId) query = query.eq("court_id", Number(courtId));
    if (hostId) query = query.eq("host_id", Number(hostId));

    const { data, error } = await query;

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
