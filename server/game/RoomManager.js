import { v4 as uuidv4 } from 'uuid';

export class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom() {
    const roomId = uuidv4();
    this.rooms.set(roomId, {
      id: roomId,
      players: [],
      status: 'waiting'
    });
    return roomId;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  addPlayerToRoom(roomId, player) {
    const room = this.rooms.get(roomId);
    if (room && room.players.length < 4) {
      room.players.push(player);
    }
  }

  removePlayerFromRoom(roomId, playerId) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.players = room.players.filter(p => p.id !== playerId);
      if (room.players.length === 0) {
        this.rooms.delete(roomId);
      }
    }
  }

  setPlayerReady(roomId, playerId) {
    const room = this.rooms.get(roomId);
    if (room) {
      const player = room.players.find(p => p.id === playerId);
      if (player) {
        player.ready = true;
      }
    }
  }

  areAllPlayersReady(roomId) {
    const room = this.rooms.get(roomId);
    return room ? room.players.every(p => p.ready) : false;
  }

  findRoomByPlayerId(playerId) {
    for (const [roomId, room] of this.rooms.entries()) {
      if (room.players.some(p => p.id === playerId)) {
        return roomId;
      }
    }
    return undefined;
  }
}