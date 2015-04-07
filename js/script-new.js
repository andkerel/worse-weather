//config

var weatherData = {
  city: document.querySelector("#city-name"),
  weather: document.querySelector("#weather"),
  temperature: document.querySelector("#temperature"),
  message: document.querySelector('#message'),
  temperatureValue: 0,
  units: "°C"
};

var ifErrorDisplayBox = document.querySelector('#display-panel')

// Does this browser support geolocation?
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
}
else{
    showError("Your browser does not support Geolocation!");
    ifErrorDisplayBox.innerHTML = "Please access this app on a browser that supports geolocation. Thanks!"
    
}

//geolocation support activated
function locationSuccess(position) {
    var currentLat = position.coords.latitude.toFixed(2);
    var currentLong = position.coords.longitude.toFixed(2);

    console.log(currentLat + " " + currentLong);


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

            var openWeather = $.when(
                // GET current position weather
                $.ajax({
                type:"GET", 
                url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + currentLat + '&lon=' + currentLong +'&APPID=09ad5a2c662be0b2d499553ff54f4228', 
                dataType: "json"}),

                //GET weather for others: moscow, toronto, ulaanbaatar, mumbai, khartoum, miami, yellowknife, san jose (costa rica)
                $.ajax({
                type:"GET", 
                url: "http://api.openweathermap.org/data/2.5/group?id=524901,6167865,2028462,1275339,379252,4164138,6185377,3669557&APPID=09ad5a2c662be0b2d499553ff54f4228", 
                dataType: "json"})
            ); 

            //perform actions when all deferred calls are completed
            openWeather.done(function(current, others) {

                $('.loading').css('display', 'none');
                $('.openweather').css('display', 'block');

                var current = {
                    city: current[0].name,
                    temp: roundTemperature(current[0].main.temp),
                    message: current[0].weather[0].description,
                    iconURL: current[0].weather[0].icon,
                    code: current[0].cod
                }

                $.each(others.list, function(key, value)) {
                    
                }

                var others = {

                }

                // weatherData.temperatureValue = tempK;

                weatherData.city.innerHTML = current.city;
                weatherData.message.innerHTML =  current.message;
                weatherData.temperature.innerHTML = current.temp + weatherData.units;
                $('#weather-icon').css("background-image", "url('http://openweathermap.org/img/w/" + current.iconURL + ".png')");

            });

            openWeather.fail(function(data) {
                console.log("ERROR: Unable to fetch the location and weather data.");
            });
            openWeather.always(function(data) {
                console.log("ajax follower");
            });
        });
    }

    getWeather();

}




function locationError(error){
    switch(error.code) {
        case error.TIMEOUT:
            showError("A timeout occured! Please try again!");
            break;
        case error.POSITION_UNAVAILABLE:
            showError('We can\'t detect your location. Sorry!');
            break;
        case error.PERMISSION_DENIED:
            showError('Please allow geolocation access for this to work.');
            break;
        case error.UNKNOWN_ERROR:
            showError('An unknown error occured!');
            break;
    }

}