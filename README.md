# Rise Work Solution

i want to start by expain that i chose this api - https://api.open-meteo.com
Open-Meteo is an open-source weather API and offers free access for non-commercial use. No API key is required. You can use it immediately

its gives the historical data for free ( which is not that easy to find ) ,
very user friendly, and give you also a Geocoding API ,
the thing is that it gives you the historical data up to the last 5 days
( in this endpoint - https://archive-api.open-meteo.com/v1/archive?latitude=52.52&longitude=13.41&start_date=2023-09-08&end_date=2023-09-22&hourly=temperature_2m)
and to get the last 5 days data i need to fetch it from this endpoint - (https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m)
and also there isn't a direct endpoint to retrieve the average temperature for each day of the last month. However, you can achieve this by making requests to retrieve historical weather data and then calculate the average temperature for each day from the retrieved data.

i need to also pass to open-meteo api (latidude, longtitudod, timezone)
i use the geocoding api that is also in this site , to convert from the city the user inserts to the input field.

this is the hourly params:
temperature,precipitation,weather code ( is how the icon will look like),i can also get the wind speed ( at wind speed 10 m)

this is the daily params:
weather code ( is how the icon will look like)
// we don't have the actual current temp
// so im just gonna use the max temp for this day(max temp 2m)
ill also take the min temp
precipitation sum
max min wind speed

to fetch the data from the weather api - i use the fetch API, which is natively available in modern browsers, to make the requests. that who ever use this script won't need to download any additional libraries.

also i use this api (worldtimeapi.org api) to get the current time in the specific timezone of the city the user chose ( to calculate the last month dates , and because the native ) because i can't directly get the current local date in a specific timezone using the native JavaScript Date object. The JavaScript Date object is based on the user's local system's timezone
