import dayjs from "dayjs";

export default async function handler(req, res) {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Tanggal wajib diisi" });
  }

  const from = dayjs(date).startOf("day").toISOString();
  const to = dayjs(date).endOf("day").toISOString();

  const response = await fetch(
    `https://v3.football.api-sports.io/fixtures?date=${date}`,
    {
      headers: {
        "x-apisports-key": process.env.API_FOOTBALL_KEY,
      },
    }
  );

  const data = await response.json();
  const fixtures = data.response.map((f) => ({
    id: f.fixture.id,
    home: f.teams.home.name,
    away: f.teams.away.name,
    league: f.league.name,
    start: f.fixture.date,
  }));

  res.status(200).json({ fixtures });
}
