"use strict";
/**
 * An example of calculating solar times.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** ignore this comment */
const psaas_js_api_1 = require("psaas-js-api");
let serverConfig = new psaas_js_api_1.defaults.ServerConfiguration();
//initialize the connection settings for PSaaS_Builder
psaas_js_api_1.globals.SocketHelper.initialize(serverConfig.builderAddress, serverConfig.builderPort);
(async () => {
    let solarCalculator = new psaas_js_api_1.solar.SolarCalculator();
    solarCalculator.latitude = 49.78;
    solarCalculator.longitude = -97.15;
    solarCalculator.timezone = 25; //hard coded to CDT, see example_timezone.js for an example getting the IDs
    let date = new Date(); //get the current date
    solarCalculator.year = date.getFullYear();
    solarCalculator.month = date.getMonth() + 1;
    solarCalculator.day = date.getDate();
    await solarCalculator.fetchSolarPromise();
    console.log(`Solar times for (${solarCalculator.latitude}, ${solarCalculator.longitude}) on ${date.toLocaleDateString()}`);
    console.log(`    Sunrise:    ${solarCalculator.sunrise}`);
    console.log(`    Solar Noon: ${solarCalculator.noon}`);
    console.log(`    Sunset:     ${solarCalculator.sunset}`);
})();
//# sourceMappingURL=example_solar.js.map