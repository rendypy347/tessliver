import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function EditMatchModal({ match, onClose, onUpdated }) {
  // Konversi UTC ke local `YYYY-MM-DDTHH:MM` format
  const toLocalInput = (isoString) => {
    const date = new Date(isoString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  };

  const [team1, setTeam1] = useState(match.team1);
  const [team2, setTeam2] = useState(match.team2);
  const [league, setLeague] = useState(match.league);
  const [sport, setSport] = useState(match.sport);
  const [videoUrl, setVideoUrl] = useState(match.video_url || "");
  const [startDatetime, setStartDatetime] = useState(toLocalInput(match.start_datetime));
  const [endDatetime, setEndDatetime] = useState(toLocalInput(match.end_datetime));

  const handleUpdate = async () => {
    const startIso = new Date(startDatetime).toISOString();
    const endIso = new Date(endDatetime).toISOString();

    const { error } = await supabase
      .from("matches")
      .update({
        team1,
        team2,
        league,
        sport,
        start_datetime: startIso,
        end_datetime: endIso,
        video_url: videoUrl, // ✅ Update URL juga
      })
      .eq("id", match.id);

    if (error) {
      console.error("Update error:", error);
      alert("Error memperbarui jadwal!");
    } else {
      onUpdated();
      onClose();
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded text-white">
      <h2 className="text-xl font-bold mb-4">Edit Jadwal</h2>

      <input
        className="w-full mb-2 p-2 rounded text-black"
        placeholder="Team 1"
        value={team1}
        onChange={(e) => setTeam1(e.target.value)}
      />
      <input
        className="w-full mb-2 p-2 rounded text-black"
        placeholder="Team 2"
        value={team2}
        onChange={(e) => setTeam2(e.target.value)}
      />
      <input
        className="w-full mb-2 p-2 rounded text-black"
        placeholder="League"
        value={league}
        onChange={(e) => setLeague(e.target.value)}
      />
      <input
        className="w-full mb-2 p-2 rounded text-black"
        placeholder="Sport"
        value={sport}
        onChange={(e) => setSport(e.target.value)}
      />

      {/* ✅ Input Video URL */}
      <input
        className="w-full mb-2 p-2 rounded text-black"
        placeholder="Video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />

      <input
        type="datetime-local"
        className="w-full mb-2 p-2 rounded text-black"
        value={startDatetime}
        onChange={(e) => setStartDatetime(e.target.value)}
      />
      <input
        type="datetime-local"
        className="w-full mb-2 p-2 rounded text-black"
        value={endDatetime}
        onChange={(e) => setEndDatetime(e.target.value)}
      />

      <button
        onClick={handleUpdate}
        className="bg-green-500 px-4 py-2 rounded font-bold"
      >
        Simpan
      </button>

      <button
        onClick={onClose}
        className="bg-gray-500 px-4 py-2 rounded font-bold ml-2"
      >
        Batal
      </button>
    </div>
  );
}
