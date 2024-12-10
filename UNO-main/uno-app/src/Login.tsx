import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import './App.css'; // Import the CSS

const socket = io("https://ethan-server.com:8443/");

function Login() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('generateToken', (token) => {
      console.log("Token reçu:", token);
      localStorage.setItem('userToken', token);
      navigate('/');
    });

    return () => {
      socket.off('generateToken');
    };
  }, [navigate]);

  const handleLogin = () => {
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }
    // La connexion au socket déclenchera automatiquement l'émission du token
    socket.connect();
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
