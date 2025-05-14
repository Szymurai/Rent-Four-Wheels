async function start() {
    const weatherPromise = await fetch("https://api.weather.gov/gridpoints/MFL/110,50/forecast")
    const weatherData = await weatherPromise.json()
    const ourTemperature = weatherData.properties.periods[0].temperature
    console.log(ourTemperature)
}

start()

// Kalendarz wykonywania misji:
// status misji w trakcie, ukonczona, chexcboxy do wykonałem, nie wykonałem, nie dzisiaj.
// Krosno:
// 49.68233 21.76607
// https://api.weather.gov/points/49.68233,21.76607
// https://api.weather.gov/gridpoints/MFL/110,50/forecast
