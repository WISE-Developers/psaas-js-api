/**
 * Classes needed to build and run a PSaaS job.
 * Jobs built with the classes in this module
 * will be serialized and streamed to PSaaS
 * Builder for it to construct the necessary
 * files to run PSaaS.
 *
 * For an example see index.js.
 */
/// <reference types="node" />
import { DateTime } from "luxon";
import * as net from "net";
import { LatLon, Duration, FGMOptions, FBPOptions, FMCOptions, FWIOptions, Timezone, VectorMetadata, SummaryOutputs, IPSaaSSerializable, AssetOperation, GlobalStatistics, ValidationError, TimeRange } from "./psaasGlobals";
export declare class VersionInfo {
    static readonly version_info: string;
    static readonly release_date: string;
    /**
     * @ignore
     */
    static localVersion(version: string): string;
}
export declare enum GridFileType {
    NONE = -1,
    FUEL_GRID = 0,
    DEGREE_CURING = 1,
    GREEN_UP = 2,
    PERCENT_CONIFER = 3,
    PERCENT_DEAD_FIR = 4,
    CROWN_BASE_HEIGHT = 5,
    TREE_HEIGHT = 6,
    FUEL_LOAD = 7,
    FBP_VECTOR = 8
}
/**
 * Information about a grid input file.
 * @author "Travis Redpath"
 */
export declare class GridFile {
    private static readonly PARAM_GRID_FILE;
    protected static counter: number;
    /**
     * The name of the grid file. Must be unique amongst the grid file collection.
     */
    private _id;
    /**
     * Get the name of the grid file.
     */
    get id(): string;
    /**
     * Set the name of the grid file. Must be unique amongst the grid file collection. Cannot be null or empty.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set id(value: string);
    /**
     * Comment about the grid file (optional).
     */
    private _comment;
    /**
     * Get the comment about the grid file.
     */
    get comment(): string;
    /**
     * Set the comment about the grid file.
     */
    set comment(value: string);
    /**
     * The type of grid file (required).
     */
    type: GridFileType;
    /**
     * The location of the file containing the grid data (required).
     */
    private _filename;
    /**
     * Get the location of the file containing the grid data.
     */
    get filename(): string;
    /**
     * Set the location of the file containing the grid data. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set filename(value: string);
    /**
     * The projection file for the grid file (required).
     */
    private _projection;
    /**
     * Get the location of the projection file for the grid file.
     */
    get projection(): string;
    /**
     * Set the location of the projection file for the grid file. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set projection(value: string);
    constructor();
    getId(): string;
    /**
     * Set the name of the grid file. This name must be unique within
     * the simulation. The name will get a default value when the
     * grid file is constructed but can be overriden with this method.
     */
    setName(name: string): void;
    /**
     * Are all required values set.
     */
    isValid(): boolean;
    /**
     * Find all errors that may be in the grid file.
     * @returns A list of errors that were found.
     */
    checkValid(): Array<ValidationError>;
    /**
     * Streams the grid file to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
export declare enum WeatherPatchOperation {
    EQUAL = 0,
    PLUS = 1,
    MINUS = 2,
    MULTIPLY = 3,
    DIVIDE = 4
}
export declare enum WeatherPatchType {
    FILE = 0,
    POLYGON = 2,
    LANDSCAPE = 4
}
export declare class WeatherPatchDetails {
    /**
     * The operation that the patch applies (required).
     */
    operation: WeatherPatchOperation;
    /**
     * The value to apply with this operation.
     */
    private _value;
    /**
     * Get the value to apply with this operation.
     */
    get value(): number;
    /**
     * Set the value to apply with this operation. Must be greater than 0.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set value(v: number);
    checkValid(): Array<ValidationError>;
}
export declare class WeatherPatch_Temperature extends WeatherPatchDetails {
}
export declare class WeatherPatch_RelativeHumidity extends WeatherPatchDetails {
    /**
     * Helper function for setting the RH value as a percent [0-100].
     * @param value The value to apply (as a percent [0-100]).
     */
    setValuePercent(value: number): void;
    /**
     * Helper function for unsetting the RH value.
     */
    unsetValuePercent(): void;
}
export declare class WeatherPatch_Precipitation extends WeatherPatchDetails {
}
export declare class WeatherPatch_WindSpeed extends WeatherPatchDetails {
}
export declare class WeatherPatch_WindDirection extends WeatherPatchDetails {
    checkValid(): Array<ValidationError>;
}
/**
 * Information about a weather patch input file.
 * @author "Travis Redpath"
 */
export declare class WeatherPatch {
    private static readonly PARAM_WEATHER_PATCH;
    protected static counter: number;
    /**
     * The name of the weather patch. The name must be unique amongst the weather patch collection.
     */
    private _id;
    /**
     * Get the name of the weather patch.
     */
    get id(): string;
    /**
     * Set the name of the weather patch. Must be unique amongst the weather patch collection. Cannot be null or empty.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set id(value: string);
    /**
     * The patch start time (required).
     */
    private _startTime;
    /**
     * Get the weather patch start time as a Luxon DateTime.
     */
    get lStartTime(): DateTime;
    /**
     * Get the weather patch start time as an ISO8601 string.
     * @deprecated
     */
    get startTime(): string;
    /**
     * Set the weather patch start time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lStartTime(value: DateTime);
    /**
     * Set the weather patch start time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set startTime(value: string);
    /**
     * The patch end time (required).
     */
    private _endTime;
    /**
     * Get the weather patch end time as a Luxon DateTime.
     */
    get lEndTime(): DateTime;
    /**
     * Get the weather patch end time as an ISO8601 string.
     * @deprecated
     */
    get endTime(): string;
    /**
     * Set the weather patch end time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lEndTime(value: DateTime);
    /**
     * Set the weather patch end time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set endTime(value: string);
    /**
     * The patches start time of day (required).
     */
    private _startTimeOfDay;
    /**
     * Get the weather patch start time of day as a Duration.
     */
    get dStartTimeOfDay(): Duration;
    /**
     * Get the weather patch start time of day as an ISO8601 string.
     * @deprecated
     */
    get startTimeOfDay(): string;
    /**
     * Set the weather patch start time of day using a Duration. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set dStartTimeOfDay(value: Duration);
    /**
     * Set the weather patch start time of day using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set startTimeOfDay(value: string);
    /**
     * The patches end time of day (required). Must be formatted as "hh:mm:ss".
     */
    private _endTimeOfDay;
    /**
     * Get the weather patch end time of day as a Duration.
     */
    get dEndTimeOfDay(): Duration;
    /**
     * Get the weather patch end time of day as an ISO8601 string.
     * @deprecated
     */
    get endTimeOfDay(): string;
    /**
     * Set the weather patch end time of day using a Duration. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set dEndTimeOfDay(value: Duration);
    /**
     * Set the weather patch end time of day using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set endTimeOfDay(value: string);
    /**
     * Any user comments about the weather patch (optional).
     */
    comments: string;
    /**
     * The type of weather patch (required).
     */
    type: WeatherPatchType;
    /**
     * The filename associated with this weather patch. Only valid if type is FILE.
     */
    private _filename;
    /**
     * Get the location of the file containing the weather patch.
     */
    get filename(): string;
    /**
     * Set the location of the file containing the weather patch. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set filename(value: string);
    /**
     * An array of LatLon describing the weather patch. Only valid if type is POLYGON.
     */
    feature: Array<LatLon>;
    /**
     * The temperature to apply with this patch.
     */
    temperature: WeatherPatch_Temperature;
    /**
     * The relative humidty to apply with this patch.
     */
    rh: WeatherPatch_RelativeHumidity;
    /**
     * The precipitation to apply with this patch.
     */
    precip: WeatherPatch_Precipitation;
    /**
     * The wind speed to apply with this patch.
     */
    windSpeed: WeatherPatch_WindSpeed;
    /**
     * The wind direction to apply with this patch.
     */
    windDirection: WeatherPatch_WindDirection;
    getId(): string;
    /**
     * Set the name of the weather patch. This name must be unique within
     * the simulation. The name will get a default value when the
     * weather patch is constructed but can be overriden with this method.
     */
    setName(name: string): void;
    constructor();
    /**
     * Set the temperature operation for the weather patch.
     * @param operation The operation to apply.
     * @param value The value to apply
     */
    setTemperatureOperation(operation: WeatherPatchOperation, value: number): void;
    /**
     * Unset the temperature operation for the weather patch.
     */
    unsetTemperatureOperation(): void;
    /**
     * Set the relative humidity operation for the weather patch.
     * @param operation The operation to apply.
     * @param value The value to apply (as a percent [0-100]).
     */
    setRhOperation(operation: WeatherPatchOperation, value: number): void;
    /**
     * Unset the relative humidty operation for the weather patch.
     */
    unsetRhOperation(): void;
    /**
     * Set the precipitation operation for the weather patch.
     * @param operation The operation to apply.
     * @param value The value to apply
     */
    setPrecipitationOperation(operation: WeatherPatchOperation, value: number): void;
    /**
     * Unset the precipitation operation for the weather patch.
     */
    unsetPrecipitationOperation(): void;
    /**
     * Set the wind speed operation for the weather patch.
     * @param operation The operation to apply.
     * @param value The value to apply
     */
    setWindSpeedOperation(operation: WeatherPatchOperation, value: number): void;
    /**
     * Unset the wind speed operation for the weather patch.
     */
    unsetWindSpeedOperation(): void;
    /**
     * Set the wind direction operation for the weather patch.
     * @param operation The operation to apply.
     * @param value The value to apply
     */
    setWindDirOperation(operation: WeatherPatchOperation, value: number): void;
    /**
     * Unset the wind direction operation for the weather patch.
     */
    unsetWindDirOperation(): void;
    /**
     * Are all required values set.
     */
    isValid(): boolean;
    /**
     * Find all errors in the weather patch.
     * @returns A list of errors in the weather patch.
     */
    checkValid(): Array<ValidationError>;
    /**
     * Streams the weather patch file to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
export declare enum WeatherGridSector {
    NORTH = 0,
    NORTHEAST = 1,
    EAST = 2,
    SOUTHEAST = 3,
    SOUTH = 4,
    SOUTHWEST = 5,
    WEST = 6,
    NORTHWEST = 7
}
export declare enum WeatherGridType {
    DIRECTION = "direction",
    SPEED = "speed"
}
/**
 * Information about a grid file.
 * @author "Travis Redpath"
 */
export declare class WeatherGrid_GridFile {
    /**
     * The wind speed (required).
     */
    private _speed;
    /**
     * Get the wind speed.
     */
    get speed(): number;
    /**
     * Set the wind speed (km/h).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set speed(value: number);
    /**
     * The sector to apply this grid file to (required).
     */
    sector: WeatherGridSector;
    /**
     * The location of the grid file (required).
     */
    private _filename;
    /**
     * Get the location of the file containing the grid data.
     */
    get filename(): string;
    /**
     * Set the location of the file containing the grid data. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set filename(value: string);
    /**
     * The projection file for the grid file (required).
     */
    projection: string;
    /**
     * Check to make sure all parameters have been set to valid values.
     */
    isValid(): boolean;
    /**
     * Find a list of all errors in the weather grid file.
     * @returns A list of errors.
     */
    checkValid(): Array<ValidationError>;
}
/**
 * Information about a weather grid input.
 * @author "Travis Redpath"
 */
export declare class WeatherGrid {
    private static readonly PARAM_WEATHER_GRID;
    protected static counter: number;
    /**
     * The name of the weather grid. The name must be unique amongst the weather grid collection.
     */
    private _id;
    /**
     * Get the name of the weather grid.
     */
    get id(): string;
    /**
     * Set the name of the weather grid. Must be unique amongst the weather grid collection. Cannot be null or empty.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set id(value: string);
    /**
     * Any comments about the weather grid (optional).
     */
    comments: string;
    /**
     * The grid start time (required).
     */
    private _startTime;
    /**
     * Get the weather grid start time as a Luxon DateTime.
     */
    get lStartTime(): DateTime;
    /**
     * Get the weather grid start time as an ISO8601 string.
     * @deprecated
     */
    get startTime(): string;
    /**
     * Set the weather grid start time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lStartTime(value: DateTime);
    /**
     * Set the weather grid start time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set startTime(value: string);
    /**
     * The grid end time (required).
     */
    private _endTime;
    /**
     * Get the weather grid end time as a Luxon DateTime.
     */
    get lEndTime(): DateTime;
    /**
     * Get the weather grid end time as an ISO8601 string.
     * @deprecated
     */
    get endTime(): string;
    /**
     * Set the weather grid end time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lEndTime(value: DateTime);
    /**
     * Set the weather grid end time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set endTime(value: string);
    /**
     * The patches start time of day (required).
     */
    private _startTimeOfDay;
    /**
     * Get the weather grid start time of day as a Duration.
     */
    get dStartTimeOfDay(): Duration;
    /**
     * Get the weather grid start time of day as an ISO8601 string.
     * @deprecated
     */
    get startTimeOfDay(): string;
    /**
     * Set the weather grid start time of day using a Duration. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set dStartTimeOfDay(value: Duration);
    /**
     * Set the weather grid start time of day using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set startTimeOfDay(value: string);
    /**
     * The patches end time of day (required).
     */
    private _endTimeOfDay;
    /**
     * Get the weather grid end time of day as a Duration.
     */
    get dEndTimeOfDay(): Duration;
    /**
     * Get the weather grid end time of day as an ISO8601 string.
     * @deprecated
     */
    get endTimeOfDay(): string;
    /**
     * Set the weather grid end time of day using a Duration. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set dEndTimeOfDay(value: Duration);
    /**
     * Set the weather grid end time of day using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set endTimeOfDay(value: string);
    /**
     * An array of WeatherGrid_GridFile. There can be one for each wind sector (North, Northeast, East, etc.).
     */
    gridData: WeatherGrid_GridFile[];
    /**
     * Whether this wind grid is for wind speed, or wind direction (required). Must be one of TYPE_DIRECTION and TYPE_SPEED.
     */
    type: WeatherGridType;
    /**
     * The default sector data. If specified {@link defaultValuesProjection} must also be specified.
     */
    defaultValuesFile: string;
    /**
     * The projection file for the default sector data. Must be specified if {@link defaultValuesFile} is specified.
     */
    defaultValuesProjection: string;
    /**
     * A convenience method for specifying the default values grid file and its projection.
     * @param defaultValuesFile The file or attachment that contains a grid of default values for the grid.
     * @param defaultValuesProjection The projection file for the specified default values file.
     */
    setDefaultValuesGrid(defaultValuesFile: string, defaultValuesProjection: string): void;
    getId(): string;
    /**
     * Set the name of the weather grid. This name must be unique within
     * the simulation. The name will get a default value when the
     * weather grid is constructed but can be overriden with this method.
     */
    setName(name: string): void;
    constructor();
    /**
     * Add a direction file to the weather grid.
     * @param filename The location of the grid file. Can either be the actual file path or the attachment URL returned
     * 				   from {@link PSaaS#addAttachment}
     * @param projection The projection file.
     * @param sector The sector (wind direction) to apply this grid file to. Only one of each sector is allowed per station.
     * @param speed The wind speed.
     * @throws Exception Throws an exception if a file for the same sector has already been added.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set and {@link SocketMsg.skipFileTests} is not set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if the file doesn't exist.
     */
    addDirectionFile(filename: string, projection: string, sector: WeatherGridSector, speed: number): WeatherGrid_GridFile;
    /**
     * Remove a WeatherGrid_GridFile object from the weather grid.
     * @param weatherGrid The WeatherGrid_GridFile object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeDirectionFile(weatherGrid: WeatherGrid_GridFile): boolean;
    /**
     * Are all required values set.
     */
    isValid(): boolean;
    /**
     * Find all errors in the weather grid.
     * @returns A list of errors found.
     */
    checkValid(): Array<ValidationError>;
    /**
     * Streams the weather grid file to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
export declare enum FuelPatchType {
    FILE = 0,
    POLYGON = 2,
    LANDSCAPE = 4
}
export declare enum FromFuel {
    NODATA = "noData",
    ALL = "allFuels",
    ALL_COMBUSTABLE = "allCombustibleFuels"
}
/**
 * A fuel patch file.
 * @author "Travis Redpath"
 */
export declare class FuelPatch {
    private static readonly PARAM_FUELPATCH;
    protected static counter: number;
    /**
     * The name of the fuel patch. The name must be unique amongst the fuel patch collection.
     */
    private _id;
    /**
     * Get the name of the fuel patch.
     */
    get id(): string;
    /**
     * Set the name of the fuel patch. Must be unique amongst the fuel patch collection. Cannot be null or empty.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set id(value: string);
    /**
     * The fuel the patch changes to.
     */
    toFuel: string;
    /**
     * Any comments about the fuel patch (optional).
     */
    comments: string;
    /**
     * The type of fuel patch (required).
     */
    type: FuelPatchType;
    /**
     * The filename associated with this fuel patch. Only valid if type is FILE.
     */
    private _filename;
    /**
     * Get the location of the file containing the fuel patch.
     */
    get filename(): string;
    /**
     * Set the location of the file containing the fuel patch. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set filename(value: string);
    /**
     * An array of LatLon describing the fuel patch. Only valid if type is POLYGON.
     */
    feature: LatLon[];
    /**
     * The fuel that the patch changes from (one of this, {@link #fromFuelIndex}, or {@link #fromFuelRule} is required).
     */
    fromFuel: string;
    /**
     * The rule about which fuels to apply the patch to (one of this, {@link #fromFuelIndex}, or {@link #fromFuel} is required).
     * If fromFuel is not specified this must be set.
     */
    fromFuelRule: FromFuel;
    /**
     * Instead of using the name of a fuel, reference it by index.
     */
    toFuelIndex: number;
    /**
     * Instead of using the name of a fuel, reference it by index.
     */
    fromFuelIndex: number;
    getId(): string;
    /**
     * Set the name of the fuel patch. This name must be unique within
     * the simulation. The name will get a default value when the
     * fuel patch is constructed but can be overriden with this method.
     */
    setName(name: string): void;
    constructor();
    /**
     * Are all required values set.
     */
    isValid(): boolean;
    /**
     * Find all errors that may be in the fuel patch.
     */
    checkValid(): Array<ValidationError>;
    /**
     * Streams the fuel patch file to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
export declare enum FuelBreakType {
    FILE = 0,
    POLYLINE = 1,
    POLYGON = 2
}
/**
 * A fuel break file.
 * @author "Travis Redpath"
 */
export declare class FuelBreak {
    private static readonly PARAM_FUELBREAK;
    protected static counter: number;
    /**
     * The name of the fuel break. The name must be unique amongst fuel break collections.
     */
    private _id;
    /**
     * Get the name of the fuel break.
     */
    get id(): string;
    /**
     * Set the name of the fuel break. Must be unique amongst the fuel break collection. Cannot be null or empty.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set id(value: string);
    /**
     * The width of the fuel break (required if type is POLYLINE, otherwise ignored).
     */
    private _width;
    /**
     * Get the width of the fuel break.
     */
    get width(): number;
    /**
     * Set the width of the fuel break (m).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set width(value: number);
    /**
     * Comments about the fuel break (optional).
     */
    comments: string;
    /**
     * The type of fuelbreak (required).
     */
    type: FuelBreakType;
    /**
     * The filename associated with this fuel break. Only valid if type is FILE.
     */
    private _filename;
    /**
     * Get the location of the file containing the fuel break.
     */
    get filename(): string;
    /**
     * Set the location of the file containing the fuel break. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set filename(value: string);
    /**
     * An array of LatLon describing the fuel break. Only valid if type is POLYLINE or POLYGON.
     */
    feature: LatLon[];
    getId(): string;
    /**
     * Set the name of the fuel break. This name must be unique within
     * the simulation. The name will get a default value when the
     * fuel break is constructed but can be overriden with this method.
     */
    setName(name: string): void;
    constructor();
    /**
     * Are all required values set.
     * @return boolean
     */
    isValid(): boolean;
    /**
     * Find any errors that may exist in the fuelbreak.
     * @returns A list of errors.
     */
    checkValid(): Array<ValidationError>;
    /**
     * Streams the fuel break file to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
/**
 * All information regarding the input files for PSaaS.
 * @author "Travis Redpath"
 */
export declare class PSaaSInputsFiles {
    private static readonly PARAM_PROJ;
    private static readonly PARAM_LUT;
    private static readonly PARAM_FUELMAP;
    private static readonly PARAM_ELEVATION;
    /**The projection file (required).
     * The location of the projection file.
     */
    private _projFile;
    /**
     * Get the location of the projection file.
     */
    get projFile(): string;
    /**
     * Set the location of the projection file. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set projFile(value: string);
    /**The LUT file (required).
     * The location of the LUT file.
     */
    private _lutFile;
    /**
     * Get the location of the lookup table file.
     */
    get lutFile(): string;
    /**
     * Set the location of the lookup table file. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lutFile(value: string);
    /**The fuel map file (required).
     * The location of the fuel map file.
     */
    private _fuelmapFile;
    /**
     * Get the location of the fuel map file.
     */
    get fuelmapFile(): string;
    /**
     * Set the location of the fuel map file. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set fuelmapFile(value: string);
    /**The elevation map file (optional).
     * The location of the elevation file.
     */
    private _elevFile;
    /**
     * Get the location of the elevation file.
     */
    get elevFile(): string;
    /**
     * Set the location of the elevation file. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set). Can be null to remove the elevation file.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set elevFile(value: string);
    /**
     * An array of fuel break files.
     */
    fuelBreakFiles: FuelBreak[];
    /**
     * An array of fuel patch files.
     */
    fuelPatchFiles: FuelPatch[];
    /**
     * An array of weather files.
     */
    weatherGridFiles: WeatherGrid[];
    /**
     * An array of weather patch files.
     */
    weatherPatchFiles: WeatherPatch[];
    /**
     * An array of grid files.
     */
    gridFiles: GridFile[];
    /**
     * Are all required values specified.
     */
    isValid(): boolean;
    /**
     * Find all errors that exist in the PSaaS input files.
     * @returns A list of errors that were found.
     */
    checkValid(): Array<ValidationError>;
    /**
     * Streams the input files to a socket.
     * @param builder
     */
    stream(builder: net.Socket): string;
}
export declare enum HFFMCMethod {
    VAN_WAGNER = 0,
    LAWSON = 1
}
/**
 * Information about a weather stream.
 * @author "Travis Redpath"
 */
export declare class WeatherStream {
    private static readonly PARAM_WEATHERSTREAM;
    protected static counter: number;
    /**
     * The name of the weather stream. The name must be unique amongst a weather stream collection.
     */
    private _id;
    /**
     * Get the name of the weather stream.
     */
    get id(): string;
    /**
     * Set the name of the weather stream. Must be unique amongst the weather stream collection. Cannot be null or empty.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set id(value: string);
    /**
     * User comments about the weather stream (optional).
     */
    comments: string;
    /**
     * The location of the file containing the stream data (required).
     */
    private _filename;
    /**
     * Get the location of the file containing the weather stream.
     */
    get filename(): string;
    /**
     * Set the location of the file containing the weather stream. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set filename(value: string);
    /**
     * Yesterday's daily starting fine fuel moisture code (required).
     */
    private _starting_ffmc;
    /**
     * Get yesterday's daily starting fine fuel moisture code.
     */
    get starting_ffmc(): number;
    /**
     * Set yesterday's daily starting fine fuel moisture code. Must be in [0, 101].
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set starting_ffmc(value: number);
    /**
     * Yesterday's daily starting duff moisture code (required).
     */
    private _starting_dmc;
    /**
     * Get yesterday's daily starting duff moisture code.
     */
    get starting_dmc(): number;
    /**
     * Set yesterday's daily starting duff moisture code. Must be in [0, 500].
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set starting_dmc(value: number);
    /**
     * Yesterday's daily starting drought code (required).
     */
    private _starting_dc;
    /**
     * Get yesterday's daily starting drought code.
     */
    get starting_dc(): number;
    /**
     * Set yesterday's daily starting drought code. Must be in [0, 1500].
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set starting_dc(value: number);
    /**
     * Yesterday's daily starting precipitation (13:01-23:00 if daylight savings time, 12:01-23:00 otherwise) (required).
     */
    private _starting_precip;
    /**
     * Get yesterday's daily starting precipitation.
     */
    get starting_precip(): number;
    /**
     * Set yesterday's daily starting precipitation. Must be greater than or equal to 0.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set starting_precip(value: number);
    /**
     * The hour that the HFFMC value is for (required). Must be between -1 and 23 inclusive.
     */
    private _hffmc_hour;
    /**
     * Get the hour that the HFFMC value is for.
     */
    get hffmc_hour(): number;
    /**
     * Set the hour that the HFFMC value is for. Must be in [0,23]. Use -1 to use the default.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set hffmc_hour(value: number);
    /**
     * The HFFMC value (required).
     */
    hffmc_value: number;
    /**
     * The HFFMC calculation method (required).
     */
    hffmc_method: HFFMCMethod;
    /**
     * Diurnal parameters - temperature alpha (optional).
     */
    diurnal_temperature_alpha: number;
    /**
     * Diurnal parameters - temperature beta (optional).
     */
    diurnal_temperature_beta: number;
    /**
     * Diurnal parameters - temperature gamma (optional).
     */
    diurnal_temperature_gamma: number;
    /**
     * Diurnal parameters - wind speed alpha (optional).
     */
    diurnal_windspeed_alpha: number;
    /**
     * Diurnal parameters - wind speed beta (optional).
     */
    diurnal_windspeed_beta: number;
    /**
     * Diurnal parameters - wind speed gamma (optional).
     */
    diurnal_windspeed_gamma: number;
    /**
     * The starting time of the weather stream (required).
     */
    private _start_time;
    /**
     * Get the weather stream starting date as a Luxon DateTime.
     */
    get lstart_time(): DateTime;
    /**
     * Get the weather grid end time as an ISO8601 string.
     * @deprecated
     */
    get start_time(): string;
    /**
     * Set the weather grid end time using a Luxon DateTime. Cannot be null. Only the date component will be used.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lstart_time(value: DateTime);
    /**
     * Set the weather grid end time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set start_time(value: string);
    /**
     * The ending time of the weather stream (required). Must be formatted as 'YYYY-MM-DD'.
     */
    private _end_time;
    /**
     * Get the weather stream end time as a Luxon DateTime.
     */
    get lend_time(): DateTime;
    /**
     * Get the weather stream end time as an ISO8601 string.
     * @deprecated
     */
    get end_time(): string;
    /**
     * Set the weather stream end date using a Luxon DateTime. Cannot be null. Only the date component will be used.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lend_time(value: DateTime);
    /**
     * Set the weather stream end date using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set end_time(value: string);
    /**
     * The ID of the weather station that this stream came from.
     */
    protected parentId: string;
    /**
     * Get the unique ID of this weather stream.
     */
    getId(): string;
    /**
     * Set the name of the weather stream. This name must be unique within
     * the simulation. The name will get a default value when the
     * weather stream is constructed but can be overriden with this method.
     */
    setName(name: string): void;
    /**
     * Get the unique ID of the weather station that this stream came from.
     */
    getParentId(): string;
    /**
     * Construct a new weather stream.
     * @param parentId The ID of the weather station that the stream came from.
     */
    constructor(parentId: string);
    /**
     * Checks to see if all required values have been set.
     */
    isValid(): boolean;
    /**
     * Find any errors that may be in the weather stream.
     * @returns A list of errors that were found.
     */
    checkValid(): Array<ValidationError>;
    /**
     * Streams the weather station to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
export declare class WeatherStation {
    private static readonly PARAM_WEATHERSTATION;
    protected static counter: number;
    /**
     * The name of the weather station. The name must be unique amongst a weather station collection.
     */
    private _id;
    /**
     * Get the name of the weather station.
     */
    get id(): string;
    /**
     * Set the name of the weather station. Must be unique amongst the weather station collection. Cannot be null or empty.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set id(value: string);
    /**
     * The location of the weather station (required).
     */
    location: LatLon;
    /**
     * The weather streams from this weather station.
     */
    streams: WeatherStream[];
    /**
     * User comments about the weather station (optional).
     */
    comments: string;
    /**
     * The elevation of the weather station (required).
     */
    elevation: number;
    getId(): string;
    /**
     * Set the name of the weather station. This name must be unique within
     * the simulation. The name will get a default value when the
     * weather station is constructed but can be overriden with this method.
     */
    setName(name: string): void;
    constructor();
    /**
     * Checks to see if all required values are specified.
     */
    isValid(): boolean;
    /**
     * Look for errors in the weather station.
     * @returns A list of all errors found in the weather station.
     */
    checkValid(): Array<ValidationError>;
    /**
     * Add a weather stream to the station.
     * @param filename The file location for the streams data. Can either be the actual file path
     * 				   or the attachment URL returned from {@link PSaaS#addAttachment}
     * @param hffmc_value The HFFMC value.
     * @param hffmc_hour The hour the HFFMC value was measured. Must be between -1 and 23 inclusive.
     * @param hffmc_method The method to calculate HFFMC.
     * @param starting_ffmc The starting FFMC value.
     * @param starting_dmc The starting DMC value.
     * @param starting_dc The starting DC value.
     * @param starting_precip The starting amount of precipitation.
     * @param start_time The starting time of the weather stream. If a string is used it must be formatted as "YYYY-MM-DD".
     * @param end_time The ending time of the weather stream. If a string is used it must be formatted as "YYYY-MM-DD".
     * @param comments An optional user comment to attach to the weather stream.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set and {@link SocketMsg.skipFileTests} is not set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if the file doesn't exist.
     * @return WeatherStream
     */
    addWeatherStream(filename: string, hffmc_value: number, hffmc_hour: number, hffmc_method: HFFMCMethod, starting_ffmc: number, starting_dmc: number, starting_dc: number, starting_precip: number, start_time: string | DateTime, end_time: string | DateTime, comments?: string): WeatherStream;
    /**
     * Add a weather stream to the station with specified diurnal parameters.
     * @param filename The file location for the streams data. Can either be the actual file path
     * 				   or the attachment URL returned from {@link PSaaS#addAttachment}
     * @param hffmc_value The HFFMC value.
     * @param hffmc_hour The hour the HFFMC value was measured. Must be between -1 and 23 inclusive.
     * @param hffmc_method The method to calculate HFFMC.
     * @param starting_ffmc The starting FFMC value.
     * @param starting_dmc The starting DMC value.
     * @param starting_dc The starting DC value.
     * @param starting_precip The starting amount of precipitation.
     * @param start_time The starting time of the weather stream. Must be formatted as "YYYY-MM-DD"
     * @param end_time The ending time of the weather stream. Must be formatted as "YYYY-MM-DD"
     * @param talpha The diurnal alpha temperature parameter.
     * @param tbeta The diurnal alpha temperature parameter.
     * @param tgamma The diurnal gamma temperature parameter.
     * @param wsalpha The diurnal alpha wind speed parameter.
     * @param wsbeta The diurnal beta wind speed parameter.
     * @param wsgamma The diurnal gamma wind speed parameter.
     * @param comments An optional user comment to attach to the weather stream.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set and {@link SocketMsg.skipFileTests} is not set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if the file doesn't exist.
     * @return WeatherStream
     */
    addWeatherStreamWithDiurnalParameters(filename: string, hffmc_value: number, hffmc_hour: number, hffmc_method: HFFMCMethod, starting_ffmc: number, starting_dmc: number, starting_dc: number, starting_precip: number, start_time: string | DateTime, end_time: string | DateTime, talpha: number, tbeta: number, tgamma: number, wsalpha: number, wsbeta: number, wsgamma: number, comments?: string): WeatherStream;
    /**
     * Remove a WeatherStream object from the weather grid.
     * @param weatherStream The WeatherStream object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeWeatherStream(weatherStream: WeatherStream): boolean;
    /**
     * Streams the weather station to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
export declare enum IgnitionType {
    FILE = 0,
    POLYLINE = 1,
    POLYGON = 2,
    POINT = 4
}
interface AttributeEntry {
    key: string;
    value: string | number;
}
/**
 * Information about an ignition input.
 * @author "Travis Redpath"
 */
export declare class Ignition {
    private static readonly PARAM_IGNITION;
    protected static counter: number;
    /**
     * The name of the ignition. The name must be unique amongst ignition collections.
     */
    private _id;
    /**
     * Get the name of the ignition.
     */
    get id(): string;
    /**
     * Set the name of the ignition. Must be unique amongst the ignition collection. Cannot be null or empty.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set id(value: string);
    /**
     * User comments about the ignition (optional).
     */
    comments: string;
    /**
     * The ignition start time (required).
     */
    private _startTime;
    /**
     * Get the ignition start time as a Luxon DateTime.
     */
    get lStartTime(): DateTime;
    /**
     * Get the ignition start time as an ISO8601 string.
     * @deprecated
     */
    get startTime(): string;
    /**
     * Set the ignition start time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lStartTime(value: DateTime);
    /**
     * Set the ignition start time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set startTime(value: string);
    /**
     * The type of ignition (required).
     */
    type: IgnitionType;
    /**
     * The filename associated with this ignition. Only valid if type is FILE.
     */
    private _filename;
    /**
     * Get the location of the file containing the ignition.
     */
    get filename(): string;
    /**
     * Set the location of the file containing the ignition. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set filename(value: string);
    /**
     * An array of LatLon describing the ignition. Only valid if type is POLYLINE, POLYGON, or POINT.
     */
    feature: LatLon[];
    /**
     * A list of attributes for the ignition. Not valid for {@link #filename} types.
     * Valid types for the value are Integer, Long, Double, and String.
     */
    attributes: AttributeEntry[];
    getId(): string;
    /**
     * Set the name of the ignition. This name must be unique within
     * the simulation. The name will get a default value when the
     * ignition is constructed but can be overriden with this method.
     */
    setName(name: string): void;
    constructor();
    /**
     * Add a new point to the ignition shape. Only valid for POLYLINE, POLYGON, or POINT.
     * @param point The point to add to the ignition.
     * @returns The current ignition object so that multiple additions can be chained.
     */
    addPoint(point: LatLon): Ignition;
    /**
     * Checks to see if all required values have been set.
     */
    isValid(): boolean;
    checkValid(): Array<ValidationError>;
    /**
     * Streams the ignition to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
/**
 * The type of shape that is being used to describe an
 * asset.
 */
export declare enum AssetShapeType {
    FILE = 0,
    POLYLINE = 1,
    POLYGON = 2,
    POINT = 4
}
/**
 * An asset that can be used to stop a simulation early.
 * @author "Travis Redpath"
 */
export declare class AssetFile {
    private static readonly PARAM_ASSET_FILE;
    protected static counter: number;
    /**
     * The name of the asset. The name must be unique amongst asset file collections.
     */
    private _id;
    /**
     * Get the name of the asset.
     */
    get id(): string;
    /**
     * Set the name of the asset. Must be unique amongst the asset collection. Cannot be null or empty.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set id(value: string);
    /**
     * User comments about the asset (optional).
     */
    comments: string;
    /**
     * The type of asset (required).
     */
    type: AssetShapeType;
    /**
     * The filename associated with this asset. Only valid if type is FILE.
     */
    private _filename;
    /**
     * Get the location of the file containing the asset.
     */
    get filename(): string;
    /**
     * Set the location of the file containing the asset. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set filename(value: string);
    /**
     * An array of LatLon describing the asset. Only valid if type is POLYLINE, POLYGON, or POINT.
     */
    feature: LatLon[];
    /**
     * The buffer size to use for line or point assets. If negative, no buffer will be used.
     */
    buffer: number;
    getId(): string;
    /**
     * Set the name of the asset. This name must be unique within
     * the simulation. The name will get a default value when the
     * asset is constructed but can be overriden with this method.
     */
    setName(name: string): void;
    constructor();
    /**
     * Checks to see if all required values have been set.
     */
    isValid(): boolean;
    /**
     * Find all errors that may exist in the asset.
     * @returns A list of errors that were found.
     */
    checkValid(): Array<ValidationError>;
    /**
     * Streams the ignition to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
/**
 * A target to direct simulated weather towards.
 */
export declare class TargetFile {
    private static readonly PARAM_TARGET_FILE;
    protected static counter: number;
    /**
     * The name of the target. The name must be unique amongst target file collections.
     */
    private _id;
    /**
     * Get the name of the target.
     */
    get id(): string;
    /**
     * Set the name of the target. Must be unique amongst the target collection. Cannot be null or empty.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set id(value: string);
    /**
     * User comments about the target (optional).
     */
    comments: string;
    /**
     * The type of target (required).
     */
    type: AssetShapeType;
    /**
     * The filename associated with this target. Only valid if type is FILE.
     */
    private _filename;
    /**
     * Get the location of the file containing the target.
     */
    get filename(): string;
    /**
     * Set the location of the file containing the target. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set filename(value: string);
    /**
     * An array of LatLon describing the target. Only valid if type is POLYLINE, POLYGON, or POINT.
     */
    feature: LatLon[];
    getId(): string;
    /**
     * Set the name of the target. This name must be unique within
     * the simulation. The name will get a default value when the
     * target is constructed but can be overriden with this method.
     */
    setName(name: string): void;
    constructor();
    /**
     * Checks to see if all required values have been set.
     */
    isValid(): boolean;
    /**
     * Find all errors that may exist in the asset.
     * @returns A list of errors that were found.
     */
    checkValid(): Array<ValidationError>;
    /**
     * Streams the ignition to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
/**
 * Options for associating an ignition point with a scenario.
 */
export declare class IgnitionReference {
    /**
     * The ID of the ignition.
     */
    ignition: string;
    /**
     * Optional sub-scenario building options.
     */
    polylineIgnitionOptions: PolylineIgnitionOptions;
    /**
     * Optional sub-scenario building options.
     */
    multiPointIgnitionOptions: MultiPointIgnitionOptions;
    /**
     * Optional sub-scenario building options.
     */
    singlePointIgnitionOptions: SinglePointIgnitionOptions;
    isValid(): boolean;
    /**
     * Find all errors that may exist in the ignition reference.
     * @returns A list of errors that were found.
     */
    checkValid(): Array<ValidationError>;
}
export declare class PolylineIgnitionOptions {
    /**
     * A name for the sub-scenario
     */
    name: string;
    /**
     * The spacing between points (expressed in meters)
     */
    pointSpacing: number;
    /**
     * Index of the polyline to use, or -1 to use all polylines.
     */
    polyIndex: number;
    /**
     * Index of the point ignition to use in the specified polyline(s), or -1 to use all points.
     */
    pointIndex: number;
    checkValid(): Array<ValidationError>;
}
export declare class MultiPointIgnitionOptions {
    /**
     * A name for the sub-scenario.
     */
    name: string;
    /**
     * Index of the point ignition to use in the specified polyline(s), or -1 to use all points.
     */
    pointIndex: number;
    checkValid(): Array<ValidationError>;
}
export declare class SinglePointIgnitionOptions {
    /**
     * A name for the sub-scenario.
     */
    name: string;
    checkValid(): Array<ValidationError>;
}
/**
 * A condition for burning.
 * @author "Travis Redpath"
 */
export declare class BurningConditions {
    /**
     * The date the burning condition is in effect on (required).
     */
    private _date;
    /**
     * Get the burning condition date as a Luxon DateTime.
     */
    get lDate(): DateTime;
    /**
     * Get the burning condition date as an ISO8601 string.
     * @deprecated
     */
    get date(): string;
    /**
     * Set the burning condition date using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lDate(value: DateTime);
    /**
     * Set the burning condition date using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set date(value: string);
    /**
     * The time of day that the burning condition starts to take effect (optional).
     */
    startTime: Duration;
    /**
     * The time of day that the burning condition stops (optional).
     */
    endTime: Duration;
    /**
     * The minimum FWI value that will allow burning (optional).
     */
    private _fwiGreater;
    /**
     * Get the minimum FWI value that will allow burning.
     */
    get fwiGreater(): number;
    /**
     * Set the minimum FWI value that will allow burning. Must be greater than or equal to 0.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set fwiGreater(value: number);
    /**
     * The minimum wind speed that will allow burning (optional).
     */
    private _wsGreater;
    /**
     * Get the minimum wind speed that will allow burning.
     */
    get wsGreater(): number;
    /**
     * Set the minimum wind speed that will allow burning. Must be in [0, 200].
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set wsGreater(value: number);
    /**
     * The maximum relative humidity that will allow burning (optional).
     */
    private _rhLess;
    /**
     * Get the maximum relative humidity that will allow burning.
     */
    get rhLess(): number;
    /**
     * Set the maximum relative humidity that will allow burning. Must be in [0, 100].
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set rhLess(value: number);
    /**
     * The minimum ISI that will allow burning (optional).
     */
    private _isiGreater;
    /**
     * Get the minimum ISI that will allow burning.
     */
    get isiGreater(): number;
    /**
     * Set the minimum ISI that will allow burning. Must be greater than or equal to 0.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set isiGreater(value: number);
    constructor();
    /**
     * Checks to see if all required values have been set.
     */
    isValid(): boolean;
    /**
     * Find all errors that may exist in the burn condition.
     * @returns A list of errors that were found.
     */
    checkValid(): Array<ValidationError>;
}
export declare class LayerInfoOptions {
    subNames: Array<string>;
}
export declare class LayerInfo {
    /**
     * The name of the grid file to add.
     */
    protected name: string;
    /**
     * The layers index.
     */
    index: number;
    /**
     * Options for the layer when creating sub-scenarios.
     */
    options: LayerInfoOptions;
    getName(): string;
    constructor(id: string);
    isValid(): boolean;
    /**
     * Find all errors that may exist in the layer reference.
     * @returns A list of all errors that were found.
     */
    checkValid(): Array<ValidationError>;
}
/**
 * A reference to an asset that has been added to a scenario. Contains options
 * for how to handle the asset.
 */
export declare class AssetReference {
    /**
     * The name of the asset that was added.
     */
    protected name: string;
    /**
     * The affect the asset will have on the simulation.
     */
    operation: AssetOperation;
    /**
     * The number of assets that need to be reached before the simulation will stop. Only valid if operation is AssetOperation::STOP_AFTER_X.
     */
    collisionCount: number;
    getName(): string;
    constructor(id: string);
    checkValid(): Array<ValidationError>;
}
/**
 * A reference to a target that has been added to a scenario. Contains options
 * for how to handle the target.
 */
export declare class TargetReference {
    /**
     * The name of the target that was added.
     */
    protected name: string;
    /**
     * An index of a geometry within the shape to use as the target.
     */
    geometryIndex: number;
    /**
     * An index of a point within the shape to use as the target.
     */
    pointIndex: number;
    getName(): string;
    constructor(id: string);
    checkValid(): Array<ValidationError>;
}
/**
 * Settings to modify PSaaS behaviour at the end of every timestep.
 * @author "Travis Redpath"
 */
export declare class TimestepSettings {
    private static readonly PARAM_EMIT_STATISTIC;
    private statistics;
    /**
     * Check to see if a global statistic if valid to be used as a timestep setting.
     * @param stat True if the input statistic if valid for timestep settings.
     */
    private static validateInput;
    /**
     * Add a statistic to output.
     * @param stat The name of the statistic to add.
     * @returns The added statistic, or null if an invalid statistic was passed.
     */
    addStatistic(stat: GlobalStatistics.TOTAL_BURN_AREA | GlobalStatistics.TOTAL_PERIMETER | GlobalStatistics.EXTERIOR_PERIMETER | GlobalStatistics.ACTIVE_PERIMETER | GlobalStatistics.TOTAL_PERIMETER_CHANGE | GlobalStatistics.TOTAL_PERIMETER_GROWTH_RATE | GlobalStatistics.EXTERIOR_PERIMETER_CHANGE | GlobalStatistics.EXTERIOR_PERIMETER_GROWTH_RATE | GlobalStatistics.ACTIVE_PERIMETER_CHANGE | GlobalStatistics.ACTIVE_PERIMETER_GROWTH_RATE | GlobalStatistics.AREA_CHANGE | GlobalStatistics.AREA_GROWTH_RATE | GlobalStatistics.NUM_VERTICES | GlobalStatistics.NUM_ACTIVE_VERTICES | GlobalStatistics.CUMULATIVE_ACTIVE_VERTICES | GlobalStatistics.CUMULATIVE_VERTICES | GlobalStatistics.NUM_FRONTS | GlobalStatistics.NUM_ACTIVE_FRONTS | GlobalStatistics.MAX_ROS | GlobalStatistics.MAX_CFB | GlobalStatistics.MAX_CFC | GlobalStatistics.MAX_SFC | GlobalStatistics.MAX_TFC | GlobalStatistics.MAX_FI | GlobalStatistics.MAX_FL | GlobalStatistics.TICKS | GlobalStatistics.PROCESSING_TIME | GlobalStatistics.GROWTH_TIME | GlobalStatistics.DATE_TIME | GlobalStatistics.SCENARIO_NAME | GlobalStatistics.HFI | GlobalStatistics.HCFB): GlobalStatistics;
    /**
     * Remove a statistic string from the statistics.
     * @param statistic The statistic string to remove
     * @returns A boolean indicating if the string was found and removed
     */
    removeStatistic(statistic: GlobalStatistics): boolean;
    /**
     * Find all errors that may exist in the timestep settings.
     * @returns A list of all errors that were found.
     */
    checkValid(): Array<ValidationError>;
    /**
     * Streams the settings to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
/**
 * Options for creating sub-scenarios when adding weather streams to
 * a scenario.
 */
export declare class StreamOptions {
    /**
     * The name of the sub-scenario that will be built using these options.
     */
    name: string;
    /**
     * An override for the scenario start time.
     */
    private _startTime;
    /**
     * Get the override for the weather stream start time as a Luxon DateTime.
     */
    get lStartTime(): DateTime;
    /**
     * Get the override for the weather stream start time as an ISO8601 string.
     * @deprecated
     */
    get startTime(): string;
    /**
     * Set the override for the weather stream start date using a Luxon DateTime. Cannot be null. Only the date component will be used.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lStartTime(value: DateTime);
    /**
     * Set the override for the weather stream start date using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set startTime(value: string);
    /**
     * An override for the scenario end time.
     */
    private _endTime;
    /**
     * Get the override for the weather stream end time as a Luxon DateTime.
     */
    get lEndTime(): DateTime;
    /**
     * Get the override for the weather stream end time as an ISO8601 string.
     * @deprecated
     */
    get endTime(): string;
    /**
     * Set the override for the weather stream end date using a Luxon DateTime. Cannot be null. Only the date component will be used.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lEndTime(value: DateTime);
    /**
     * Set the override for the weather stream end date using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set endTime(value: string);
    /**
     * An override for the ignition start time for any ignitions attached
     * to this sub-scnario. Must be formatted as ISO-8601.
     */
    private _ignitionTime;
    /**
     * Get the override for the ignition start time as a Luxon DateTime.
     */
    get lIgnitionTime(): DateTime;
    /**
     * Get the override for the ignition start time as an ISO8601 string.
     * @deprecated
     */
    get ignitionTime(): string;
    /**
     * Set the override for the ignition start date using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lIgnitionTime(value: DateTime);
    /**
     * Set the override for the ignition start time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set ignitionTime(value: string);
    isValid(): boolean;
    /**
     * Find all errors that may exist in the stream sub-scenario options.
     * @returns A list of all errors that were found.
     */
    checkValid(): Array<ValidationError>;
}
/**
 * A reference to a weather stream/station used by a scenario.
 */
export declare class StationStream {
    /**
     * The name of the weather station.
     */
    station: string;
    /**
     * The name of the weather stream.
     */
    stream: string;
    /**
     * Is this the primary stream attached to the scenario.
     */
    primaryStream: boolean;
    /**
     * Optional settings that determine how sub-scenarios will
     * be created if multiple weather streams are referenced.
     */
    streamOptions: StreamOptions;
    isValid(): boolean;
    /**
     * Find all errors that may exist in the weather stream reference.
     * @returns A list of errors that were found.
     */
    checkValid(): Array<ValidationError>;
}
/**
 * A simulation scenario.
 * @author "Travis Redpath"
 */
export declare class Scenario {
    private static readonly PARAM_SCENARIO_BEGIN;
    private static readonly PARAM_SCENARIO_END;
    private static readonly PARAM_SCENARIONAME;
    private static readonly PARAM_DISPLAY_INTERVAL;
    private static readonly PARAM_COMMENTS;
    private static readonly PARAM_STARTTIME;
    private static readonly PARAM_ENDTIME;
    private static readonly PARAM_BURNINGCONDITION;
    private static readonly PARAM_VECTOR_REF;
    private static readonly PARAM_STREAM_REF;
    private static readonly PARAM_IGNITION_REF;
    private static readonly PARAM_LAYER_INFO;
    private static readonly PARAM_PRIMARY_STREAM;
    private static readonly PARAM_SCENARIO_TO_COPY;
    private static readonly PARAM_ASSET_REF;
    private static readonly PARAM_WIND_TARGET_REF;
    private static readonly PARAM_VECTOR_TARGET_REF;
    protected static counter: number;
    protected isCopy: boolean;
    /**
     * The name of the scenario. The name must be unique amongst the scenarios.
     */
    private _id;
    /**
     * Get the name of the scenario.
     */
    get id(): string;
    /**
     * Set the name of the scenario. Must be unique amongst the scenario collection. Cannot be null or empty.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set id(value: string);
    /**
     * The scenario start time (required). Must be formatted as 'YYYY-MM-DDThh:mm:ss'.
     */
    private _startTime;
    /**
     * Get the scenario start time as a Luxon DateTime.
     */
    get lStartTime(): DateTime;
    /**
     * Get the scenario start time as an ISO8601 string.
     * @deprecated
     */
    get startTime(): string;
    /**
     * Set the scenario start time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lStartTime(value: DateTime);
    /**
     * Set the scenario start time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set startTime(value: string);
    /**
     * The scenario end time (required).
     */
    private _endTime;
    /**
     * Get the scenario end time as a Luxon DateTime.
     */
    get lEndTime(): DateTime;
    /**
     * Get the scenario end time as an ISO8601 string.
     * @deprecated
     */
    get endTime(): string;
    /**
     * Set the scenario end time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lEndTime(value: DateTime);
    /**
     * Set the scenario end time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set endTime(value: string);
    /**
     * The scenarios display interval (required).
     */
    displayInterval: Duration;
    /**
     * User comments about the scenario (optional).
     */
    comments: string;
    /**
     * The FGM option values.
     */
    fgmOptions: FGMOptions;
    /**
     * The FBP option values.
     */
    fbpOptions: FBPOptions;
    /**
     * The FMC option values.
     */
    fmcOptions: FMCOptions;
    /**
     * The FWI option values.
     */
    fwiOptions: FWIOptions;
    /**
     *
     */
    stationStreams: StationStream[];
    /**
     * A set of burning conditions.
     */
    burningConditions: BurningConditions[];
    /**
     * A list of vectors used by this scenario.
     */
    vectorInfo: string[];
    /**
     * A list of ignitions used by this scenario.
     */
    ignitionInfo: IgnitionReference[];
    /**
     * A list of grids used by the scenario. The list contains an index value that defines the order of the layers.
     */
    layerInfo: LayerInfo[];
    /**
     * A list of assets used by this scenario. Assets will be used to end simulations early when a firefront
     * reaches the shape.
     */
    assetFiles: AssetReference[];
    /**
     * A target used by this scenario to modify the wind direction.
     */
    windTargetFile: TargetReference;
    /**
     * A target used by this scenario to modify the vector behaviour.
     */
    vectorTargetFile: TargetReference;
    /**
     * The name of the scenario that will be copied.
     */
    protected scenToCopy: string;
    getId(): string;
    /**
     * Set the name of the scenario. This name must be unique within
     * the simulation. The name will get a default value when the
     * scenario is constructed but can be overriden with this method.
     */
    setName(name: string): void;
    constructor();
    makeCopy(toCopy: Scenario): void;
    /**
     *
     * @param date The date that the condition is valid on. Must be formatted as 'YYYY-MM-DD'.
     * @param startTime The starting hour. Must be between 0 and 23 inclusive.
     * @param endTime The ending hour. Must be between 1 and 24 inclusive.
     * @param fwiGreater The minimum FWI value that will allow burning.
     * @param wsGreater The minimum wind speed that will allow burning.
     * @param rhLess The maximum relative humidity that will allow burning (as a percent [0-100]).
     * @param isiGreater The minimum ISI that will allow burning.
     */
    addBurningCondition(date: string | DateTime, startTime: number, endTime: number, fwiGreater: number, wsGreater: number, rhLess: number, isiGreater: number): BurningConditions;
    /**
     * Remove a BurningConditions object from the burning conditions.
     * @param burningCondition The BurningConditions object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeBurningCondition(burningCondition: BurningConditions): boolean;
    /**
     * Set the FGM options.
     * @param maxAccTS The maximum time step during acceleration.
     * @param distRes The distance resolution.
     * @param perimRes The perimeter resolution.
     * @param minimumSpreadingRos Minimum Spreading ROS.
     * @param stopAtGridEnd Whether to stop the fire spread when the simulated fire reaches the boundary of the grid data.
     * @param breaching Whether breaching is turned on or off.
     * @param dynamicSpatialThreshold Whether using the dynamic spatial threshold algorithm is turned on or off.
     * @param spotting Whether the spotting model should be activated.
     * @param purgeNonDisplayable Whether internal/hidden time steps are retained.
     * @param growthPercentileApplied Whether the growth percentile value is applied.
     * @param growthPercentile Growth percentile, to apply to specific fuel types.
     */
    setFgmOptions(maxAccTS: Duration, distRes: number, perimRes: number, minimumSpreadingRos: number, stopAtGridEnd: boolean, breaching: boolean, dynamicSpatialThreshold: boolean, spotting: boolean, purgeNonDisplayable: boolean, growthPercentileApplied: boolean, growthPercentile: number): void;
    /**
     * Clears the FGM options.
     */
    clearFgmOptions(): void;
    /**
     * How much to nudge ignitions to perform probabilistic analyses on ignition location and start time.
     * Primarily used when ignition information is not 100% reliable.
     * @param dx How much to nudge ignitions to perform probabilistic analyses on ignition location.
     * @param dy How much to nudge ignitions to perform probabilistic analyses on ignition location.
     * @param dt How much to nudge ignitions to perform probabilistic analyses on ignition location and start time.
     */
    setProbabilisticValues(dx: number, dy: number, dt: Duration): void;
    /**
     * Clears the nudge to ignitions to perform probabilistic analyses on ignition location and start time.
     */
    clearProbabilisticValues(): void;
    /**
     * Set the FBP options.
     * @param terrainEffect Use terrain effect.
     * @param windEffect Use wind effect.
     */
    setFbpOptions(terrainEffect: boolean, windEffect: boolean): void;
    /**
     * Clear the FBP options.
     */
    clearFbpOptions(): void;
    /**
     * Set the FMC options.
     * @param perOverrideVal The value for the FMC (%) override. Use -1 for no override.
     * @param nodataElev The elevation where NODATA or no grid exists.
     * @param terrain
     * @param accurateLocation No longer used, left for compatibility.
     */
    setFmcOptions(perOverrideVal: number, nodataElev: number, terrain: boolean, accurateLocation: boolean): void;
    /**
     * Clears the FMC options.
     */
    clearFmcOptions(): void;
    /**
     * Set the FWI options.
     * @param fwiSpacInterp Apply spatial interpolation to FWI values.
     * @param fwiFromSpacWeather Calculate FWI values from temporally interpolated weather.
     * @param historyOnEffectedFWI Apply history to FWI values affected by patches, grids, etc..
     * @param burningConditionsOn Use burning conditions.
     * @param fwiTemporalInterp Apply spatial interpolation to FWI values.
     */
    setFwiOptions(fwiSpacInterp: boolean, fwiFromSpacWeather: boolean, historyOnEffectedFWI: boolean, burningConditionsOn: boolean, fwiTemporalInterp: boolean): void;
    /**
     * Clear the FWI options.
     */
    clearFwiOptions(): void;
    /**
     * Add an ignition to the scenario.
     * @param ignition The ignition to add to the scenario.
     */
    addIgnitionReference(ignition: Ignition): IgnitionReference;
    /**
     * Remove a Ignition object from the ignition info.
     * @param ignition The Ignition object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeIgnitionReference(ignition: Ignition): boolean;
    /**
     * Add a weather stream to the scenario.
     * @param stream The weather stream to add to the scenario.
     */
    addWeatherStreamReference(stream: WeatherStream): StationStream;
    /**
     * Remove a WeatherStream object from the stream and station info.
     * @param stream The WeatherStream object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeWeatherStreamReference(stream: WeatherStream): boolean;
    /**
     * Add the primary weather stream to the scenario.
     * @param stream The weather stream to set as the scenario's primary stream.
     */
    addPrimaryWeatherStreamReference(stream: WeatherStream): StationStream;
    /**
     * Remove the primary WeatherStream object from the stream and station info.
     * @param stream The WeatherStream object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removePrimaryWeatherStreamReference(stream: WeatherStream): boolean;
    /**
     * Add a fuel breack to the scenario.
     * @param brck The fuel break to add to the scenario.
     */
    addFuelBreakReference(brck: FuelBreak): FuelBreak;
    /**
     * Remove a FuelBreak object from the vector info.
     * @param brck The FuelBreak object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeFuelBreakReference(brck: FuelBreak): boolean;
    /**
     * Add a weather grid to the scenario.
     * @param wthr The weather grid to add to the scenario.
     * @param index The layers index in the scenario.
     * @return LayerInfo The reference that was just added.
     */
    addWeatherGridReference(wthr: WeatherGrid, index: number): LayerInfo;
    /**
     * Add a grid file to the scenario.
     * @param grid The grid file to add to the scenario.
     * @param index The layers index in the scenario.
     * @return LayerInfo The reference that was just added.
     */
    addGridFileReference(grid: GridFile, index: number): LayerInfo;
    /**
     * Add a fuel patch to the scenario.
     * @param patch The fuel patch to add to the scenario.
     * @param index The layers index in the scenario.
     * @return LayerInfo The reference that was just added.
     */
    addFuelPatchReference(patch: FuelPatch, index: number): LayerInfo;
    /**
     * Add a weather patch to the scenario.
     * @param patch The weather patch to add to the scenario.
     * @param index The layers index in the scenario.
     * @return LayerInfo The reference that was just added.
     */
    addWeatherPatchReference(patch: WeatherPatch, index: number): LayerInfo;
    /**
     * Remove a layer from the layer info.
     * @param ref The layer to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeLayerInfo(ref: LayerInfo): boolean;
    /**
     * Add an asset file to the scenario. Must already be added to the {@link PSaaS} object.
     * @param file The asset file to add to the scenario.
     */
    addAssetFile(file: AssetFile): AssetReference;
    /**
     * Remove an asset file from the scenario.
     * @param file The asset file to remove from the scenario.
     */
    removeAssetFile(ref: AssetReference): boolean;
    /**
     * Add a target file to the scenario for wind direction. Must already be added to the {@link PSaaS} object.
     * @param file The target file to add to the scenario.
     */
    setWindTargetFile(file: TargetFile): TargetReference;
    /**
     * Remove the wind target file from the scenario.
     */
    clearWindTargetFile(): boolean;
    /**
     * Add a target file to the scenario for vector direction. Must already be added to the {@link PSaaS} object.
     * @param file The target file to add to the scenario.
     */
    setVectorTargetFile(file: TargetFile): TargetReference;
    /**
     * Remove the vector target file from the scenario.
     */
    clearVectorTargetFile(): boolean;
    /**
     * Checks to see if all required values have been set.
     */
    isValid(): boolean;
    /**
     * Find all errors that may exist in the scenario.
     * @returns A list of errors that were found.
     */
    checkValid(): Array<ValidationError>;
    /**
     * Streams the scenario to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
/**
 * Types of options that can be applied to the fuels in
 * the lookup table.
 */
export declare enum FuelOptionType {
    GRASS_FUEL_LOAD = 0,
    GRASS_CURING = 1,
    PERCENT_CONIFER = 2,
    PERCENT_DEAD_FIR = 3,
    CROWN_BASE_HEIGHT = 4
}
/**
 * Stores options for various fuel types including default grass fuel load,
 * grass curing, percent conifer, and percent dead fir.
 * @author Travis Redpath
 */
export declare class FuelOption {
    private static readonly PARAM_FUEL_OPTION;
    /**
     * The type of fuel to apply the option to.
     */
    fuelType: string;
    /**
     * The option that is to be applied.
     */
    optionType: FuelOptionType;
    /**
     * The value of the applied option.
     */
    value: number;
    /**
     * Find all errors that may exist in the fuel option.
     * @returns A list of all errors that were found.
     */
    checkValid(): Array<ValidationError>;
    /**
     * Streams the fuel option to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
/**
 * A class that holds information about the files and settings that will be inputs to PSaaS.
 * @author "Travis Redpath"
 */
export declare class PSaaSInputs {
    /**
     * Information about the files that may be needed by the scenarios.
     */
    files: PSaaSInputsFiles;
    /**
     * All weather stations. At least one is required.
     */
    weatherStations: WeatherStation[];
    /**
     * All ignition features.
     */
    ignitions: Ignition[];
    /**
     * The scenarios to run. At least one is required.
     */
    scenarios: Scenario[];
    /**
     * The timezone of the scenarios (required).
     */
    timezone: Timezone;
    /**
     * Options to apply to the fuel types in the LUT file.
     */
    fuelOptions: FuelOption[];
    /**
     * Assets that can stop simulations when reached.
     */
    assetFiles: AssetFile[];
    /**
     * Targets that can affect how weather information is processed.
     */
    targetFiles: TargetFile[];
    constructor();
    /**
     * Validate the user specified inputs.
     * @returns A list of errors found during validation.
     */
    isValid(): boolean;
    /**
     * Find any errors in the PSaaS input values.
     * @returns A list of errors that were found.
     */
    checkValid(): Array<ValidationError>;
    /**
     * Streams the input settings to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
export declare enum Output_GridFileInterpolation {
    /**
     * Interpolate using the nearest vertex to the centre of the grid cell.
     */
    CLOSEST_VERTEX = "ClosestVertex",
    /**
     * Interpolate using inverse distance weighting.
     */
    IDW = "IDW",
    /**
     * Interpolate using voronoi area weighting.
     */
    AREA_WEIGHTING = "AreaWeighting",
    CALCULATE = "Calculate",
    DISCRETIZED = "Discretized",
    VORONOI_OVERLAP = "VoronoiOverlap"
}
/**
 * If the grid file is a TIF file its contents can be
 * compressed. This describes the algorithm used to
 * compress the data.
 */
export declare enum Output_GridFileCompression {
    NONE = 0,
    /**
     * Should only be used with byte data.
     */
    JPEG = 1,
    LZW = 2,
    PACKBITS = 3,
    DEFLATE = 4,
    /**
     * Should only be used with bit data.
     */
    CCITTRLE = 5,
    /**
     * Should only be used with bit data.
     */
    CCITTFAX3 = 6,
    /**
     * Should only be used with bit data.
     */
    CCITTFAX4 = 7,
    LZMA = 8,
    ZSTD = 9,
    LERC = 10,
    LERC_DEFLATE = 11,
    LERC_ZSTD = 12,
    WEBP = 13
}
/**
 * Override the output time for a specific sub-scenario.
 */
export declare class ExportTimeOverride {
    /**
     * The name of the sub-scenario that the override time is for.
     */
    subScenarioName: string;
    /**
     * The export time to use instead of the one defined in the {@link Output_GridFile} class.
     */
    private _exportTime;
    /**
     * Get the override for the export time as a Luxon DateTime.
     */
    get lExportTime(): DateTime;
    /**
     * Get the override for the export time as an ISO8601 string.
     * @deprecated
     */
    get exportTime(): string;
    /**
     * Set the override for the export time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lExportTime(value: DateTime);
    /**
     * Set the override for the export time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set exportTime(value: string);
    getExportOverrideTime(): string;
    checkValid(): Array<ValidationError>;
}
export declare class Output_GridFile {
    private static readonly PARAM_GRIDFILE;
    /**
     * The name of the output file (required).
     * The file will be located below the jobs output directory.
     * All global paths and relative paths that attempt to move
     * the file outside of this directory will be removed.
     */
    filename: string;
    /**
     * The end of the output time range (required). Will also be
     * used as the start of the output time range if the start
     * output time has not been specified.
     */
    private _outputTime;
    /**
     * Get the end export time as a Luxon DateTime.
     */
    get lOutputTime(): DateTime;
    /**
     * Get the end export time as an ISO8601 string.
     * @deprecated Use lOutputTime instead.
     */
    get outputTime(): string;
    /**
     * Set the end export time using a Luxon DateTime. Cannot be null. If
     * the start export time is not set this value will also be used for
     * the start time.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lOutputTime(value: DateTime);
    /**
     * Set the export time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * If the start export time is not set this value will also be used for
     * the start time.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated Use lOutputTime instead.
     */
    set outputTime(value: string);
    /**
     * The start of the output time range (optional).
     */
    private _startOutputTime;
    /**
     * Get the start export time as a Luxon DateTime.
     */
    get lStartOutputTime(): DateTime;
    /**
     * Get the start export time as an ISO8601 string.
     * @deprecated Use lStartOutputTime instead.
     */
    get startOutputTime(): string;
    /**
     * Set the start export time using a Luxon DateTime. Use null to clear the value.
     */
    set lStartOutputTime(value: DateTime);
    /**
     * Set the start export time using a string. Use null to clear the value.
     * @deprecated Use lOutputTime instead.
     */
    set startOutputTime(value: string);
    private _statistic;
    /**
     * The statistic that should be output (required). If the statistic is TOTAL_FUEL_CONSUMED, SURFACE_FUEL_CONSUMED,
     * CROWN_FUEL_CONSUMED, or RADIATIVE_POWER the {@link Output_GridFileInterpolation interpolation method} must be DISCRETIZED.
     * Setting the output statistic to any of those values will automatically set the interpolation method.
     *
     * Valid values:
     * <ul>
     * <li>TEMPERATURE</li>
     * <li>DEW_POINT</li>
     * <li>RELATIVE_HUMIDITY</li>
     * <li>WIND_DIRECTION</li>
     * <li>WIND_SPEED</li>
     * <li>PRECIPITATION</li>
     * <li>FFMC</li>
     * <li>ISI</li>
     * <li>FWI</li>
     * <li>BUI</li>
     * <li>MAX_FI</li>
     * <li>MAX_FL</li>
     * <li>MAX_ROS</li>
     * <li>MAX_SFC</li>
     * <li>MAX_CFC</li>
     * <li>MAX_TFC</li>
     * <li>MAX_CFB</li>
     * <li>RAZ</li>
     * <li>BURN_GRID</li>
     * <li>FIRE_ARRIVAL_TIME</li>
     * <li>HROS</li>
     * <li>FROS</li>
     * <li>BROS</li>
     * <li>RSS</li>
     * <li>ACTIVE_PERIMETER</li>
     * <li>BURN</li>
     * <li>BURN_PERCENTAGE</li>
     * <li>FIRE_ARRIVAL_TIME_MIN</li>
     * <li>FIRE_ARRIVAL_TIME_MAX</li>
     * <li>TOTAL_FUEL_CONSUMED</li>
     * <li>SURFACE_FUEL_CONSUMED</li>
     * <li>CROWN_FUEL_CONSUMED</li>
     * <li>RADIATIVE_POWER</li>
     * <li>HFI</li>
     * <li>HCFB</li>
     * <li>HROS_MAP</li>
     * <li>FROS_MAP</li>
     * <li>BROS_MAP</li>
     * <li>RSS_MAP</li>
     * <li>RAZ_MAP</li>
     * <li>FMC_MAP</li>
     * <li>CFB_MAP</li>
     * <li>CFC_MAP</li>
     * <li>SFC_MAP</li>
     * <li>TFC_MAP</li>
     * <li>FI_MAP</li>
     * <li>FL_MAP</li>
     * <li>CURINGDEGREE_MAP</li>
     * <li>GREENUP_MAP</li>
     * <li>PC_MAP</li>
     * <li>PDF_MAP</li>
     * <li>CBH_MAP</li>
     * <li>TREE_HEIGHT_MAP</li>
     * <li>FUEL_LOAD_MAP</li>
     * <li>CFL_MAP</li>
     * <li>GRASSPHENOLOGY_MAP</li>
     * <li>ROSVECTOR_MAP</li>
     * <li>DIRVECTOR_MAP</li>
     * </ul>
     */
    get statistic(): GlobalStatistics;
    /**
     * The statistic that should be output (required). If the statistic is TOTAL_FUEL_CONSUMED, SURFACE_FUEL_CONSUMED,
     * CROWN_FUEL_CONSUMED, or RADIATIVE_POWER the {@link Output_GridFileInterpolation interpolation method} must be DISCRETIZED.
     * Setting the output statistic to any of those values will automatically set the interpolation method.
     *
     * Valid values:
     * <ul>
     * <li>TEMPERATURE</li>
     * <li>DEW_POINT</li>
     * <li>RELATIVE_HUMIDITY</li>
     * <li>WIND_DIRECTION</li>
     * <li>WIND_SPEED</li>
     * <li>PRECIPITATION</li>
     * <li>FFMC</li>
     * <li>ISI</li>
     * <li>FWI</li>
     * <li>BUI</li>
     * <li>MAX_FI</li>
     * <li>MAX_FL</li>
     * <li>MAX_ROS</li>
     * <li>MAX_SFC</li>
     * <li>MAX_CFC</li>
     * <li>MAX_TFC</li>
     * <li>MAX_CFB</li>
     * <li>RAZ</li>
     * <li>BURN_GRID</li>
     * <li>FIRE_ARRIVAL_TIME</li>
     * <li>HROS</li>
     * <li>FROS</li>
     * <li>BROS</li>
     * <li>RSS</li>
     * <li>ACTIVE_PERIMETER</li>
     * <li>BURN</li>
     * <li>BURN_PERCENTAGE</li>
     * <li>FIRE_ARRIVAL_TIME_MIN</li>
     * <li>FIRE_ARRIVAL_TIME_MAX</li>
     * <li>TOTAL_FUEL_CONSUMED</li>
     * <li>SURFACE_FUEL_CONSUMED</li>
     * <li>CROWN_FUEL_CONSUMED</li>
     * <li>RADIATIVE_POWER</li>
     * <li>HFI</li>
     * <li>HCFB</li>
     * <li>HROS_MAP</li>
     * <li>FROS_MAP</li>
     * <li>BROS_MAP</li>
     * <li>RSS_MAP</li>
     * <li>RAZ_MAP</li>
     * <li>FMC_MAP</li>
     * <li>CFB_MAP</li>
     * <li>CFC_MAP</li>
     * <li>SFC_MAP</li>
     * <li>TFC_MAP</li>
     * <li>FI_MAP</li>
     * <li>FL_MAP</li>
     * <li>CURINGDEGREE_MAP</li>
     * <li>GREENUP_MAP</li>
     * <li>PC_MAP</li>
     * <li>PDF_MAP</li>
     * <li>CBH_MAP</li>
     * <li>TREE_HEIGHT_MAP</li>
     * <li>FUEL_LOAD_MAP</li>
     * <li>CFL_MAP</li>
     * <li>GRASSPHENOLOGY_MAP</li>
     * <li>ROSVECTOR_MAP</li>
     * <li>DIRVECTOR_MAP</li>
     * </ul>
     */
    set statistic(value: GlobalStatistics);
    /**
     * The interpolation method (required).
     */
    interpMethod: Output_GridFileInterpolation;
    /**
     * The amount to discritize the existing grid to (optional).
     * Only applicable if the interpolation mode is set to {@link Output_GridFileInterpolation.DISCRETIZED}.
     * Must be in [1, 1000].
     */
    discretize: number;
    /**
     * The name of the scenario that this output is for (required).
     */
    scenarioName: string;
    /**
     * Should the file be streamed/uploaded to an external service after
     * it has been created? The streaming services are defined by
     * {@link OutputStreamInfo} and helper methods such as
     * {@link PSaaS#streamOutputToMqtt} or {@link PSaaS#streamOutputToGeoServer}.
     */
    shouldStream: boolean;
    /**
     * If the output file is a TIF file the contents will be compressed
     * using this method.
     */
    compression: Output_GridFileCompression;
    /**
     * Should the output file be minimized to just its bounding box (true) or should it cover the entire
     * grid area (false).
     */
    shouldMinimize: boolean;
    /**
     * The name of a specific sub-scenario that the output is for (if it should be for a subscenario).
     */
    subScenarioName: string;
    /**
     * A list of export time overrides for different sub-scenarios that may be created
     * for the specified scenario.
     */
    private subScenarioOverrideTimes;
    add_subScenarioOverrideTimes(add: ExportTimeOverride): void;
    remove_subScenarioOverrideTimes(remove: ExportTimeOverride): void;
    /**
     * Checks to see if all required values have been set.
     */
    isValid(): boolean;
    checkValid(): Array<ValidationError>;
    private static streamNullableString;
    /**
     * Streams the grid file to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
export declare enum VectorFileType {
    KML = "KML",
    SHP = "SHP"
}
/**
 * An override start and end time for a specific sub-scenario.
 */
export declare class PerimeterTimeOverride {
    /**
     * The name of the sub-scenario.
     */
    subScenarioName: string;
    /**
     * The time to use instead of {@link VectorFile#perimStartTime}.
     */
    private _startTime;
    /**
     * Get the override for the export start time as a Luxon DateTime.
     */
    get lStartTime(): DateTime;
    /**
     * Get the override for the export start time as an ISO8601 string.
     * @deprecated
     */
    get startTime(): string;
    /**
     * Set the override for the export start time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lStartTime(value: DateTime);
    /**
     * Set the override for the export start time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set startTime(value: string);
    getExportStartTime(): string;
    /**
     * The time to use instead of {@link VectorFile#perimEndTime}.
     */
    private _endTime;
    /**
     * Get the override for the export end time as a Luxon DateTime.
     */
    get lEndTime(): DateTime;
    /**
     * Get the override for the export end time as an ISO8601 string.
     * @deprecated
     */
    get endTime(): string;
    /**
     * Set the override for the export end time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lEndTime(value: DateTime);
    /**
     * Set the override for the export end time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set endTime(value: string);
    getExportEndTime(): string;
    checkValid(): Array<ValidationError>;
}
export declare class VectorFile {
    private static readonly PARAM_VECTORFILE;
    /**
     * The name of the output file (required).
     * The file will be located below the jobs output directory. All global paths and
     * relative paths that attempt to move the file outside of this directory will be removed.
     */
    filename: string;
    /**
     * The type of vector file to output (required).
     */
    type: VectorFileType;
    /**
     * Whether multiple perimeters are needed (based on time steps) or only the final perimeter is needed (required).
     */
    multPerim: boolean;
    /**
     * Start output perimeter time (required).
     */
    private _perimStartTime;
    /**
     * Get the perimeter export start time as a Luxon DateTime.
     */
    get lPerimStartTime(): DateTime;
    /**
     * Get the perimeter export start time as an ISO8601 string.
     * @deprecated
     */
    get perimStartTime(): string;
    /**
     * Set the perimeter export start time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lPerimStartTime(value: DateTime);
    /**
     * Set the perimeter export start time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set perimStartTime(value: string);
    /**
     * End output perimeter time (required).
     */
    private _perimEndTime;
    /**
     * Get the override for the export end time as a Luxon DateTime.
     */
    get lPerimEndTime(): DateTime;
    /**
     * Get the override for the export end time as an ISO8601 string.
     * @deprecated
     */
    get perimEndTime(): string;
    /**
     * Set the override for the export end time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lPerimEndTime(value: DateTime);
    /**
     * Set the override for the export end time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set perimEndTime(value: string);
    /**
     * Remove unburned islands (holes) inside of the perimeter (required).
     */
    removeIslands: boolean;
    /**
     * Dissolve contacting fires into a single perimeter (required).
     */
    mergeContact: boolean;
    /**
     * Whether the exported file should contain only the active perimeter (required).
     */
    perimActive: boolean;
    /**
     * The name of the scenario that this output is for (required).
     */
    scenarioName: string;
    /**
     * Describes which metadata should be written to the vector file (required).
     */
    metadata: VectorMetadata;
    /**
     * Should the file be streamed/uploaded to an external service after
     * it has been created? The streaming services are defined by
     * {@link OutputStreamInfo} and helper methods such as
     * {@link PSaaS#streamOutputToMqtt} or {@link PSaaS#streamOutputToGeoServer}.
     */
    shouldStream: boolean;
    /**
     * The name of a sub-scenario to export instead of all sub-scenarios
     * being combined into a single output. Ignored if not using sub-scenarios.
     */
    subScenarioName: string;
    /**
     * A list of times to override for specific sub-scenarios, if sub-scenarios
     * are being created for the referenced scenario.
     */
    private subScenarioOverrides;
    add_subScenarioOverrides(add: PerimeterTimeOverride): void;
    remove_subScenarioOverrides(remove: PerimeterTimeOverride): void;
    private static streamNullableBoolean;
    private static streamNullableString;
    constructor();
    /**
     * Checks to see if all required values have been set.
     */
    isValid(): boolean;
    checkValid(): Array<ValidationError>;
    /**
     * Streams the vector file to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
/**
 * Output a summary for the specified scenario.
 * @author "Travis Redpath"
 */
export declare class SummaryFile {
    private static readonly PARAM_SUMMARYFILE;
    /**
     * Which summary values should be output upon completion of the scenario.
     */
    outputs: SummaryOutputs;
    /**
     * Should the file be streamed/uploaded to an external service after
     * it has been created? The streaming services are defined by
     * {@link OutputStreamInfo} and helper methods such as
     * {@link PSaaS#streamOutputToMqtt} or {@link PSaaS#streamOutputToGeoServer}.
     */
    shouldStream: boolean;
    protected scenName: string;
    /**
     * The name of the output file.
     */
    filename: string;
    /**
     * Create a new summary file.
     * @param scen The name of the scenario to output a summary for.
     */
    constructor(scen: Scenario);
    /**
     * Determine if all of the required values have been set.
     */
    isValid(): boolean;
    /**
     * Find all errors that may exist in the summary file output.
     * @returns A list of all errors that were found.
     */
    checkValid(): Array<ValidationError>;
    /**
     * Streams the summary options to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
/**
 * The filetype of the exported stats file.
 */
export declare enum StatsFileType {
    /**
     * Detect the output type based on the file extension. *.json will
     * always be {@see JSON_ROW}.
     */
    AUTO_DETECT = 0,
    /**
     * Export to a CSV file.
     */
    COMMA_SEPARATED_VALUE = 1,
    /**
     * Export to a JSON file with the data separated by timestep.
     */
    JSON_ROW = 2,
    /**
     * Export to a JSON file with the data separated by statistic.
     */
    JSON_COLUMN = 3
}
/**
 * An output file to mimic the Prometheus stats view. Contains
 * stats from each timestep of a scenarios simulation.
 */
export declare class StatsFile {
    private static readonly PARAM_STATSFILE;
    /**
     * Should the file be streamed/uploaded to an external service after
     * it has been created? The streaming services are defined by
     * {@link OutputStreamInfo} and helper methods such as
     * {@link PSaaS#streamOutputToMqtt} or {@link PSaaS#streamOutputToGeoServer}.
     */
    shouldStream: boolean;
    protected scenName: string;
    streamName: string;
    location: LatLon;
    /**
     * The name of the output file.
     */
    filename: string;
    /**
     * The file format to export to.
     */
    fileType: StatsFileType;
    /**
     * An array of {@link GlobalStatistics} that dictates which statistics
     * will be added to the file.
     */
    columns: GlobalStatistics[];
    /**
     * Create a new stats file.
     * @param scen The name of the scenario to output a stats file for.
     */
    constructor(scen: Scenario);
    /**
     * Set a location to use for exporting weather information to the stats file.
     * Either this or {@link setWeatherStream} should be used if weather information
     * is to be added to the stats file.
     * @param location The location that will be used for exporting weather information.
     */
    setLocation(location: LatLon): void;
    /**
     * Set a weather stream to use for exporting weather information to the stats file.
     * Either this or {@link setLocation} should be used if weather information
     * is to be added to the stats file.
     * @param stream A weather stream that will be used for exporting weather information.
     */
    setWeatherStream(stream: WeatherStream): void;
    /**
     * Add a new column to output in the statistics file.
     * @param col The new column to add.
     * @returns The column that was added, or null if the column was invalid or had already been added.
     */
    addColumn(col: GlobalStatistics.DATE_TIME | GlobalStatistics.ELAPSED_TIME | GlobalStatistics.TIME_STEP_DURATION | GlobalStatistics.TEMPERATURE | GlobalStatistics.DEW_POINT | GlobalStatistics.RELATIVE_HUMIDITY | GlobalStatistics.WIND_SPEED | GlobalStatistics.WIND_DIRECTION | GlobalStatistics.PRECIPITATION | GlobalStatistics.HFFMC | GlobalStatistics.HISI | GlobalStatistics.DMC | GlobalStatistics.DC | GlobalStatistics.HFWI | GlobalStatistics.BUI | GlobalStatistics.FFMC | GlobalStatistics.ISI | GlobalStatistics.FWI | GlobalStatistics.TIMESTEP_AREA | GlobalStatistics.TIMESTEP_BURN_AREA | GlobalStatistics.TOTAL_AREA | GlobalStatistics.TOTAL_BURN_AREA | GlobalStatistics.AREA_GROWTH_RATE | GlobalStatistics.EXTERIOR_PERIMETER | GlobalStatistics.EXTERIOR_PERIMETER_GROWTH_RATE | GlobalStatistics.ACTIVE_PERIMETER | GlobalStatistics.ACTIVE_PERIMETER_GROWTH_RATE | GlobalStatistics.TOTAL_PERIMETER | GlobalStatistics.TOTAL_PERIMETER_GROWTH_RATE | GlobalStatistics.FI_LT_10 | GlobalStatistics.FI_10_500 | GlobalStatistics.FI_500_2000 | GlobalStatistics.FI_2000_4000 | GlobalStatistics.FI_4000_10000 | GlobalStatistics.FI_GT_10000 | GlobalStatistics.ROS_0_1 | GlobalStatistics.ROS_2_4 | GlobalStatistics.ROS_5_8 | GlobalStatistics.ROS_9_14 | GlobalStatistics.ROS_GT_15 | GlobalStatistics.MAX_ROS | GlobalStatistics.MAX_FI | GlobalStatistics.MAX_FL | GlobalStatistics.MAX_CFB | GlobalStatistics.MAX_CFC | GlobalStatistics.MAX_SFC | GlobalStatistics.MAX_TFC | GlobalStatistics.TOTAL_FUEL_CONSUMED | GlobalStatistics.CROWN_FUEL_CONSUMED | GlobalStatistics.SURFACE_FUEL_CONSUMED | GlobalStatistics.NUM_ACTIVE_VERTICES | GlobalStatistics.NUM_VERTICES | GlobalStatistics.CUMULATIVE_VERTICES | GlobalStatistics.CUMULATIVE_ACTIVE_VERTICES | GlobalStatistics.NUM_ACTIVE_FRONTS | GlobalStatistics.NUM_FRONTS | GlobalStatistics.MEMORY_USED_START | GlobalStatistics.MEMORY_USED_END | GlobalStatistics.NUM_TIMESTEPS | GlobalStatistics.NUM_DISPLAY_TIMESTEPS | GlobalStatistics.NUM_EVENT_TIMESTEPS | GlobalStatistics.NUM_CALC_TIMESTEPS | GlobalStatistics.TICKS | GlobalStatistics.PROCESSING_TIME | GlobalStatistics.GROWTH_TIME): GlobalStatistics;
    /**
     * Remove a column for the statistics file.
     */
    removeColumn(col: GlobalStatistics): boolean;
    private validateColumn;
    /**
     * Determine if all of the required values have been set.
     */
    isValid(): boolean;
    /**
     * Find all errors that may be in the statistics file output.
     * @returns A list of all errors that were found.
     */
    checkValid(): Array<ValidationError>;
    /**
     * Streams the stats options to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
/**
 * Information about which files should be output from the job.
 * @author "Travis Redpath"
 */
export declare class PSaaSOutputs {
    /**
     * The vector files that should be output (optional).
     */
    vectorFiles: VectorFile[];
    /**
     * The grid files that should be output (optional).
     */
    gridFiles: Output_GridFile[];
    /**
     * The summary files that should be output (optional).
     */
    summaryFiles: SummaryFile[];
    /**
     * Output a stats file with information from each scenario timestep.
     */
    statsFiles: StatsFile[];
    /**
     * The default stream status for all newly created output
     * files. If true, newly created output files will be
     * defaulted to streaming to any specified stream
     * locations. If false, newly created output files will
     * be defaulted to not stream. The user can override
     * this setting on each output file.
     */
    streamAll: boolean;
    constructor();
    /**
     * Create a new vector file and add it to the list of
     * vector file outputs.
     */
    newVectorFile(scen: Scenario): VectorFile;
    /**
     * Removes the output vector file from a scenario
     */
    removeOutputVectorFile(stat: VectorFile): boolean;
    /**
     * Create a new grid file and add it to the list of
     * grid file outputs.
     */
    newGridFile(scen: Scenario): Output_GridFile;
    /**
     * Removes the output grid file from a scenario
     */
    removeOutputGridFile(stat: Output_GridFile): boolean;
    /**
     * Create a new summary file and add it to the list of
     * summary file outputs.
     */
    newSummaryFile(scen: Scenario): SummaryFile;
    /**
     * Removes the output summary file from a scenario
     */
    removeOutputSummaryFile(stat: SummaryFile): boolean;
    /**
     * Create a new stats file and add it to the list of
     * stats file outputs.
     * @param scen The scenario to output the stats for.
     */
    newStatsFile(scen: Scenario): StatsFile;
    /**
     * Remove a stats file from the scenario.
     * @param stat The stats file to remove.
     */
    removeOutputStatsFile(stat: StatsFile): boolean;
    /**
     * Checks to see if all of the required values have been set.
     */
    isValid(): boolean;
    /**
     * Find all errors that may exist in the PSaaS outputs.
     * @returns A list of errors that were found.
     */
    checkValid(): Array<ValidationError>;
    /**
     * Streams the output settings to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
/**
 * After all simulations have completed the output files can be streamed to another
 * location to be consumed by a client side application. Currently only streaming
 * over MQTT is supported.
 * @author "Travis Redpath"
 */
export declare abstract class OutputStreamInfo extends IPSaaSSerializable {
    protected static readonly PARAM_URL = "output_stream";
    /**
     * Find all errors in the stream settings.
     * @returns A list of all errors that were found.
     */
    abstract checkValid(): Array<ValidationError>;
    abstract stream(builder: net.Socket): void;
}
export declare class MqttOutputStreamInfo extends OutputStreamInfo {
    /**
     * @inheritdoc
     */
    checkValid(): Array<ValidationError>;
    /**
     * Streams the output stream information to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
/**
 * After a file has been written by PSaaS it can be uploaded to a GeoServer
 * instance by Manager. Currently only TIFF files are supported.
 */
export declare class GeoServerOutputStreamInfo extends OutputStreamInfo {
    /**
     * The username to authenticate on GeoServer with.
     */
    username: string;
    /**
     * A password to authenticate on GeoServer with.
     * WARNING: this password will be saved in plain text.
     */
    password: string;
    /**
     * The URL of the GeoServer instance to upload the file to.
     * The address of the REST API should be {url}/rest and the
     * URL of the web interface should be {url}/web.
     */
    url: string;
    /**
     * The workspace to add the file to.
     * If the workspace doesn't exist it will be created.
     */
    workspace: string;
    /**
     * The coverage store to add the file to.
     * If the coverage store doesn't exist it will be created.
     */
    coverageStore: string;
    /**
     * The declared spatial reference system for the added coverage.
     * If this is not specified the uploaded coverage will not be
     * enabled.
     */
    declaredSrs: string;
    /**
     * @inheritdoc
     */
    checkValid(): Array<ValidationError>;
    /**
     * Streams the outptu stream information to a socket.
     */
    stream(builder: net.Socket): void;
}
export declare enum TimeUnit {
    DEFAULT = -1,
    MICROSECOND = 1572864,
    MILLISECOND = 1638400,
    SECOND = 1114112,
    MINUTE = 1179648,
    HOUR = 1245184,
    DAY = 1310720,
    WEEK = 1376256,
    MONTH = 1441792,
    YEAR = 1507328,
    DECADE = 1703936,
    CENTURY = 1769472
}
export declare enum DistanceUnit {
    DEFAULT = -1,
    MM = 1,
    CM = 2,
    M = 3,
    KM = 4,
    INCH = 5,
    FOOT = 6,
    YARD = 7,
    CHAIN = 8,
    MILE = 9,
    NAUTICAL_MILE = 10,
    NAUTICAL_MILE_UK = 11
}
export declare enum AreaUnit {
    DEFAULT = -1,
    MM2 = 256,
    CM2 = 257,
    M2 = 258,
    HECTARE = 259,
    KM2 = 260,
    IN2 = 261,
    FT2 = 262,
    YD2 = 263,
    ACRE = 264,
    MILE2 = 265
}
export declare enum VolumeUnit {
    DEFAULT = -1,
    MM3 = 512,
    CM3 = 513,
    LITRE = 514,
    M3 = 515,
    KM3 = 516,
    IN3 = 517,
    FT3 = 518,
    YD3 = 519,
    MILE3 = 520,
    UK_FL_OZ = 521,
    UK_PINT = 522,
    UK_QUART = 523,
    UK_GALLON = 524,
    BUSHEL = 525,
    US_DRAM = 526,
    US_FL_OZ = 527,
    US_FL_PINT = 528,
    US_FL_QUART = 529,
    US_GALLON = 530,
    US_FL_BARREL = 531,
    US_DRY_PINT = 532,
    US_DRY_QUART = 533,
    US_DRY_BARREL = 534
}
export declare enum TemperatureUnit {
    DEFAULT = -1,
    KELVIN = 1024,
    CELSIUS = 1025,
    FAHRENHEIT = 1026,
    RANKINE = 1027
}
export declare enum PressureUnit {
    DEFAULT = -1,
    KPA = 1280,
    PSI = 1281,
    BAR = 1282,
    ATM = 1283,
    TORR = 1284
}
export declare enum MassUnit {
    DEFAULT = -1,
    MILLIGRAM = 1536,
    GRAM = 1537,
    KG = 1538,
    TONNE = 1539,
    OUNCE = 1540,
    LB = 1541,
    SHORT_TON = 1542,
    TON = 1543
}
export declare enum EnergyUnit {
    DEFAULT = -1,
    JOULE = 1792,
    KILOJOULE = 1802,
    ELECTRONVOLT = 1793,
    ERG = 1794,
    FT_LB = 1795,
    CALORIE = 1796,
    KG_METRE = 1797,
    BTU = 1798,
    WATT_SECOND = 1115911,
    WATT_HOUR = 1246983,
    KILOWATT_SECOND = 1115912,
    KILOWATT_HOUR = 1246984,
    THERM = 1801
}
export declare enum PercentUnit {
    DEFAULT = -1,
    DECIMAL = 1216,
    PERCENT = 1217,
    DECIMAL_INVERT = 1218,
    PERCENT_INVERT = 1219
}
export declare enum AngleUnit {
    DEFAULT = -1,
    CARTESIAN_RADIAN = 1200,
    COMPASS_RADIAN = 16778416,
    CARTESIAN_DEGREE = 33555632,
    COMPASS_DEGREE = 50332848,
    CARTESIAN_ARCSECOND = 67110064,
    COMPASS_ARCSECOND = 83887280
}
export declare enum CoordinateUnit {
    DEFAULT = -1,
    DEGREE = 2048,
    DEGREE_MINUTE = 2049,
    DEGREE_MINUTE_SECOND = 2050,
    UTM = 2051,
    RELATIVE_DISTANCE = 2052
}
export declare class VelocityUnit {
    distance: DistanceUnit;
    time: TimeUnit;
}
export declare class IntensityUnit {
    energy: EnergyUnit;
    distance: DistanceUnit;
}
export declare class MassAreaUnit {
    mass: MassUnit;
    area: AreaUnit;
}
/**
 * Settings that define which units will be used when data is exported in summary
 * or statistics files. All units are optional with application defaults being
 * used for anything that isn't specified.
 */
export declare class UnitSettings {
    private static readonly PARAM_UNITS;
    /**
     * Units for displaying small distance measurements.
     */
    smallMeasureOutput: DistanceUnit;
    /**
     * Units for displaying small distances.
     */
    smallDistanceOutput: DistanceUnit;
    /**
     * Units for displaying distances.
     */
    distanceOutput: DistanceUnit;
    /**
     * Alternate units for displaying distances.
     */
    alternateDistanceOutput: DistanceUnit;
    /**
     * Units for displaying coordinates.
     */
    coordinateOutput: CoordinateUnit;
    /**
     * Units for displaying areas.
     */
    areaOutput: AreaUnit;
    /**
     * Units for displaying volumes.
     */
    volumeOutput: VolumeUnit;
    /**
     * Units for displaying temperature.
     */
    temperatureOutput: TemperatureUnit;
    /**
     * Units for displaying mass or weight.
     */
    massOutput: MassUnit;
    /**
     * Units for displaying energy.
     */
    energyOutput: EnergyUnit;
    /**
     * Units for displaying angles.
     */
    angleOutput: AngleUnit;
    /**
     * Units for displaying velocity.
     */
    velocityOutput: VelocityUnit;
    /**
     * An alternate unit for displaying velocity.
     */
    alternateVelocityOutput: VelocityUnit;
    /**
     * Units for displaying fire intensity.
     */
    intensityOutput: IntensityUnit;
    /**
     * Units for displaying mass.
     */
    massAreaOutput: MassAreaUnit;
    /**
     * Find all errors that may exist in the unit settings.
     * @returns A list of all errors that were found.
     */
    checkValid(): Array<ValidationError>;
    /**
     * Streams the attachment to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
/**
 * The types of load balancing available in PSaaS.
 */
export declare enum LoadBalanceType {
    /**
     * Don't use any load balancing. The generated FGM will be sent to
     * a single instance of PSaaS Manager and it will run all scenarios.
     */
    NONE = 0,
    /**
     * Every instance of PSaaS Manager in the same cluster will receive
     * the generated FGM. An external service will provide scenario
     * indices to run so that each instance of PSaaS that is processing
     * the FGM will run different scenarios. The indices will be
     * communicated to the PSaaS instance over MQTT. See the
     * [MQTT documentation](https://spydmobile.bitbucket.io/psaas_mqtt/#topic-psaas/{originator}/delegator/balance)
     * for more information.
     */
    EXTERNAL_COUNTER = 1,
    /**
     * The generated FGM will be sent to a single instance of PSaaS
     * Manager. A file that the user creates will provide scenario
     * indices to the instance of PSaaS that runs the FGM. The file
     * must be named balance.txt and each line must contian a valid
     * scenario index that should be run. Typically used for debugging
     * to force PSaaS to only process a single scenario when many
     * are present in the FGM.
     */
    LOCAL_FILE = 2
}
/**
 * Options for running the job not related directly to
 * scenarios or fire growth.
 */
export declare class JobOptions extends IPSaaSSerializable {
    private static readonly PARAM_OPTIONS;
    /**
     * The type of load balancing to use to run the job.
     */
    loadBalance: LoadBalanceType;
    /**
     * A priority to use to sort the job queue. When a
     * job is recieved by an instance of PSaaS Manager
     * it will be placed in the job queue immediately
     * below the first job found with the same or higher
     * priority that isn't already running starting from
     * the bottom of the queue.
     *
     * The priority can be any valid integer value.
     */
    priority: number;
    /**
     * Should the job be validated by PSaaS instead of
     * being run. The user can redo the job if there
     * is a validation error or restart the job so
     * that it simulates in PSaaS using MQTT commands.
     */
    validate: boolean;
    /**
     * Find all errors that may exist in the job settings.
     * @readonly A list of all errors that were found.
     */
    checkValid(): Array<ValidationError>;
    /**
     * Streams the options to a socket.
     * @param builder
     */
    stream(builder: net.Socket): void;
}
/**
 * The top level class where all information required to run a PSaaS job will be stored.
 * @author "Travis Redpath"
 */
export declare class PSaaS extends IPSaaSSerializable {
    private static readonly PARAM_COMMENT;
    /**
     * Optional user comments about the job.
     */
    comments: string;
    /**
     * Files that are needed as input for the job.
     */
    inputs: PSaaSInputs;
    /**
     * Files that will be output from the job.
     */
    outputs: PSaaSOutputs;
    /**
     * Settings that modify PSaaS's behaviour at the end of each timestep.
     */
    timestepSettings: TimestepSettings;
    /**
     * Details of a service to stream output files to after all
     * simulations have completed.
     */
    streamInfo: Array<OutputStreamInfo>;
    /**
     * Settings that define which units will be used when data is exported in summary
     * or statistics files.
     */
    exportUnits: UnitSettings;
    /**
     * Options concering how to run the job, not related directly
     * to scenarios or fire growth.
     */
    jobOptions: JobOptions;
    protected builder: net.Socket;
    /**
     * An array of files that can be used in place of
     * regular files in the simulation. Stores both
     * a filename and the file contents.
     */
    private attachments;
    /**
     * A counter to use when adding attachments to
     * make sure that the names are unique.
     */
    private attachmentIndex;
    constructor();
    /**
     * Are the input and output values for the job valid.
     */
    isValid(): boolean;
    /**
     * Get a list of errors that exist in the current PSaaS configuration.
     * @returns A list of errors that were found.
     */
    checkValid(): Array<ValidationError>;
    /**
     * Specify the timezone for all specified times.
     * @param zone The hour offset from UTC.
     * @param daylight Whether the offset is for daylight savings time or not.
     */
    setTimezone(zone: Duration, daylight: boolean): void;
    /**
     * Clears the timezone for all specified times.
     */
    clearTimezone(): void;
    /**
     * Specify the timezone for all specified times by name. Must be one of the names
     * provided by the timezone classes <code>getTimezoneNameList()</code> function.
     *
     * @param value The value associated with the time zone.
     */
    setTimezoneByValue(value: number): void;
    /**
     * Unset the timezone for all specified times by name.
     */
    unsetTimezoneByValue(value: number): void;
    /**
     * Set the projection file. This file is required.
     * An exception will be thrown if the file does not exist.
     * @param filename
     */
    setProjectionFile(filename: string): void;
    /**
     * Unset the projection file.
     */
    unsetProjectionFile(): void;
    /**
     * Set the look up table. This file is required.
     * An exception will be thrown if the file does not exist.
     * @param filename
     */
    setLutFile(filename: string): void;
    /**
     * Unset the look up table.
     */
    unsetLutFile(): void;
    /**
     * Set the percent conifer for the M-1, M-2, NZ-54, or NZ-69 fuel type.
     * @param fuel The fuel type to set the percent conifer for. Must be M-1, M-2, NZ-54, or NZ-69.
     * @param value The percent conifer as a percent (0 - 100%).
     */
    setPercentConifer(fuel: "M-1" | "M-2" | "NZ-54" | "NZ-69", value: number): void;
    /**
     * Set the percent dead fir for either the M-3 or M-4 fuel type.
     * @param fuel The fuel type to set the percent dead fir for. Must be either M-3 or M-4.
     * @param value The percent dead fir as a percent (0 - 100%).
     */
    setPercentDeadFir(fuel: "M-3" | "M-4", value: number): void;
    /**
     * Set the grass curing for the O-1a, O-1b, NZ-2, NZ-15, NZ-30, NZ-31, NZ-32, NZ-33, NZ-40,
     * NZ-41, NZ-43, NZ-46, NZ-50, NZ-53, NZ-62, NZ-63, or NZ-65 fuel type. If unset, this also
     * sets the grass fuel load to 0.35kg/m^2.
     * @param fuel The fuel type to set the grass curing for.
     * @param value The grass curing (0 - 100%).
     */
    setGrassCuring(fuel: "O-1a" | "O-1b" | "NZ-2" | "NZ-15" | "NZ-30" | "NZ-31" | "NZ-32" | "NZ-33" | "NZ-40" | "NZ-41" | "NZ-43" | "NZ-46" | "NZ-50" | "NZ-53" | "NZ-62" | "NZ-63" | "NZ-65", value: number): void;
    /**
     * Set the grass fuel load for either the O-1a, O-1b, NZ-2, NZ-15, NZ-30, NZ-31, NZ-32, NZ-33, NZ-40,
     * NZ-41, NZ-43, NZ-46, NZ-50, NZ-53, NZ-62, NZ-63, or NZ-65 fuel type. If unset, this also
     * sets the grass curing to 60%.
     * @param fuel The fuel type to set the grass fuel load for.
     * @param value The grass fuel load (kg/m^2).
     */
    setGrassFuelLoad(fuel: "O-1a" | "O-1b" | "NZ-2" | "NZ-15" | "NZ-30" | "NZ-31" | "NZ-32" | "NZ-33" | "NZ-40" | "NZ-41" | "NZ-43" | "NZ-46" | "NZ-50" | "NZ-53" | "NZ-62" | "NZ-63" | "NZ-65", value: number): void;
    /**
     * Set the crown base height.
     * @param fuel The fuel type to set the grass fuel load for. Must be C-6, NZ-60, NZ-61, NZ-66, NZ-67, or NZ-71.
     * @param value The crown base height (m).
     */
    setCrownBaseHeight(fuel: "C-6" | "NZ-60" | "NZ-61" | "NZ-66" | "NZ-67" | "NZ-71", value: number): void;
    /**
     * Remove a FuelOption object from the input fuel options.
     * @param fuelOption The FuelOption object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeFuelOption(fuelOption: FuelOption): boolean;
    /**
     * Set the fuel map file. This file is required.
     * An exception will be thrown if the file does not exist.
     * @param filename Can either be the actual file path or the
     * 			   attachment URL returned from {@link addAttachment}
     */
    setFuelmapFile(filename: string): void;
    /**
     * Unset the fuel map file.
     */
    unsetFuelmapFile(): void;
    /**
     * Set the default FMC value for the fuel map.
     * This value can be overridden by scenarios.
     * @param value The default FMC value. Set to -1 to disable.
     * @deprecated deprecated since 6.2.4.3. Project level default FMC is no longer used.
     */
    setDefaultFMC(value: number): void;
    /**
     * Set the elevation grid file. An elevation grid file is optional.
     * An exception will be thrown if the file does not exist.
     * @param filename Can either be the actual file path or the attachment
     * 			   URL returned from {@link addAttachment}
     */
    setElevationFile(filename: string): void;
    /**
     * Unset the elevation grid file
     */
    unsetElevationFile(): void;
    /**
     * Add a grid file to the project.
     * @param filename The location of the grid file. Can either
     * 			   be the actual file path or the attachment
     * 			   URL returned from {@link addAttachment}
     * @param proj The location of the grid files projection.
     * @param type Must be one of the GridFile::TYPE_* values.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set and {@link SocketMsg.skipFileTests} is not set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if the file doesn't exist.
     */
    addGridFile(filename: string, proj: string, type: GridFileType): GridFile;
    /**
     * Add a grid file to the project.
     * @param filename The location of the grid file. Can either
     * 			   be the actual file path or the attachment
     * 			   URL returned from {@link addAttachment}
     * @param proj The location of the grid files projection.
     * @param type Must be one of the GridFile::TYPE_* values.
     * @param comment A user comment to add to the grid file.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set and {@link SocketMsg.skipFileTests} is not set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if the file doesn't exist.
     */
    addGridFileWithComment(filename: string, proj: string, type: GridFileType, comment: string): GridFile;
    /**
     * Remove a GridFile object from the grid files.
     * @param gridFile The GridFile object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeGridFile(gridFile: GridFile): boolean;
    /**
     * Add a landscape fuel patch to the job.
     * @param fromFuel The fuel to change from. Can either be one of the rules defined in FuelPatch (FROM_FUEL_*) or the name of a fuel.
     * @param toFuel The name of the fuel to change to.
     * @param comment An optional user created comment to attach to the fuel patch.
     */
    addLandscapeFuelPatch(fromFuel: FromFuel | string, toFuel: string, comment?: string): FuelPatch;
    /**
     * Add a file fuel patch to the job.
     * @param filename The location of the shape file. Can either be the actual file path or the attachment URL returned from {@link addAttachment}
     * @param fromFuel The fuel to change from. Can either be one of the rules defined in FuelPatch (FROM_FUEL_*) or the name of a fuel.
     * @param toFuel The name of the fuel to change to.
     * @param comment An optional user created comment to attach to the fuel patch.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set and {@link SocketMsg.skipFileTests} is not set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if the file doesn't exist.
     */
    addFileFuelPatch(filename: string, fromFuel: FromFuel | string, toFuel: string, comment?: string): FuelPatch;
    /**
     * Add a polygon fuel patch to the job.
     * @param vertices The vertices of the polygon. Must be an array of LatLon values. The LatLon values will be copied by reference.
     * @param fromFuel The fuel to change from. Can either be one of the rules defined in FuelPatch (FROM_FUEL_*) or the name of a fuel.
     * @param toFuel The name of the fuel to change to.
     * @param comments An optional user created comment to attach to the fuel patch.
     */
    addPolygonFuelPatch(vertices: Array<LatLon>, fromFuel: FromFuel | string, toFuel: string, comments?: string): FuelPatch;
    /**
     * Remove a FuelPatch object from the fuel patch files.
     * @param fuelPatch The FuelPatch object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeFuelPatch(fuelPatch: FuelPatch): boolean;
    /**
     * Add a fuel break to the project.
     * @param filename The file location of the fuel break. Can either be the actual file
     * 			   path or the attachment URL returned from {@link addAttachment}
     * @param comments An optional user created comment to attach to the fuel break.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set and {@link SocketMsg.skipFileTests} is not set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if the file doesn't exist.
     */
    addFileFuelBreak(filename: string, comments?: string): FuelBreak;
    /**
     * Add a fuel break to the project.
     * @param vertices The vertices of the polygon. Must be an array of LatLon values. The LatLon values will be copied by reference.
     * @param comments An optional user created comment to attach to the fuel break;
     */
    addPolygonFuelBreak(vertices: Array<LatLon>, comments?: string): FuelBreak;
    /**
     * Add a fuel break to the project.
     * @param vertices The vertices of the polyline. Must be an array of LatLon values. The LatLon values will be copied by reference.
     * @param width The width of the fuel break.
     * @param comments An optional user created comment to attach to the fuel break;
     */
    addPolylineFuelBreak(vertices: Array<LatLon>, width: number, comments?: string): FuelBreak;
    /**
     * Remove a FuelBreak object from the fuel break files.
     * @param fuelBreak The FuelBreak object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeFuelBreak(fuelBreak: FuelBreak): boolean;
    /**
     * Add a weather station to the project.
     * @param elevation The elevation of the weather station.
     * @param location The location of the weather station.
     * @param comments An optional user created comment to attach to the weather station.
     * @return WeatherStation
     */
    addWeatherStation(elevation: number, location: LatLon, comments?: string): WeatherStation;
    /**
     * Remove a WeatherStation object from the weather stations.
     * @param weatherStation The WeatherStation object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeWeatherStation(weatherStation: WeatherStation): boolean;
    /**
     * Add a weather patch from a file.
     * @param filename The location of the file containing the patches location. Can
     * 				   either be the actual file path or the attachment URL returned
     *                 from {@link addAttachment}
     * @param startTime The patch start time. If a string is used must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param startTimeOfDay The patches start time of day. If a string is used it must be formatted as "hh:mm:ss".
     * @param endTime The patch end time. If a string is used must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param endTimeOfDay The patches end time of day. If a string is used it must be formatted as "hh:mm:ss".
     * @param comments An optional user created comment to attach to the weather patch.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set and {@link SocketMsg.skipFileTests} is not set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if the file doesn't exist.
     * @return WeatherPatch
     */
    addFileWeatherPatch(filename: string, startTime: string | DateTime, startTimeOfDay: string | Duration, endTime: string | DateTime, endTimeOfDay: string | Duration, comments?: string): WeatherPatch;
    /**
     * Add a weather patch from an array of vertices of a polygon.
     * @param vertices The vertices of the polygon.
     * @param startTime The patch start time. If a string is used it must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param startTimeOfDay The patches start time of day. If a string is used it must be formatted as "hh:mm:ss".
     * @param endTime The patch end time. If a string is used it must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param endTimeOfDay The patches end time of day. If a string is used it must be formatted as "hh:mm:ss".
     * @param comments An optional user created comment to attach to the weather patch.
     * @return WeatherPatch
     */
    addPolygonWeatherPatch(vertices: Array<LatLon>, startTime: string | DateTime, startTimeOfDay: string | Duration, endTime: string | DateTime, endTimeOfDay: string | Duration, comments?: string): WeatherPatch;
    /**
     * Add a landscape weather patch.
     * @param startTime The patch start time. If a string is used it must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param startTimeOfDay The patches start time of day. If a string is used it must be formatted as "hh:mm:ss".
     * @param endTime The patch end time. If a string is used it must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param endTimeOfDay The patches end time of day. If a string is used it must be formatted as "hh:mm:ss".
     * @param comments An optional user created comment to attach to the weather patch.
     * @return WeatherPatch
     */
    addLandscapeWeatherPatch(startTime: string | DateTime, startTimeOfDay: string | Duration, endTime: string | DateTime, endTimeOfDay: string | Duration, comments?: string): WeatherPatch;
    /**
     * Remove a WeatherPatch object from the weather patch files.
     * @param weatherPatch The WeatherPatch object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeWeatherPatch(weatherPatch: WeatherPatch): boolean;
    /**
     * Add a weather grid for wind directions to the project.
     * @param startTime The grids start time. If a string is used it must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param startTimeOfDay The grids start time of day. If a string is used it must be formatted as "hh:mm:ss".
     * @param endTime The grids end time. If a string is used it must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param endTimeOfDay The grids end time of day. If a string is used it must be formatted as "hh:mm:ss".
     * @param comments An optional user created comment to attach to the weather grid.
     * @return WeatherGrid
     */
    addDirectionWeatherGrid(startTime: string | DateTime, startTimeOfDay: string | Duration, endTime: string | DateTime, endTimeOfDay: string | Duration, comments?: string): WeatherGrid;
    /**
     * Add a weather grid for wind speeds to the project.
     * @param startTime The grids start time. If a string is used it must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param startTimeOfDay The grids start time of day. Must be formatted as "hh:mm:ss".
     * @param endTime The grids end time. If a string is used it must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param endTimeOfDay The grids end time of day. Must be formatted as "hh:mm:ss".
     * @param comments An optional user created comment to attach to the weather grid.
     * @return WeatherGrid
     */
    addSpeedWeatherGrid(startTime: string | DateTime, startTimeOfDay: string | Duration, endTime: string | DateTime, endTimeOfDay: string | Duration, comments?: string): WeatherGrid;
    /**
     * Remove a WeatherGrid object from the weather grid files.
     * @param weatherGrid The WeatherGrid object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeWeatherGrid(weatherGrid: WeatherGrid): boolean;
    /**
     * Add an ignition from a file.
     * @param filename The location of the ignitions file. Can either be the actual file path
     * 				   or the attachment URL returned from {@link addAttachment}
     * @param startTime The ignitions start time.
     * @param comments An optional user created comment to attach to the ignition.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set and {@link SocketMsg.skipFileTests} is not set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if the file doesn't exist.
     * @return Ignition
     */
    addFileIgnition(filename: string, startTime: string | DateTime, comments?: string): Ignition;
    /**
     * Add an ignition from a single point. If this is to be a multipoint more points can be added
     * to the returned object using {@link Ignition#addPoint}.
     * @param startTime The ignitions start time.
     * @param point The location of the ignition.
     * @param comments An optional user created comment to attach to the ignition.
     * @return Ignition
     */
    addPointIgnition(point: LatLon, startTime: string | DateTime, comments?: string): Ignition;
    /**
     * Add an ignition with multiple points.
     * @param points An array of LatLons that are all point ignitions.
     * @param startTime The ignitions start time.
     * @param comments An optional user created comment to attach to the ignition.
     * @return Ignition
     */
    addMultiPointIgnition(points: Array<LatLon>, startTime: string | DateTime, comments?: string): Ignition;
    /**
     * Add an ignition from a set of vertices.
     * @param startTime The ignitions start time.
     * @param vertices An array of LatLons that describe the polygon.
     * @param comments An optional user created comment to attach to the ignition.
     * @return Ignition
     */
    addPolygonIgnition(vertices: Array<LatLon>, startTime: string | DateTime, comments?: string): Ignition;
    /**
     * Add an ignition from a set of vertices.
     * @param vertices An array of LatLons that descrive the polyline.
     * @param startTime The ignitions start time.
     * @param comments An optional user created comment to attach to the ignition.
     * @return Ignition
     */
    addPolylineIgnition(vertices: Array<LatLon>, startTime: string | DateTime, comments?: string): Ignition;
    /**
     * Remove an Ignition object from the ignitions.
     * @param ignition The Ignition object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeIgnition(ignition: Ignition): boolean;
    /**
     * Add a new asset using a shapefile.
     * @param filename The location of the shapefile to use as the shape of the asset.
     * @param comments Any user defined comments for the asset. Can be null if there are no comments.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set and {@link SocketMsg.skipFileTests} is not set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if the file doesn't exist.
     */
    addFileAsset(filename: string, comments?: string): AssetFile;
    /**
     * Add a new asset using a single point. A buffer around the point can be created
     * using the {@code buffer} property.
     * @param location The lat/lon of the asset.
     * @param comments Any user defined comments for the asset. Can be null if there are no comments.
     */
    addPointAsset(location: LatLon, comments?: string): AssetFile;
    /**
     * Add a new asset using a polygon.
     * @param locations An array of lat/lons that make up the polygon.
     * @param comments Any user defined comments for the asset. Can be null if there are no comments.
     */
    addPolygonAsset(locations: Array<LatLon>, comments?: string): AssetFile;
    /**
     * Add a new asset using a polyline. A buffer around the line can be created
     * using the {@code buffer} property.
     * @param locations An array of lat/lons that make up the polyline.
     * @param comments Any user defined comments for the asset. Can be null if there are no comments.
     */
    addPolylineAsset(locations: Array<LatLon>, comments?: string): AssetFile;
    /**
     * Remove an asset from the job. This will not remove it from any
     * scenarios that it may be associated with.
     * @param asset The asset to remove.
     */
    removeAsset(asset: AssetFile): boolean;
    /**
     * Add a new target using a shapefile.
     * @param filename The location of the shapefile to use as the shape of the target.
     * @param comments Any user defined comments for the target. Can be null if there are no comments.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set and {@link SocketMsg.skipFileTests} is not set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if the file doesn't exist.
     */
    addFileTarget(filename: string, comments?: string): TargetFile;
    /**
     * Add a new target using a single point.
     * @param location The lat/lon of the target.
     * @param comments Any user defined comments for the target. Can be null if there are no comments.
     */
    addPointTarget(location: LatLon, comments?: string): TargetFile;
    /**
     * Add a new target using a polygon.
     * @param locations An array of lat/lons that make up the polygon.
     * @param comments Any user defined comments for the target. Can be null if there are no comments.
     */
    addPolygonTarget(locations: Array<LatLon>, comments?: string): TargetFile;
    /**
     * Add a new target using a polyline.
     * @param locations An array of lat/lons that make up the polyline.
     * @param comments Any user defined comments for the asset. Can be null if there are no comments.
     */
    addPolylineTarget(locations: Array<LatLon>, comments?: string): TargetFile;
    /**
     * Remove an target from the job. This will not remove it from any
     * scenarios that it may be associated with.
     * @param target The target to remove.
     */
    removeTarget(target: TargetFile): boolean;
    /**
     * Add a scenario to the job.
     * @param startTime The start time of the scenario. If a string is used it must be formatted as 'YYYY-MM-DDThh:mm:ss'.
     * @param endTime The end time of the scenario. If a string is used it must be formatted as 'YYYY-MM-DDThh:mm:ss'.
     * @param comments An optional user created comment to attach to the scenario.
     */
    addScenario(startTime: string | DateTime, endTime: string | DateTime, comments?: string): Scenario;
    /**
     * Remove a Scenario object from the scenarios.
     * @param scenario The Scenario object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeScenario(scenario: Scenario): boolean;
    /**
     *  Add a grid file output to a scenario.
     * @param stat The statistic to output.
     * @param filename The name of the output file. Can either
     * 				   be the actual file path or the attachment
     *  			   URL returned from {@link addAttachment}
     * @param time The simulation time to output the file at.
     * @param interpMethod The interpolation method to use.
     * @param scen The scenario to output the data for.
     * @return Output_GridFile
     */
    addOutputGridFileToScenario(stat: GlobalStatistics.TEMPERATURE | GlobalStatistics.DEW_POINT | GlobalStatistics.RELATIVE_HUMIDITY | GlobalStatistics.WIND_DIRECTION | GlobalStatistics.WIND_SPEED | GlobalStatistics.PRECIPITATION | GlobalStatistics.FFMC | GlobalStatistics.ISI | GlobalStatistics.FWI | GlobalStatistics.BUI | GlobalStatistics.MAX_FI | GlobalStatistics.MAX_FL | GlobalStatistics.MAX_ROS | GlobalStatistics.MAX_SFC | GlobalStatistics.MAX_CFC | GlobalStatistics.MAX_TFC | GlobalStatistics.MAX_CFB | GlobalStatistics.RAZ | GlobalStatistics.BURN_GRID | GlobalStatistics.FIRE_ARRIVAL_TIME | GlobalStatistics.HROS | GlobalStatistics.FROS | GlobalStatistics.BROS | GlobalStatistics.RSS | GlobalStatistics.ACTIVE_PERIMETER | GlobalStatistics.BURN | GlobalStatistics.BURN_PERCENTAGE | GlobalStatistics.FIRE_ARRIVAL_TIME_MIN | GlobalStatistics.FIRE_ARRIVAL_TIME_MAX | GlobalStatistics.TOTAL_FUEL_CONSUMED | GlobalStatistics.SURFACE_FUEL_CONSUMED | GlobalStatistics.CROWN_FUEL_CONSUMED | GlobalStatistics.RADIATIVE_POWER | GlobalStatistics.HFI | GlobalStatistics.HCFB | GlobalStatistics.HROS_MAP | GlobalStatistics.FROS_MAP | GlobalStatistics.BROS_MAP | GlobalStatistics.RSS_MAP | GlobalStatistics.RAZ_MAP | GlobalStatistics.FMC_MAP | GlobalStatistics.CFB_MAP | GlobalStatistics.CFC_MAP | GlobalStatistics.SFC_MAP | GlobalStatistics.TFC_MAP | GlobalStatistics.FI_MAP | GlobalStatistics.FL_MAP | GlobalStatistics.CURINGDEGREE_MAP | GlobalStatistics.GREENUP_MAP | GlobalStatistics.PC_MAP | GlobalStatistics.PDF_MAP | GlobalStatistics.CBH_MAP | GlobalStatistics.TREE_HEIGHT_MAP | GlobalStatistics.FUEL_LOAD_MAP | GlobalStatistics.CFL_MAP | GlobalStatistics.GRASSPHENOLOGY_MAP | GlobalStatistics.ROSVECTOR_MAP | GlobalStatistics.DIRVECTOR_MAP, filename: string, time: string | DateTime | TimeRange, interpMethod: Output_GridFileInterpolation, scen: Scenario): Output_GridFile;
    /**
     * Removes the output grid file from a scenario
     */
    removeOutputGridFileFromScenario(stat: Output_GridFile): boolean;
    /**
     * Add a vector file output to a scenario.
     * @param type Either 'SHP' or 'KML'.
     * @param filename The name of the output file. Can either be the actual file path
     * 				   or the attachment URL returned from {@link addAttachment}
     * @param perimStartTime The time to start output of the perimeter.
     * @param perimEndTime The time to stop output of the perimeter.
     * @param scen The scenario to output the data for.
     * @return VectorFile
     */
    addOutputVectorFileToScenario(type: VectorFileType, filename: string, perimStartTime: string | DateTime, perimEndTime: string | DateTime, scen: Scenario): VectorFile;
    /**
     * Removes the output vector file from a scenario
     */
    removeOutputVectorFileFromScenario(stat: VectorFile): boolean;
    /**
     * Add a summary output file to a scenario.
     * @param scen The scenario to add the summary file to.
     * @param filename The name of the file to output to. Can either be the actual file path
     * 				   or the attachment URL returned from {@link addAttachment}
     */
    addOutputSummaryFileToScenario(scen: Scenario, filename: string): SummaryFile;
    /**
     * Removes the output summary file from a scenario
     */
    removeOutputSummaryFileFromScenario(stat: SummaryFile): boolean;
    /**
     * Add a stats file to a scenario. If you want to set the type of file exported
     * instead of relying on the file extension use the {@code fileType} parameter
     * of the returned object.
     * @param scen The scenario to add the stats file to.
     * @param filename The name of the file to output to.
     * @returns The newly created stats file export.
     */
    addOutputStatsFileToScenario(scen: Scenario, filename: string): StatsFile;
    /**
     * Remove a stats file from a scenario.
     * @param stat The stats file to remove.
     */
    removeOutputStatsFileFromScenario(stat: StatsFile): boolean;
    /**
     * Stream output files to the MQTT connection.
     */
    streamOutputToMqtt(): void;
    /**
     * Clear the stream output files for the MQTT connection.
     */
    clearStreamOutputToMqtt(): void;
    /**
     * Stream output files to a GeoServer instance. Currently only GeoTIFF files can be streamed to GeoServer.
     * @param username The username to authenticate on the GeoServer instance with.
     * @param password The password to authenticate on the GeoServer instance with. WARNING: the password will be stored in plain text.
     * @param url The URL of the GeoServer instance. The web interface should be at {url}/web.
     * @param workspace The name of the workspace to upload the file to. If the workspace doesn't exist it will be created.
     * @param coverageStore A prefix on the filename that will be used when creating the coverage store.
     *                      The full coverage store name will be "coverageStore_filename" or just "filename" if coverageStore is an empty string.
     * @param srs The declared spatial reference system of the uploaded file. If not provided the uploaded coverage will not be enabled.
     */
    streamOutputToGeoServer(username: string, password: string, url: string, workspace: string, coverageStore: string, srs?: string): void;
    /**
     * Test the validity of a filename.
     * - The filename must not contain any of the following characters: \ / : * ? " < > |
     * - The filename must not begin with a dot (.)
     * - The filename may not be any of the following: nul, prn, con, aux, lpt#, com#
     * @param filename The filename to test for validity.
     */
    private validateFilename;
    /**
     * Add a file attachment to the project. Attachments can be used anywhere a filename would be used.
     * @param filename The name of the file to attach. Must be a valid Windows filename. See {@link validateFilename}
     * @param contents The file contents. Must still be valid if streamed to a file with UTF-8 encoding.
     * @returns Will return false if the filename is not valid, otherwise the URL to use as the filename
     *          when referencing the attachment will be returned.
     * @example
     * ```javascript
     * fs.readFile("/mnt/location/file.txt", "utf8", (err, data) => {
     *     //on successful read data will be a string containing the contents of the file
     *     let psaas = new PSaaS();
     *     let att = psaas.addAttachment("file.txt", data);
     *     psaas.addFileIgnition("2019-02-20T12:00:00", att, "No comment");
     * });
     *
     * fs.readFile("/mnt/location/file.kmz", (err, data) => {
     *     //on successful read data will be a Buffer containing the contents of the file
     *     let psaas = new PSaaS();
     *     let att = psaas.addAttachment("file.kmz", data);
     *     psaas.addFileIgnition("2019-02-20T12:00:00", att, "No comment");
     * });
     * ```
     */
    addAttachment(filename: string, contents: string | Buffer): string | boolean;
    /**
     * Sends the job to the job manager for execution.
     * @throws This method can only be called once at a time per instance.
     */
    beginJob(callback: (job: PSaaS, name: string) => any): void;
    /**
     * Sends the job to the job manager for execution.
     * @returns A {@link StartJobWrapper} that contains the name of the newly
     *          started job as well as the current {@link PSaaS} object.
     * @throws This method can only be called once at a time per instance.
     */
    beginJobPromise(): Promise<StartJobWrapper>;
    /**
     * Sends the job to the job manager for validation.
     * @throws This method can only be called once at a time per instance.
     */
    validateJob(callback: (job: PSaaS, name: string) => any): void;
    /**
     * Sends the job to the job manager for validation. The job won't run
     * completely until the user issues the rerun command later.
     * @returns A {@link StartJobWrapper} that contains the name of the newly
     * 			started job as well as the current {@link PSaaS} object.
     * @throws This method can only be called once at a time per instance.
     */
    validateJobPromise(): Promise<StartJobWrapper>;
    private beginJobInternal;
}
export declare class StartJobWrapper {
    /**
     * The PSaaS instance that started the job.
     */
    job: PSaaS;
    /**
     * The name of the started job.
     */
    name: string;
    constructor(job: PSaaS, name: string);
}
export declare enum StopPriority {
    /** Stop the job at the soonest time available (may not occur until currently running simulations have completed). */
    NONE = 0,
    /** Stop at the soonest time available but attempt to terminate the job if still running after 5 minutes. */
    SOON = 1,
    /** Attempt to terminate the executing process immediately. */
    NOW = 2
}
export declare class Admin {
    /**
     * Creates a TAR archive of the specified job. Note this does not delete the job directory.
     * @param jobname The name of the job to archive.
     */
    static archiveTar(jobname: string, callback?: () => any): void;
    /**
     * Creates a TAR archive of the specified job. Note this does not delete the job directory.
     * @param jobname The name of the job to archive.
     */
    static archiveTarPromise(jobname: string): Promise<void>;
    /**
     * Creates a ZIP archive of the specified job. Note this does not delete the job directory.
     * @param jobname The name of the job to archive.
     */
    static archiveZip(jobname: string, callback?: () => any): void;
    /**
     * Creates a ZIP archive of the specified job. Note this does not delete the job directory.
     * @param jobname The name of the job to archive.
     */
    static archiveZipPromise(jobname: string): Promise<void>;
    /**
     * Deletes the specified job directory. This is not reversible.
     * @param jobname The name of the job to delete.
     */
    static deleteJob(jobname: string, callback?: () => any): void;
    /**
     * Deletes the specified job directory. This is not reversible.
     * @param jobname The name of the job to delete.
     */
    static deleteJobPromise(jobname: string): Promise<void>;
    /**
     * Requests that a specific job stop executing.
     * @param jobname The job to stop executing.
     * @param priority The priority with which to stop the job.
     */
    static stopJob(jobname: string, priority?: StopPriority, callback?: () => any): void;
    /**
     * Requests that a specific job stop executing.
     * @param jobname The job to stop executing.
     * @param priority The priority with which to stop the job.
     */
    static stopJobPromise(jobname: string, priority?: StopPriority): Promise<void>;
    /**
     * Echos the list of complete jobs (both failed and succeeded) in a format that can be used in a <select> tag.
     */
    static echoCompleteJobOptions(callback?: (options: string) => any): void;
    /**
     * Echos the list of complete jobs (both failed and succeeded) in a format that can be used in a <select> tag.
     * @returns A string containing a list of `<option>` tags with the completed job list that can be used
     *          to populate a webpage.
     */
    static echoCompleteJobOptionsPromise(): Promise<string>;
    /**
     * Echos the list of running jobs in a format that can be used in a <select> tag.
     */
    static echoRunningJobOptions(callback?: (options: string) => any): void;
    /**
     * Echos the list of running jobs in a format that can be used in a <select> tag.
     * @returns A string containing a list of `<option>` tags with the running job list
     *          that can be used to populate a webpage.
     */
    static echoRunningJobOptionsPromise(): Promise<string>;
    /**
     * Echos the list of queued jobs in a format that can be used in a <select> tag.
     */
    static echoQueuedJobOptions(callback?: (options: string) => any): void;
    /**
     * Echos the list of queued jobs in a format that can be used in a <select> tag.
     * @returns A string containing a list of `<option>` tags with the queued job list
     *          that can be used to populate a webpage.
     */
    static echoQueuedJobOptionsPromise(): Promise<string>;
}
export {};
