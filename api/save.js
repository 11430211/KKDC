const fetch = global.fetch || require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });

  // Verify token to get user
  try {
    const u = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!u.ok) return res.status(401).json({ error: 'Invalid token' });
    const user = await u.json();

    const payload = req.body && typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    const content = payload.data || payload;

    // Upsert into table `tournaments` with owner = user.id
    const upsert = await fetch(`${SUPABASE_URL}/rest/v1/tournaments`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify([{ owner: user.id, content }]),
    });

    if (!upsert.ok) {
      const txt = await upsert.text();
      return res.status(500).json({ error: 'Upsert failed', details: txt });
    }

    const result = await upsert.json();
    return res.status(200).json({ ok: true, result });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
