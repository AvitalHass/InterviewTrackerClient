import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import Dashboard from './components/dashboard';
import InterviewForm from './components/interview-form';
import PublicInterviews from './components/public-interviews';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" index element={<Dashboard />} />
        <Route path="interviewForm" element={<InterviewForm />} />
        <Route path="publicInterviews" element={<PublicInterviews />} />
      </Route>
    </Routes>
  );
}

export default App;
