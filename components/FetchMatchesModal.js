// components/FetchMatchesModal.js

import { useState } from "react";

export default function FetchMatchesModal({ onClose, onImported }) {
  const [date, setDate] = useState("");
  const [matches, setMatches] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!date) {
      alert("Pilih tanggal terlebih dahulu!");
      return;
    }

    setLoading(true);

    const res = await fetch(`/api/fetchMatchesByDate?date=${date}`);
    const data = await res.json();

    if (res.ok) {
      setMatches(data.fixtures);
    } else {
      alert("Gagal ambil data: " + data.error);
    }

    setLoading(false);
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleImport = async () => {
    if (selectedIds.length === 0) {
      alert("Pilih minimal 1 pertandingan!");
      return;
    }

    const selectedMatches = matches.filter((m) => selectedIds.includes(m.id));
    const res = await fetch("/api/importMatches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matches: selectedMatches }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Berhasil import!");
      onImported();
      onClose();
    } else {
      alert("Gagal import: " + data.error);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded text-white">
      <h2 className="text-xl font-bold mb-4">Ambil Jadwal API Football</h2>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="mb-2 p-2 rounded text-black"
      />

      <button
        onClick={handleFetch}
        className="bg-green-600 px-4 py-2 rounded ml-2"
      >
        {loading ? "Memuat..." : "Cari"}
      </button>

      {matches.length > 0 && (
        <>
          <h3 className="mt-4 mb-2 font-bold">Hasil:</h3>
          <ul className="max-h-64 overflow-y-auto border p-2 rounded">
            {matches.map((m) => (
              <li key={m.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(m.id)}
                  onChange={() => toggleSelect(m.id)}
                  className="mr-2"
                />
                {m.home} vs {m.away} | {m.league} | {m.start}
              </li>
            ))}
          </ul>

          <button
            onClick={handleImport}
            className="bg-blue-600 px-4 py-2 rounded mt-4"
          >
            Import Jadwal Terpilih
          </button>
        </>
      )}

      <button
        onClick={onClose}
        className="bg-gray-500 px-4 py-2 rounded font-bold ml-2 mt-4"
      >
        Batal
      </button>
    </div>
  );
}
