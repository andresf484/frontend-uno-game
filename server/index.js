import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { GameManager } from './game/GameManager.js';
import { RoomManager } from './game/RoomManager.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const roomManager = new RoomManager();
const gameManagers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('createRoom', () => {
    const roomId = roomManager.createRoom();
    gameManagers.set(roomId, new GameManager());
    socket.emit('roomCreated', roomId);
  });

  socket.on('joinRoom', (roomId, playerName) => {
    const room = roomManager.getRoom(roomId);
    if (!room) {
      socket.emit('error', 'Room not found');
      return;
    }

    if (room.players.length >= 4) {
      socket.emit('error', 'Room is full');
      return;
    }

    socket.join(roomId);
    roomManager.addPlayerToRoom(roomId, {
      id: socket.id,
      name: playerName,
      ready: false
    });

    io.to(roomId).emit('playerJoined', roomManager.getRoom(roomId));
  });

  socket.on('playerReady', (roomId) => {
    const room = roomManager.getRoom(roomId);
    if (!room) return;

    roomManager.setPlayerReady(roomId, socket.id);
    const updatedRoom = roomManager.getRoom(roomId);
    io.to(roomId).emit('roomUpdated', updatedRoom);

    if (roomManager.areAllPlayersReady(roomId) && room.players.length >= 2) {
      const gameManager = gameManagers.get(roomId);
      if (gameManager) {
        gameManager.startGame(room.players);
        io.to(roomId).emit('gameStarted', gameManager.getGameState());
      }
    }
  });

  socket.on('playCard', (card) => {
    const roomId = roomManager.findRoomByPlayerId(socket.id);
    if (!roomId) return;

    const gameManager = gameManagers.get(roomId);
    if (!gameManager) return;

    const isValidPlay = gameManager.playCard(socket.id, card);
    if (isValidPlay) {
      const gameState = gameManager.getGameState();
      io.to(roomId).emit('gameStateUpdated', gameState);
    }
  });

  socket.on('drawCard', () => {
    const roomId = roomManager.findRoomByPlayerId(socket.id);
    if (!roomId) return;

    const gameManager = gameManagers.get(roomId);
    if (!gameManager) return;

    const success = gameManager.drawCardForPlayer(socket.id);
    if (success) {
      io.to(roomId).emit('gameStateUpdated', gameManager.getGameState());
    }
  });

  socket.on('playAgain', () => {
    const roomId = roomManager.findRoomByPlayerId(socket.id);
    if (!roomId) return;

    const gameManager = gameManagers.get(roomId);
    if (!gameManager) return;

    const newGameState = gameManager.resetGame();
    io.to(roomId).emit('gameStateUpdated', newGameState);
  });

  socket.on('disconnect', () => {
    const roomId = roomManager.findRoomByPlayerId(socket.id);
    if (roomId) {
      roomManager.removePlayerFromRoom(roomId, socket.id);
      const room = roomManager.getRoom(roomId);
      if (room) {
        io.to(roomId).emit('playerLeft', room);
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});