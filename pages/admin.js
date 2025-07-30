import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AddMatchModal from "../components/AddMatchModal";
import MatchCard from "../components/MatchCard";
import EditMatchModal from "../components/EditMatchModal";
import FetchMatchesModal from "../components/FetchMatchesModal";
import { supabaseAdmin } from "../lib/supabaseAdmin";
import cookie from 'cookie';

export default function Admin({ matches: initialMatches }) {
  const [editMatch, setEditMatch] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showFetch, setShowFetch] = useState(false);

  // Pastikan aman di client
  const matches = Array.isArray(initialMatches) ? initialMatches : [];

  const refresh = () => window.location.reload();

  const handleDelete = async (match) => {
    if (!confirm(`Hapus jadwal ${match.team1} vs ${match.team2}?`)) return;
    const { error } = await supabase.from('matches').delete().eq('id', match.id);
    if (error) {
      console.error(error);
      alert('Gagal hapus jadwal!');
    } else {
      refresh();
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>

      <div className="mb-4">
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded mr-4"
        >
          + Tambah Jadwal
        </button>

        <button
          onClick={() => setShowFetch(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          🔄 Ambil Jadwal Otomatis
        </button>
      </div>

      {showAdd && (
        <AddMatchModal onClose={() => setShowAdd(false)} onAdded={refresh} />
      )}

      {showFetch && (
        <FetchMatchesModal
          onClose={() => setShowFetch(false)}
          onImported={refresh}
        />
      )}

      {editMatch && (
        <EditMatchModal
          match={editMatch}
          onClose={() => setEditMatch(null)}
          onUpdated={refresh}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {matches.length > 0 ? (
          matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onEdit={() => setEditMatch(match)}
              onDelete={() => handleDelete(match)}
            />
          ))
        ) : (
          <p className="text-center col-span-full">Tidak ada data jadwal.</p>
        )}
      </div>
    </main>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const isAdmin = cookies.admin_auth === 'true';

  if (!isAdmin) {
    return {
      redirect: {
        destination: '/admin-login',
        permanent: false,
      },
    };
  }

  const { data: matches, error } = await supabaseAdmin
    .from("matches")
    .select("*")
    .order("start_datetime", { ascending: true });

  if (error) {
    console.error("Supabase error:", error);
  }

  return {
    props: {
      matches: matches || [], // Selalu array
    },
  };
}
