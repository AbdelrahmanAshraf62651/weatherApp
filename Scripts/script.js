// Handle search Button click
document.addEventListener("DOMContentLoaded", () => {

    async function updateWeatherUI(weather) {
        if (weather && weather.cod === 200) {
            const iconCode = weather.weather[0].icon;

            // Set local time of the searche Country
            const utcTime = Date.now() + new Date().getTimezoneOffset() * 60000;
            const localTime = new Date(utcTime + weather.timezone * 1000);
            const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
            document.getElementById("currentDate").textContent = localTime.toLocaleDateString(undefined, options);

            // Change background based on weather
            const localTimestamp = Math.floor(localTime.getTime() / 1000);
            const isDay = localTimestamp >= weather.sys.sunrise && localTimestamp < weather.sys.sunset;
            const condition = weather.weather[0].main.toLowerCase();
            let bgImage = "./background imgs/default.jpg";

            if (condition.includes("cloud")) bgImage = isDay ? "./background imgs/clouds-day.jpg" : "./background imgs/clouds-night.jpg";
            else if (condition.includes("rain")) bgImage = isDay ? "./background imgs/rain-day.jpg" : "./background imgs/rain-night.jpg";
            else if (condition.includes("clear")) bgImage = isDay ? "./background imgs/clear-day.jpg" : "./background imgs/clear-night.jpg";
            else if (condition.includes("snow")) bgImage = isDay ? "./background imgs/snow-day.jpg" : "./background imgs/snow-night.jpg";
            else if (condition.includes("thunder")) bgImage = "./background imgs/thunderstorm.jpg";
            else if (condition.includes("mist") || condition.includes("fog")) bgImage = "./background imgs/mist.jpg";

            document.body.style.backgroundImage = `url('${bgImage}')`;
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
            document.body.style.backgroundRepeat = "no-repeat";

            // Data
            document.getElementById("currentTemp").textContent = `${Math.round(weather.main.temp)}°`;
            document.getElementById("feelsLike").textContent = `${weather.main.feels_like}°`;
            document.getElementById("currentCondition").textContent = weather.weather[0].description;
            document.getElementById("wind").textContent = `${weather.wind.speed} m/s`;
            document.getElementById("humidity").textContent = `${weather.main.humidity}%`;
            document.getElementById("pressure").textContent = `${weather.main.pressure} hPa`;
            document.getElementById("clouds").textContent = `${weather.clouds.all}%`;
            document.getElementById("visibility").textContent = `${(weather.visibility / 1000).toFixed(1)} km`;
            document.querySelector(".city-name").textContent = `Weather in ${weather.name}`;
            document.getElementById("currentIcon").innerHTML = `
            <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="weather icon">`;
        } else {
            alert("City not found. Please try again.");
        }
    }

    document.querySelector(".search-btn").addEventListener("click", async () => { // edit to on submit
        console.log("Search button clicked ✅");

        const city = document.querySelector(".city-input").value.trim();
        if (!city) return;

        const weather = await getCityWeather(city);
        await updateWeatherUI(weather);
        console.log(weather);


    });

    document.querySelector(".city-input").addEventListener("keypress", e => {
        if (e.key === "Enter") document.querySelector(".search-btn").click();
    });

    (async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    let loadCity = await getCityWeather(lat, lon);
                    await updateWeatherUI(loadCity);
                }
            )
        }
        else {
            const cairoWeather = await getCityWeather("Cairo");
            await updateWeatherUI(cairoWeather);
        }
    })();
});

