export default async function handler(req, res) {
  // Allow GET for quick browser tests, and POST for real usage
  const question =
    req.method === "POST"
      ? (req.body?.question || "")
      : (req.query?.question || "");

  if (!question || question.trim().length === 0) {
    return res.status(400).json({
      ok: false,
      error: "Missing 'question'. Try /api/ask?question=Hello"
    });
  }

  // Simple placeholder "brain" logic for now
  const answer = `I received your question: "${question}". Next we will wire this to an AI model.`;

  return res.status(200).json({
    ok: true,
    question,
    answer,
    timestamp: new Date().toISOString()
  });
}
