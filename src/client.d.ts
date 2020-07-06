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
/// <reference types="node" />
import { EventEmitter } from "events";
/**
 *
 */
export declare interface JobManager {
    /**
     * All scenarios have completed and PSaaS is shutting down. No further events should be
     * emitted after this.
     * @param event The name of the event.
     * @param listener A callback function that receives events when the simulation has completed.
     */
    on(event: 'simulationComplete', listener: (args: SimulationCompleteEventArgs) => void): this;
    /**
     * A single scenario within the simulation has completed.
     * @param event The name of the event.
     * @param listener A callback function that receives events when a scenario has completed.
     */
    on(event: 'scenarioComplete', listener: (args: ScenarioCompleteEventArgs) => void): this;
    /**
     * The running PSaaS job has emitted statistics at the end of a timestep.
     * @param event The name of the event.
     * @param listener A callback function that receives events when statistics are emitted
     *                 from a running scenario.
     */
    on(event: 'statisticsReceived', listener: (args: StatisticsEventArgs) => void): this;
}
/**
 * Details received when a simulation has completed.
 */
export declare class SimulationCompleteEventArgs {
    /**
     * The job manager that raised the event.
     */
    manager: JobManager;
}
/**
 * Details received when a scenario has completed.
 */
export declare class ScenarioCompleteEventArgs {
    /**
     * The job manager that raised the event.
     */
    manager: JobManager;
    /**
     * Was the scenario successful or did it fail.
     */
    success: boolean;
    /**
     * An optional error message. Will be null if the scenario completed successfully.
     */
    errorMessage: string;
    constructor(success: boolean, message: string);
}
/**
 * A statistic emitted from a running PSaaS job.
 */
export declare class PSaaSStatistic {
    /**
     * The name of the returned statistic.
     */
    key: string;
    /**
     * The value of the statistic. The type of the statistic
     * will depend on which statistic was returned.
     */
    value: number | string;
}
/**
 * Details of statistics emitted from a running PSaaS job.
 */
export declare class StatisticsEventArgs {
    /**
     * The job manager that raised the event.
     */
    manager: JobManager;
    /**
     * The list of received statistics.
     */
    statistics: Array<PSaaSStatistic>;
    constructor(stats: Array<PSaaSStatistic>);
}
export interface IJobManagerOptions {
    /**
     * The address of the MQTT broker. Does not include the port.
     * If not present `127.0.0.1` will be used.
     */
    host?: string;
    /**
     * The port of the MQTT broker. If not present `1883` will be used.
     */
    port?: number;
    /**
     * The base of the MQTT topics to subscribe to. All topics used
     * within PSaaS should have the same beginning topic.
     */
    topic?: string;
    /**
     * A client ID to use when connecting to the MQTT broker. A
     * random ID will be generated if one is not supplied. The
     * ID must be unique to the broker that the client will be
     * connecting to.
     */
    clientID?: string;
    /**
     * The username to use when connecting to the MQTT broker.
     * If not present no authentication will be used.
     */
    username?: string;
    /**
     * The password to use when connecting to the MQTT broker.
     * If not present no authentication will be used.
     */
    password?: string;
}
/**
 * A class for managing listeners for events on jobs.
 */
export declare class JobManager extends EventEmitter {
    /**
     * An MQTT client connection for receiving status updates.
     */
    private client;
    /**
     * The name of the job running in PSaaS.
     */
    private jobName;
    /**
     * The default connection parameters to use when
     * connecting to the MQTT broker. The client ID
     * will always be ignored.
     */
    static defaultOptions: IJobManagerOptions;
    /**
     * The name of the job running in PSaaS that this
     * object is managing messages from.
     */
    getJobName(): string;
    /**
     * @hidden
     */
    private onMqttMessageReceived;
    /**
     * Set the default broker connection options. If no options
     * are specified when {@link JobManager#start} is called
     * these values will be used. {@link IJobManagerOptions#clientId}
     * will always be ignored as it should be unique between
     * multiple connections.
     */
    static setDefaults(options: IJobManagerOptions): void;
    constructor(jobName: string);
    /**
     * @hidden
     */
    private fillOptions;
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
    start(options?: IJobManagerOptions): Promise<void>;
    /**
     * Close the MQTT connection.
     */
    dispose(): void;
    /**
     * Parse a message that has been received from the MQTT connection.
     * @param message The received message.
     */
    private processMqttMessage;
}
