export const getJwtPayload = (token) => {
  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const payload = getJwtPayload(token);
  if (!payload?.exp) return true;
  const nowSec = Math.floor(Date.now() / 1000);
  return payload.exp < nowSec;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  if (isTokenExpired(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("account");
    return false;
  }
  return true;
};
