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


async function fetchAirtableRecords(baseId, tableName, opts = {}) {
    // const apiKey = process.env.AIRTABLE_API_KEY;
    const apiKey = 'patFXNmF6UrEpevQ4.dc506d310149c167406aed36856a8bc93cfa98706d61c61156388b04576d1ed1';

    if (!apiKey) {
        throw new Error('Brak klucza API: ustaw zmienną środowiskową AIRTABLE_API_KEY');
    };

    const endpoint = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    };

    const params = new URLSearchParams();
    if (opts.view) params.append('view', opts.view);
    if (opts.pageSize) params.append('pageSize', opts.pageSize);
    if (opts.filterByFormula) params.append('filterByFormula', opts.filterByFormula);


    let allRecords = [];
    let offset;

    try {
        do {
            if (offset) params.set('offset', offset);
            const url = `${endpoint}?${params.toString()}`;

            const response = await fetch(url, { headers });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(`Airtable API error ${response.status}: ${err.error?.message || response.statusText}`);
            }

            const data = await response.json();
            allRecords = allRecords.concat(data.records);
            console.log(allRecords)
            offset = data.offset;
        } while (offset);

        return allRecords;
    } catch (error) {
        console.error('fetchAirtableRecords error:', error);
        throw error;
    }
}

async function carsArea() {
    try {
        const carsArray = await fetchAirtableRecords(
            'apprFJC08idk5Qg0Z',
            'cars',
            { view: 'cars - all', pageSize: 50 }
        )

        console.log(`Pobrano ${carsArray.length} rekordów:`);
        const carsData = []
        carsArray.forEach((car, index) => {
            console.log(`Car ${index}: ${JSON.stringify(car.fields)}`);
            carsData.push(car.fields)
        });

        console.log(carsData)
        return carsData

    } catch (err) {
        console.error('Błąd podczas pobierania danych z Airtable:', err);
    }
}

carsData = carsArea()
