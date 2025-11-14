import { invokeFunction, isSupabaseConfigured } from './supabase';

export async function getNearbyCourts(lat: number, lng: number, radius_km = 10, limit = 50) {
  if (!isSupabaseConfigured) return { data: null, error: 'not-configured' };
  return await invokeFunction('getNearbyCourts', { method: 'GET', query: { lat, lng, radius_km, limit } });
}

export async function countRsvps(game_id: number) {
  if (!isSupabaseConfigured) return { data: null, error: 'not-configured' };
  return await invokeFunction('countRsvps', { method: 'GET', query: { game_id } });
}

export async function playerSearch(search: string, limit = 10) {
  if (!isSupabaseConfigured) return { data: null, error: 'not-configured' };
  return await invokeFunction('playerSearch', { method: 'GET', query: { search, limit } });
}

export async function getUpcomingGames(opts?: { limit?: number; court_id?: number; host_id?: number }) {
  if (!isSupabaseConfigured) return { data: null, error: 'not-configured' };
  return await invokeFunction('getUpcomingGames', { method: 'GET', query: opts as any });
}

export async function getPlayerGames(player_id?: number, upcoming?: boolean, include_declined?: boolean) {
  if (!isSupabaseConfigured) return { data: null, error: 'not-configured' };
  const query: Record<string, string | number | boolean> = {};
  if (player_id !== undefined) query.player_id = player_id;
  if (upcoming !== undefined) query.upcoming = upcoming;
  if (include_declined !== undefined) query.include_declined = include_declined;
  return await invokeFunction('getPlayerGames', { method: 'GET', query });
}

export async function createGame(body: any) {
  if (!isSupabaseConfigured) return { data: null, error: 'not-configured' };
  return await invokeFunction('createGame', { method: 'POST', body });
}

export async function rsvpToGame(body: any) {
  if (!isSupabaseConfigured) return { data: null, error: 'not-configured' };
  // frontend friendly mapping: map 'no' -> 'declined'
  if (body.status === 'no') body.status = 'declined';
  return await invokeFunction('rsvpToGame', { method: 'POST', body });
}

export async function updateGame(body: any) {
  if (!isSupabaseConfigured) return { data: null, error: 'not-configured' };
  return await invokeFunction('updateGame', { method: 'POST', body });
}

export async function deleteGame(game_id: number) {
  if (!isSupabaseConfigured) return { data: null, error: 'not-configured' };
  return await invokeFunction('deleteGame', { method: 'POST', body: { game_id } });
}
