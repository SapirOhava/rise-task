# Rise Work Solution

## Introduction

I would like to begin by explaining my choice of weather API for this task - Open-Meteo.  
Open-Meteo is an open-source weather API that offers free access for non-commercial use.  
It doesn’t require an API key and provides historical data for free.  
Open-Meteo is user-friendly and equipped with a Geocoding API,  
essential for converting the user-inputted city name into corresponding timezone,  
latitude, and longitude parameters - prerequisites for retrieving historical weather data.

## A Deep Dive into the API’s Functionalities

Open-Meteo provides historical data up to just the last 5 days.  
To gather a more comprehensive data set
, i used a combination of this endpoints :

- **Historical Data Endpoint** provides data up to the last 5 days.
- **Forecast Endpoint** fills in the gap, offering data for the most recent 5 days.

The combination ensures a comprehensive dataset covering an entire month.  
However, there isn’t a direct endpoint to fetch average temperatures,  
requiring me to do the math with the data i got.

## Data Retrieval with Fetch API

The native Fetch API, incorporated in modern browsers,  
is employed for data retrieval negating the need for additional libraries or packages,  
ensuring the script remains lightweight and user-friendly.

## Timezone Handling

Retrieving the current local time specific to the chosen city’s timezone is a challenge as the native  
JavaScript Date object is confined to the user’s local system timezone.  
The solution is the integration of the WorldTimeAPI,  
facilitating the retrieval of the current time according to the specific timezone of the chosen city,  
enabling accurate calculation of dates for the past month.

## Weather Icons Representation

To represent the weather conditions visually,  
I leveraged a [GitHub gist](https://gist.github.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c) that facilitates the conversion of weather icon codes into  
static hosted image URLs corresponding to the appropriate weather conditions.

## Data Parameters

The historical weather data API yields both hourly and daily datasets based on specified parameters.  
For hourly data, parameters include temperature at 2m above ground, rain, weather code  
(determining the icon representation), and wind speed at 10m above ground.

For daily data, parameters extend to weather code, maximum and minimum temperatures at 2m above ground, cumulative rain,  
and maximum wind speed at 10m above ground.

## Average Temperature Calculation

The calculated average temperatures for each day of the week are derived from the average of the daily maximum and minimum temperatures.  
A more precise average temperature utilizing the hourly data is plausible,  
but incorporating both day and night temperatures could potentially skew the accuracy.

## How to Use the Script

To use my script, simply add the following line to your HTML file:

```html
<script src="https://cdn.jsdelivr.net/gh/SapirOhava/rise-task/dynamicWeatherScript.js"></script>
```

Additionally, remember to add a data-div-id attribute followed by the ID of the div where you want the weather information to be displayed , for example:

```html
<script
  src="https://cdn.jsdelivr.net/gh/SapirOhava/rise-task/dynamicWeatherScript.js"
  data-div-id="your-div-id"
></script>
```

Replace "your-div-id" with the actual ID of your target div.

## Easy Embedding with jsDelivr

The script is easily embeddable by hosting it online and allowing users to add it via a script tag using jsDelivr. jsDelivr serves the raw JavaScript file, offering an advantage over the GitHub repository URL. This makes integrating the weather script into any webpage seamless and user-friendly, requiring only a single line of code.
