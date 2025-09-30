// supabase/functions/updateGame/index.ts
import { createClient } from "@supabase/supabase-js";
import { serve } from "https://deno.land/x/sift/mod.ts";

const SUPA_URL = Deno.env.get("SUPABASE_URL")!;
const SUPA_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPA_URL, SUPA_KEY);

async function getAuthUser(token: string | null) {
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error) return null;
  return data?.user ?? null;
}

serve(async (req) => {
  try {
    if (req.method !== "PATCH" && req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Use PATCH or POST" }), { status: 405 });
    }

    const authHeader = req.headers.get("Authorization")?.replace("Bearer ", "") ?? null;
    const authUser = await getAuthUser(authHeader);
    if (!authUser) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const body = await req.json();
    const { game_id, ...updates } = body;
    if (!game_id) return new Response(JSON.stringify({ error: "game_id required" }), { status: 400 });

    // map auth user -> player_id
    const { data: player, error: pErr } = await supabase.from("players").select("player_id, user_id").eq("user_id", authUser.id).maybeSingle();
    if (pErr || !player) return new Response(JSON.stringify({ error: "Player profile not found" }), { status: 404 });

    // verify the player is host of the game
    const { data: game, error: gErr } = await supabase.from("pickup_games").select("game_id, host_id").eq("game_id", game_id).maybeSingle();
    if (gErr || !game) return new Response(JSON.stringify({ error: "Game not found" }), { status: 404 });

    if (game.host_id !== player.player_id) {
      return new Response(JSON.stringify({ error: "Forbidden - only host can update game" }), { status: 403 });
    }

    // Validate updates: whitelist allowed fields
    const allowed = ["court_id", "game_date", "game_time", "players_needed", "skill_level", "notes"];
    const payload: Record<string, any> = {};
    for (const k of allowed) {
      if (k in updates) payload[k] = updates[k];
    }
    if (Object.keys(payload).length === 0) {
      return new Response(JSON.stringify({ error: "No updatable fields provided" }), { status: 400 });
    }

    const { data: updated, error: updErr } = await supabase
      .from("pickup_games")
      .update(payload)
      .eq("game_id", game_id)
      .select()
      .maybeSingle();

    if (updErr) return new Response(JSON.stringify({ error: updErr.message }), { status: 500 });

    return new Response(JSON.stringify({ game: updated }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
