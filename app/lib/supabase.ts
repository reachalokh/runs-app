import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Prefer Expo config extras (app.json / app.config.js) when available, then fallback to process.env
const expoExtra: any = (Constants.manifest && (Constants.manifest as any).extra) || (Constants.expoConfig && (Constants.expoConfig as any).extra) || {};

export const SUPABASE_URL = (expoExtra.SUPABASE_URL as string) ?? process.env.SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = (expoExtra.SUPABASE_ANON_KEY as string) ?? process.env.SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = SUPABASE_URL !== '' && SUPABASE_ANON_KEY !== '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Small helper to call Supabase Edge Functions with a consistent header set.
export async function invokeFunction(name: string, options?: {
	method?: string;
	query?: Record<string, string | number | boolean>;
	body?: any;
	headers?: Record<string, string>;
}) {
	if (!SUPABASE_URL) {
		return { data: null, error: 'SUPABASE_URL not configured' };
	}

	const method = (options?.method || (options?.body ? 'POST' : 'GET')).toUpperCase();
		const qs = options?.query
			? '?' + Object.entries(options.query).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}` ).join('&')
			: '';
	const url = `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/${name}${qs}`;

	const headers: Record<string, string> = {
		apikey: SUPABASE_ANON_KEY,
		'Content-Type': 'application/json',
		...(options?.headers || {}),
	};

	try {
		const resp = await fetch(url, {
			method,
			headers,
			body: method === 'GET' ? undefined : JSON.stringify(options?.body ?? {}),
		});

		const text = await resp.text();
		try {
			const json = text ? JSON.parse(text) : null;
			if (!resp.ok) return { data: null, error: json || text };
			return { data: json, error: null };
		} catch (e) {
			if (!resp.ok) return { data: null, error: text };
			return { data: text, error: null };
		}
	} catch (err) {
		return { data: null, error: (err as Error).message };
	}
}
