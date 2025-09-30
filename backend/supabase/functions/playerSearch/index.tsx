import { createClient } from "@supabase/supabase-js";
import { serve } from "https://deno.land/x/sift/mod.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  try {
    // Optional query param: search by name substring
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";

    // Query players table
    const { data, error } = await supabase
      .from("players")
      .select("player_id, name")
      .ilike("name", `%${search}%`) // case-insensitive search
      .order("name");

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
