import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AddMatchModal({ onClose, onAdded }) {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [league, setLeague] = useState("");
  const [sport, setSport] = useState("SEPAKBOLA");
  const [startDatetime, setStartDatetime] = useState("");
  const [endDatetime, setEndDatetime] = useState("");
const [videoUrl, setVideoUrl] = useState("");

const handleAdd = async () => {
  console.log("Submitting:", team1, team2, startDatetime, endDatetime);

  if (!team1 || !team2 || !league || !startDatetime || !endDatetime) {
    alert("Semua field wajib diisi!");
    return;
  }

  const startIso = new Date(startDatetime);
  const endIso = new Date(endDatetime);

  if (isNaN(startIso) || isNaN(endIso)) {
    alert("Format tanggal tidak valid!");
    return;
  }

  const { error } = await supabase.from("matches").insert([
    {
      team1,
      team2,
      league,
      sport,
      start_datetime: startIso.toISOString(),
      end_datetime: endIso.toISOString(),
  video_url: videoUrl,
    },
  ]);

  if (error) {
    console.error("Insert error:", error);
    alert(`Error menambahkan jadwal: ${error.message}`);
  } else {
    console.log("Insert OK");
    onAdded();
    onClose();
  }
};


  return (
    <div className="bg-gray-800 p-4 rounded text-white">
      <h2 className="text-xl font-bold mb-4">Tambah Jadwal Baru</h2>

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
  placeholder="Link Video Iframe"
  value={videoUrl}
  onChange={(e) => setVideoUrl(e.target.value)}
/>
      <input
        className="w-full mb-2 p-2 rounded text-black"
        placeholder="League"
        value={league}
        onChange={(e) => setLeague(e.target.value)}
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

<button onClick={handleAdd}>Simpan</button>


      <button
        onClick={onClose}
        className="bg-gray-500 px-4 py-2 rounded font-bold ml-2"
      >
        Batal
      </button>
    </div>
  );
}
