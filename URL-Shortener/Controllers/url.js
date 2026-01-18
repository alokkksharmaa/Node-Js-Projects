import { nanoid } from "nanoid";
import URL from "../Models/model.js";

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });
  
  const shortID = nanoid(8);
  
  await URL.create({
    shortId: shortID,
    redirectUrl: body.url,
    visitHistory: [],
  });

  return res.json({ id: shortID });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  
  if (!result) return res.status(404).json({ error: "Short URL not found" });

  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

async function handleShortUrlRedirect(req, res) {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  if (!entry) return res.status(404).json({ error: "Short URL not found" });
  res.redirect(entry.redirectUrl);
}

export {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  handleShortUrlRedirect
};

