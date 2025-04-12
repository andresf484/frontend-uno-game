import {useContext, useEffect, useState} from 'react'

import {SocketContext} from './SocketContext'

import { socket } from '../services/socket'

export const SocketContextProvider = ({children}) => {

    const [gameState, setGameState] = useState(null);
    const [room, setRoom] = useState(null);

    socket.connect(); // Conectar el socket al iniciar el contexto

    useEffect(() => {

      // ################# TODO - Inicio Depuración #################

      //console.log('SocketContextProvider useEffect');
      //console.log('socket.id: '+socket.id);

      /* socket.on('connect', () => {
        console.log("El socket se ha conectado: ", socket.id);

        //https://socket.io/docs/v4/connection-state-recovery
        if (socket.recovered) {
          // any event missed during the disconnection period will be received now
          console.log("Socket recuperado de una desconexión: ", socket.id);
        } else {
          // new or unrecoverable session
          console.log("Socket nuevo o no se ha podido recuperar: ", socket.id);
        }

      });

      socket.on('disconnect', () => {
        console.log("El socket se ha desconectado", socket.id);
      }); */

      // ################# TODO - Fin Depuración #################


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

    }, [socket]);

    return (
      <SocketContext.Provider value={{
        socket: socket,
        gameState: gameState,
        setGameState: setGameState,
        room: room,
        setRoom: setRoom
      }}>
        {children}
      </SocketContext.Provider>
    );

}