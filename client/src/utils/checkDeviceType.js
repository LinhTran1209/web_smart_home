const checkDeviceType = (device_type) => {
    if (!device_type || typeof device_type !== "string") return "led";

    return device_type.toLowerCase().split("_")[0];
};

export default checkDeviceType;
