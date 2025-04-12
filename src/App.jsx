import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { GameRoom } from './pages/GameRoom';

import { SocketContextProvider } from './context/SocketContextProvider';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <SocketContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<GameRoom />} />
        </Routes>
      </SocketContextProvider>
    </div>
  );
}