import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import Dashboard from './components/dashboard';
import InterviewForm from './components/interview-form';
import PublicInterviews from './components/public-interviews';
import Home from './components/home';
import { AuthProvider } from './auth/auth-context';
import ProtectedRoute from './components/protected-route';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="interviewForm"
            element={
              <ProtectedRoute>
                <InterviewForm />
              </ProtectedRoute>
            }
          />
          <Route path="publicInterviews" element={<PublicInterviews />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
