"use strict";
/**
 * An example of retrieving the supported cities for
 * forecast and current weather lookups.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** ignore this comment */
const psaas_js_api_1 = require("psaas-js-api");
let serverConfig = new psaas_js_api_1.defaults.ServerConfiguration();
//initialize the connection settings for PSaaS_Builder
psaas_js_api_1.globals.SocketHelper.initialize(serverConfig.builderAddress, serverConfig.builderPort);
//cache the returned cities for later use
let forecast_cities;
let weather_cities;
(async () => {
    let weather_province = psaas_js_api_1.globals.Province.NORTHWEST_TERRITORIES; //lookup cities in NWT
    //get a list of cities that can be used for current weather lookups
    weather_cities = await psaas_js_api_1.weather.WeatherCalculator.getCitiesPromise(weather_province);
    //get a list of cities that can be used for forecast lookups
    forecast_cities = await psaas_js_api_1.forecast.ForecastCalculator.getCitiesPromise(weather_province);
    //print up to 10 of the supported cities to the console
    console.log(`Cities supported for current weather lookups in ${weather_province.toUpperCase()}`);
    for (let index = 0; index < weather_cities.length && index < 10; index++) {
        const element = weather_cities[index];
        console.log(`    ${element}`);
    }
    if (weather_cities.length > 10) {
        console.log('    ...');
    }
    //print up to 10 of the supported cities to the console
    console.log(`Cities supported for forecast weather lookups in ${weather_province.toUpperCase()}`);
    for (let index = 0; index < forecast_cities.length && index < 10; index++) {
        const element = forecast_cities[index];
        console.log(`    ${element}`);
    }
    if (forecast_cities.length > 10) {
        console.log('    ...');
    }
})();
//# sourceMappingURL=example_cities.js.map