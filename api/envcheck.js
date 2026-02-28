export default function handler(req, res) {
  const key = process.env.KIMI_API_KEY || "";

  res.status(200).json({
    ok: true,
    hasKimiKey: key.length > 0,
    keyLength: key.length,
    keyPrefix: key ? key.slice(0, 4) : null, // first 4 chars only
    nodeEnv: process.env.NODE_ENV || null,
    vercelEnv: process.env.VERCEL_ENV || null,
  });
}
