const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "a5367d491aee588e328e79274092be4f";

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

async function getLoadCityWeather(lat, lon) {
    try {
        let result = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await result.json();
        return data;
    }
    catch (e) {
        console.error(e.message)
        return null;
    }
}