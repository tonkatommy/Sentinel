import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Personnel from './pages/Personnel.jsx';
import AuditLog from './pages/AuditLog.jsx';
import Layout from './components/Layout.jsx';

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route
        path="/"
        element={user ? <Layout /> : <Navigate to="/login" />}
      >
        <Route index element={<Dashboard />} />
        <Route path="personnel" element={<Personnel />} />
        <Route path="audit" element={<AuditLog />} />
      </Route>
    </Routes>
  );
}
