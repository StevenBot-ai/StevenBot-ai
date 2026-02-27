export default function handler(req, res) {
  res.status(200).json({
    status: "ok",
    system: "StevenBot",
    message: "Infrastructure is live",
    time: new Date().toISOString()
  });
}
