import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import './App.css';

const socket = io("https://ethan-server.com:8443/"); // Use same server URL as Rooms.tsx

function Game() {
  const [playerHand, setPlayerHand] = useState([]);
  const [topCard, setTopCard] = useState([]);
  const token = localStorage.getItem('userToken');
  const { roomId } = useParams<{ roomId: string }>();

  useEffect(() => {

    // socket.emit('jeveuxdescartes', token, roomId);

    socket.on('cardsDistributed', (cardsList) => {
        console.log("Cards reçues game:", cardsList);
        setPlayerHand(cardsList);
    });

    socket.on('firstCard', (card) => {
        console.log("First card reçue:", card);
        // Convert card to array of objects
        if (Array.isArray(card)) {
            setTopCard(card);
        } else {
            setTopCard([card]);
        }
    });

    socket.on('cardList', (cardsList) => {
        console.log("Cards reçues game nouvelle liste:", cardsList);
        setPlayerHand(cardsList);
    });

    socket.on('gameStarting', () => {
      console.log('Game is starting!');
    });

    socket.on('cardDrawn', (card) => {
      setPlayerHand(prev => [...prev, card]);
    });

    socket.on('tokenErreur', () => {
      alert('Token error - please refresh');
    });


    return () => {
      socket.off('generateToken');
      socket.off('gameStarting');
      socket.off('cardDrawn');
      socket.off('tokenErreur');
    };
  }, []);

  const playCard = (card) => {
    socket.emit('playCard', token, roomId, card);
  };

  const piocheCard = () => {
    socket.emit('drawCard', token, roomId);
  };

  return (
    <div id="main">
    <div id="grid">
        <div id="topHand">
            <div className="card back"></div>
            <div className="card back"></div>
            <div className="card back"></div>
            <div className="card back"></div>
            <div className="card back"></div>
            <div className="card back"></div>
            <div className="card back"></div>
        </div>
        <div id="leftHand">
            <div className="card back"></div>
            <div className="card back"></div>
            <div className="card back"></div>
            <div className="card back"></div>
            <div className="card back"></div>
            <div className="card back"></div>
            <div className="card back"></div>
        </div>
        <div id="rightHand">
            <div className="card back"></div>
            <div className="card back"></div>
            <div className="card back"></div>
            <div className="card back"></div>
            <div className="card back"></div>
            <div className="card back"></div>
            <div className="card back"></div>
        </div>
        <div id="playerhand" className="">
            {playerHand.map((card, index) => (
                <div
                    key={index}
                    className={`card ${card.color}`}
                    onClick={() => playCard(card)}
                >
                    {card.value}
                </div>
            ))}
        </div>
        <div id="playField">
            <div id="chrono">
                35
            </div>
            <div id="deck" onClick={piocheCard}>
                <div className="card back"></div>
                <div className="card back"></div>
                <div className="card back"></div>
            </div>
            <div id="discard">
                {topCard.map((card, index) => (
                    <div key={index} className={`card ${card.color}`}>{card.value}</div>
                ))}
            </div>
            <div id="uno">
                <button className="uno-button">UNO</button>
                <button className="uno-button">DOS</button>
            </div>
        </div>
        <div id="roomCode" style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '20px',
            color: 'black',
            fontWeight: 'bold',
        }}>
            {roomId}
        </div>
    </div>
</div>
  );
}

export default Game;