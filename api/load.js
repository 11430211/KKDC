const fetch = global.fetch || require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const u = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: SERVICE_KEY },
    });
    if (!u.ok) return res.status(401).json({ error: 'Invalid token' });
    const user = await u.json();

    // fetch latest tournament for this user
    const q = await fetch(`${SUPABASE_URL}/rest/v1/tournaments?owner=eq.${user.id}&select=content,updated_at&id=order=updated_at.desc&limit=1`, {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    });

    if (!q.ok) {
      const txt = await q.text();
      return res.status(500).json({ error: 'Query failed', details: txt });
    }

    const rows = await q.json();
    return res.status(200).json({ ok: true, data: rows[0] || null });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
