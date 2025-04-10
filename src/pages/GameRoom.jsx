import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../services/socket';
import { GameBoard } from '../components/GameBoard';
import { WaitingRoom } from '../components/WaitingRoom';

export function GameRoom() {
  const { roomId } = useParams();
  const [gameState, setGameState] = useState(null);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    socket.on('playerJoined', (updatedRoom) => {
      setRoom(updatedRoom);
    });

    socket.on('playerLeft', (updatedRoom) => {
      setRoom(updatedRoom);
    });

    socket.on('roomUpdated', (updatedRoom) => {
      setRoom(updatedRoom);
    });

    socket.on('gameStarted', (initialGameState) => {
      setGameState(initialGameState);
    });

    socket.on('gameStateUpdated', (newGameState) => {
      setGameState(newGameState);
    });

    return () => {
      socket.off('playerJoined');
      socket.off('playerLeft');
      socket.off('roomUpdated');
      socket.off('gameStarted');
      socket.off('gameStateUpdated');
    };
  }, []);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {gameState ? (
        <GameBoard gameState={gameState} />
      ) : (
        <WaitingRoom room={room} roomId={roomId} />
      )}
    </div>
  );
}