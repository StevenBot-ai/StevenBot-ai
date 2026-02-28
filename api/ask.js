export default async function handler(req, res) {
  try {
    const question =
      req.method === "POST"
        ? (req.body?.question ?? "")
        : (req.query?.question ?? "");

    if (!question || String(question).trim().length === 0) {
      return res.status(400).json({
        ok: false,
        error: "Missing 'question'. Try /api/ask?question=Hello",
      });
    }

    const apiKey = process.env.KIMI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        ok: false,
        error: "KIMI_API_KEY is not set on the server",
      });
    }

    // Moonshot (Kimi) OpenAI-compatible endpoint
    const url = "https://api.moonshot.cn/v1/chat/completions";

    const payload = {
      model: "moonshot-v1-8k",
      messages: [{ role: "user", content: String(question) }],
      temperature: 0.7,
    };

    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await r.text(); // keep as text so we always see the raw result

    // If Moonshot returns a non-200, expose it clearly
    if (!r.ok) {
      return res.status(502).json({
        ok: false,
        upstreamStatus: r.status,
        upstreamBody: text,
      });
    }

    // Try parse JSON on success
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(502).json({
        ok: false,
        error: "Upstream returned non-JSON",
        upstreamBody: text,
      });
    }

    const answer =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.text ??
      null;

    return res.status(200).json({
      ok: true,
      question,
      answer,
      raw: data,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: String(err?.message || err),
    });
  }
}
