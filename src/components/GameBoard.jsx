import React from 'react';
import { PlayerHand } from './PlayerHand';
import { Card } from './Card';
import { WinnerModal } from './WinnerModal';
import { socket } from '../services/socket';

export function GameBoard({ gameState }) {
  if (!gameState || !gameState.players || !gameState.currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const currentPlayer = gameState.players.find(p => p.id === socket.id);
  const isCurrentTurn = currentPlayer?.id === gameState.currentPlayer.id;

  const handleDrawCard = () => {
    if (isCurrentTurn) {
      socket.emit('drawCard');
    }
  };

  const handlePlayAgain = () => {
    socket.emit('playAgain');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_100%)]" />
      <div className="flex-1 relative">
        {/* Opponents' hands */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
          {gameState.players.map((player) => (
            player.id !== socket.id && (
              <div key={player.id} className="text-center mb-8">
                <div className="text-gray-300 mb-2 font-medium">
                  {player.name}
                  {player.id === gameState.currentPlayer.id && (
                    <span className="ml-2 text-blue-400">(Current Turn)</span>
                  )}
                </div>
                <div className="flex justify-center">
                  {Array.from({ length: player.hand?.length || 0 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-12 h-16 bg-gray-800 rounded-lg shadow-lg -ml-4 first:ml-0 border border-gray-700"
                    />
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        {/* Center area with deck and discard pile */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center space-x-8">
          <button
            onClick={handleDrawCard}
            disabled={!isCurrentTurn}
            className="relative transition-transform hover:transform hover:-translate-y-2 disabled:opacity-50 disabled:hover:transform-none"
          >
            <div className="w-24 h-36 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-300">
                  {gameState.deckCount} cards
                </span>
              </div>
            </div>
          </button>
          {gameState.topCard && <Card card={gameState.topCard} size="lg" />}
        </div>

        {/* Current color indicator */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <span className="text-gray-300 font-medium">Current Color:</span>
          <div 
            className={`w-6 h-6 rounded-md border border-gray-700 ${
              gameState.currentColor === 'red' ? 'bg-red-500' :
              gameState.currentColor === 'blue' ? 'bg-blue-500' :
              gameState.currentColor === 'green' ? 'bg-green-500' :
              'bg-yellow-400'
            }`}
          />
        </div>

        {/* Player's hand */}
        {currentPlayer && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <div className="text-gray-300 mb-2 text-center font-medium">
              Your Hand {isCurrentTurn && (
                <span className="text-blue-400">(Your Turn)</span>
              )}
            </div>
            <PlayerHand
              cards={currentPlayer.hand || []}
              canPlay={isCurrentTurn}
              currentColor={gameState.currentColor}
            />
          </div>
        )}

        {/* Winner Modal */}
        {gameState.winner && (
          <WinnerModal
            winner={gameState.winner}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </div>
    </div>
  );
}