import { useState, useEffect } from "react";
import EditMatchModal from "../components/EditMatchModal";

export default function MatchCard({ match, onClick, onEdit, onDelete }) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now) return null;

  const startTime = new Date(match.start_datetime);
  const endTime = new Date(match.end_datetime);
  const remaining = startTime - now;
  const isLive = now >= startTime && now <= endTime;
  const isFinished = now > endTime;

  if (isFinished) return null;

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  const status = isLive
    ? "🔥 LIVE NOW 🔥"
    : `⏳ ${days}j ${hours}j ${minutes}m ${seconds}s`;

  const localTime = startTime.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      onClick={onClick}
      className={`relative bg-[#1e1e1e] text-white rounded-xl p-4 shadow-lg border border-gray-700 flex flex-col items-center mb-6 ${onClick ? 'cursor-pointer' : ''}`}
    >
      {onEdit && (
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(match); }}
          className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded"
        >
          Edit
        </button>
      )}
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(match); }}
          className="absolute top-2 right-12 bg-red-600 text-white text-xs px-2 py-1 rounded"
        >
          Hapus
        </button>
      )}

      <div className="absolute -top-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
        {match.sport || "SEPAKBOLA"}
      </div>

      <p className="text-sm text-gray-300 mt-4">{localTime} WIB</p>

      <div className="flex flex-col items-center my-2 gap-1">
        <h2 className="text-xl font-bold">{match.team1}</h2>
        <span className="text-sm font-semibold">vs</span>
        <h2 className="text-xl font-bold">{match.team2}</h2>
      </div>

      <div className="px-4 py-2 rounded-full font-bold bg-yellow-400 text-black mt-2">
        {status}
      </div>

<div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 
  bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase 
  max-w-[80%] overflow-hidden whitespace-nowrap text-ellipsis text-center">
  {match.league || "UEFA Champions League"}
</div>

    </div>
  );
}
