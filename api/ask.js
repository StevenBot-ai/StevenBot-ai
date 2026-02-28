export default async function handler(req, res) {
  const question =
    req.method === "POST"
      ? (req.body?.question || "")
      : (req.query?.question || "");

  if (!question) {
    return res.status(400).json({
      ok: false,
      error: "Missing question"
    });
  }

  try {
    const response = await fetch("https://api.moonshot.cn/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.KIMI_API_KEY}`
      },
      body: JSON.stringify({
        model: "moonshot-v1-8k",
        messages: [
          {
            role: "system",
            content: "You are StevenBot, an executive AI proxy representing Steven. Be intelligent, strategic, and concise."
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    const answer =
      data.choices?.[0]?.message?.content ||
      JSON.stringify(data);

    return res.status(200).json({
      ok: true,
      question,
      answer,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}
