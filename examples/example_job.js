"use strict";
/**
 * An example that creates and runs a job through PSaaS Builder.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** ignore this comment */
const fs = require("fs");
const psaas_js_api_1 = require("psaas-js-api");
const luxon_1 = require("luxon");
const semver = require("semver");
let serverConfig = new psaas_js_api_1.defaults.ServerConfiguration();
//initialize the connection settings for PSaaS_Builder
psaas_js_api_1.globals.SocketHelper.initialize(serverConfig.builderAddress, serverConfig.builderPort);
//turn on debug messages
psaas_js_api_1.globals.PSaaSLogger.getInstance().setLogLevel(psaas_js_api_1.globals.PSaaSLogLevel.DEBUG);
//set the default MQTT broker to use when listening for PSaaS events
psaas_js_api_1.client.JobManager.setDefaults({
    host: serverConfig.mqttAddress,
    port: serverConfig.mqttPort,
    topic: serverConfig.mqttTopic,
    username: serverConfig.mqttUsername,
    password: serverConfig.mqttPassword
});
//uncomment this line for exceptions to be thrown when invalid values are set
//psaas_js_api_1.globals.SocketMsg.inlineThrowOnError = true;
//the directory of the test files
let localDir = serverConfig.exampleDirectory;
//the version of the example data to use
let psaasVersion = '6.2.6.0';
//make sure the local directory has been configured
if (localDir.includes('@JOBS@')) {
    console.log("The job directory has not been configured. Please edit the job directory before running the example server.");
    process.exit();
}
/**
 * Async
 * @param t The timeout in milliseconds
 * @param callback The function that will be called when the delay is up.
 */
function delay(t) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, t);
    });
}
/**
 * Recursively handle nodes of the validation tree and
 * print relevant ones to the console.
 * @param node The node of the validation tree to handle.
 */
function handleErrorNode(node) {
    //leaf node
    if (node.children.length == 0) {
        console.error(`'${node.getValue()}' is invalid for '${node.propertyName}': "${node.message}"`);
    }
    //branch node
    else {
        node.children.forEach(child => {
            handleErrorNode(child);
        });
    }
}
//an asynchronous function for creating a job and listening for status messages.
(async function () {
    //fetch the default settings for some parameters from PSaaS Builder
    let jDefaults = await new psaas_js_api_1.defaults.JobDefaults().getDefaultsPromise();
    psaas_js_api_1.globals.PSaaSLogger.getInstance().info('Building Prometheus job.');
    //set this to the location of the test files folder.
    let prom = new psaas_js_api_1.psaas.PSaaS();
    //add the projection and elevation files as attachments
    let projContents = fs.readFileSync(localDir + psaasVersion + '/test/elevation.prj', "utf8");
    let elevContents = fs.readFileSync(localDir + psaasVersion + '/test/elevation.asc', "utf8");
    let projAttachment = prom.addAttachment('elevation.prj', projContents);
    let elevAttachment = prom.addAttachment('elevation.asc', elevContents);
    if (!projAttachment || !elevAttachment) {
        throw Error("Cannot add attachment");
    }
    prom.setProjectionFile('' + projAttachment);
    prom.setElevationFile('' + elevAttachment);
    //add the rest of the files as paths to locations on disk
    prom.setFuelmapFile(localDir + psaasVersion + '/test/fbp_fuel_type.asc');
    prom.setLutFile(localDir + psaasVersion + '/test/fbp_lookup_table.lut');
    prom.setTimezoneByValue(25); //hard coded to CDT, see example_timezone.js for an example getting the IDs
    let degree_curing = prom.addGridFile(localDir + psaasVersion + '/test/degree_of_curing.asc', localDir + psaasVersion + '/test/degree_of_curing.prj', psaas_js_api_1.psaas.GridFileType.DEGREE_CURING);
    let fuel_patch = prom.addLandscapeFuelPatch("O-1a Matted Grass", "O-1b Standing Grass");
    let gravel_road = prom.addFileFuelBreak(localDir + psaasVersion + '/test/access_gravel_road.kmz');
    gravel_road.setName("Gravel Road");
    let unimproved_road = prom.addFileFuelBreak(localDir + psaasVersion + '/test/access_unimproved_road.kmz');
    unimproved_road.setName("Unimproved Road");
    let river = prom.addFileFuelBreak(localDir + psaasVersion + '/test/hydrology_river.kmz');
    river.setName("Rivers");
    let stream = prom.addFileFuelBreak(localDir + psaasVersion + '/test/hydrology_stream.kmz');
    stream.setName("Streams");
    let ws = prom.addWeatherStation(1483.0, new psaas_js_api_1.globals.LatLon(51.654700, -115.361700));
    let b3Yaha = ws.addWeatherStream(localDir + psaasVersion + '/test/weather_B3_hourly_Sep25toOct30_2001.txt', 94.0, 17, psaas_js_api_1.psaas.HFFMCMethod.LAWSON, 89.0, 58.0, 482.0, 0.0, luxon_1.DateTime.fromISO("2001-09-25"), luxon_1.DateTime.fromISO("2001-10-30"));
    let wpatch = prom.addLandscapeWeatherPatch(luxon_1.DateTime.fromISO("2001-10-16T13:00:00-05:00"), psaas_js_api_1.globals.Duration.createTime(13, 0, 0, false), luxon_1.DateTime.fromISO("2001-10-16T21:00:00-05:00"), psaas_js_api_1.globals.Duration.createTime(21, 0, 0, false));
    wpatch.setWindDirOperation(psaas_js_api_1.psaas.WeatherPatchOperation.PLUS, 10);
    wpatch.setRhOperation(psaas_js_api_1.psaas.WeatherPatchOperation.PLUS, 5);
    let wpatch2 = prom.addFileWeatherPatch(localDir + psaasVersion + '/test/weather_patch_wd270.kmz', luxon_1.DateTime.fromISO("2001-10-16T13:00:00-05:00"), psaas_js_api_1.globals.Duration.createTime(13, 0, 0, false), luxon_1.DateTime.fromISO("2001-10-16T21:00:00-05:00"), psaas_js_api_1.globals.Duration.createTime(21, 0, 0, false));
    wpatch2.setWindDirOperation(psaas_js_api_1.psaas.WeatherPatchOperation.EQUAL, 270);
    //create the ignition points
    let ll1 = new psaas_js_api_1.globals.LatLon(51.65287648142513, -115.4779078053444);
    let ig3 = prom.addPointIgnition(ll1, luxon_1.DateTime.fromISO('2001-10-16T13:00:00-05:00'));
    let ll2 = new psaas_js_api_1.globals.LatLon(51.66090499909746, -115.4086430000001);
    let ig4 = prom.addPointIgnition(ll2, luxon_1.DateTime.fromISO('2001-10-16T16:00:00-05:00'));
    //emit some statistics at the end of timesteps
    prom.timestepSettings.addStatistic(psaas_js_api_1.globals.GlobalStatistics.TOTAL_BURN_AREA);
    prom.timestepSettings.addStatistic(psaas_js_api_1.globals.GlobalStatistics.DATE_TIME);
    prom.timestepSettings.addStatistic(psaas_js_api_1.globals.GlobalStatistics.SCENARIO_NAME);
    //create a scenario
    let scen1 = prom.addScenario(luxon_1.DateTime.fromISO('2001-10-16T13:00:00-05:00'), luxon_1.DateTime.fromISO('2001-10-16T22:00:00-05:00'));
    scen1.setName('scen0');
    scen1.addBurningCondition(luxon_1.DateTime.fromISO('2001-10-16'), 0, 24, 19, 0.0, 95.0, 0.0);
    scen1.setFgmOptions(psaas_js_api_1.globals.Duration.createTime(0, 2, 0, false), 1.0, 1.0, 1.0, false, true, true, true, false, true, 50.0);
    //optionally set dx, dy, and dt
    scen1.setProbabilisticValues(1.0, 1.0, psaas_js_api_1.globals.Duration.createTime(0, 0, 10, false));
    scen1.setFbpOptions(true, true);
    scen1.setFmcOptions(-1, 0.0, true, false);
    scen1.setFwiOptions(false, true, false, false, false);
    scen1.addIgnitionReference(ig3);
    scen1.addIgnitionReference(ig4);
    scen1.addWeatherStreamReference(b3Yaha);
    scen1.addFuelPatchReference(fuel_patch, 0);
    scen1.addGridFileReference(degree_curing, 1);
    scen1.addWeatherPatchReference(wpatch, 3);
    scen1.addWeatherPatchReference(wpatch2, 2);
    let ovf1 = prom.addOutputVectorFileToScenario(psaas_js_api_1.psaas.VectorFileType.KML, 'scen0/perim.kml', luxon_1.DateTime.fromISO('2001-10-16T13:00:00-05:00'), luxon_1.DateTime.fromISO('2001-10-16T22:00:00-05:00'), scen1);
    ovf1.mergeContact = true;
    ovf1.multPerim = true;
    ovf1.removeIslands = true;
    ovf1.metadata = jDefaults.metadataDefaults;
    let ogf1 = prom.addOutputGridFileToScenario(psaas_js_api_1.globals.GlobalStatistics.TEMPERATURE, 'scen0/temp.txt', luxon_1.DateTime.fromISO('2001-10-16T21:00:00-05:00'), psaas_js_api_1.psaas.Output_GridFileInterpolation.IDW, scen1);
    let ogf2 = prom.addOutputGridFileToScenario(psaas_js_api_1.globals.GlobalStatistics.BURN_GRID, "scen0/burn_grid.tif", luxon_1.DateTime.fromISO('2001-10-16T22:00:00-05:00'), psaas_js_api_1.psaas.Output_GridFileInterpolation.IDW, scen1);
    //allow the file to be streamed to a remote location after it is written (ex. streamOutputToMqtt, streamOutputToGeoServer).
    ogf2.shouldStream = true;
    let osf1 = prom.addOutputSummaryFileToScenario(scen1, 'scen0/summary.txt');
    osf1.outputs.outputApplication = true;
    osf1.outputs.outputFBP = true;
    osf1.outputs.outputFBPPatches = true;
    osf1.outputs.outputGeoData = true;
    osf1.outputs.outputIgnitions = true;
    osf1.outputs.outputInputs = true;
    osf1.outputs.outputLandscape = true;
    osf1.outputs.outputScenario = true;
    osf1.outputs.outputScenarioComments = true;
    osf1.outputs.outputWxPatches = true;
    osf1.outputs.outputWxStreams = true;
    //stream output files to the MQTT connection
    //prom.streamOutputToMqtt();
    //stream output files to a GeoServer instance
    //prom.streamOutputToGeoServer("admin", "password", "192.168.0.178:8080/geoserver", "prometheus", "prometheus_store", "EPSG:4326");
    //test to see if all required parameters have been set
    let errors = prom.checkValid();
    if (errors.length > 0) {
        //write the errors to the console
        errors.forEach(node => {
            handleErrorNode(node);
        });
    }
    else {
        let wrapper = null;
        //not yet supported by a released version of PSaaS
        if (semver.gte(psaas_js_api_1.psaas.VersionInfo.localVersion(psaas_js_api_1.psaas.VersionInfo.version_info), '2.6.1')) {
            //validate the job asynchronously
            wrapper = await prom.validateJobPromise();
        }
        else {
            //start the job asynchronously
            wrapper = await prom.beginJobPromise();
        }
        //trim the name of the newly started job
        let jobName = wrapper.name.replace(/^\s+|\s+$/g, '');
        //a manager for listening for status messages
        let manager = new psaas_js_api_1.client.JobManager(jobName);
        //start the job manager
        await manager.start();
        //if possible the job will first be validated, catch the validation response
        manager.on('validationReceived', (args) => {
            //the FGM could not be validated. It's possible that the PSaaS version used doesn't support validation
            if (!args.validation.success) {
                //this probably means that the PSaaS Manager and PSaaS versions are different, the job may be able to be started without validation
                //at this point in time but we'll just exit and consider this an unexpected setup
                args.manager.dispose(); //close the connection that is listening for status updates
                console.log("Validation could not be run, check your PSaaS version");
            }
            //errors were found in the FGM
            else if (!args.validation.valid) {
                args.manager.dispose(); //close the connection that is listening for status updates
                console.log("The submitted FGM is not valid");
                //just dump the error list, let the user sort through it
                console.log(args.validation.error_list);
            }
            //the FGM is valid, start it running
            else {
                console.log("FGM valid, starting job");
                //add a delay, shouldn't be needed but it's here so the user can see the process happening
                delay(1000)
                    .then(() => {
                    //use rerun to start the job. Rerun can be used on any job that is in
                    //the finished job list in PSaaS Manager.
                    args.manager.broadcastJobRerun(jobName);
                });
            }
        });
        //when the PSaaS job triggers that it is complete, shut down the listener
        manager.on('simulationComplete', (args) => {
            args.manager.dispose(); //close the connection that is listening for status updates
            if (args.hasOwnProperty("time") && args.time != null) {
                console.log(`Simulation complete at ${args.time.toISOString()}.`);
            }
            else {
                console.log("Simulation complete.");
            }
        });
        //catch scenario failure
        manager.on('scenarioComplete', (args) => {
            if (!args.success) {
                if (args.hasOwnProperty("time") && args.time != null) {
                    console.log(`At ${args.time.toISOString()} a scenario failed: ${args.errorMessage}`);
                }
                else {
                    console.log(`A scenario failed: ${args.errorMessage}`);
                }
            }
        });
        //listen for statistics at the end of timesteps
        manager.on('statisticsReceived', (args) => {
            if (args.hasOwnProperty("time") && args.time != null) {
                console.log(`Received statistics at ${args.time.toISOString()}`);
                for (const stat of args.statistics) {
                    console.log("    Statistic " + stat.key + " with value " + stat.value);
                }
            }
            else {
                for (const stat of args.statistics) {
                    console.log("Received statistic " + stat.key + " with value " + stat.value);
                }
            }
        });
    }
})().then(x => console.log("Job created, waiting for results."));
//# sourceMappingURL=example_job.js.map