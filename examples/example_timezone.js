"use strict";
/**
 * An example of retrieving the known timezone values.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** ignore this comment */
const psaas_js_api_1 = require("psaas-js-api");
let serverConfig = new psaas_js_api_1.defaults.ServerConfiguration();
//initialize the connection settings for PSaaS_Builder
psaas_js_api_1.globals.SocketHelper.initialize(serverConfig.builderAddress, serverConfig.builderPort);
let zoneCache = null;
//get the list of supported timezones
(async () => {
    zoneCache = await psaas_js_api_1.globals.Timezone.getTimezoneNameListPromise();
    for (const zone of zoneCache) {
        console.log(zone.name + " has a reference Id of " + zone.value);
    }
})();
//# sourceMappingURL=example_timezone.js.map