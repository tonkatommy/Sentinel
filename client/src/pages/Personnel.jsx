import { useEffect, useState } from 'react';
import api from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Personnel() {
  const { user } = useAuth();
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/personnel').then(({ data }) => {
      setPersonnel(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Personnel</h2>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <div className="bg-sentinel-panel border border-sentinel-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sentinel-border text-slate-400 text-left">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Service Number</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {personnel.map(p => (
                <tr key={p.id} className="border-b border-sentinel-border/50 hover:bg-slate-800/50">
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{p.service_number}</td>
                  <td className="px-4 py-3 capitalize">
                    <span className={`px-2 py-0.5 rounded text-xs ${p.role === 'officer' ? 'bg-blue-900/50 text-blue-300' : 'bg-slate-700 text-slate-300'}`}>
                      {p.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
