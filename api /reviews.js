// Serverless API Route for Vercel
export default async function handler(req, res) {
  // CORS (gerekirse farklı site’den çağırabilmek için)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  // Vercel Environment Variables
  const API_KEY = process.env.GOOGLE_API_KEY;
  const PLACE_ID = process.env.GOOGLE_PLACE_ID;

  if (!API_KEY || !PLACE_ID) {
    return res.status(500).json({ error: "Missing environment variables" });
  }

  // ?lang=tr / ?lang=de vb. (yoksa tr)
  const lang = (req.query.lang || "tr").toString();

  try {
    const fields = "rating,user_ratings_total,reviews,name,url";
    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${PLACE_ID}` +
      `&fields=${encodeURIComponent(fields)}` +
      `&language=${encodeURIComponent(lang)}` +
      `&key=${API_KEY}`;

    const r = await fetch(url);
    const j = await r.json();

    if (j.status !== "OK") {
      return res.status(502).json({ error: j.status, details: j.error_message || null });
    }

    const place = j.result || {};
    const reviews = (place.reviews || []).map(rv => ({
      author_name: rv.author_name,
      profile_photo_url: rv.profile_photo_url,
      rating: rv.rating,
      relative_time_description: rv.relative_time_description,
      text: rv.text,
      author_url: rv.author_url
    }));

    return res.status(200).json({
      name: place.name,
      url: place.url,
      rating: place.rating,
      total: place.user_ratings_total,
      reviews
    });
  } catch (e) {
    return res.status(500).json({ error: "Failed to fetch reviews" });
  }
}
