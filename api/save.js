let fetchFn;
try {
  fetchFn = global.fetch || require('node-fetch');
} catch (e) {
  fetchFn = global.fetch;
}
const fetch = fetchFn;

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Storage has been disabled by request. Echo payload back without persisting.
  try {
    const payload = req.body && typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    return res.status(200).json({ ok: true, persisted: false, message: 'Storage disabled - not persisted', echo: payload });
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON', details: e.message });
  }
};
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
