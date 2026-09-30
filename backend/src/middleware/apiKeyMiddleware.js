const verifyApiKey = (req, res, next) => {
  const apiKeyHeader = req.headers['x-api-key'] || req.headers['x-goog-api-key'];
  const expectedKey = process.env.GOOGLE_FORM_API_KEY || 'smart_attend_gf_sec_2026_x9k';

  if (!apiKeyHeader || apiKeyHeader !== expectedKey) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or missing API key for Google Form webhook.'
    });
  }

  next();
};

module.exports = { verifyApiKey };
