import mqtt from "mqtt";

let client = null;

export function connectMqtt() {
  if (client) return client;

  client = mqtt.connect("wss://your-broker-url:8084/mqtt", {
    username: "user",
    password: "pass",
  });

  client.on("connect", () => {
    console.log("MQTT connected");
    // ví dụ: subscribe tất cả state
    client.subscribe("home/bedroom/+/state");
  });

  client.on("error", (err) => {
    console.error("MQTT error:", err);
  });

  return client;
}

// Gửi lệnh điều khiển 1 thiết bị
export function sendDeviceCommand(device, command) {
  if (!client) return;

  // ví dụ build topic theo device_type
  const baseTopic = `home/${device.room_id || "bedroom"}/${device.device_id}`;

  let topic = "";
  let payload = {};

  switch (command.kind) {
    case "on_off":
      topic = `${baseTopic}/set`;
      payload = { on: command.value };
      break;
    case "fan_speed":
      topic = `${baseTopic}/set`;
      payload = { speed: command.value };
      break;
    case "ac_temp":
      topic = `${baseTopic}/set`;
      payload = { temp: command.value };
      break;
    case "ac_mode":
      topic = `${baseTopic}/set`;
      payload = { mode: command.value };
      break;
    case "ac_fan_speed":
      topic = `${baseTopic}/set`;
      payload = { fan_speed: command.value };
      break;
    default:
      topic = `${baseTopic}/set`;
      payload = command;
  }

  client.publish(topic, JSON.stringify(payload));
}
