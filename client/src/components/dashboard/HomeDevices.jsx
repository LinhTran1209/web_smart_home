import { useEffect, useMemo, useState } from "react";
import api from "../../utils/axios.js";
import { Lightbulb, Fan, Snowflake, Thermometer } from "lucide-react";
import no_data from "../../assets/icons/no_data.svg";
import checkDeviceType from "../../utils/checkDeviceType.js";
import Icon from "@mdi/react";
import {mdiFan, mdiSnowflake} from "@mdi/js";

const HomeDevices = ({ onDeviceSelected, onDeviceCommand }) => {
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [devices, setDevices] = useState([]);

  const [selectedBuildingId, setSelectedBuildingId] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");

  const safeOnDeviceSelected = onDeviceSelected || (() => {});
  const safeOnDeviceCommand = onDeviceCommand || (() => {});

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
        const devicesData = (dRes.data || []).filter(
          (d) => d.type !== "sensor"
        );

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

  // ===== LOAD DEVICE STATE CHO TỪNG DEVICE TRONG ROOM ======================================================
  useEffect(() => {
    const fetchStatesForRoom = async () => {
      if (!devicesInRoom.length) {
        setDeviceStatesMap({});
        return;
      }

      setLoadingDevices(true);
      try {
        // Lọc bỏ sensor
        const filteredDevices = devicesInRoom.filter(
          (d) => d.type !== "sensor"
        );
        const results = await Promise.all(
          filteredDevices.map((device) =>
            api
              .get(`/device-states/${device.device_id}`)
              .then((res) => res.data[0])
          )
        );

        const map = {};
        results.forEach((item) => {
          if (item && item.device_id) {
            map[item.device_id] = item;
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
  const getIconComponent = (deviceState) => {
    // console.log("deviceState", deviceState);
    const deviceType = checkDeviceType(deviceState?.device_type);
    switch (deviceType) {
      case "ac":
        return Snowflake;
        // return () => <Icon path={mdiSnowflake} size={1} />;
      case "fan":
        // return Fan;
        return () => <Icon path={mdiFan} size={1} spin/>;
      default:
        return Lightbulb;
    }
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

    try {
      setToggling((prev) => ({ ...prev, [deviceId]: true }));

      // Gửi lệnh ra ngoài (HomePage -> MQTT)
      safeOnDeviceCommand(device, { kind: "on_off", value: nextOn });

      // Update local state (optimistic)
      const oldStatus = currentState?.status || [];
      const otherProps = oldStatus.filter((s) => s.property !== "on_off");
      const newState = {
        ...(currentState || {}),
        device_id: deviceId,
        device_type: currentState?.device_type || device.type,
        timestamp: new Date().toISOString(),
        status: [
          ...otherProps,
          { property: "on_off", value: nextOn ? "on" : "off" },
        ],
      };

      setDeviceStatesMap((prev) => ({
        ...prev,
        [deviceId]: newState,
      }));

      // nếu panel đang hiển thị thiết bị này thì update luôn
      const controlType = checkDeviceType(newState.device_type || device.type);
      safeOnDeviceSelected({
        device,
        deviceState: newState,
        controlType,
        isOn: nextOn,
      });
    } catch (err) {
      console.error("Toggle device failed:", err);
    } finally {
      setToggling((prev) => ({ ...prev, [deviceId]: false }));
    }
  };

  const currentRoom = rooms.find((r) => r.room_id === selectedRoomId);

  return (
    <>
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
            const IconComp = getIconComponent(state);
            const cardClass = on
              ? "device-card device-card--primary"
              : "device-card device-card--neutral";

            const controlType = checkDeviceType(
              state?.device_type || device.type
            );

            const handleSelectCard = () => {
              safeOnDeviceSelected({
                device,
                deviceState: state,
                controlType,
                isOn: on,
              });
            };

            return (
              <div
                key={device.device_id}
                className={cardClass}
                onClick={handleSelectCard}
              >
                <div className="device-status-row">
                  <span className="device-status">{on ? "ON" : "OFF"}</span>

                  <label
                    className="switch"
                    onClick={(e) => e.stopPropagation()} // không trigger chọn card
                  >
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
