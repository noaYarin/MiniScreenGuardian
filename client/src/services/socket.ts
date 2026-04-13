import { io, type Socket } from "socket.io-client";
import { API_BASE_URL } from "../config/env";
import { JOIN_PARENT, JOIN_CHILD } from "@/src/constants/socketEvents";

let socket: Socket | null = null;
export const connectSocket = (
  userId: string,
  userType: "parent" | "child",
  options?: { parentId?: string }
) => {
    if (!socket) {
        console.log("Creating Singleton Socket...");
        socket = io(API_BASE_URL);
    }
    const joinEvent = userType === "parent" ? JOIN_PARENT : JOIN_CHILD;

    const emitJoin = () => {
        if (userType === "child" && options?.parentId) {
          socket?.emit(joinEvent, { childId: userId, parentId: options.parentId });
          return;
        }
        socket?.emit(joinEvent, userId);
    };

    if (socket.connected) {
        emitJoin();
    } else {
        socket.off("connect", emitJoin);
        socket.on("connect", emitJoin);
    }
  
    return socket;
  };


// Emit events to the server
export const emitEvent = (event: string, data: any) => {
    if (socket && socket.connected) {
        socket.emit(event, data);
    } else {
        console.warn(`Socket not connected. Could not emit: ${event}`);
    }
};


// Listen to events from the server
export const onEvent = (event: string, handler: (...args: any[]) => void) => {
    socket?.on(event, handler);
    // Return a function to clean up the event listener
    return () => socket?.off(event, handler);
};

export const disconnectSocket = () => {
    socket?.disconnect();
    socket = null;
};