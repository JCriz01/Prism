import { io, Socket } from "socket.io-client";

interface Message {
  id: string;
  content: string;
  channelId: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt: string;
  type: "DEFAULT" | "REPLY" | "SYSTEM";
}

interface TypingUser {
  userId: string;
  username: string;
  channelId: string;
}

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    this.token = token;
    console.log("token", token);
    this.socket = io("http://localhost:5200", {
      path: "/socket.io",
      withCredentials: true,
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
    });

    this.setupEventListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Connected to server:", this.socket?.id);
      console.log("Socket connected:", this.socket?.connected);
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    this.socket.on("joined_channel", (data) => {
      console.log("Successfully joined channel:", data);
    });
  }

  // Channel management
  joinChannel(channelId: string) {
    if (this.socket?.connected) {
      console.log("Joining channel:", channelId);
      this.socket.emit("join_channel", { channelId });
    } else {
      console.log("Cannot join channel - socket not connected");
    }
  }

  leaveChannel(channelId: string) {
    if (this.socket?.connected) {
      this.socket.emit("leave_channel", { channelId });
    }
  }

  // Message handling
  sendMessage(channelId: string, content: string) {
    if (this.socket?.connected) {
      this.socket.emit("send_message", { channelId, content });
    }
  }

  onNewMessage(callback: (message: Message) => void) {
    if (this.socket) {
      console.log("Setting up new_message listener");
      this.socket.on("new_message", (message) => {
        console.log("Socket received new_message:", message);
        callback(message);
      });
    }
  }

  offNewMessage(callback: (message: Message) => void) {
    if (this.socket) {
      this.socket.off("new_message", callback);
    }
  }

  // Typing indicators
  startTyping(channelId: string) {
    if (this.socket?.connected) {
      this.socket.emit("typing_start", { channelId });
    }
  }

  stopTyping(channelId: string) {
    if (this.socket?.connected) {
      this.socket.emit("typing_stop", { channelId });
    }
  }

  onUserTyping(callback: (data: TypingUser) => void) {
    if (this.socket) {
      this.socket.on("user_typing", callback);
    }
  }

  onUserStoppedTyping(callback: (data: TypingUser) => void) {
    if (this.socket) {
      this.socket.on("user_stopped_typing", callback);
    }
  }

  offUserTyping(callback: (data: TypingUser) => void) {
    if (this.socket) {
      this.socket.off("user_typing", callback);
    }
  }

  offUserStoppedTyping(callback: (data: TypingUser) => void) {
    if (this.socket) {
      this.socket.off("user_stopped_typing", callback);
    }
  }

  // Connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Generic event handling
  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }
}

// Create singleton instance
export const socketService = new SocketService();
export default socketService;
