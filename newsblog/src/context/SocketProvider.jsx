// SocketProvider.jsx - Optimized version
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    const SOCKET_URL = 'http://localhost:8080';
    
    console.log('🔌 Initializing socket connection...');

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    // Connection handlers
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    newSocket.on('disconnect', (reason) => {
      console.warn('⚠️ Socket disconnected:', reason);
      setIsConnected(false);
      setJoinedRoom(null);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      setIsConnected(false);
      reconnectAttempts.current += 1;
      
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.error('🚫 Max reconnection attempts reached');
      }
    });

    newSocket.on('joined', (data) => {
      console.log('🏠 Joined room:', data);
      setJoinedRoom(data.userId);
    });

    // Reconnection handlers
    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts');
      reconnectAttempts.current = 0;
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('🔄❌ Reconnection error:', error.message);
    });

    setSocket(newSocket);

    return () => {
      console.log('🧹 Cleaning up socket connection');
      newSocket.removeAllListeners();
      newSocket.disconnect();
    };
  }, []);

  // Join user room (call this once when user logs in)
  const joinUserRoom = (userId) => {
    if (socket && isConnected && userId && joinedRoom !== userId) {
      console.log('🏠 Joining room for user:', userId);
      socket.emit('join', userId);
    }
  };

  // Enhanced emit with connection check
  const emit = (event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
      return true;
    } else {
      console.warn(`❗ Cannot emit "${event}". Socket not connected.`);
      return false;
    }
  };

  // Enhanced listener management
  const on = (event, callback) => {
    if (socket) {
      socket.on(event, callback);
      return () => socket.off(event, callback);
    }
    return () => {};
  };

  const off = (event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  };

  const value = {
    socket,
    isConnected,
    joinedRoom,
    joinUserRoom,
    emit,
    on,
    off,
    reconnectAttempts: reconnectAttempts.current,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;