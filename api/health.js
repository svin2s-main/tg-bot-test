import { cors, ok } from './_supabase.js';

export default function handler(req, res) {
  if (cors(req, res)) return;
  ok(res, { status: 'ok', env: {
    supabase_url: !!process.env.SUPABASE_URL,
    supabase_key: !!process.env.SUPABASE_KEY,
    bot_token: !!process.env.BOT_TOKEN,
    node: process.version,
  }});
}