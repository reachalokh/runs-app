import { createClient } from "@supabase/supabase-js";
import { serve } from "https://deno.land/x/sift/mod.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "POST required" }), { status: 405 });
    }

    const body = await req.json();
    const { player_id, game_id, status } = body;

    if (!player_id || !game_id || !status || !["confirmed","maybe","declined"].includes(status)) {
      return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
    }

    // Check if RSVP already exists
    const { data: existing, error: existingError } = await supabase
      .from("rsvps")
      .select("*")
      .eq("player_id", player_id)
      .eq("game_id", game_id)
      .single();

    if (existingError && existingError.code !== "PGRST116") { // PGRST116 = no rows
      return new Response(JSON.stringify({ error: existingError.message }), { status: 500 });
    }

    if (existing) {
      // Update existing RSVP
      const { error: updateError } = await supabase.from("rsvps").update({ status }).eq("rsvp_id", existing.rsvp_id);
      if (updateError) return new Response(JSON.stringify({ error: updateError.message }), { status: 500 });
    } else {
      // Insert new RSVP
      const { error: insertError } = await supabase.from("rsvps").insert({ player_id, game_id, status });
      if (insertError) return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "RSVP updated" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
