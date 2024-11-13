import "./reset.css";
import "./styles.css";

import sunIcon from "./sun.png";
import rainIcon from "./downpour.png";
import cloudIcon from "./cloud.png";

const API_KEY = "<Enter visualcrossing API key here>";
const DEFAULT_LOCATION = "Berlin";

const locationForm = document.querySelector("#location-form");

const fetchWeatherData = async (location) => {
  console.log("Searched location: ", location);
  const weatherAPIResponse = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${API_KEY}&contentType=json`,
  );

  if (!weatherAPIResponse.ok) {
    throw new Error("API response not successful");
  }

  return await weatherAPIResponse.json();
};

const getCurrentWeatherInformation = async (location) => {
  const {
    address,
    currentConditions: { datetime, icon, conditions, temp },
  } = await fetchWeatherData(location);
  return { address, datetime, icon, conditions, temp };
};

const printWeatherInformation = async (weatherInformation) => {
  const container = document.querySelector("#content");
  const locationTitle = document.querySelector("#location-title");
  const temperature = document.querySelector("#temperature");
  const conditions = document.querySelector("#conditions");
  const iconContainer = document.querySelector("#icon-container");
  iconContainer.innerHTML = "";

  if (weatherInformation.temp > 15) {
    container.classList.add("warm");
  } else {
    container.classList.remove("warm");
  }

  locationTitle.textContent = `${weatherInformation.address} - ${weatherInformation.datetime.slice(0, 5)}`;
  temperature.textContent = `${Math.trunc(weatherInformation.temp)}°`;
  conditions.textContent = weatherInformation.conditions;

  const icon = document.createElement("img");
  icon.src = getIconForIconText(weatherInformation.icon);
  icon.alt = `${weatherInformation.icon} icon`;

  iconContainer.appendChild(icon);
};

const showWeatherDataForLocation = async (location) => {
  const weatherData = await getCurrentWeatherInformation(location);
  console.log("weather data: ", weatherData);
  await printWeatherInformation(weatherData);
};

const getIconForIconText = (icon) => {
  if (icon.includes("cloudy")) {
    return cloudIcon;
  } else if (icon.includes("rain")) {
    return rainIcon;
  } else if (icon.includes("sun")) {
    return sunIcon;
  } else {
    return sunIcon; // TODO return fallback icon
  }
};

locationForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const locationInput = document.querySelector("#location-search").value;
  await showWeatherDataForLocation(locationInput).catch(() =>
    alert(
      "Error fetching data. Please make sure that you entered a valid location. If the problem persists, please try again later.",
    ),
  );
});

showWeatherDataForLocation(DEFAULT_LOCATION);
