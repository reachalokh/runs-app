import { createClient } from "@supabase/supabase-js";
import { serve } from "https://deno.land/x/sift/mod.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // service role key required for server-side queries
);

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const gameId = url.searchParams.get("game_id");

    if (!gameId) {
      return new Response(JSON.stringify({ error: "Missing game_id parameter" }), {
        status: 400,
      });
    }

    // Fetch RSVP counts grouped by status
    const { data, error } = await supabase
      .from("rsvps")
      .select("status, count(*)")
      .eq("game_id", Number(gameId))
      .group("status");

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    // Format response as { confirmed: X, maybe: Y, declined: Z }
    const counts: Record<string, number> = { confirmed: 0, maybe: 0, declined: 0 };
    data?.forEach((row: any) => {
      counts[row.status] = Number(row.count);
    });

    return new Response(JSON.stringify(counts), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
