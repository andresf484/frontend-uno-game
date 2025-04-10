import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Users } from 'lucide-react';
import { socket } from '../services/socket.js';

export function Home() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');

  const createRoom = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    socket.emit('createRoom');
    socket.once('roomCreated', (newRoomId) => {
      socket.emit('joinRoom', newRoomId, playerName);
      navigate(`/room/${newRoomId}`);
    });
  };

  const joinRoom = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return;
    }
    socket.emit('joinRoom', roomId, playerName);
    socket.once('error', (message) => setError(message));
    socket.once('playerJoined', () => navigate(`/room/${roomId}`));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-8">
          <Play className="w-12 h-12 text-red-500 mr-3" />
          <h1 className="text-4xl font-bold text-gray-800">UNO Game</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div className="flex flex-col space-y-4">
            <button
              onClick={createRoom}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded flex items-center justify-center"
            >
              <Users className="w-5 h-5 mr-2" />
              Create New Room
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                placeholder="Enter Room ID"
              />
              <button
                onClick={joinRoom}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded"
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}