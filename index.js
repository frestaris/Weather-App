import express from "express";
import axios from "axios";
import "dotenv/config";

const app = express();
const port = 3000;

const apiKey = process.env.API_KEY;
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", {
    temp: "",
    city: "",
    humidity: "",
    wind: "",
    weatherIcon: "",
    error: false,
  });
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
          weatherIcon = "images/default.png";
      }

      // Render the index.ejs template with the fetched data and weather icon
      res.render("index.ejs", {
        temp,
        city: name,
        humidity,
        wind: wind.speed,
        weatherIcon,
        error: false,
      });
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);

      res.render("index.ejs", {
        temp: "",
        city: "",
        humidity: "",
        wind: "",
        weatherIcon: "images/default.png",
        error: true,
      });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
