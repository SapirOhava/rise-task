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

    widgetDiv.style.display = 'flex';
    widgetDiv.style.flexDirection = 'column';
    widgetDiv.style.border = '1px solid black';
    widgetDiv.style.padding = '20px';
    widgetDiv.style.width = '300px';
    widgetDiv.style.borderRadius = '5px';
    widgetDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter city name';
    input.classList.add('city-input');

    input.style.padding = '10px';
    input.style.fontSize = '1em';
    input.style.marginBottom = '10px';
    input.style.borderRadius = '5px';
    input.style.border = '1px solid #ccc';

    widgetDiv.appendChild(input);

    const button = document.createElement('button');
    button.textContent = 'Get Weather';

    button.style.padding = '10px 20px';
    button.style.fontSize = '1em';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.backgroundColor = '#4CAF50'; // You can choose any color
    button.style.color = 'white';
    button.onmouseover = function () {
      button.style.backgroundColor = '#45a049'; // Darker shade on hover
    };
    button.onmouseout = function () {
      button.style.backgroundColor = '#4CAF50'; // Return to original color on mouse out
    };

    widgetDiv.appendChild(button);

    let weatherDiv = document.createElement('div');
    weatherDiv.classList.add('weather');
    weatherDiv.style.display = 'flex';
    weatherDiv.style.flexDirection = 'row';
    weatherDiv.style.justifyContent = 'space-between';
    // Add this to handle overflow content
    weatherDiv.style.flexWrap = 'wrap';
    // Add some margin at the top for separation
    weatherDiv.style.marginTop = '20px';

    widgetDiv.appendChild(weatherDiv);

    button.onclick = async () => {
      weatherDiv.innerHTML = '';
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

              const API_URL_HISTORICAL = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&hourly=temperature_2m,rain,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,rain_sum,windspeed_10m_max&timezone=${timezone}`;
              const responseHist = await fetch(API_URL_HISTORICAL);
              const dataHist = await responseHist.json();

              const API_URL_FORCAST = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,rain,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,rain_sum,windspeed_10m_max&timezone=${timezone}&past_days=5`;

              const responseForecast = await fetch(API_URL_FORCAST);
              const dataForecast = await responseForecast.json();

              console.log('history: ', dataHist);
              console.log('forecast: ', dataForecast);

              let parsedDailyData = dataHist.daily.time.reduce(
                (acc, time, index) => {
                  acc[time] = {
                    iconCode: dataHist.daily.weathercode[index],
                    dayName: days[new Date(time).getDay()],
                    rainSum: dataHist.daily.rain_sum[index],
                    maxTemp: dataHist.daily.temperature_2m_max[index],
                    minTemp: dataHist.daily.temperature_2m_min[index],
                    windspeed_10m_max: dataHist.daily.windspeed_10m_max[index],
                  };
                  return acc;
                },
                {}
              );

              const avgDailyData = Object.values(parsedDailyData).reduce(
                (acc, cur) => {
                  const dayName = cur.dayName;

                  if (!acc[dayName]) {
                    acc[dayName] = {
                      totalMaxTemp: 0,
                      totalMinTemp: 0,
                      totalRainSum: 0,
                      totalWindSpeed_10m_max: 0,
                      count: 0,
                      avgMaxTemp: 0,
                      avgMinTemp: 0,
                      avgRainSum: 0,
                      avgWindSpeed_10m_max: 0,
                      iconCodes: [],
                    };
                  }

                  acc[dayName].totalMaxTemp += cur.maxTemp;
                  acc[dayName].totalMinTemp += cur.minTemp;
                  acc[dayName].totalRainSum += cur.rainSum;
                  acc[dayName].totalWindSpeed_10m_max += cur.windspeed_10m_max;
                  acc[dayName].count += 1;
                  acc[dayName].avgMaxTemp =
                    acc[dayName].totalMaxTemp / acc[dayName].count;
                  acc[dayName].avgMinTemp =
                    acc[dayName].totalMinTemp / acc[dayName].count;
                  acc[dayName].avgRainSum =
                    acc[dayName].totalRainSum / acc[dayName].count;
                  acc[dayName].avgWindSpeed_10m_max =
                    acc[dayName].totalWindSpeed_10m_max / acc[dayName].count;

                  return acc;
                },
                {}
              );

              console.log('parsedDailyData', parsedDailyData);
              console.log('avgDailyData', avgDailyData);

              Object.keys(avgDailyData).forEach((day) => {
                const dayDiv = document.createElement('div');
                dayDiv.classList.add('day');
                dayDiv.style.flex = '1';

                const dayTitle = document.createElement('h3');
                dayTitle.textContent = `${day}: `;
                dayDiv.appendChild(dayTitle);

                const weatherImg = document.createElement('img');
                weatherImg.src = 'http://openweathermap.org/img/wn/10d@2x.png';
                dayDiv.appendChild(weatherImg);

                const avgMaxTempP = document.createElement('p');
                avgMaxTempP.textContent = `Avg Max Temp: ${avgDailyData[
                  day
                ].avgMaxTemp.toFixed(2)}°C`;
                dayDiv.appendChild(avgMaxTempP);

                const avgMinTempP = document.createElement('p');
                avgMinTempP.textContent = `Avg Min Temp: ${avgDailyData[
                  day
                ].avgMinTemp.toFixed(2)}°C`;
                dayDiv.appendChild(avgMinTempP);

                const avgRainSumP = document.createElement('p');
                avgRainSumP.textContent = `Avg Rain Sum: ${avgDailyData[
                  day
                ].avgRainSum.toFixed(2)}°C`;
                dayDiv.appendChild(avgRainSumP);

                const avgWindSpeed_10m_maxP = document.createElement('p');
                avgWindSpeed_10m_maxP.textContent = `Avg Wind Speed: ${avgDailyData[
                  day
                ].avgWindSpeed_10m_max.toFixed(2)}°C`;
                dayDiv.appendChild(avgWindSpeed_10m_maxP);

                weatherDiv.appendChild(dayDiv);
              });
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
