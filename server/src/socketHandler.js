import { Server } from "socket.io";
import { 
  REQUEST_CHILD_LOCATION, 
  REQUEST_REFRESH_FROM_PARENT, 
  LOCATION_LIVE_UPDATE, 
  PARENT_LOGOUT, 
  DELETE_DEVICE,
  FORCE_CHILD_LOGOUT,
  JOIN_PARENT,
  JOIN_CHILD
} from "./constants/socketEvents.js";
import {NotificationType} from "./constants/notificationType.js";
import {NotificationSeverity} from "./constants/severity.js";

import { notifyParent } from "./services/notification.service.js";
let io = null;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`New connection established: ${socket.id}`);

    // Join Parent Room
    socket.on(JOIN_PARENT, (parentId) => {
      if (!parentId) return;
      const room = `parent_${parentId}`;
      socket.data.parentId = String(parentId);
      socket.join(room);
      console.log(`[Join] Parent ${parentId} joined room: ${room}`);
    });

    // Join Child Room
    socket.on(JOIN_CHILD, (payload) => {
      const childId =
        payload && typeof payload === "object" ? payload.childId : payload;
      const parentId =
        payload && typeof payload === "object" ? payload.parentId : null;

      if (!childId) return;
      const room = `child_${childId}`;
      socket.data.childId = String(childId);
      if (parentId) socket.data.parentId = String(parentId);
      socket.join(room);
      console.log(`[Join] Child ${childId} joined room: ${room}`);
    });

    // Parent requesting location from child
    socket.on(REQUEST_REFRESH_FROM_PARENT, (data) => {
      const { parentId, childId } = data;
      console.log(`[Request] Parent ${parentId} requesting location from child ${childId}`);
      io.to(`child_${childId}`).emit(REQUEST_CHILD_LOCATION, { parentId });
    });
  
    // Child sending location to parent
    socket.on(REQUEST_CHILD_LOCATION, (data) => {
      const { parentId, location, childId, lastUpdated } = data;
      console.log(`[LocationUpdate] Child ${childId} sending location to parent ${parentId}`);
      
      io.to(`parent_${parentId}`).emit(LOCATION_LIVE_UPDATE, {
        childId,
        location,
        lastUpdated
      });
    });

    // Parent Logout - Force disconnect all linked children
    socket.on(PARENT_LOGOUT, (data) => {
      const { parentId, childrenIds } = data;
      console.log(`[Logout] Parent ${parentId} logged out. Processing children disconnection...`);
      
      if (childrenIds && Array.isArray(childrenIds)) {
        childrenIds.forEach(childId => {
          const childRoom = `child_${childId}`;
          console.log(`[ForceLogout] Emitting logout to child room: ${childRoom}`);
          
          io.to(childRoom).emit(FORCE_CHILD_LOGOUT, {
            message: "The parent logged out, the application will close now."
          });
        });
      }
    });

    socket.on(DELETE_DEVICE, (data) => {
      const { deviceId, childId } = data; 
      
      if (!childId || !deviceId) {
        console.log("[DeleteDevice] Missing childId or deviceId");
        return;
      }
    
      const childRoom = `child_${childId}`;
      console.log(`[DeleteDevice] Parent requesting delete for device ${deviceId} in room: ${childRoom}`);
    
      io.to(childRoom).emit(FORCE_CHILD_LOGOUT, { 
        deviceId,
        message: "This device has been disconnected by the parent." 
      });
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);

      const parentId = socket.data?.parentId;
      const childId = socket.data?.childId;
      if (parentId && childId) {
        notifyParent({
          parentId,
          childId,
          type: NotificationType.CHILD_DISCONNECTED,
          severity: NotificationSeverity.WARNING,
          title: "Child Disconnected",
          description: "The child's device disconnected"
        });
      }
    });
  });

  return io;
}

export function getIO() {
  return io;
}