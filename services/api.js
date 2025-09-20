const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "";
async function getCityWeather(city) {
    try {
        let result = await fetch(`${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
        const data = await result.json();
        return data;
    }
    catch (e) {
        console.error(e.message)
        return null;
    }
}