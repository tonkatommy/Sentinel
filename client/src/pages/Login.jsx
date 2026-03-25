import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const [serviceNumber, setServiceNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(serviceNumber, password);
    } catch {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-widest text-sentinel-accent uppercase">
            Sentinel
          </h1>
          <p className="text-slate-400 text-sm mt-1">Key Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-sentinel-panel border border-sentinel-border rounded-lg p-6 space-y-4">
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <div>
            <label className="block text-sm text-slate-400 mb-1">Service Number</label>
            <input
              type="text"
              value={serviceNumber}
              onChange={e => setServiceNumber(e.target.value)}
              className="w-full bg-slate-800 border border-sentinel-border rounded px-3 py-2 text-sm focus:outline-none focus:border-sentinel-accent"
              placeholder="e.g. T12345"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-sentinel-border rounded px-3 py-2 text-sm focus:outline-none focus:border-sentinel-accent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sentinel-accent hover:bg-blue-600 text-white rounded py-2 text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
