"use strict";
/**
 * This module contains the MQTT client listener classes.
 * They can be used to listen for events raised by the
 * PSaaS process using MQTT. Event types include scenario
 * completion, simulation completion, and statistics.
 *
 * Example
 * -------
 *
 * ```javascript
 * let psaas = new PSaaS();
 * //********** setup your psaas job here **********
 * //add some statistics to listen for. They will be emitted at
 * //the end of each timestep for all scenariosd
 * prom.timestepSettings.addStatistic(TimestepSettings.STATISTIC_SCENARIO_CURRENT_TIME);
 * prom.timestepSettings.addStatistic(TimestepSettings.STATISTIC_SCENARIO_NAME);
 * //start the job
 * let job = await psaas.beginJobPromise();
 * //create a new manager to listen for events
 * let manager = new JobManager(job.name.replace(/^\s+|\s+$/g, ''));
 * //listen for new statistics events
 * manager.on('statisticsReceived', (args) => {
 *     //args will be of type StatisticsEventArgs
 * });
 * //listen for new scenario complete events
 * manager.on('scenarioComplete', (args) => {
 *     //args will be of type ScenarioCompleteEventArgs
 * });
 * //listen for new simulation complete events
 * manager.on('simulationComplete', (args) => {
 *     //args will be of type SimulationCompleteEventArgs
 * });
 *
 * await manager.start(); //connect to the MQTT broker
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** ignore this commment */
const mqtt = require("mqtt");
const os = require("os");
const events_1 = require("events");
/**
 * Details received when a simulation has completed.
 */
class SimulationCompleteEventArgs {
}
exports.SimulationCompleteEventArgs = SimulationCompleteEventArgs;
/**
 * Details received when a scenario has completed.
 */
class ScenarioCompleteEventArgs {
    constructor(success, message) {
        this.success = success;
        if (!this.success) {
            if (message && message.length > 0) {
                let index = message.indexOf("Error:");
                if (index >= 0) {
                    this.errorMessage = message.substring(index + 6).trim();
                }
                else {
                    this.errorMessage = message;
                }
            }
            else {
                this.errorMessage = "Unknown Error";
            }
        }
    }
}
exports.ScenarioCompleteEventArgs = ScenarioCompleteEventArgs;
/**
 * A statistic emitted from a running PSaaS job.
 */
class PSaaSStatistic {
}
exports.PSaaSStatistic = PSaaSStatistic;
/**
 * Details of statistics emitted from a running PSaaS job.
 */
class StatisticsEventArgs {
    constructor(stats) {
        this.statistics = stats;
    }
}
exports.StatisticsEventArgs = StatisticsEventArgs;
/**
 * A class for managing listeners for events on jobs.
 */
class JobManager extends events_1.EventEmitter {
    constructor(jobName) {
        super();
        /**
         * An MQTT client connection for receiving status updates.
         */
        this.client = null;
        this.jobName = jobName.replace(/^\s+|\s+$/g, '');
    }
    /**
     * The name of the job running in PSaaS that this
     * object is managing messages from.
     */
    getJobName() { return this.jobName; }
    /**
     * @hidden
     */
    onMqttMessageReceived(topic, payload) {
        let message = new MqttMessage(topic, payload);
        if (message.type === MessageType.Status) {
            this.processMqttMessage(message);
        }
    }
    /**
     * Set the default broker connection options. If no options
     * are specified when {@link JobManager#start} is called
     * these values will be used. {@link IJobManagerOptions#clientId}
     * will always be ignored as it should be unique between
     * multiple connections.
     */
    static setDefaults(options) {
        if (options.port) {
            JobManager.defaultOptions.port = options.port;
        }
        if (options.host) {
            JobManager.defaultOptions.host = options.host;
        }
        if (options.username) {
            JobManager.defaultOptions.username = options.username;
        }
        if (options.password) {
            JobManager.defaultOptions.password = options.password;
        }
        if (options.topic) {
            JobManager.defaultOptions.topic = options.topic;
        }
    }
    /**
     * @hidden
     */
    fillOptions(options) {
        if (!options.clientID) {
            options.clientID = "jsapi_" + Math.random().toString(16).substr(2, 8) + "-" + os.hostname();
        }
        if (!options.host) {
            options.host = JobManager.defaultOptions.host;
        }
        if (!options.port) {
            options.port = JobManager.defaultOptions.port;
        }
        if (!options.username) {
            options.username = JobManager.defaultOptions.username;
        }
        if (!options.password) {
            options.password = JobManager.defaultOptions.password;
        }
        if (!options.topic) {
            //if there is a topic set in the default options use it
            if (JobManager.defaultOptions.topic) {
                options.topic = JobManager.defaultOptions.topic;
            }
            else {
                options.topic = "psaas";
            }
        }
        return options;
    }
    /**
     * Connect to the MQTT broker and start listening for messages. If the client
     * has already connected this method will do nothing.
     * @param options An optional collection of options to modify how the MQTT
     *                client connects to the broker. Options only need to be
     *                specified if they are different from the default values.
     * @example
     * let client = new JobManager("job_id");
     * client.start({
     *     host: "mqtt.hostname",
     *     port: 1883,
     *     clientId: "unique.client.id", //will be generated if not present
     *     username: "username",
     *     password: "password"
     * });
     */
    async start(options) {
        if (this.client === null) {
            if (options) {
                options = this.fillOptions(options);
            }
            else {
                options = this.fillOptions({});
            }
            //ignores the brokerUrl when additional options are supplied
            this.client = mqtt.connect({
                port: options.port,
                clientId: options.clientID,
                protocol: "tcp",
                username: options.username,
                password: options.password,
                host: options.host
            });
            this.client.on('message', (topic, payload) => { this.onMqttMessageReceived(topic, payload); });
            await new Promise((resolve, reject) => {
                this.client.on('connect', () => {
                    this.client.subscribe(options.topic + "/+/" + this.jobName + "/status", { "qos": 2 });
                    resolve();
                });
                this.client.on('error', (err) => {
                    reject(err);
                });
            })
                .catch(err => { throw err; });
        }
    }
    /**
     * Close the MQTT connection.
     */
    dispose() {
        if (this.client !== null && this.client.connected) {
            this.client.end();
            this.client = null;
        }
    }
    /**
     * Parse a message that has been received from the MQTT connection.
     * @param message The received message.
     */
    processMqttMessage(message) {
        //something has finished
        if (message.status === "Complete") {
            //the entire simulation is complete
            if (message.message === "PSaaS.EXE operations") {
                let args = new SimulationCompleteEventArgs();
                args.manager = this;
                this.emit('simulationComplete', args);
            }
            else {
                let args = new ScenarioCompleteEventArgs(true, null);
                args.manager = this;
                this.emit('scenarioComplete', args);
            }
        }
        else if (message.status === "Scenario Failed") {
            let args = new ScenarioCompleteEventArgs(false, message.message);
            args.manager = this;
            this.emit('scenarioComplete', args);
        }
        else if (message.message !== null && message.message.length > 0) {
            //this is a timestep change message
            if (message.statistics != null && message.statistics.size > 0) {
                let stats = new Array();
                message.statistics.forEach((value, key) => {
                    let stat = new PSaaSStatistic();
                    stat.key = key;
                    stat.value = value;
                    stats.push(stat);
                });
                let args = new StatisticsEventArgs(stats);
                args.manager = this;
                this.emit('statisticsReceived', args);
            }
        }
    }
}
/**
 * The default connection parameters to use when
 * connecting to the MQTT broker. The client ID
 * will always be ignored.
 */
JobManager.defaultOptions = { port: 1883, host: "127.0.0.1" };
exports.JobManager = JobManager;
var MessageType;
(function (MessageType) {
    MessageType[MessageType["Unknown"] = 0] = "Unknown";
    MessageType[MessageType["Status"] = 1] = "Status";
    MessageType[MessageType["Checkin"] = 2] = "Checkin";
})(MessageType || (MessageType = {}));
/**
 * Parse an MQTT message type from a string.
 * @hidden
 */
function messageTypeFromString(value) {
    if (value.localeCompare("status", undefined, { sensitivity: 'accent' }) === 0) {
        return MessageType.Status;
    }
    else if (value.localeCompare("reportin", undefined, { sensitivity: 'accent' }) === 0) {
        return MessageType.Checkin;
    }
    return MessageType.Unknown;
}
class MqttMessage {
    constructor(topic, payload) {
        this.timeStamp = new Date();
        this.topic = topic;
        if (payload !== null) {
            this.payload = payload.toString();
        }
        let topicParse = topic.split('/');
        if (topicParse.length > 1) {
            //found a sender ID
            this.from = topicParse[1];
            if (topicParse.length > 2) {
                //found a job name
                this.job = topicParse[2];
                if (topicParse.length > 3) {
                    //found a message type
                    this.type = messageTypeFromString(topicParse[3]);
                    //this is a status message, parse the PSaaS status from the payload
                    if (this.type === MessageType.Status && this.payload.length > 0) {
                        let json = JSON.parse(this.payload);
                        //is the recieved value a valid status message
                        if (json.hasOwnProperty("message") && json.hasOwnProperty("status")) {
                            this.message = json.message;
                            switch (json.status) {
                                case 0:
                                    this.status = "Submitted";
                                    break;
                                case 1:
                                    this.status = "Started";
                                    break;
                                case 2:
                                    this.status = "Scenario Started";
                                    break;
                                case 3:
                                    this.status = "Scenario Completed";
                                    break;
                                case 4:
                                    this.status = "Scenario Failed";
                                    break;
                                case 5:
                                    this.status = "Complete";
                                    break;
                                case 6:
                                    this.status = "Failed";
                                    break;
                                case 7:
                                    this.status = "Error";
                                    break;
                                case 8:
                                    this.status = "Information";
                                    break;
                                case 9:
                                    this.status = "Shutdown Requested";
                                    break;
                                default:
                                    this.status = "";
                                    break;
                            }
                            //if the status was a valid status look for statistics
                            if (this.status.length > 0 && json.hasOwnProperty("stats")) {
                                this.statistics = new Map();
                                let stats = json.stats;
                                //add all the
                                for (var key in stats) {
                                    if (stats.hasOwnProperty(key)) {
                                        this.statistics.set(key, stats[key]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
//# sourceMappingURL=client.js.map