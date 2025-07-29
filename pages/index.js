import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import MatchCard from '../components/MatchCard';

export default function Home({ matches }) {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [iframeKey, setIframeKey] = useState(0); // 👉 Tambah key

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Jadwal Live Streaming Bola</h1>

      {selectedMatch && (
        <div className="relative mb-8">
          <button
            onClick={() => setSelectedMatch(null)}
            className="absolute top-2 right-2 bg-red-600 text-white font-bold rounded w-8 h-8 flex items-center justify-center z-10"
          >
            X
          </button>

          <iframe
            key={iframeKey} // 👉 Kunci reload
            src={selectedMatch.video_url}
            width="100%"
            height="400"
            allowFullScreen
            className="rounded z-0 relative"
          ></iframe>

          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => {
                setSelectedMatch({
                  ...selectedMatch,
                  video_url: selectedMatch.video_url,
                });
                setIframeKey(prev => prev + 1); // 👉 Paksa reload
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded font-bold"
            >
              REFRESH SERVER
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            onClick={() => {
              setSelectedMatch(match);
              setIframeKey(0); // Optional: reset key saat match ganti
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ))}
      </div>
    </main>
  );
}

export async function getServerSideProps() {
  const { data: matches } = await supabase
    .from("matches")
    .select("*")
    .order("start_datetime", { ascending: true });

  return {
    props: {
      matches: matches || [],
    },
  };
}
