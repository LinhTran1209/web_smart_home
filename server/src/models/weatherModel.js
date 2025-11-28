import axios from "axios";

const WEATHER_API_BASE_URL = "http://api.weatherapi.com/v1/current.json";

const cache = {
  // city: { data, expiredAt }
};
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function getCurrentWeatherByCity(city) {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing WEATHER_API_KEY in .env");
  }

  const cityKey = city.toLowerCase();

  // kiểm tra cache
  const now = Date.now();
  const cached = cache[cityKey];
  if (cached && cached.expiredAt > now) {
    return cached.data;
  }

  // gọi API weather bên thứ 3
  const { data } = await axios.get(WEATHER_API_BASE_URL, {
    params: {
      key: apiKey,
      q: city,
      aqi: "yes",
    },
  });

  const result = {
    location: {
      name: data.location.name,
      country: data.location.country,
      localtime: data.location.localtime,
    },
    current: {
      temp_c: data.current.temp_c,
      humidity: data.current.humidity,
      wind_kph: data.current.wind_kph,
      condition: data.current.condition, // { text, icon, code }
      air_quality: data.current.air_quality, 
    },
  };

  // lưu cache
  cache[cityKey] = {
    data: result,
    expiredAt: now + CACHE_TTL_MS,
  };

  return result;
}
