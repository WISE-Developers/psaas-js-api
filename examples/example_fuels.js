"use strict";
/**
 * An example of retrieving the supported fuel types from
 * PSaaS Builder.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** ignore this comment */
const psaas_js_api_1 = require("psaas-js-api");
let serverConfig = new psaas_js_api_1.defaults.ServerConfiguration();
//initialize the connection settings for PSaaS_Builder
psaas_js_api_1.globals.SocketHelper.initialize(serverConfig.builderAddress, serverConfig.builderPort);
//cache the fuel type defaults
let fuelCache;
(async () => {
    //retrieve the fuel types and their default settings
    fuelCache = await psaas_js_api_1.fbp.FbpCalculations.getFuelsWithDefaultsPromise();
    for (const fuel of fuelCache) {
        console.log(`${fuel.name}: ${fuel.desc}`);
        if (fuel.defaults.useCrownBase)
            console.log(`    Crown Base Height: ${fuel.defaults.crownBase}`);
        if (fuel.defaults.useGrassCuring)
            console.log(`    Percent Curing: ${fuel.defaults.grassCuring}`);
        if (fuel.defaults.useGrassFuelLoad)
            console.log(`    Grass Fuel Load: ${fuel.defaults.grassFuelLoad}`);
        if (fuel.defaults.usePercentConifer)
            console.log(`    Percent Conifer: ${fuel.defaults.percentConifer}`);
        if (fuel.defaults.usePercentDeadFir)
            console.log(`    Percent Dead Fir: ${fuel.defaults.percentDeadFir}`);
    }
})();
//# sourceMappingURL=example_fuels.js.map