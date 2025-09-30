// supabase/functions/deleteGame/index.ts
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
    const authHeader = req.headers.get("Authorization")?.replace("Bearer ", "") ?? null;
    const authUser = await getAuthUser(authHeader);
    if (!authUser) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    // accept body or query param
    const url = new URL(req.url);
    let gameIdStr = url.searchParams.get("game_id");
    if (!gameIdStr) {
      if (req.method === "DELETE") {
        const body = await req.json().catch(()=>null);
        gameIdStr = body?.game_id;
      } else {
        const body = await req.json().catch(()=>null);
        gameIdStr = body?.game_id ?? null;
      }
    }
    if (!gameIdStr) return new Response(JSON.stringify({ error: "game_id required" }), { status: 400 });
    const game_id = Number(gameIdStr);

    const { data: player, error: pErr } = await supabase.from("players").select("player_id, user_id").eq("user_id", authUser.id).maybeSingle();
    if (pErr || !player) return new Response(JSON.stringify({ error: "Player profile not found" }), { status: 404 });

    const { data: game, error: gErr } = await supabase.from("pickup_games").select("game_id, host_id").eq("game_id", game_id).maybeSingle();
    if (gErr || !game) return new Response(JSON.stringify({ error: "Game not found" }), { status: 404 });

    if (game.host_id !== player.player_id) {
      return new Response(JSON.stringify({ error: "Forbidden - only host can delete game" }), { status: 403 });
    }

    const { error: delErr } = await supabase.from("pickup_games").delete().eq("game_id", game_id);
    if (delErr) return new Response(JSON.stringify({ error: delErr.message }), { status: 500 });

    return new Response(JSON.stringify({ message: "Game deleted" }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
