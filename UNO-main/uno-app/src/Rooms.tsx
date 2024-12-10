import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import './App.css'; // Import the CSS

const socket = io("https://ethan-server.com:8443/");

function Rooms() {
  const [roomId, setRoomId] = useState<string>('');
  const [rooms, setRooms] = useState<[]>([]);
  const [cards, setCards] = useState<[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Demander la liste des rooms au chargement
    socket.emit('listRooms', token);

    socket.on('roomsListed', (roomsList) => {
      console.log("Rooms reçues:", roomsList);
      const roomsArray = Object.keys(roomsList);
      setRooms(roomsArray);
    });

    // socket.on('cardsDistributed', (cardsList) => {
    //   console.log("Cards reçues:", cardsList);
    //   setCards(cardsList);
    // });

    socket.on('roomCreated', (newRoomId: string) => {
      navigate(`/room/${newRoomId}`);
    });

    socket.on('roomJoined', (joinedRoomId: string) => {
      navigate(`/room/${joinedRoomId}`);
    });

    socket.on('tokenErreur', () => {
      localStorage.removeItem('userToken');
      navigate('/login');
    });

    return () => {
      socket.off('listRooms');
      socket.off('roomCreated');
      socket.off('roomJoined');
      socket.off('tokenErreur');
    };
  }, [navigate, token]);

  const createRoom = () => {
    if (roomId.trim() === '') {
      alert('Please enter a room ID.');
      return;
    }
    socket.emit('createRoom', token, roomId);
  };

  const joinRoom = (roomToJoin: string) => {
    socket.emit('joinRoom', token, roomToJoin);
  };

  return (
    <div className="container">
      <h1>Rooms</h1>
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Enter room ID"
      />
      <button onClick={createRoom}>Create Room</button>
      <h2>Available Rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room}>
            {room} <button onClick={() => joinRoom(room)}>Join</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Rooms;