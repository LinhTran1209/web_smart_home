import clearSkyIcon from "../assets/images/weather/clear-sky.svg";
import cloudyIcon from "../assets/images/weather/cloudy.svg";
import fogIcon from "../assets/images/weather/fog.svg";
import drizzleIcon from "../assets/images/weather/drizzle.svg";
import rainIcon from "../assets/images/weather/rain.svg";
import sleetIcon from "../assets/images/weather/sleet.svg";
import snowIcon from "../assets/images/weather/snow.svg";

// map WeatherAPI "code" → high-level category
export const WEATHER_CODE_CATEGORY = {
  1000: "clear",
  1003: "cloudy",
  1006: "cloudy",
  1009: "cloudy",
  1030: "fog",
  1063: "rain",
  1066: "snow",
  1069: "sleet",
  1072: "drizzle",
  1087: "rain",
  1114: "snow",
  1117: "snow",
  1135: "fog",
  1147: "fog",
  1150: "drizzle",
  1153: "drizzle",
  1168: "drizzle",
  1171: "drizzle",
  1180: "rain",
  1183: "rain",
  1186: "rain",
  1189: "rain",
  1192: "rain",
  1195: "rain",
  1198: "rain",
  1201: "rain",
  1204: "sleet",
  1207: "sleet",
  1210: "snow",
  1213: "snow",
  1216: "snow",
  1219: "snow",
  1222: "snow",
  1225: "snow",
  1237: "snow",
  1240: "rain",
  1243: "rain",
  1246: "rain",
  1249: "sleet",
  1252: "sleet",
  1255: "snow",
  1258: "snow",
  1261: "snow",
  1264: "snow",
  1273: "rain",
  1276: "rain",
  1279: "snow",
  1282: "snow",
};

// map category → CSS class
export const WEATHER_CATEGORY_STYLES = {
  clear: {
    className: "greeting-card--clear",
    icon: clearSkyIcon,
  },
  cloudy: {
    className: "greeting-card--cloudy",
    icon: cloudyIcon,
  },
  fog: {
    className: "greeting-card--fog",
    icon: fogIcon,
  },
  drizzle: {
    className: "greeting-card--drizzle",
    icon: drizzleIcon,
  },
  rain: {
    className: "greeting-card--rain",
    icon: rainIcon,
  },
  sleet: {
    className: "greeting-card--sleet",
    icon: sleetIcon,
  },
  snow: {
    className: "greeting-card--snow",
    icon: snowIcon,
  },
};
