"use strict";
/**
 * An example of calculating FWI values.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** ignore this comment */
const psaas_js_api_1 = require("psaas-js-api");
const luxon_1 = require("luxon");
let serverConfig = new psaas_js_api_1.defaults.ServerConfiguration();
//initialize the connection settings for PSaaS_Builder
psaas_js_api_1.globals.SocketHelper.initialize(serverConfig.builderAddress, serverConfig.builderPort);
(async () => {
    //get the current weather conditions for Enterprise NT
    let weatherCalculator = new psaas_js_api_1.weather.WeatherCalculator();
    weatherCalculator.province = psaas_js_api_1.globals.Province.NORTHWEST_TERRITORIES;
    weatherCalculator.city = "Enterprise";
    await weatherCalculator.fetchWeatherPromise();
    console.log(`The current conditions in Enterprise, NT`);
    console.log(`    Temperature:    ${weatherCalculator.temperature}\xb0C`);
    console.log(`    Humidity:       ${weatherCalculator.humidity}%`);
    console.log(`    Wind Direction: ${weatherCalculator.windDirection}\xb0`);
    console.log(`    Wind Speed:     ${weatherCalculator.windSpeed}km/h`);
    //get the forecast conditions for Enterprise NT
    let forecastCalculator = new psaas_js_api_1.forecast.ForecastCalculator();
    forecastCalculator.province = psaas_js_api_1.globals.Province.NORTHWEST_TERRITORIES;
    forecastCalculator.city = "Inuvik";
    forecastCalculator.model = "GEM"; // can also be NCEP, GEM_DETER, or CUSTOM (requires you to set the model IDs you want to use)
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    forecastCalculator.date = luxon_1.DateTime.local().toISODate();
    forecastCalculator.timezone = 25; //hard coded to CDT, see example_timezone.js for an example getting the IDs
    forecastCalculator.time = "00Z"; //needs to be either 00Z for the midnight forecast or 12Z for the noon forecast
    forecastCalculator.forecastType = "hour"; //can also be day for daily forecast
    await forecastCalculator.fetchForecastPromise();
    console.log(`The first forecast hour for Inuvik, NT on ${forecastCalculator.date}:`);
    if (forecastCalculator.results && forecastCalculator.results.length > 0) {
        let forecast = forecastCalculator.results[0];
        console.log(`    Temperature:    ${forecast.temperature}\xb0C`);
        console.log(`    Precipitation:  ${forecast.precipitation}mm`);
        console.log(`    RH:             ${forecast.relativeHumidity}%`);
        console.log(`    Wind Direction: ${forecast.windDirection}\xb0`);
        console.log(`    Wind Speed:     ${forecast.windSpeed}km/h`);
    }
    else {
        console.log('    No forecast was found');
    }
})();
//# sourceMappingURL=example_weather.js.map