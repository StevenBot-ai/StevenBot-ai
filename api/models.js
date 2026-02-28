export default async function handler(req, res) {
  const apiKey = (process.env.KIMI_API_KEY || "").trim();
  if (!apiKey) {
    return res.status(500).json({ ok: false, error: "KIMI_API_KEY missing" });
  }

  const r = await fetch("https://api.moonshot.cn/v1/models", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const text = await r.text();

  return res.status(200).json({
    ok: r.ok,
    upstreamStatus: r.status,
    upstreamBody: text,
  });
}
