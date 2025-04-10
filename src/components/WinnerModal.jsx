import React from 'react';
import { Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function WinnerModal({ winner, onPlayAgain }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-xl max-w-md w-full mx-4">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {winner.name} Wins!
          </h2>
          <p className="text-gray-600 mb-8">
            Congratulations! {winner.name} has won the game by playing all their cards!
          </p>
          <div className="space-y-4">
            <button
              onClick={onPlayAgain}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}