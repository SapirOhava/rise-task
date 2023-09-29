function insertWeatherDiv(parentDivId) {
  try {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const parentElement = parentDivId
      ? document.getElementById(parentDivId)
      : document.body;

    if (!parentElement) {
      console.error(`Element with ID ${parentDivId} not found.`);
      return;
    }

    const widgetDiv = document.createElement('div');
    widgetDiv.classList.add('widget');

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter city name';
    input.classList.add('city-input');
    widgetDiv.appendChild(input);

    const button = document.createElement('button');
    button.textContent = 'Get Weather';
    widgetDiv.appendChild(button);

    const weatherDiv = document.createElement('div');
    weatherDiv.classList.add('weather');
    widgetDiv.appendChild(weatherDiv);

    button.onclick = async () => {
      const cityName = input.value.trim();

      if (cityName) {
        try {
          // im calling this geocoding api to get the timezone , latitude and latitude according to the city
          const GEOCODING_API = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`;
          const responseGeo = await fetch(GEOCODING_API);
          const dataGeo = await responseGeo.json();

          if (dataGeo && dataGeo.results && dataGeo.results[0]) {
            const timezone = dataGeo.results[0].timezone;
            const latitude = dataGeo.results[0].latitude;
            const longitude = dataGeo.results[0].longitude;

            // im using this free public ( without the need of api keys) to get the local time of the given timezone
            const TIME_API = `http://worldtimeapi.org/api/timezone/${timezone}`;
            const responseTime = await fetch(TIME_API);
            const dataTime = await responseTime.json();

            console.log('worldtimeeeeeeeeeeee resss: ', dataTime);

            if (dataTime && dataTime.datetime) {
              const today = new Date(dataTime.datetime);

              const lastMonthLastDay = new Date(
                today.getFullYear(),
                today.getMonth(),
                0
              );
              const lastMonthFirstDay = new Date(
                today.getFullYear(),
                today.getMonth() - 1,
                1
              );

              const formatDate = (date) => {
                const options = {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                };
                return date.toLocaleDateString('en-CA', options);
              };

              const startDate = formatDate(lastMonthFirstDay);
              const endDate = formatDate(lastMonthLastDay);

              const API_URL_HISTORICAL = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&hourly=temperature_2m,precipitation,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=${timezone}`;

              const responseHist = await fetch(API_URL_HISTORICAL);
              const dataHist = await responseHist.json();

              const API_URL_FORCAST = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=${timezone}&past_days=5`;
              const responseForecast = await fetch(API_URL_FORCAST);
              const dataForecast = await responseForecast.json();

              console.log('history: ', dataHist);
              console.log('forecast: ', dataForecast);

              let parsedDailyData = dataHist.daily.time.map((time, index) => {
                return {
                  timestamp: time,
                  iconCode: dataHist.daily.weathercode[index],
                  precipitationSum: dataHist.daily.precipitation_sum[index],
                  maxTemp: dataHist.daily.temperature_2m_max[index],
                  minTemp: dataHist.daily.temperature_2m_min[index],
                };
              });

              let parsedHourlyData = dataHist.hourly.time.map((time, index) => {
                return {
                  timestamp: time,
                  iconCode: dataHist.hourly.weathercode[index],
                  precipitation: dataHist.hourly.precipitation[index],
                  temperature_2m: dataHist.hourly.temperature_2m[index],
                };
              });

              console.log('parsedDailyData', parsedDailyData);
              console.log('parsedHourlyData', parsedHourlyData);
            } else {
              console.error('Failed to fetch the current time.');
            }
          } else {
            console.error('City not found.');
          }
        } catch (error) {
          console.error('Failed to fetch weather data.', error);
        }
      } else {
        console.error('Please enter a city name.');
      }
    };

    days.forEach((day) => {
      const dayDiv = document.createElement('div');
      dayDiv.classList.add('day');
      dayDiv.textContent = `${day}: ${Math.floor(Math.random() * 30)}°C`;
      weatherDiv.appendChild(dayDiv);
    });

    parentElement.appendChild(widgetDiv);
  } catch (error) {
    console.error(
      'An error occurred while creating the weather widget.',
      error
    );
  }
}

const scriptTag = document.currentScript;
const parentDivId = scriptTag.getAttribute('data-div-id');
insertWeatherDiv(parentDivId);
