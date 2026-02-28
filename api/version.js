export default function handler(req, res) {
  const key = (process.env.KIMI_API_KEY || "").trim();

  res.status(200).json({
    ok: true,
    vercelEnv: process.env.VERCEL_ENV || null,
    gitCommit: process.env.VERCEL_GIT_COMMIT_SHA || null,
    hasKimiKey: Boolean(key),
    keyPrefix: key ? key.slice(0, 4) : null,
    keySuffix: key ? key.slice(-4) : null,
    keyLength: key ? key.length : 0,
  });
}
