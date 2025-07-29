import { supabase } from "../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { matches } = req.body;

  if (!matches || !Array.isArray(matches)) {
    return res.status(400).json({ error: "Data matches invalid" });
  }

  for (const m of matches) {
    const start = new Date(m.start);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    const { error } = await supabase.from("matches").insert([
      {
        team1: m.home,
        team2: m.away,
        league: m.league,
        sport: "SEPAKBOLA",
        start_datetime: start.toISOString(),
        end_datetime: end.toISOString(),
        video_url: "",
      },
    ]);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  res.status(200).json({ message: "Import sukses!" });
}
