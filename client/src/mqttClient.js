// src/mqttClient.js
import mqtt from "mqtt";

const MQTT_URL = process.env.REACT_APP_MQTT_URL || "ws://localhost:9001"; 

let client = null;

export function getMqttClient() {
  if (!client) {
    client = mqtt.connect(MQTT_URL, {
      clean: true,
      reconnectPeriod: 3000, // tự reconnect
    });

    client.on("connect", () => {
      console.log("[MQTT] Connected");
    });

    client.on("reconnect", () => {
      console.log("[MQTT] Reconnecting...");
    });

    client.on("error", (err) => {
      console.error("[MQTT] Error:", err.message);
    });

    client.on("close", () => {
      console.log("[MQTT] Disconnected");
    });
  }

  return client;
}
