import { WebSocketServer } from "ws";
import aedes from "aedes";
import websocketStream from "websocket-stream";
import { createServer as createTcpServer } from "net";
const wss = new WebSocketServer(
  {
    port: 8080,
  },
  () => console.log("Starting websocket server on 8080")
);

const mqttBroker = new aedes();
const tcpServer = createTcpServer(mqttBroker.handle);
mqttBroker.on("publish", (packet, client) => {
  console.log("client " + client);
  console.log("packet " + packet.payload.toString());
});
tcpServer.listen(1883, () => {
  console.log("MQTT over TCP listening on 1883");
});

wss.on("connection", async (ws: WebSocket) => {
  console.log("user conencted");

  const stream = websocketStream(ws);
  mqttBroker.handle(stream);
});
