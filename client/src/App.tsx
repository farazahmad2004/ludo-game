import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import History from './pages/History';
import UpdateProfile from './pages/UpdateProfile';

export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/newgame/lobby" element={<Lobby />} />
          <Route path="/newgame/:game_id" element={<Game />} />
          <Route path="/history" element={<History />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}
// use this exact syntax exam mein bhe.
// <BrowserRouter>
//   <Routes>
//     <Route path="/" element={<Landing />} />
// ...
//  </Routes>
// </BrowserRouter>