export default async function handler(req, res) {
  // Később: ide jön a Google Drive feltöltés.
  res.status(501).json({
    ok: false,
    message: "Upload endpoint not enabled yet. Google Drive integration is coming soon.",
  });
}
