import { useEffect, useState } from "react";
import GreetingCard from "../../components/dashboard/GreetingCard.jsx";
import HomeDevices from "../../components/dashboard/HomeDevices.jsx";
import MyDevicesPanel from "../../components/dashboard/DevicePanel.jsx";
import MembersPanel from "../../components/dashboard/MembersPanel.jsx";
import PowerChart from "../../components/dashboard/PowerChart.jsx";

import { connectMqtt, sendDeviceCommand } from "../../services/mqttClient.js";

const HomePage = () => {
  const [coords, setCoords] = useState(null);
  const [geoErr, setGeoErr] = useState("");

  // Device chọn lắng nghe MQTT
  const [selectedDeviceInfo, setSelectedDeviceInfo] = useState(null);

  // Lấy vị trí tọa độ người dùng
  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => {
        setGeoErr("Dùng mặc định HaNoi.");
      },
      { enableHighAccuracy: true }
    );
  }, []);

  // Kết nối MQTT
  useEffect(() => {
    connectMqtt();
  }, []);

  // Khi click vào card device bên trái
  const handleDeviceSelected = (info) => {
    // info: { device, deviceState, controlType, isOn }
    setSelectedDeviceInfo(info);
  };

  // Hàm chung để gửi lệnh điều khiển (được gọi từ HomeDevices + DevicePanel)
  const handleDeviceCommand = (device, command) => {
    if (!device) return;

    console.log("Command from UI:", { device, command });
    // Gọi MQTT
    sendDeviceCommand(device, command);
  };

  return (
    <div className="home-grid">
      <div className="home-left">
        <GreetingCard city={coords ? `${coords.lat}, ${coords.lon}` : ""} />

        {/* {geoErr && (
          <p style={{ fontSize: 12, marginTop: 4, color: "#ff7b00" }}>{geoErr}</p>
        )} */}

        <section className="card section-card">
          <HomeDevices
            onDeviceSelected={handleDeviceSelected}
            onDeviceCommand={handleDeviceCommand}
          />
        </section>

        <section className="card section-card">
          <MyDevicesPanel
            selectedDevice={selectedDeviceInfo}
            onDeviceCommand={handleDeviceCommand}
          />
        </section>
      </div>

      <div className="home-right">
        <section className="card side-card">
          <MembersPanel />
        </section>

        <section className="card side-card">
          <PowerChart />
        </section>
      </div>
    </div>
  );
};

export default HomePage;
