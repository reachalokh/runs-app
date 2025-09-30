// supabase/functions/getPlayerGames/index.ts
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
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
    const url = new URL(req.url);
    const queryPlayerId = url.searchParams.get("player_id");
    const upcoming = url.searchParams.get("upcoming") === "true";
    const includeDeclined = url.searchParams.get("include_declined") === "true";

    const authHeader = req.headers.get("Authorization")?.replace("Bearer ", "") ?? null;
    let playerId: number | null = queryPlayerId ? Number(queryPlayerId) : null;

    if (!playerId) {
      // determine via auth
      const authUser = await getAuthUser(authHeader);
      if (!authUser) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

      const { data: profile, error: pErr } = await supabase
        .from("players")
        .select("player_id")
        .eq("user_id", authUser.id)
        .maybeSingle();

      if (pErr || !profile) return new Response(JSON.stringify({ error: "Player profile not found" }), { status: 404 });
      playerId = profile.player_id;
    }

    // 1) Hosted games
    let hostedQuery = supabase
      .from("pickup_games")
      .select("game_id, host_id, court_id, game_date, game_time, players_needed, skill_level, notes, confirmed_count, maybe_count, declined_count")
      .eq("host_id", playerId)
      .order("game_date", { ascending: true });

    if (upcoming) hostedQuery = hostedQuery.gte("game_date", new Date().toISOString().split("T")[0]);

    const { data: hosted, error: hostedErr } = await hostedQuery;
    if (hostedErr) return new Response(JSON.stringify({ error: hostedErr.message }), { status: 500 });

    // 2) Attended games (via RSVPs)
    const rsvpFilter = includeDeclined ? ["confirmed","maybe","declined"] : ["confirmed","maybe"];
    const { data: rsvps, error: rsvpErr } = await supabase
      .from("rsvps")
      .select("game_id, status, created_at")
      .eq("player_id", playerId)
      .in("status", rsvpFilter);

    if (rsvpErr) return new Response(JSON.stringify({ error: rsvpErr.message }), { status: 500 });

    const attendedGameIds = Array.from(new Set((rsvps || []).map((r: any) => r.game_id)));
    let attended: any[] = [];
    if (attendedGameIds.length) {
      let attendedQuery = supabase
        .from("pickup_games")
        .select("game_id, host_id, court_id, game_date, game_time, players_needed, skill_level, notes, confirmed_count, maybe_count, declined_count")
        .in("game_id", attendedGameIds)
        .order("game_date", { ascending: true });

      if (upcoming) attendedQuery = attendedQuery.gte("game_date", new Date().toISOString().split("T")[0]);

      const { data: attendedData, error: attendedErr } = await attendedQuery;
      if (attendedErr) return new Response(JSON.stringify({ error: attendedErr.message }), { status: 500 });
      attended = attendedData || [];
    }

    // 3) Fetch courts & hosts for enrichment
    const courtIds = Array.from(new Set([...(hosted || []).map(g => g.court_id), ...(attended || []).map(g => g.court_id)]));
    const hostIds = Array.from(new Set([...(hosted || []).map(g => g.host_id), ...(attended || []).map(g => g.host_id)]));

    let courtsMap: Record<number, any> = {};
    if (courtIds.length) {
      const { data: courts } = await supabase.from("courts").select("*").in("court_id", courtIds);
      courtsMap = (courts || []).reduce((acc: any, c: any) => { acc[c.court_id] = c; return acc; }, {});
    }

    let hostsMap: Record<number, any> = {};
    if (hostIds.length) {
      const { data: hosts } = await supabase.from("players").select("player_id, name").in("player_id", hostIds);
      hostsMap = (hosts || []).reduce((acc: any, h: any) => { acc[h.player_id] = h; return acc; }, {});
    }

    // Attach enrichment
    const attach = (g: any) => ({
      ...g,
      court: courtsMap[g.court_id] ?? null,
      host: hostsMap[g.host_id] ?? null
    });

    const hostedWith = (hosted || []).map(attach);
    const attendedWith = (attended || []).map(attach);

    // Remove duplication where a hosted game also appears in attended (shouldn't usually, but safe)
    const hostedIds = new Set((hostedWith || []).map((g:any)=>g.game_id));
    const attendedOnly = (attendedWith || []).filter((g:any)=>!hostedIds.has(g.game_id));

    return new Response(JSON.stringify({
      hosted: hostedWith,
      attended: attendedOnly
    }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
