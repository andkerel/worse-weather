//config

var weatherData = {
  city: document.querySelector("#city-name"),
  weather: document.querySelector("#weather"),
  temperature: document.querySelector("#temperature"),
  message: document.querySelector('#message'),
  // icon: document.querySelector('#weather-icon'),
  temperatureValue: 0,
  units: "°C"
};

function roundTemperature(kelvin){
    celsius = kelvin - 273;
    temperature = +celsius.toFixed(2);
    return temperature;
}

function switchUnits(){
  if (weatherData.units == "°C"){
    weatherData.temperatureValue = roundTemperature(weatherData.temperatureValue * 9/5 + 32);
    weatherData.units = "°F";
  }
  else{
    weatherData.temperatureValue = roundTemperature((weatherData.temperatureValue -  32) * 5/9);
    weatherData.units = "°C";
  }

  weatherData.temperature.innerHTML = weatherData.temperatureValue + weatherData.units + ", ";      
}

function getWeather() {
    $(document).ready(function() {
        var openWeather = $.ajax({
            type:"GET", 
            url: "http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=09ad5a2c662be0b2d499553ff54f4228", 
            dataType: "json"});
            // options: {type: "POST", url: url, data: dataObject}
            openWeather.done(function(data) {

                $('.loading').css('display', 'none');
                $('.openweather').css('display', 'block');

                var cityName = data.name;
                var tempK = roundTemperature(data.main.temp);
                var message = data.weather[0].description;
                var iconURL = data.weather[0].icon;
                var code = data.cod;

                weatherData.temperatureValue = tempK;

                weatherData.city.innerHTML = cityName;
                weatherData.message.innerHTML =  message;
                weatherData.temperature.innerHTML = tempK + weatherData.units;
                $('#weather-icon').css("background-image", "url('http://openweathermap.org/img/w/" + iconURL + ".png')");
                console.log(iconURL);

            });

            openWeather.fail(function(data) {
                console.log("ERROR: Unable to fetch the location and weather data.");
            });
            openWeather.always(function(data) {
                console.log("From the AJAX Request");
            });
    });
}

getWeather();