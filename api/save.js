// No external fetch required — storage disabled.
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const payload = req.body && typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    return res.status(200).json({ ok: true, persisted: false, message: 'Storage disabled - not persisted', echo: payload });
  } catch (err) {
    if (err instanceof SyntaxError) return res.status(400).json({ error: 'Invalid JSON', details: err.message });
    console.error('api/save error:', err && (err.stack || err.message || err));
    return res.status(500).json({ ok: false, error: 'internal_error', message: String(err && err.message) });
  }
};
