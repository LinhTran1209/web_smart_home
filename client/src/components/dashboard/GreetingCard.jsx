// src/components/dashboard/GreetingCard.jsx
import React, { useEffect, useState } from "react";
import { Droplets, Wind, Activity } from "lucide-react";
import api from "../../utils/axios.js";
import { WEATHER_CODE_CATEGORY, WEATHER_CATEGORY_STYLES } from "../../constants/weatherStyles.jsx";

const GreetingCard = ({ city = "HaNoi" }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/weather", { params: { city } });
        if (cancelled) return;

        setWeather(res.data);
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        setError(
          err?.response?.data?.message || "Failed to fetch weather data."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchWeather();

    return () => {
      cancelled = true;
    };
  }, [city]);

  if (loading) {
    return (
      <section className="card greeting-card">
        <span className="weather-loading">Loading weather...</span>
      </section>
    );
  }

  if (error || !weather) {
    return (
      <section className="card greeting-card">
        <span className="weather-error">{error || "Unexpected error."}</span>
      </section>
    );
  }

  const { location, current } = weather;

  // ===== BASIC WEATHER INFO =====
  const tempC = Math.round(current?.temp_c ?? 0);
  const humidity = current?.humidity ?? "--";
  const windMps =
    typeof current?.wind_kph === "number"
      ? (current.wind_kph / 3.6).toFixed(1)
      : "--";

  const conditionText = current?.condition?.text ?? "";
  const conditionCode = current?.condition?.code;

  const dateStr = location?.localtime
    ? new Date(location.localtime.replace(" ", "T")).toLocaleDateString(
        "en-US",
        { month: "short", day: "2-digit", year: "numeric" }
      )
    : "";

  // ===== AIR QUALITY (US-EPA 1–6) =====
  const aqiIndex = current?.air_quality?.["us-epa-index"];
  const hasPm25 = typeof current?.air_quality?.pm2_5 === "number";
  const pm25 = hasPm25 ? current.air_quality.pm2_5.toFixed(1) : null;

  const getAqiInfo = (index) => {
    // US-EPA standard mapping (1–6)
    switch (index) {
      case 1:
        return {
          shortStatus: "Good",
          description: "Air quality is considered satisfactory.",
          badgeClass: "aqi-badge--good",
        };
      case 2:
        return {
          shortStatus: "Moderate",
          description: "Acceptable for most people.",
          badgeClass: "aqi-badge--moderate",
        };
      case 3:
        return {
          shortStatus: "Unhealthy for sensitive groups",
          description:
            "Sensitive groups should consider limiting long outdoor activities.",
          badgeClass: "aqi-badge--moderate",
        };
      case 4:
        return {
          shortStatus: "Unhealthy",
          description:
            "Everyone may begin to experience health effects outdoors.",
          badgeClass: "aqi-badge--bad",
        };
      case 5:
        return {
          shortStatus: "Very unhealthy",
          description: "Health warnings – avoid intensive outdoor activity.",
          badgeClass: "aqi-badge--bad",
        };
      case 6:
        return {
          shortStatus: "Hazardous",
          description: "Serious health risk – stay indoors if possible.",
          badgeClass: "aqi-badge--bad",
        };
      default:
        return {
          shortStatus: "Unknown",
          description: "Air quality data is not available.",
          badgeClass: "aqi-badge--unknown",
        };
    }
  };

  const { shortStatus, description, badgeClass } = getAqiInfo(aqiIndex);

  // ===== WEATHER VISUALS (BACKGROUND + ICON) =====
  const category = WEATHER_CODE_CATEGORY[conditionCode] || "clear";
  const visual =
    WEATHER_CATEGORY_STYLES[category] || WEATHER_CATEGORY_STYLES.clear;

  return (
    <section className={`card greeting-card ${visual.className}`}>
      {/* LEFT – temperature + basic weather info */}
      <div className="weather-left">
        <div className="weather-temp">{tempC}°C</div>
        <div className="weather-location">
          {location?.name}, {conditionText}
        </div>
        <div className="weather-date">{dateStr}</div>

        <div className="weather-meta">
          <div className="weather-meta-item">
            <Droplets className="weather-meta-icon" />
            <span>{humidity}%</span>
          </div>
          <div className="weather-meta-item">
            <Wind className="weather-meta-icon" />
            <span>{windMps} m/s</span>
          </div>
        </div>
      </div>

      {/* CENTER – Air Quality (US-EPA) */}
      {current?.air_quality && (
        <div className="weather-center">
          <div className="aqi-card">
            <div className="aqi-header">
              <Activity className="aqi-icon" />
              <div className="aqi-header-text">
                <span className="aqi-title">AIR QUALITY</span>
              </div>
            </div>

            <div className="aqi-main-row">
              <span className={`aqi-badge ${badgeClass}`}>{shortStatus}</span>

              {hasPm25 && <span className="aqi-pm">PM2.5 {pm25} µg/m³</span>}
            </div>

            <p className="aqi-note">{description}</p>
          </div>
        </div>
      )}

      {/* RIGHT – weather icon (Figma image) */}
      <div className="weather-right">
        <img
          className="weather-icon"
          src={visual.icon}
          alt={conditionText}
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default GreetingCard;
