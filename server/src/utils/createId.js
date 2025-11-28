
export const slugifyName = (name) => {
  if (!name) return "";

  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")                  // tách dấu
    .replace(/[\u0300-\u036f]/g, "")   // xóa dấu
    .replace(/[^a-z0-9]+/g, "");       // giữ chữ và số
};

/**
 * Tạo building_id theo quy ước:
 *   build_<ten_toa>
 * 
 * Ví dụ:
 *   "Ký túc xá" -> build_kytucxa
 */
export const createBuildingId = (buildingName) => {
  const slug = slugifyName(buildingName);
  return `build_${slug}`;
};

/**
 * Tạo room_id theo quy ước:
 *   room_<ten_toa>_<ten_phong>
 * 
 * Ví dụ:
 *   (building_id = "build_kytucxa", room_name = "phòng nghỉ")
 *   -> room_kytucxa_phongnghi
 */
export const createRoomId = (buildingId, roomName) => {
  let buildingSlug = buildingId.replace(/^build_/, "");

  const roomSlug = slugifyName(roomName);

  return `room_${buildingSlug}_${roomSlug}`;
};
