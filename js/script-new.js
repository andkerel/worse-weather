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
                url: "http://api.openweathermap.org/data/2.5/group?id=524901,6167865,2028462,1275339,379252,4164138,6185377,3621849&APPID=09ad5a2c662be0b2d499553ff54f4228", 
                dataType: "json"})
            ); 

            //perform actions when all deferred calls are completed
            openWeather.done(function(current, others) {

                $('.loading').css('display', 'none');
                $('.openweather').css('display', 'block');

                //current weather object
                var current = {
                    city: current[0].name,
                    temp: roundTemperature(current[0].main.temp),
                    message: current[0].weather[0].description,
                    iconURL: current[0].weather[0].icon,
                    code: current[0].cod
                }

                //moscow weather object
                var moscow = {
                    city: others[0].list[0].name,
                    temp: roundTemperature(others[0].list[0].main.temp),
                    message: others[0].list[0].weather[0].description,
                    iconURL: others[0].list[0].weather[0].icon,
                    code: others[0].list[0].weather[0].id
                }

                //toronto weather object (at some point I will figure out how to loop through these)
                var toronto = {
                    city: others[0].list[1].name,
                    temp: roundTemperature(others[0].list[1].main.temp),
                    message: others[0].list[1].weather[0].description,
                    iconURL: others[0].list[1].weather[0].icon,
                    code: others[0].list[1].weather[0].id
                }

                //ulaanbaatar weather object
                var ulaan = {
                    city: others[0].list[2].name,
                    temp: roundTemperature(others[0].list[2].main.temp),
                    message: others[0].list[2].weather[0].description,
                    iconURL: others[0].list[2].weather[0].icon,
                    code: others[0].list[2].weather[0].id
                }
                 
                //mumbai weather object
                var mumbai = {
                    city: others[0].list[3].name,
                    temp: roundTemperature(others[0].list[3].main.temp),
                    message: others[0].list[3].weather[0].description,
                    iconURL: others[0].list[3].weather[0].icon,
                    code: others[0].list[3].weather[0].id
                }

                //khartoum weather object
                var khartoum = {
                    city: others[0].list[4].name,
                    temp: roundTemperature(others[0].list[4].main.temp),
                    message: others[0].list[4].weather[0].description,
                    iconURL: others[0].list[4].weather[0].icon,
                    code: others[0].list[4].weather[0].id
                }

                //miami weather object
                var miami = {
                    city: others[0].list[5].name,
                    temp: roundTemperature(others[0].list[5].main.temp),
                    message: others[0].list[5].weather[0].description,
                    iconURL: others[0].list[5].weather[0].icon,
                    code: others[0].list[5].weather[0].id
                }

                //yellowknife weather object
                var yknife = {
                    city: others[0].list[6].name,
                    temp: roundTemperature(others[0].list[6].main.temp),
                    message: others[0].list[6].weather[0].description,
                    iconURL: others[0].list[6].weather[0].icon,
                    code: others[0].list[6].weather[0].id
                }

                //san jose weather object
                var sj = {
                    city: others[0].list[7].name,
                    temp: roundTemperature(others[0].list[7].main.temp),
                    message: others[0].list[7].weather[0].description,
                    iconURL: others[0].list[7].weather[0].icon,
                    code: others[0].list[7].weather[0].id
                }

                //create othercities array
                var othercities = [];
                othercities.push(moscow, toronto, ulaan, mumbai, khartoum, miami, yknife, sj);

                

                weatherData.city.innerHTML = ulaan.city;
                weatherData.message.innerHTML =  moscow.message;
                weatherData.temperature.innerHTML = moscow.temp + weatherData.units;
                $('#weather-icon').css("background-image", "url('http://openweathermap.org/img/w/" + moscow.iconURL + ".png')");

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