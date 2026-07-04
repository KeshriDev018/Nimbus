import { WebSocketServer, WebSocket } from "ws";

const clients: WebSocket[] = [];

export function createLogWebSocket(server: any) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (socket: WebSocket) => {
    console.log("📡 Log stream client connected");

    clients.push(socket);

    socket.on("close", () => {
      const index = clients.indexOf(socket);
      if (index !== -1) clients.splice(index, 1);
    });
  });
}

export function broadcastLog(containerId: string, log: string) {
  const payload = JSON.stringify({
    containerId,
    log,
    timestamp: new Date(),
  });

  clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}
