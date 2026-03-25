import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-sentinel-panel border-r border-sentinel-border flex flex-col">
        <div className="p-5 border-b border-sentinel-border">
          <h1 className="text-xl font-bold tracking-widest text-sentinel-accent uppercase">
            Sentinel
          </h1>
          <p className="text-xs text-slate-400 mt-1">Key Management</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `block px-3 py-2 rounded text-sm transition ${isActive ? 'bg-sentinel-accent text-white' : 'text-slate-300 hover:bg-slate-700'}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/personnel"
            className={({ isActive }) =>
              `block px-3 py-2 rounded text-sm transition ${isActive ? 'bg-sentinel-accent text-white' : 'text-slate-300 hover:bg-slate-700'}`
            }
          >
            Personnel
          </NavLink>
          <NavLink
            to="/audit"
            className={({ isActive }) =>
              `block px-3 py-2 rounded text-sm transition ${isActive ? 'bg-sentinel-accent text-white' : 'text-slate-300 hover:bg-slate-700'}`
            }
          >
            Audit Log
          </NavLink>
        </nav>

        <div className="p-4 border-t border-sentinel-border">
          <p className="text-xs text-slate-400">{user?.name}</p>
          <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          <button
            onClick={logout}
            className="mt-2 text-xs text-red-400 hover:text-red-300 transition"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
