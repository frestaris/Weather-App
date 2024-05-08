import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

const apiKey = "";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Render the initial form
app.get("/", (req, res) => {
  res.render("index.ejs", {
    temp: "",
    city: "",
    humidity: "",
    wind: "",
    weatherIcon: "",
    error: false,
  }); // Initial values are empty
});

// Handle form submission
app.post("/", (req, res) => {
  const city = req.body.city;

  // Make GET request to OpenWeatherMap API with the user-input city
  axios
    .get(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`)
    .then((response) => {
      console.log("API Response:", response.data);
      // Extract required data from the response
      const { main, name, wind, weather } = response.data;
      const { temp, humidity } = main;

      // Define weatherIcon variable and set its src based on weather condition
      let weatherIcon;
      switch (weather[0].main.toLowerCase()) {
        case "clouds":
          weatherIcon = "images/clouds.png";
          break;
        case "clear":
          weatherIcon = "images/clear.png";
          break;
        case "rain":
          weatherIcon = "images/rain.png";
          break;
        case "drizzle":
          weatherIcon = "images/drizzle.png";
          break;
        case "mist":
          weatherIcon = "images/mist.png";
          break;
        case "fog":
          weatherIcon = "images/fog.png";
          break;
        default:
          weatherIcon = "images/default.png"; // Default icon
      }

      // Render the index.ejs template with the fetched data and weather icon
      res.render("index.ejs", {
        temp,
        city: name,
        humidity,
        wind: wind.speed,
        weatherIcon, // Pass weatherIcon to index.ejs
        error: false,
      });
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      // Handle error
      res.render("index.ejs", {
        temp: "",
        city: "",
        humidity: "",
        wind: "",
        weatherIcon: "images/default.png", // Default icon for error case
        error: true,
      });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
