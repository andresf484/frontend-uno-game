import React from 'react';
import { Users, Copy, CheckCircle } from 'lucide-react';
import { socket } from '../services/socket';

export function WaitingRoom({ room, roomId }) {
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
  };

  const handleReady = () => {
    socket.emit('playerReady', roomId);
  };

  const currentPlayer = room.players.find(p => p.id === socket.id);
  const emptySlots = 4 - room.players.length;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Waiting Room</h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Room ID:</span>
            <code className="bg-gray-100 px-2 py-1 rounded">{roomId}</code>
            <button
              onClick={copyRoomId}
              className="text-gray-500 hover:text-gray-700"
              title="Copy Room ID"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">
              Players ({room.players.length}/4)
              {room.players.length >= 2 && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Minimum 2 players needed)
                </span>
              )}
            </h3>
            <div className="space-y-3">
              {room.players.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between bg-white p-3 rounded-lg shadow-sm ${
                    player.id === socket.id ? 'border-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <span className="font-medium">
                      {player.name}
                      {player.id === socket.id && (
                        <span className="text-blue-500 ml-2">(You)</span>
                      )}
                    </span>
                  </div>
                  {player.ready ? (
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="w-5 h-5 mr-1" />
                      <span className="text-sm">Ready</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Not Ready</span>
                  )}
                </div>
              ))}
              {emptySlots > 0 && Array.from({ length: emptySlots }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex items-center justify-center bg-gray-100 p-3 rounded-lg"
                >
                  <span className="text-gray-400">Waiting for player...</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleReady}
            disabled={currentPlayer?.ready}
            className={`
              w-full font-bold py-3 px-4 rounded transition-colors
              ${currentPlayer?.ready
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
              }
            `}
          >
            {currentPlayer?.ready ? 'Waiting for others...' : 'Ready to Play'}
          </button>
        </div>
      </div>
    </div>
  );
}