import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Prefer Expo config extras (app.json / app.config.js) when available, then fallback to process.env
const expoExtra: any = (Constants.manifest && (Constants.manifest as any).extra) || (Constants.expoConfig && (Constants.expoConfig as any).extra) || {};

const SUPABASE_URL = (expoExtra.SUPABASE_URL as string) ?? process.env.SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = (expoExtra.SUPABASE_ANON_KEY as string) ?? process.env.SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = SUPABASE_URL !== '' && SUPABASE_ANON_KEY !== '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
