import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

// Buraya kendi Google API Key'inizi yazın
const API_KEY = "AIzaSyCen4qB5TbesIjKqlLYSrFLHsuX5hXyTIY";

app.get("/reviews", async (req, res) => {
  const placeId = req.query.place_id; // ?place_id=xxxx
  if (!placeId) {
    return res.status(400).json({ error: "place_id ist erforderlich" });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews&key=${API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Abrufen der Bewertungen" });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});

