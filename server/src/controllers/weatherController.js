import { getCurrentWeatherByCity } from "../models/weatherModel.js";

export async function getWeather(req, res) {
  const city = req.query.city || "HaNoi";

  try {
    const weather = await getCurrentWeatherByCity(city);
    return res.json(weather);
  } catch (err) {
    console.error("Weather controller error:", err.message);
    return res.status(500).json({
      message: "Error get weather data",
    });
  }
}