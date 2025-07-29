'use client';

import { useState } from 'react';
import AddMatchModal from './AddMatchModal';

export default function AddMatchButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        + Tambah Jadwal
      </button>

      {isOpen && <AddMatchModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
