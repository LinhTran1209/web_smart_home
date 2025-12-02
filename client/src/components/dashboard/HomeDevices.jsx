import { useEffect, useMemo, useState } from "react";
import api from "../../utils/axios.js";
import { Lightbulb, Fan, Snowflake, Thermometer } from "lucide-react";
import no_data from "../../assets/icons/no_data.svg";

const HomeDevices = () => {
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [devices, setDevices] = useState([]);

  const [selectedBuildingId, setSelectedBuildingId] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");

  const [deviceStatesMap, setDeviceStatesMap] = useState({});
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [toggling, setToggling] = useState({}); // { device_id: true/false }

  // ===== LOAD BUILDINGS, ROOMS, DEVICES LẦN ĐẦU =====
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [bRes, rRes, dRes] = await Promise.all([
          api.get("/buildings"),
          api.get("/rooms"),
          api.get("/devices"),
        ]);

        const buildingsData = bRes.data || [];
        const roomsData = rRes.data || [];
        const devicesData = dRes.data || [];

        setBuildings(buildingsData);
        setRooms(roomsData);
        setDevices(devicesData);

        // auto chọn building đầu tiên
        if (buildingsData.length > 0) {
          setSelectedBuildingId(buildingsData[0].building_id);
        }
      } catch (err) {
        console.error("Error loading buildings/rooms/devices:", err);
      }
    };

    fetchInitial();
  }, []);

  // ===== ROOM THEO BUILDING ĐANG CHỌN =====
  const roomsByBuilding = useMemo(() => {
    if (!selectedBuildingId) return [];
    return rooms.filter((r) => r.building_id === selectedBuildingId);
  }, [rooms, selectedBuildingId]);

  // khi đổi building → chọn room đầu tiên
  useEffect(() => {
    if (roomsByBuilding.length > 0) {
      setSelectedRoomId(roomsByBuilding[0].room_id);
    } else {
      setSelectedRoomId("");
    }
  }, [roomsByBuilding]);

  // ===== DEVICES THEO ROOM =====
  const devicesInRoom = useMemo(() => {
    if (!selectedRoomId) return [];
    return devices.filter((d) => d.room_id === selectedRoomId);
  }, [devices, selectedRoomId]);

  // ===== LOAD DEVICE STATE CHO TỪNG DEVICE TRONG ROOM =====
  useEffect(() => {
    const fetchStatesForRoom = async () => {
      if (!devicesInRoom.length) {
        setDeviceStatesMap({});
        return;
      }

      setLoadingDevices(true);
      try {
        const promises = devicesInRoom.map((device) =>
          api
            .get(`/device-states/${device.device_id}`)
            .then((res) => {
              const data = res.data;
              const stateDoc = Array.isArray(data) ? data[0] : data;
              return { device_id: device.device_id, state: stateDoc };
            })
            .catch((err) => {
              console.error(
                `Error loading state for ${device.device_id}:`,
                err
              );
              return null;
            })
        );

        const results = await Promise.all(promises);
        const map = {};
        results.forEach((item) => {
          if (item && item.state) {
            map[item.device_id] = item.state;
          }
        });
        setDeviceStatesMap(map);
      } catch (err) {
        console.error("Error loading device states:", err);
      } finally {
        setLoadingDevices(false);
      }
    };

    fetchStatesForRoom();
  }, [devicesInRoom]);

  // ===== ICON THEO device_type =====
  const getIconComponent = (deviceState, device) => {
    const deviceType = (deviceState?.device_type || "").toLowerCase();

    if (deviceType.includes("led")) return Lightbulb;
    if (deviceType.includes("fan")) return Fan;
    if (deviceType.includes("ac")) return Snowflake;

    if (device?.type === "sensor" || deviceType.includes("sensor")) {
      return Thermometer;
    }

    return Lightbulb;
  };

  // ===== CHECK ON / OFF =====
  const isOn = (deviceState) => {
    if (!deviceState || !Array.isArray(deviceState.status)) return false;
    const onOffItem = deviceState.status.find((s) => s.property === "on_off");
    if (!onOffItem) return false;

    const v = onOffItem.value;
    if (v === "on") return true;
    if (v === "off") return false;
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v > 0;
    return false;
  };

  // ===== TOGGLE ON/OFF (HIỆN TẠI MỚI UPDATE LOCAL, SAU M NỐI MQTT API) =====
  const handleToggleDevice = async (device) => {
    const deviceId = device.device_id;
    const currentState = deviceStatesMap[deviceId];
    const currentlyOn = isOn(currentState);
    const nextOn = !currentlyOn;

    // payload control (khi m có API điều khiển thì bật lại)
    const payload = {
      action: "on_off",
      value: nextOn,
    };

    try {
      setToggling((prev) => ({ ...prev, [deviceId]: true }));

      // TODO: khi có API control thực, bật dòng này và chỉnh endpoint + payload
      // await api.post(`/devices/${deviceId}/control`, payload);

      // optimistic update local state
      const oldStatus = currentState?.status || [];
      const otherProps = oldStatus.filter((s) => s.property !== "on_off");

      const newState = {
        ...(currentState || {}),
        device_id: deviceId,
        device_type:
          currentState?.device_type ||
          (device.type === "sensor" ? "sensor" : "led"),
        timestamp: new Date().toISOString(),
        status: [
          ...otherProps,
          {
            property: "on_off",
            value: nextOn ? "on" : "off",
          },
        ],
      };

      setDeviceStatesMap((prev) => ({
        ...prev,
        [deviceId]: newState,
      }));
    } catch (err) {
      console.error("Toggle device failed:", err);
    } finally {
      setToggling((prev) => ({ ...prev, [deviceId]: false }));
    }
  };

  const currentRoom = rooms.find((r) => r.room_id === selectedRoomId);

  return (
    <>
      {/* HEADER: ROOM (TRÁI) - BUILDING (PHẢI) */}
      <div className="section-header">
        <div className="section-header-left">
          <span className="section-label">Room:</span>
          <select
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            className="section-select"
            disabled={!roomsByBuilding.length}
          >
            {roomsByBuilding.map((room) => (
              <option key={room.room_id} value={room.room_id}>
                {room.room_name}
              </option>
            ))}
          </select>
        </div>

        <div className="section-header-right">
          <span className="section-label">Building:</span>
          <select
            value={selectedBuildingId}
            onChange={(e) => setSelectedBuildingId(e.target.value)}
            className="section-select"
          >
            {buildings.map((b) => (
              <option key={b.building_id} value={b.building_id}>
                {b.building_alias || b.building_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DEVICES ROW */}
      {loadingDevices ? (
        <p className="muted" style={{ fontSize: 13 }}>
          Loading devices...
        </p>
      ) : !devicesInRoom.length ? (
        <>
          <img className="img-no-data" src={no_data} alt="" />
          <p className="muted" style={{ fontSize: 13 }}>
            No devices in {currentRoom?.room_name || "this room"}.
          </p>
        </>
      ) : (
        <div className="devices-row">
          {devicesInRoom.map((device) => {
            const state = deviceStatesMap[device.device_id];
            const on = isOn(state);
            const IconComp = getIconComponent(state, device);
            const cardClass = on
              ? "device-card device-card--primary"
              : "device-card device-card--neutral";

            return (
              <div key={device.device_id} className={cardClass}>
                <div className="device-status-row">
                  <span className="device-status">{on ? "ON" : "OFF"}</span>

                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={on}
                      disabled={!!toggling[device.device_id]}
                      onChange={() => handleToggleDevice(device)}
                    />
                    <span className="slider" />
                  </label>
                </div>

                <div className="device-icon">
                  <IconComp size={24} />
                </div>
                <div className="device-name">{device.device_name}</div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default HomeDevices;
