let fetchFn;
try { fetchFn = global.fetch || require('node-fetch'); } catch (e) { fetchFn = global.fetch; }
const fetch = fetchFn;

// No external fetch required — storage disabled.
module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  return res.status(200).json({ ok: true, data: null, message: 'Storage disabled - no database configured' });
};
