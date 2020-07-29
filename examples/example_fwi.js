"use strict";
/**
 * An example of calculating FWI values.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** ignore this comment */
const psaas_js_api_1 = require("psaas-js-api");
let serverConfig = new psaas_js_api_1.defaults.ServerConfiguration();
//initialize the connection settings for PSaaS_Builder
psaas_js_api_1.globals.SocketHelper.initialize(serverConfig.builderAddress, serverConfig.builderPort);
//an example FWI calculation
(async () => {
    //populate the FWI calculator with example values
    let fwi = new psaas_js_api_1.fwi.FwiCalculations();
    fwi.date = "2014-10-4 12:18:00";
    fwi.dst = 1;
    fwi.location = new psaas_js_api_1.globals.LatLon(49.78, -97.15);
    fwi.noonTemp = 8.0;
    fwi.noonRh = 44;
    fwi.noonPrecip = 0;
    fwi.noonWindSpeed = 18.0;
    fwi.hourlyMethod = psaas_js_api_1.fwi.FWICalculationMethod.VAN_WAGNER;
    fwi.temp = 5;
    fwi.rh = 53;
    fwi.precip = 0;
    fwi.windSpeed = 10;
    fwi.prevHourFFMC = 85.0;
    fwi.ystrdyFFMC = 85.0;
    fwi.ystrdyDMC = 25.0;
    fwi.ystrdyDC = 200.0;
    await fwi.FWICalculateDailyStatisticsPromise();
    console.log("FWI Calculation");
    console.log("Input values:");
    console.log(`    Date:                      ${fwi.date}`);
    console.log(`    DST:                       ${fwi.dst == 1 ? 'Yes' : 'No'}`);
    console.log(`    Location:                  (${fwi.location.latitude}, ${fwi.location.longitude})`);
    console.log(`    Noon Temperature:          ${fwi.noonTemp}\xb0C`);
    console.log(`    Noon RH:                   ${fwi.noonRh}%`);
    console.log(`    Noon Precipitation:        ${fwi.noonPrecip}mm`);
    console.log(`    Noon Wind Speed:           ${fwi.noonWindSpeed}km/h`);
    console.log(`    Hourly Calculation Method: ${psaas_js_api_1.fwi.FWICalculationMethod[fwi.hourlyMethod]}`); //output the value as a string instead of its integer representation
    console.log(`    Hourly Temperature:        ${fwi.temp}\xb0C`);
    console.log(`    Hourly RH:                 ${fwi.rh}%`);
    console.log(`    Hourly Precipitation:      ${fwi.precip}mm`);
    console.log(`    Hourly Wind Speed:         ${fwi.windSpeed}km/h`);
    console.log(`    Previous Hour FFMC:        ${fwi.prevHourFFMC}`);
    console.log(`    Yesterday FFMC:            ${fwi.ystrdyFFMC}`);
    console.log(`    Yesterday DMC:             ${fwi.ystrdyDMC}`);
    console.log(`    Yesterday DC:              ${fwi.ystrdyDC}`);
    console.log("Output values:");
    console.log(`    Daily FFMC:                ${fwi.calc_dailyFfmc}`);
    console.log(`    Daily DMC:                 ${fwi.calc_dailyDmc}`);
    console.log(`    Daily DC:                  ${fwi.calc_dailyDc}`);
    console.log(`    Daily ISI:                 ${fwi.calc_dailyIsi}`);
    console.log(`    Daily BUI:                 ${fwi.calc_dailyBui}`);
    console.log(`    Daily FWI:                 ${fwi.calc_dailyFwi}`);
    console.log(`    Daily DSR:                 ${fwi.calc_dailyDsr}`);
    console.log(`    Hourly FFMC:               ${fwi.calc_hourlyFfmc}`);
    console.log(`    Hourly ISI:                ${fwi.calc_hourlyIsi}`);
    console.log(`    Hourly FWI:                ${fwi.calc_hourlyFwi}`);
})();
//# sourceMappingURL=example_fwi.js.map