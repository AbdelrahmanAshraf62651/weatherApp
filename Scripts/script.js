document.addEventListener("DOMContentLoaded", () => {
    function showAlert(message, type = "danger") {
        const oldAlert = document.querySelector(".alert");
        if (oldAlert) oldAlert.remove();
        const alert = document.createElement("div");
        alert.className = `alert alert-${type} alert-dismissible fade show position-fixed start-50 top-50 translate-middle`;
        alert.style.zIndex = "1050";
        alert.style.minWidth = "320px";
        alert.style.textAlign = "center";
        alert.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
        alert.style.padding = "1rem 1.25rem";
        alert.style.borderRadius = "0.5rem";

        alert.role = "alert";
        alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 2000);
    }

    async function updateWeatherUI(weather) {
        if (weather && weather.cod === 200) {
            const iconCode = weather.weather[0].icon;
            const utcTime = Date.now() + new Date().getTimezoneOffset() * 60000;
            const localTime = new Date(utcTime + weather.timezone * 1000);
            const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
            document.getElementById("currentDate").textContent = localTime.toLocaleDateString(undefined, options);
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
            showAlert("City not found. Please try again.");

        }
    }

    document.querySelector(".search-container").addEventListener("submit", async (e) => {
        e.preventDefault();
        const city = document.querySelector(".city-input").value.trim();
        if (!city) return;
        const weather = await getCityWeather(city);
        await updateWeatherUI(weather);
        console.log(weather);
    });

    (async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    let loadCity = await getLoadCityWeather(lat, lon);
                    await updateWeatherUI(loadCity);
                },
                async (error) => {
                    const cairoWeather = await getCityWeather("Cairo");
                    await updateWeatherUI(cairoWeather);
                }
            );
        } else {
            const cairoWeather = await getCityWeather("Cairo");
            await updateWeatherUI(cairoWeather);
        }
    })();

});

