async function start() {
    const weatherPromise = await fetch("https://api.open-meteo.com/v1/forecast?latitude=49.68233&longitude=21.76607&hourly=temperature_2m,relativehumidity_2m,precipitation,windspeed_10m,weathercode")
    const weatherData = await weatherPromise.json()
    // const ourTemperature = weatherData.properties.periods[0].temperature

    const currentHourISO = new Date().toISOString().slice(0, 13) + ":00"; // "YYYY-MM-DDTHH:00"
    const idx = weatherData.hourly.time.indexOf(currentHourISO);

    if (idx === -1) throw new Error("Brak danych dla bieżącej godziny");

    const ourTemperature = weatherData.hourly.temperature_2m[idx];
    console.log(ourTemperature)

    document.querySelector("#temprature-output").textContent = ourTemperature
}

start()

// Kalendarz wykonywania misji:
// status misji w trakcie, ukonczona, chexcboxy do wykonałem, nie wykonałem, nie dzisiaj.
// Krosno:
// 49.68233 21.76607
// https://api.weather.gov/points/49.68233,21.76607
// https://api.weather.gov/gridpoints/MFL/110,50/forecast
