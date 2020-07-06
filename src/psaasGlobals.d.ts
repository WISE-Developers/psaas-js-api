/**
 * Global classes needed for multiple parts of the API.
 */
/// <reference types="node" />
/** ignore this comment */
import * as net from "net";
export declare class SocketMsg {
    static readonly STARTUP: string;
    static readonly SHUTDOWN: string;
    static readonly BEGINDATA: string;
    static readonly ENDDATA: string;
    static readonly STARTJOB: string;
    static readonly GETDEFAULTS: string;
    static readonly GETTIMEZONES: string;
    static readonly NEWLINE: string;
    static readonly DEBUG_NO_FILETEST: boolean;
}
export declare class SocketHelper {
    private port;
    private address;
    private static instance;
    private constructor();
    static getInstance(): SocketHelper;
    /**
     * Initialize the socket helper by setting the IP address and
     * port to be used to communicate with the Java builder application.
     * @param address The IP address of the computer running the Java builder application.
     * @param port The port to use to communicate with the Java builder application.
     */
    static initialize(address: string, port: number): void;
    /**
     * Get the IP address to attempt to communicate with the Java builder with.
     * @return The IP address that is set for the computer running the Java builder.
     */
    static getAddress(): string;
    /**
     * Get the port to communicate with the Java builder over.
     * @return The port that will be used to communicate with the Java builder.
     */
    static getPort(): number;
}
export declare class IPSaaSSerializable {
    protected fetchState: number;
}
export declare enum Units {
    UNKNOWN = -1,
    /**
     * Kilometres
     */
    KM = 0,
    /**
     * Metres
     */
    M = 1,
    /**
     * Miles
     */
    MI = 2,
    /**
     * Feet
     */
    FT = 3,
    /**
     * Square Kilometres
     */
    KM2 = 4,
    /**
     * Square Metres
     */
    M2 = 5,
    /**
     * Square Miles
     */
    MI2 = 6,
    /**
     * Square Feet
     */
    FT2 = 7,
    /**
     * Hectares
     */
    HA = 8,
    /**
     * Square yards
     */
    YD2 = 9,
    /**
     * Acres
     */
    ACRE = 10,
    /**
     * Yards
     */
    YARD = 11,
    /**
     * Chains
     */
    CHAIN = 12
}
export declare enum Province {
    ALBERTA = "ab",
    BRITISH_COLUMBIA = "bc",
    MANITOBA = "mb",
    NEW_BRUNSWICK = "nb",
    NEWFOUNDLAND = "nl",
    NORTHWEST_TERRITORIES = "nt",
    NOVA_SCOTIA = "ns",
    NUNAVUT = "nu",
    ONTARIO = "on",
    PRINCE_EDWARD_ISLAND = "pe",
    QUEBEC = "qc",
    SASKATCHEWAN = "sk",
    YUKON_TERRITORY = "yt"
}
/**
 * A class to store location information.
 * @author "Travis Redpath"
 */
export declare class LatLon {
    /**
     * The locations latitude.
     */
    latitude: number;
    /**
     * The locations longitude.
     */
    longitude: number;
    /**
     * Construct a new LatLon with the given latitude and longitude.
     * @param lat The latitude.
     * @param lon The longitude.
     */
    constructor(lat: number, lon: number);
}
/**
 * A class that stores information about a time duration.
 * @author "Travis Redpath"
 */
export declare class Duration {
    /**
     * The number of years in the duration. Leave as 0 or less for no years.
     */
    years: number;
    /**
     * The number of months in the duration. Leave as 0 or less for no months.
     */
    months: number;
    /**
     * The number of days in the duration. Leave as 0 or less for no days.
     */
    days: number;
    /**
     * The number of hours in the duration. Leave as 0 or less for no hours.
     */
    hours: number;
    /**
     * The number of minutes in the duration. Leave as 0 or less for no miutes.
     */
    minutes: number;
    /**
     * The number of seconds in the duration. Leave as 0 or less for no seconds.
     * Fractions of a second can be specified.
     */
    seconds: number;
    /**
     * Is the duration negative in direction.
     */
    isNegative: boolean;
    protected _token: string;
    protected _tokenIndex: number;
    protected _duration: string;
    /**
     * Is the duration valid (not zero).
     * @return boolean
     */
    isValid(): boolean;
    /**
     * Create a new time duration.
     * @param years
     * @param months
     * @param days
     * @param hours
     * @param minutes
     * @param seconds
     * @param negative Is the duration negative in time.
     */
    static createDateTime(years: number, months: number, days: number, hours: number, minutes: number, seconds: number, negative: boolean): Duration;
    /**
     * Create a new time duration with only date parameters.
     * @param years
     * @param months
     * @param days
     * @param negative Is the duration negative in time.
     */
    static createDate(years: number, months: number, days: number, negative: boolean): Duration;
    /**
     * Create a new time duration with only time parameters.
     * @param hours
     * @param minutes
     * @param seconds
     * @param negative Is the duration negative in time.
     */
    static createTime(hours: any, minutes: any, seconds: any, negative: any): Duration;
    /**
     * Convert the Duration into a properly formatted xml duration string.
     */
    toString: () => string;
    /**
     * Convert an xml duration string into a Duration object.
     * @param val The xml duration string. An exception will be thrown if the string is not in the correct format.
     */
    fromString(val: string): void;
    protected _parse(): void;
    protected _parseDate(): void;
    protected _parseDateModifier(num: string): void;
    protected _parseTime(): void;
    protected _parseTimeModifier(num: string): void;
    protected _nextToken(): string;
}
/**
 * A class to hold information about time zone names retrieved from Java.
 * The value is what will be passed back to the job builder.
 * @author "Travis Redpath"
 */
export declare class TimezoneName {
    /**
     * The name of the time zone to display to the user.
     */
    name: string;
    /**
     * A unique identifier for the time zone that can be
     * passed to the job builder in place of a time zone
     * offset.
     */
    value: number;
}
/**
 * A timezone.
 * @author "Travis Redpath"
 */
export declare class Timezone {
    private static readonly PARAM_TIMEZONE;
    /**
     * Is the timezone currently in daylight savings time.
     */
    dst: boolean;
    /**
     * The offset from GMT.
     */
    offset: Duration;
    /**
     * Optional value of the timezone. If set to a valid value, the offset will be
     * looked up once the job is submitted so {@link Timezone#offset} and {@link Timezone#dst}
     * will be ignored. Valid values can be obtained by calling {@link Timezone#getTimezoneList()}.
     */
    value: number;
    /**
     * Construct a new timezone.
     */
    constructor();
    isValid(): boolean;
    /**
     * Streams the timezone to a socket.
     * @param builder A socket connection to stream to.
     */
    stream(builder: net.Socket): void;
    private static ParseTimezone;
    /**
     * Gets a list of possible time zones from Java.
     * @return An array of timezone names.
     */
    static getTimezoneNameList(callback?: (defaults: TimezoneName[]) => any): void;
    /**
     * Gets a list of possible time zones from Java.
     * @return An array of timezone names.
     */
    static getTimezoneNameListPromise(): Promise<TimezoneName[]>;
    /**
     * Gets a list of the possible time zones from Java. The list is combined into
     * a single string with name/value pairs separated by a '|'.
     * @deprecated Use {@link Timezone#getTimezoneNameList()} instead.
     */
    static getTimezoneList(callback?: (defaults: string) => any): void;
    /**
     * Gets a list of the possible time zones from Java. The list is combined into
     * a single string with name/value pairs separated by a '|'.
     * @returns The list of timezone names and their UTC offsets in a single string separated by '|'.
     * @deprecated Use {@link Timezone#getTimezoneNameListPromise()} instead.
     */
    static getTimezoneListPromise(): Promise<string>;
}
/**
 * The affect that an asset will have on a simulation.
 */
export declare enum AssetOperation {
    UNDEFINED = -1,
    /**
     * The asset will have no effect on the simulation. The arrival time will be noted then the simulation will continue.
     */
    NO_EFFECT = 0,
    /**
     * The simulation will stop as soon as the first asset has been reached.
     */
    STOP_IMMEDIATELY = 1,
    /**
     * The simulation will stop after a certain number of assets have been reached. The default is all assets.
     */
    STOP_AFTER_X = 2
}
/**
 * The fire growth model options.
 * @author "Travis Redpath"
 */
export declare class FGMOptions {
    static readonly PARAM_MAXACCTS = "maxaccts";
    static readonly PARAM_DISTRES = "distres";
    static readonly PARAM_PERIMRES = "perimres";
    static readonly PARAM_MINSPREADROS = "fgm_minspreadros";
    static readonly PARAM_STOPGRIDEND = "stopatgridends";
    static readonly PARAM_BREACHING = "breaching";
    static readonly PARAM_DYNAMICTHRESHOLD = "fgm_dynamicthreshold";
    static readonly PARAM_SPOTTING = "spotting";
    static readonly PARAM_PURGENONDISPLAY = "fgm_purgenondisplay";
    static readonly PARAM_DX = "fgm_dx";
    static readonly PARAM_DY = "fgm_dy";
    static readonly PARAM_DT = "fgm_dt";
    static readonly PARAM_DWD = "fgm_dwd";
    static readonly PARAM_GROWTHAPPLIED = "fgm_growthPercApplied";
    static readonly PARAM_GROWTHPERC = "fgm_growthPercentile";
    static readonly PARAM_SIM_PROPS = "simulation_properties";
    static readonly DEFAULT_MAXACCTS = "MAXACCTS";
    static readonly DEFAULT_DISTRES = "DISTRES";
    static readonly DEFAULT_PERIMRES = "PERIMRES";
    static readonly DEFAULT_MINSPREADROS = "fgmd_minspreadros";
    static readonly DEFAULT_STOPGRIDEND = "STOPGRIDEND";
    static readonly DEFAULT_BREACHING = "BREACHING";
    static readonly DEFAULT_DYNAMICTHRESHOLD = "fgmd_dynamicthreshold";
    static readonly DEFAULT_SPOTTING = "fgmd_spotting";
    static readonly DEFAULT_PURGENONDISPLAY = "fgmd_purgenondisplay";
    static readonly DEFAULT_DX = "fgmd_dx";
    static readonly DEFAULT_DY = "fgmd_dy";
    static readonly DEFAULT_DT = "fmgd_dt";
    static readonly DEFAULT_GROWTHAPPLIED = "fgmd_growthPercApplied";
    static readonly DEFAULT_GROWTHPERC = "fgmd_growthPercentile";
    /**
     * The maximum time step during acceleration (optional). This value must be <= 5min.
     * Has a default value.
     */
    maxAccTS: Duration;
    /**
     * The distance resolution (required). Must be between 0.2 and 10.0.
     * Has a default value.
     */
    distRes: number;
    /**
     * The perimeter resolution (required). Must be between 0.2 and 10.0.
     * Has a default value.
     */
    perimRes: number;
    /**
     * Minimum Spreading ROS (optional). Must be between 0.0000001 and 1.0.
     * Has a default value.
     */
    minimumSpreadingROS: number;
    /**
     * Whether to stop the fire spread when the simulated fire reaches the boundary of the grid data (required).
     * Has a default value.
     */
    stopAtGridEnd: boolean;
    /**
     * Whether breaching is turned on or off (required).
     * Has a default value.
     */
    breaching: boolean;
    /**
     * Whether using the dynamic spatial threshold algorithm is turned on or off (optional).
     * Has a default value.
     */
    dynamicSpatialThreshold: boolean;
    /**
     * Whether the spotting model should be activated (optional).
     * Has a default value.
     */
    spotting: boolean;
    /**
     * Whether internal/hidden time steps are retained.
     * Has a default value.
     */
    purgeNonDisplayable: boolean;
    /**
     * How much to nudge ignitions to perform probabilistic analyses on ignition location.
     * Primarily used when ignition information is not 100% reliable.
     * Must be between -250 and 250.
     * Has a default value.
     */
    dx: number;
    /**
     * How much to nudge ignitions to perform probabilistic analyses on ignition location.
     * Primarily used when ignition information is not 100% reliable.
     * Must be between -250 and 250.
     * Has a default value.
     */
    dy: number;
    /**
     * How much to nudge ignitions to perform probabilistic analyses on ignition location and start time.
     * Primarily used when ignition information is not 100% reliable.
     * Has a default value.
     */
    dt: Duration;
    /**
     * How much to nudge wind direction to perform probabilistic analyses on weather.
     * Applied after all patches and grids, and does not recalculate any FWI calculations.
     * Applied before any FBP calculations.
     * Provided in compass degrees, -360 to 360 is acceptable.
     * Applied to both simulations, and to instantaneous calculations as shown on the map trace view query, for consistency.
     * Primarily used when weather information does not have the expected fidelity.
     */
    dwd: number;
    /**
     * Whether the growth percentile value is applied (optional).
     * Has a default value.
     */
    growthPercentileApplied: boolean;
    /**
     * Growth percentile, to apply to specific fuel types (optional).
     * Has a default value.
     */
    growthPercentile: number;
    /**
     * The initial number of vertices used to create a polygon aroung point ignitions.
     */
    initialVertexCount: number;
    /**
     * The initial size of the polygon around point ignitions, in metres.
     */
    ignitionSize: number;
    /**
     * A global asset operation that can be used to force an asset behaviour for all attached assets.
     */
    globalAssetOperation: AssetOperation;
    /**
     * An asset collision count. Will allow the simulation to be stopped after a certain number of assets have been reached.
     * Only valid if globalAssetOperation in AssetOperation::STOP_AFTER_X.
     */
    assetCollisionCount: number;
    /**
     * Checks to see if all required values have been set.
     */
    isValid(): boolean;
    /**
     * Check to see if the type is part of this class. Assign $data to the appropriate variable if it is.
     * @param type
     * @param data
     */
    tryParse(type: string, data: string): boolean;
    /**
     * Streams the FGM options to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
    /**
     * Streams the FGM options to a socket.
     * @param builder
     */
    streamCopy(builder: net.Socket): string;
}
/**
 * The fire behaviour prediction options.
 * @author "Travis Redpath"
 */
export declare class FBPOptions {
    static readonly PARAM_TERRAIN = "terraineffect";
    static readonly PARAM_WINDEFF = "windeffect";
    static readonly DEFAULT_TERRAINEFF = "TERRAINEFFECT";
    static readonly DEFAULT_WINDEFFECT = "fgmd_windeffect";
    /**
     * Use terrain effect (optional).
     * Has a default value.
     */
    terrainEffect: boolean;
    /**
     * Use wind effect (optional).
     */
    windEffect: boolean;
    /**
     * Checks to see if all of the required values have been set.
     */
    isValid: () => boolean;
    tryParse(type: string, data: string): boolean;
    /**
     * Streams the FBP options to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
    /**
     * Streams the FBP options to a socket.
     * @param builder
     */
    streamCopy(builder: net.Socket): void;
}
/**
 * The foliar moisture content options.
 * @author "Travis Redpath"
 */
export declare class FMCOptions {
    static readonly PARAM_PEROVER = "peroverride";
    static readonly PARAM_NODATAELEV = "nodataelev";
    static readonly PARAM_TERRAIN = "fmc_terrain";
    static readonly DEFAULT_PEROVER = "PEROVERRIDEVAL";
    static readonly DEFAULT_NODATAELEV = "NODATAELEV";
    static readonly DEFAULT_TERRAIN = "fmcd_terrain";
    static readonly DEFAULT_ACCURATELOCATION = "fmcd_accuratelocation";
    /**
     * The value for the FMC (%) override (optional). Must be between 0 and 300.
     * Has a default value.
     */
    perOverride: number;
    /**
     * The elevation where NODATA or no grid exists (required). Must be between 0 and 7000.
     * Has a default value.
     */
    nodataElev: number;
    /**
     * Optional.
     * Has a default value.
     */
    terrain: boolean;
    /**
     * Optional.
     * Has a default value.
     * @deprecated deprecated. Always true.
     */
    accurateLocation: boolean;
    /**
     * Checks to see if all required values have been set.
     */
    isValid(): boolean;
    tryParse(type: string, data: string): boolean;
    /**
     * Streams the FMC options to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
    /**
     * Streams the FMC options to a socket.
     * @param builder
     */
    streamCopy(builder: net.Socket): void;
}
/**
 * The fire weather index options.
 * @author "Travis Redpath"
 */
export declare class FWIOptions {
    static readonly PARAM_FWISPACIAL = "fwispacinterp";
    static readonly PARAM_FWIFROMSPACIAL = "fwifromspacweather";
    static readonly PARAM_HISTORYFWI = "historyonfwi";
    static readonly PARAM_BURNINGCONDON = "burningconditionon";
    static readonly PARAM_FWITEMPORALINTERP = "fwitemporalinterp";
    static readonly DEFAULT_FWISPACINTERP = "FWISPACINTERP";
    static readonly DEFAULT_FWIFROMSPACWEATH = "FWIFROMSPACWEATH";
    static readonly DEFAULT_HISTORYONFWI = "HISTORYONFWI";
    static readonly DEFAULT_BURNINGCONDITIONSON = "fwid_burnconditions";
    static readonly DEFAULT_TEMPORALINTERP = "fwid_tempinterp";
    /**
     * Apply spatial interpolation to FWI values (optional).
     * Has a default value.
     */
    fwiSpacInterp: boolean;
    /**
     * Calculate FWI values from temporally interpolated weather (optional).
     * Has a default value.
     */
    fwiFromSpacWeather: boolean;
    /**
     * Apply history to FWI values affected by patches, grids, etc. (optional).
     * Has a default value.
     */
    historyOnEffectedFWI: boolean;
    /**
     * Use burning conditions (optional).
     */
    burningConditionsOn: boolean;
    /**
     * Apply spatial interpolation to FWI values (optional).
     */
    fwiTemporalInterp: boolean;
    /**
     * Checks to see if all required values have been set.
     */
    isValid(): boolean;
    tryParse(type: string, data: string): boolean;
    /**
     * Streams the FWI options to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
/**
 * Possible metadata that could be written to vector files.
 * @author "Travis Redpath"
 */
export declare class VectorMetadata {
    static readonly DEFAULT_VERSION = "VERSION";
    static readonly DEFAULT_SCENNAME = "SCENNAME";
    static readonly DEFAULT_JOBNAME = "JOBNAME";
    static readonly DEFAULT_IGNAME = "IGNAME";
    static readonly DEFAULT_SIMDATE = "SIMDATE";
    static readonly DEFAULT_FIRESIZE = "FIRESIZE";
    static readonly DEFAULT_PERIMTOTAL = "PERIMTOTAL";
    static readonly DEFAULT_PERIMACTIVE = "PERIMACTIVE";
    static readonly DEFAULT_AREAUNIT = "AREAUNIT";
    static readonly DEFAULT_PERIMUNIT = "PERIMUNIT";
    /**
     * PSaaS version and build date (required).
     * Has a default value.
     */
    version: boolean;
    /**
     * Scenario name (required).
     * Has a default value.
     */
    scenName: boolean;
    /**
     * Job name (required).
     * Has a default value.
     */
    jobName: boolean;
    /**
     * Ignition name(s) (required).
     * Has a default value.
     */
    igName: boolean;
    /**
     * Simulated date/time (required).
     * Has a default value.
     */
    simDate: boolean;
    /**
     * Fire size (area) (required).
     * Has a default value.
     */
    fireSize: boolean;
    /**
     * Total perimeter (required).
     * Has a default value.
     */
    perimTotal: boolean;
    /**
     * Active perimeter (required).
     * Has a default value.
     */
    perimActive: boolean;
    /**
     * Units of measure for area outputs (required). Must be one of the area values defined in the UNITS class.
     * Has a default value.
     * @deprecated Use the global unit settings instead. Will be removed in the future.
     */
    areaUnit: Units;
    /**
     * Units of measure for perimeter outputs (required). Must be one of the distance values defined in the UNITS class.
     * Has a default value.
     * @deprecated Use the global unit settings instead. Will be removed in the future.
     */
    perimUnit: Units;
    /**
     * Include the weather information in the output vector file (optional).
     */
    wxValues: boolean;
    /**
     * Include the FWI values in the output vector file (optional).
     */
    fwiValues: boolean;
    /**
     * Include the location of the ignition that created the perimeter in the vector file (optional).
     */
    ignitionLocation: boolean;
    /**
     * Add the max burn distance for each perimeter to the vector file (optional).
     */
    maxBurnDistance: boolean;
    /**
     * Pass ignition attributes from the input ignition file to the output perimeter (optional).
     */
    ignitionAttributes: boolean;
    /**
     * The time that the fire front reached an asset and the simulation stopped (optional).
     */
    assetArrivalTime: boolean;
    /**
     * The number of assets that were reached when the simulation stopped, if any (optional).
     */
    assetArrivalCount: boolean;
    /**
     * Add a column of 0s and 1s to indicate if a perimeter is the final perimeter of a simulation
     * or an intermediate step.
     */
    identifyFinalPerimeter: boolean;
    err: any;
    /**
     * Checks to see if all required values have been set.
     */
    isValid(): boolean;
    tryParse(type: string, data: string): boolean;
}
export declare enum PSaaSLogLevel {
    VERBOSE = 1,
    DEBUG = 2,
    INFO = 3,
    WARN = 4,
    NONE = 5
}
export declare class PSaaSLogger {
    private static instance;
    private level;
    private constructor();
    static getInstance(): PSaaSLogger;
    setLogLevel(level: PSaaSLogLevel): void;
    unsetLogLevel(): void;
    error(message: string): void;
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
}
/**
 * Which summary values to output.
 * @author "Travis Redpath"
 */
export declare class SummaryOutputs {
    private static readonly DEFAULT_TIMETOEXEC;
    private static readonly DEFAULT_GRIDINFO;
    private static readonly DEFAULT_LOCATION;
    private static readonly DEFAULT_ELEVINFO;
    private static readonly DEFAULT_INPUTSUM;
    /**
     * Application information (optional).
     * Has a default value.
     */
    outputApplication: boolean;
    /**
     * Grid information (cell size, dimensions) (optional).
     * Has a default value.
     */
    outputGeoData: boolean;
    /**
     * Scenario Information (optional).
     * Has a default value.
     */
    outputScenario: boolean;
    /**
     * Scenario comments (optional).
     * Has a default value.
     */
    outputScenarioComments: boolean;
    /**
     * Inputs (optional).
     * Has a default value.
     */
    outputInputs: boolean;
    /**
     * Landscape information (optional).
     */
    outputLandscape: boolean;
    /**
     * Fuel patch information (optional).
     */
    outputFBPPatches: boolean;
    /**
     * Wx patches and grids information (optional).
     */
    outputWxPatches: boolean;
    /**
     * Ignition information (optional).
     */
    outputIgnitions: boolean;
    /**
     * Wx stream information (optional).
     */
    outputWxStreams: boolean;
    /**
     * Fuel type information (optional).
     */
    outputFBP: boolean;
    /**
     * Wx stream data (temperature, RH, etc.) (optional).
     */
    outputWxData: boolean;
    /**
     * Asset related information (asset file reference) (optional).
     */
    outputAssetInfo: boolean;
    /**
     * Checks to see if all required values have been set.
     */
    isValid(): boolean;
    tryParse(type: string, data: string): boolean;
}
/**
 * All supported statistics values that can be used across the API.
 * Not all locations will support all statistics.
 */
export declare enum GlobalStatistics {
    DATE_TIME = 0,
    ELAPSED_TIME = 1,
    TIME_STEP_DURATION = 2,
    TEMPERATURE = 3,
    DEW_POINT = 4,
    RELATIVE_HUMIDITY = 5,
    WIND_SPEED = 6,
    WIND_DIRECTION = 7,
    PRECIPITATION = 8,
    HFFMC = 9,
    HISI = 10,
    DMC = 11,
    DC = 12,
    HFWI = 13,
    BUI = 14,
    FFMC = 15,
    ISI = 16,
    FWI = 17,
    TIMESTEP_AREA = 18,
    TIMESTEP_BURN_AREA = 19,
    TOTAL_AREA = 20,
    /**
     * Total area of the fire. (sq. metres)
     */
    TOTAL_BURN_AREA = 21,
    /**
     * Rate of change in the fire area. (sq. metres)
     */
    AREA_GROWTH_RATE = 22,
    /**
     * Total exterior fire perimeter, including active and inactive portions. (metres)
     */
    EXTERIOR_PERIMETER = 23,
    /**
     * Rate of change in the exterior perimeter growth rate. (metres per minute)
     */
    EXTERIOR_PERIMETER_GROWTH_RATE = 24,
    /**
     * Portion of the fire front considered active (interior and exterior) (where 1 or both vertices are active). (metres)
     */
    ACTIVE_PERIMETER = 25,
    /**
     * Rate of change in the active perimeter growth rate. (metres per minute)
     */
    ACTIVE_PERIMETER_GROWTH_RATE = 26,
    /**
     * Total fire perimeter, including interior and exterior and active/inactive portions. (metres)
     */
    TOTAL_PERIMETER = 27,
    /**
     * Rate of change in the total perimeter growth rate. (metres per minute)
     */
    TOTAL_PERIMETER_GROWTH_RATE = 28,
    FI_LT_10 = 29,
    FI_10_500 = 30,
    FI_500_2000 = 31,
    FI_2000_4000 = 32,
    FI_4000_10000 = 33,
    FI_GT_10000 = 34,
    ROS_0_1 = 35,
    ROS_2_4 = 36,
    ROS_5_8 = 37,
    ROS_9_14 = 38,
    ROS_GT_15 = 39,
    /**
     * Maximum rate of spread calculated from Dr. Richards' ellipse equations (metres per minute).
     */
    MAX_ROS = 40,
    MAX_FI = 41,
    /**
     * Maximum flame length (metres), based on ROS from Dr. Richards' ellipse equations.
     */
    MAX_FL = 42,
    /**
     * Maximum crown fraction burned (unitless), based on ROS from Dr. Richards' ellipse equations.
     */
    MAX_CFB = 43,
    /**
     * Maximum crown fuel consumption (kg/m2), based on ROS from Dr. Richards' ellipse equations.
     */
    MAX_CFC = 44,
    /**
     * Maximum surface fuel consumption (kg/m2), based on ROS from Dr. Richards' ellipse equations.
     */
    MAX_SFC = 45,
    /**
     * Maximum total fuel consumption (kg/m2), based on ROS from Dr. Richards' ellipse equations.
     */
    MAX_TFC = 46,
    TOTAL_FUEL_CONSUMED = 47,
    CROWN_FUEL_CONSUMED = 48,
    SURFACE_FUEL_CONSUMED = 49,
    /**
     * Number of active vertices defining the fire perimeter(s).
     */
    NUM_ACTIVE_VERTICES = 50,
    /**
     * Number of vertices defining the fire perimeter(s).
     */
    NUM_VERTICES = 51,
    /**
     * Total, cumulative number of verticies defining the simulation's perimeters.
     */
    CUMULATIVE_VERTICES = 52,
    /**
     * Cumulative number of active vertices defining the fire perimeter(s).
     */
    CUMULATIVE_ACTIVE_VERTICES = 53,
    /**
     * Number of fire fronts (interior and exterior) which have at least 1 active vertex.
     */
    NUM_ACTIVE_FRONTS = 54,
    /**
     * Number of fire fronts (interior and exterior).
     */
    NUM_FRONTS = 55,
    MEMORY_USED_START = 56,
    MEMORY_USED_END = 57,
    NUM_TIMESTEPS = 58,
    NUM_DISPLAY_TIMESTEPS = 59,
    NUM_EVENT_TIMESTEPS = 60,
    NUM_CALC_TIMESTEPS = 61,
    /**
     * Number of real-time (clock) seconds to calculate the current display time step.
     */
    TICKS = 62,
    /**
     * Number of real-time (clock) seconds to calculate all display time steps.
     */
    PROCESSING_TIME = 63,
    /**
     * Number of simulated seconds that burning was allowed since the start of the simulation.
     */
    GROWTH_TIME = 64,
    RAZ = 65,
    BURN_GRID = 66,
    FIRE_ARRIVAL_TIME = 67,
    FIRE_ARRIVAL_TIME_MIN = 68,
    FIRE_ARRIVAL_TIME_MAX = 69,
    HROS = 70,
    FROS = 71,
    BROS = 72,
    RSS = 73,
    RADIATIVE_POWER = 74,
    /**
     * Maximum fire intensity, based on ROS the standard FBP equations.
     */
    HFI = 75,
    /**
     * Maximum crown fraction burned (unitless), based on ROS from standard FBP equations.
     */
    HCFB = 76,
    /**
     * The current simulation time as of the end of the timestep.
     */
    CURRENT_TIME = 77,
    /**
     * The name of the scenario that is reporting statistics.
     */
    SCENARIO_NAME = 78,
    BURN_PERCENTAGE = 79,
    /**
     * Change in the total perimeter growth. (metres)
     */
    TOTAL_PERIMETER_CHANGE = 80,
    /**
     * Change in the exterior perimeter growth. (metres)
     */
    EXTERIOR_PERIMETER_CHANGE = 81,
    /**
     * Change in the active perimeter growth. (metres)
     */
    ACTIVE_PERIMETER_CHANGE = 82,
    /**
     * Change in fire area. (sq. metres)
     */
    AREA_CHANGE = 83,
    BURN = 84
}
