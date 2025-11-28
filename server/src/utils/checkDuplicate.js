/**
 * Kiểm tra trùng lặp một trường trong MongoDB
 * Không hỗ trợ excludeId (vì bạn không update)
 */
export const checkDuplicateField = async (Model, fieldName, value) => {
  if (!value) {
    return { isDuplicate: false };
  }

  const query = { [fieldName]: value };

  const existing = await Model.findOne(query);

  return { isDuplicate: !!existing };
};
