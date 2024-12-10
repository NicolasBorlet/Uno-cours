import { Route, BrowserRouter as Router, Routes } from 'react-router';
import Game from './Game';
import Login from './Login';
import Rooms from './Rooms';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
        <Route path="/room/:roomId" element={<ProtectedRoute><Game /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
