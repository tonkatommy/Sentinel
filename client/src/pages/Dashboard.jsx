import { useEffect, useState } from 'react';
import api from '../lib/api.js';

export default function Dashboard() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKeys();
  }, []);

  async function fetchKeys() {
    try {
      const { data } = await api.get('/keys');
      setKeys(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const available = keys.filter(k => k.status === 'available').length;
  const issued = keys.filter(k => k.status === 'issued').length;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Key Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Keys" value={keys.length} />
        <StatCard label="Available" value={available} color="text-green-400" />
        <StatCard label="Issued" value={issued} color="text-red-400" />
      </div>

      {/* Key Grid */}
      {loading ? (
        <p className="text-slate-400">Loading keys...</p>
      ) : (
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {keys.map(key => (
            <KeySlot key={key.id} k={key} onUpdate={fetchKeys} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color = 'text-white' }) {
  return (
    <div className="bg-sentinel-panel border border-sentinel-border rounded-lg p-4">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

function KeySlot({ k, onUpdate }) {
  const isIssued = k.status === 'issued';

  return (
    <div
      title={isIssued ? `Issued to: ${k.held_by_name || 'Unknown'}` : 'Available'}
      className={`
        aspect-square rounded border flex flex-col items-center justify-center cursor-pointer
        text-xs font-mono transition hover:brightness-125
        ${isIssued
          ? 'bg-red-900/40 border-red-700 text-red-300'
          : 'bg-green-900/40 border-green-700 text-green-300'
        }
      `}
    >
      <span>{k.key_number}</span>
      <span className="text-[10px] opacity-60 mt-0.5">{isIssued ? 'OUT' : 'IN'}</span>
    </div>
  );
}
