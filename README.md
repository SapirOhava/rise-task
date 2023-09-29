# Rise Work Solution

i want to start by expain that i chose this api - https://api.open-meteo.com
Open-Meteo is an open-source weather API and offers free access for non-commercial use. No API key is required. You can use it immediately
its gives mt historical data for free ( which is not that easy to find ) ,very user friendly,and give you the Geocoding API the thing is that it gives you the historical data up to the last 5 days ( in this endpoint - https://archive-api.open-meteo.com/v1/archive?latitude=52.52&longitude=13.41&start_date=2023-09-08&end_date=2023-09-22&hourly=temperature_2m)
and to get the last 5 days data i need to fetch it from this endpoint - https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m) and also
there isn't a direct endpoint to retrieve the average temperature for each day of the last month. However, you can achieve this by making requests to retrieve historical weather data and then calculate the average temperature for each day from the retrieved data.

i need to also pass to my script (latidude,longtitudod, timezone)
the lat and long are converted from the city and i also pass the timezone ( because in this api i have to sand the timezone differently it doesnt convert us the correct timezone by the long and lat)
and i do want the dates to be in my current timezone

this is the hourly params:
the tempartuere is obius
precipitation
weather code ( is how the icon will look like)
i can also get the wind speed ( at wind speed 10 m)

this is the daily params:
weather code ( is how the icon will look like)
// we dont have the actual current temp
// so im just gonna use the max temp for this day(max temp 2m)
ill also take the min temp
preceipitation sum
max min wind speed

to fetch the data from the weather api - i use the fetch API, which is natively available in modern browsers, to make the requests.
that who ever use this script won't need to download any additional libraries.
