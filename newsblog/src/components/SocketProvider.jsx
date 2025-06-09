import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

// 1. Create Context
export const SocketContext = createContext(null);

// 2. Provider Component
const SocketProvider = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user && user._id) {
      const newSocket = io("http://localhost:8080", {
        withCredentials: true,
      });

      console.log("🔌 Socket connected");
      newSocket.emit("join", { userId: user._id });
      setSocket(newSocket);

      // Clean up on unmount or user logout
      return () => {
        if (newSocket) {
          newSocket.disconnect();
          console.log("❌ Socket disconnected");
        }
      };
    } else {
      // Handle case where user logs out
      if (socket) {
        socket.disconnect();
        console.log("❌ Socket disconnected due to logout");
        setSocket(null);
      }
    }
  }, [user?._id]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
