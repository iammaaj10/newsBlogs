import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

// Create Socket Context
export const SocketContext = createContext();

// Custom hook to use socket
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    console.error('useSocket must be used within a SocketProvider');
    return null;
  }
  return context;
};

// Socket Provider Component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Replace with your actual backend URL
    const SOCKET_URL =  'http://localhost:8080';
    
    console.log('Initializing socket connection to:', SOCKET_URL);
    
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    setSocket(newSocket);

    // Cleanup function
    return () => {
      console.log('Cleaning up socket connection');
      newSocket.disconnect();
    };
  }, []);

  // Debug: Log socket state
  useEffect(() => {
    console.log('Socket state:', {
      socket: socket,
      isConnected: isConnected,
      hasEmit: socket && typeof socket.emit === 'function',
      hasOn: socket && typeof socket.on === 'function'
    });
  }, [socket, isConnected]);

  const value = {
    socket,
    isConnected,
    // Helper methods
    emit: (event, data) => {
      if (socket && typeof socket.emit === 'function') {
        socket.emit(event, data);
      } else {
        console.warn('Socket not available for emit:', event, data);
      }
    },
    on: (event, callback) => {
      if (socket && typeof socket.on === 'function') {
        socket.on(event, callback);
      } else {
        console.warn('Socket not available for on:', event);
      }
    },
    off: (event, callback) => {
      if (socket && typeof socket.off === 'function') {
        socket.off(event, callback);
      } else {
        console.warn('Socket not available for off:', event);
      }
    }
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;