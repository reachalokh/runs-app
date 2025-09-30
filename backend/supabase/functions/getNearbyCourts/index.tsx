// supabase/functions/getNearbyCourts/index.ts
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { serve } from "https://deno.land/x/sift/mod.ts";

const SUPA_URL = Deno.env.get("SUPABASE_URL")!;
const SUPA_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPA_URL, SUPA_KEY);

function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371; // Earth radius km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const lat = Number(url.searchParams.get("lat"));
    const lng = Number(url.searchParams.get("lng"));
    const radiusKm = Number(url.searchParams.get("radius_km") || "10");
    const limit = Number(url.searchParams.get("limit") || "50");

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return new Response(JSON.stringify({ error: "lat and lng are required numeric query params" }), { status: 400 });
    }

    // bounding box approx to reduce rows: 1 deg lat ~ 111 km
    const latDelta = radiusKm / 111;
    const lonDelta = radiusKm / (111 * Math.cos(lat * Math.PI / 180));

    const { data: candidates, error } = await supabase
      .from("courts")
      .select("*")
      .gte("latitude", lat - latDelta)
      .lte("latitude", lat + latDelta)
      .gte("longitude", lng - lonDelta)
      .lte("longitude", lng + lonDelta)
      .limit(500); // safety limit

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    const withDistance = (candidates || []).map((c: any) => {
      const distance = haversineDistanceKm(lat, lng, Number(c.latitude), Number(c.longitude));
      return { ...c, distance_km: distance };
    });

    const filtered = withDistance.filter((c: any) => c.distance_km <= radiusKm).sort((a:any,b:any)=>a.distance_km - b.distance_km).slice(0, limit);

    return new Response(JSON.stringify({ results: filtered }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
