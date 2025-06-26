import { useEffect, useState } from "react";
import { type Socket, io } from "socket.io-client";

let socket: Socket;

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) {
      socket = io(import.meta.env.VITE_API_URL as string, {
        withCredentials: true,
        auth: { token: localStorage.getItem("token") },
      });
    }

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return socket;
}
