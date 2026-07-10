const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lwaesyvvltatcnsbixxf.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3YWVzeXZ2bHRhdGNuc2JpeHhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MzI1MjIsImV4cCI6MjA5OTAwODUyMn0.kSFWsInlazj3wsdI3IItwSSFpcUhIfUnke06dRF4FxY';

export async function sb(path, opts = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase not configured');
  }
    const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const method = opts.method || 'GET';
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
  };
  if (method === 'POST') headers['Prefer'] = 'return=representation';
  const res = await fetch(url, {
    method,
    headers,
    ...(opts.body ? { body: opts.body } : {}),
  });
  if (opts.method === 'DELETE') return;
  if (opts.method === 'PATCH' && res.status === 204) return;
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

export function readBody(req) {
  return new Promise(resolve => {
    if (req.body) return resolve(req.body);
    let data = '';
    req.on('data', c => data += c);
    req.on('end', () => {
      try { resolve(JSON.parse(data)); }
      catch { resolve({}); }
    });
  });
}

export function getQuery(req) {
  const url = new URL(req.url, 'http://localhost');
  const params = {};
  url.searchParams.forEach((v, k) => params[k] = v);
  return params;
}

export function cors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return true; }
  return false;
}

export function ok(res, data) { res.status(200).json(data); }
export function created(res, data) { res.status(201).json(data); }
export function err(res, msg, code = 400) { res.status(code).json({ detail: msg }); }