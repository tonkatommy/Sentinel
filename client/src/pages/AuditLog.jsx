import { useEffect, useState } from 'react';
import api from '../lib/api.js';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/audit').then(({ data }) => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Audit Log</h2>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <div className="bg-sentinel-panel border border-sentinel-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sentinel-border text-slate-400 text-left">
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Key</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Personnel</th>
                <th className="px-4 py-3">Officer</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-b border-sentinel-border/50 hover:bg-slate-800/50">
                  <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono">{log.key_number}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${log.action === 'issue' ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">{log.user_name || '—'}</td>
                  <td className="px-4 py-3 text-slate-400">{log.officer_name || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
