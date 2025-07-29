import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Admin() {
  const [matches, setMatches] = useState([]);
  const [form, setForm] = useState({
    sport: '', date: '', dateTime: '', team1: '', team2: '', league: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchMatches = async () => {
    const { data } = await supabase.from('matches').select('*').order('dateTime');
    setMatches(data);
  };

  useEffect(() => { fetchMatches(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from('matches').update(form).eq('id', editingId);
    } else {
      await supabase.from('matches').insert([form]);
    }
    setForm({ sport: '', date: '', dateTime: '', team1: '', team2: '', league: '' });
    setEditingId(null);
    fetchMatches();
  };

  const handleEdit = (match) => {
    setForm(match);
    setEditingId(match.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin hapus?')) {
      await supabase.from('matches').delete().eq('id', id);
      fetchMatches();
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl mb-4">Admin Dashboard</h1>
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input name="sport" placeholder="Sport" value={form.sport} onChange={handleChange} className="p-2 text-black w-full" required/>
        <input name="date" placeholder="Date" value={form.date} onChange={handleChange} className="p-2 text-black w-full" required/>
        <input name="dateTime" placeholder="DateTime" value={form.dateTime} onChange={handleChange} className="p-2 text-black w-full" required/>
        <input name="team1" placeholder="Team 1" value={form.team1} onChange={handleChange} className="p-2 text-black w-full" required/>
        <input name="team2" placeholder="Team 2" value={form.team2} onChange={handleChange} className="p-2 text-black w-full" required/>
        <input name="league" placeholder="League" value={form.league} onChange={handleChange} className="p-2 text-black w-full" required/>
        <button type="submit" className="bg-red-600 px-4 py-2">
          {editingId ? 'Update Match' : 'Add Match'}
        </button>
      </form>

      <ul>
        {matches.map((m) => (
          <li key={m.id} className="mb-2">
            {m.team1} vs {m.team2} ({m.league})
            <button onClick={() => handleEdit(m)} className="ml-2 bg-yellow-500 px-2 py-1">Edit</button>
            <button onClick={() => handleDelete(m.id)} className="ml-2 bg-red-500 px-2 py-1">Hapus</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
