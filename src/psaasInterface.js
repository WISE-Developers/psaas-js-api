"use strict";
/**
 * Classes needed to build and run a PSaaS job.
 * Jobs built with the classes in this module
 * will be serialized and streamed to PSaaS
 * Builder for it to construct the necessary
 * files to run PSaaS.
 *
 * For an example see index.js.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = exports.StopPriority = exports.StartJobWrapper = exports.PSaaS = exports.JobOptions = exports.LoadBalanceType = exports.UnitSettings = exports.MassAreaUnit = exports.IntensityUnit = exports.VelocityUnit = exports.CoordinateUnit = exports.AngleUnit = exports.PercentUnit = exports.EnergyUnit = exports.MassUnit = exports.PressureUnit = exports.TemperatureUnit = exports.VolumeUnit = exports.AreaUnit = exports.DistanceUnit = exports.TimeUnit = exports.GeoServerOutputStreamInfo = exports.MqttOutputStreamInfo = exports.OutputStreamInfo = exports.PSaaSOutputs = exports.StatsFile = exports.StatsFileType = exports.SummaryFile = exports.VectorFile = exports.PerimeterTimeOverride = exports.VectorFileType = exports.Output_GridFile = exports.ExportTimeOverride = exports.Output_GridFileCompression = exports.Output_GridFileInterpolation = exports.PSaaSInputs = exports.FuelOption = exports.FuelOptionType = exports.Scenario = exports.StationStream = exports.StreamOptions = exports.TimestepSettings = exports.TargetReference = exports.AssetReference = exports.LayerInfo = exports.LayerInfoOptions = exports.BurningConditions = exports.SinglePointIgnitionOptions = exports.MultiPointIgnitionOptions = exports.PolylineIgnitionOptions = exports.IgnitionReference = exports.TargetFile = exports.AssetFile = exports.AssetShapeType = exports.Ignition = exports.IgnitionType = exports.WeatherStation = exports.WeatherStream = exports.HFFMCMethod = exports.PSaaSInputsFiles = exports.FuelBreak = exports.FuelBreakType = exports.FuelPatch = exports.FromFuel = exports.FuelPatchType = exports.WeatherGrid = exports.WeatherGrid_GridFile = exports.WeatherGridType = exports.WeatherGridSector = exports.WeatherPatch = exports.WeatherPatch_WindDirection = exports.WeatherPatch_WindSpeed = exports.WeatherPatch_Precipitation = exports.WeatherPatch_RelativeHumidity = exports.WeatherPatch_Temperature = exports.WeatherPatchDetails = exports.WeatherPatchType = exports.WeatherPatchOperation = exports.GridFile = exports.GridFileType = exports.VersionInfo = void 0;
/** ignore this comment */
const fs = require("fs");
const luxon_1 = require("luxon");
const net = require("net");
const psaasGlobals_1 = require("./psaasGlobals");
class VersionInfo {
    /**
     * @ignore
     */
    static localVersion(version) {
        return version;
    }
}
exports.VersionInfo = VersionInfo;
VersionInfo.version_info = '2021.07.01' /*/vers*/;
VersionInfo.release_date = 'July 13, 2021' /*/rld*/;
var GridFileType;
(function (GridFileType) {
    GridFileType[GridFileType["NONE"] = -1] = "NONE";
    GridFileType[GridFileType["FUEL_GRID"] = 0] = "FUEL_GRID";
    GridFileType[GridFileType["DEGREE_CURING"] = 1] = "DEGREE_CURING";
    GridFileType[GridFileType["GREEN_UP"] = 2] = "GREEN_UP";
    GridFileType[GridFileType["PERCENT_CONIFER"] = 3] = "PERCENT_CONIFER";
    GridFileType[GridFileType["PERCENT_DEAD_FIR"] = 4] = "PERCENT_DEAD_FIR";
    GridFileType[GridFileType["CROWN_BASE_HEIGHT"] = 5] = "CROWN_BASE_HEIGHT";
    GridFileType[GridFileType["TREE_HEIGHT"] = 6] = "TREE_HEIGHT";
    GridFileType[GridFileType["FUEL_LOAD"] = 7] = "FUEL_LOAD";
    GridFileType[GridFileType["FBP_VECTOR"] = 8] = "FBP_VECTOR";
})(GridFileType = exports.GridFileType || (exports.GridFileType = {}));
/**
 * Information about a grid input file.
 * @author "Travis Redpath"
 */
class GridFile {
    constructor() {
        /**
         * Comment about the grid file (optional).
         */
        this._comment = "";
        /**
         * The type of grid file (required).
         */
        this.type = GridFileType.NONE;
        /**
         * The location of the file containing the grid data (required).
         */
        this._filename = "";
        /**
         * The projection file for the grid file (required).
         */
        this._projection = "";
        this._id = "grdfl" + GridFile.counter;
        GridFile.counter += 1;
    }
    /**
     * Get the name of the grid file.
     */
    get id() {
        return this._id;
    }
    /**
     * Set the name of the grid file. Must be unique amongst the grid file collection. Cannot be null or empty.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set id(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The name of the grid file is not valid");
        }
        this.setName(value);
    }
    /**
     * Get the comment about the grid file.
     */
    get comment() {
        return this._comment;
    }
    /**
     * Set the comment about the grid file.
     */
    set comment(value) {
        if (value == null) {
            this._comment = "";
        }
        else {
            this._comment = value;
        }
    }
    /**
     * Get the location of the file containing the grid data.
     */
    get filename() {
        return this._filename;
    }
    /**
     * Set the location of the file containing the grid data. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set filename(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && !psaasGlobals_1.SocketMsg.skipFileTests && !value.startsWith("attachment:/") && !fs.existsSync(value)) {
            throw new RangeError("The grid file does not exist.");
        }
        this._filename = value;
    }
    /**
     * Get the location of the projection file for the grid file.
     */
    get projection() {
        return this._projection;
    }
    /**
     * Set the location of the projection file for the grid file. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set projection(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && !psaasGlobals_1.SocketMsg.skipFileTests && !value.startsWith("attachment:/") && !fs.existsSync(value)) {
            throw new RangeError("The grid file projection does not exist.");
        }
        this._projection = value;
    }
    getId() {
        return this._id;
    }
    /**
     * Set the name of the grid file. This name must be unique within
     * the simulation. The name will get a default value when the
     * grid file is constructed but can be overriden with this method.
     */
    setName(name) {
        this._id = name.replace(/\|/g, "");
    }
    /**
     * Are all required values set.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find all errors that may be in the grid file.
     * @returns A list of errors that were found.
     */
    checkValid() {
        let errs = new Array();
        if (!this._id || this._id.length === 0) {
            errs.push(new psaasGlobals_1.ValidationError("id", "No ID has been set for the grid file.", this));
        }
        if (this.type < GridFileType.FUEL_GRID && this.type > GridFileType.TREE_HEIGHT) {
            errs.push(new psaasGlobals_1.ValidationError("type", "An invalid type has been set on the grid file.", this));
        }
        if (!psaasGlobals_1.SocketMsg.skipFileTests) {
            //the filename must be either an attachment or a local file
            if (!this._filename.startsWith("attachment:/") && !fs.existsSync(this._filename)) {
                errs.push(new psaasGlobals_1.ValidationError("filename", "The grid file file does not exist.", this));
            }
            //the projection must be either an attachment or a local file
            if (!this._projection.startsWith("attachment:/") && !fs.existsSync(this._projection)) {
                errs.push(new psaasGlobals_1.ValidationError("projection", "The grid file projection does not exist.", this));
            }
        }
        return errs;
    }
    /**
     * Streams the grid file to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this._id + '|' + this._comment + '|' + this.type + '|' + this._filename + '|' + this._projection;
        builder.write(GridFile.PARAM_GRID_FILE + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
exports.GridFile = GridFile;
GridFile.PARAM_GRID_FILE = "inputgridfile";
GridFile.counter = 0;
var WeatherPatchOperation;
(function (WeatherPatchOperation) {
    WeatherPatchOperation[WeatherPatchOperation["EQUAL"] = 0] = "EQUAL";
    WeatherPatchOperation[WeatherPatchOperation["PLUS"] = 1] = "PLUS";
    WeatherPatchOperation[WeatherPatchOperation["MINUS"] = 2] = "MINUS";
    WeatherPatchOperation[WeatherPatchOperation["MULTIPLY"] = 3] = "MULTIPLY";
    WeatherPatchOperation[WeatherPatchOperation["DIVIDE"] = 4] = "DIVIDE";
})(WeatherPatchOperation = exports.WeatherPatchOperation || (exports.WeatherPatchOperation = {}));
var WeatherPatchType;
(function (WeatherPatchType) {
    WeatherPatchType[WeatherPatchType["FILE"] = 0] = "FILE";
    WeatherPatchType[WeatherPatchType["POLYGON"] = 2] = "POLYGON";
    WeatherPatchType[WeatherPatchType["LANDSCAPE"] = 4] = "LANDSCAPE";
})(WeatherPatchType = exports.WeatherPatchType || (exports.WeatherPatchType = {}));
class WeatherPatchDetails {
    /**
     * Get the value to apply with this operation.
     */
    get value() {
        return this._value;
    }
    /**
     * Set the value to apply with this operation. Must be greater than 0.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set value(v) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && v <= 0) {
            throw new RangeError("The value is not valid.");
        }
        this._value = v;
    }
    checkValid() {
        let errs = new Array();
        if (this.operation < 0 || this.operation > WeatherPatchOperation.DIVIDE) {
            errs.push(new psaasGlobals_1.ValidationError("operation", "An invalid operation has been set on the weather patch details.", this));
        }
        if (this._value <= 0) {
            errs.push(new psaasGlobals_1.ValidationError("value", "An invalid value has been set on the weather patch details.", this));
        }
        return errs;
    }
}
exports.WeatherPatchDetails = WeatherPatchDetails;
class WeatherPatch_Temperature extends WeatherPatchDetails {
}
exports.WeatherPatch_Temperature = WeatherPatch_Temperature;
class WeatherPatch_RelativeHumidity extends WeatherPatchDetails {
    /**
     * Helper function for setting the RH value as a percent [0-100].
     * @param value The value to apply (as a percent [0-100]).
     */
    setValuePercent(value) {
        this.value = value / 100.0;
    }
    /**
     * Helper function for unsetting the RH value.
     */
    unsetValuePercent() {
        this.value = 0.0;
    }
}
exports.WeatherPatch_RelativeHumidity = WeatherPatch_RelativeHumidity;
class WeatherPatch_Precipitation extends WeatherPatchDetails {
}
exports.WeatherPatch_Precipitation = WeatherPatch_Precipitation;
class WeatherPatch_WindSpeed extends WeatherPatchDetails {
}
exports.WeatherPatch_WindSpeed = WeatherPatch_WindSpeed;
class WeatherPatch_WindDirection extends WeatherPatchDetails {
    checkValid() {
        let errs = new Array();
        if (this.operation < 0 || this.operation > WeatherPatchOperation.MINUS) {
            errs.push(new psaasGlobals_1.ValidationError("operation", "An invalid operation has been set on the wind direction weather patch details.", this));
        }
        if (this.value <= 0) {
            errs.push(new psaasGlobals_1.ValidationError("value", "An invalid value has been set on the weather patch details.", this));
        }
        return errs;
    }
}
exports.WeatherPatch_WindDirection = WeatherPatch_WindDirection;
/**
 * Information about a weather patch input file.
 * @author "Travis Redpath"
 */
class WeatherPatch {
    constructor() {
        /**
         * The patch start time (required).
         */
        this._startTime = null;
        /**
         * The patch end time (required).
         */
        this._endTime = null;
        /**
         * The patches start time of day (required).
         */
        this._startTimeOfDay = null;
        /**
         * The patches end time of day (required). Must be formatted as "hh:mm:ss".
         */
        this._endTimeOfDay = null;
        /**
         * Any user comments about the weather patch (optional).
         */
        this.comments = "";
        /**
         * The filename associated with this weather patch. Only valid if type is FILE.
         */
        this._filename = "";
        /**
         * An array of LatLon describing the weather patch. Only valid if type is POLYGON.
         */
        this.feature = new Array();
        /**
         * The temperature to apply with this patch.
         */
        this.temperature = null;
        /**
         * The relative humidty to apply with this patch.
         */
        this.rh = null;
        /**
         * The precipitation to apply with this patch.
         */
        this.precip = null;
        /**
         * The wind speed to apply with this patch.
         */
        this.windSpeed = null;
        /**
         * The wind direction to apply with this patch.
         */
        this.windDirection = null;
        this._id = "wthrptch" + WeatherPatch.counter;
        WeatherPatch.counter += 1;
    }
    /**
     * Get the name of the weather patch.
     */
    get id() {
        return this._id;
    }
    /**
     * Set the name of the weather patch. Must be unique amongst the weather patch collection. Cannot be null or empty.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set id(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The name of the weather patch is not valid");
        }
        this.setName(value);
    }
    /**
     * Get the weather patch start time as a Luxon DateTime.
     */
    get lStartTime() {
        return this._startTime;
    }
    /**
     * Get the weather patch start time as an ISO8601 string.
     * @deprecated
     */
    get startTime() {
        return this._startTime == null ? "" : this._startTime.toISO();
    }
    /**
     * Set the weather patch start time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lStartTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value == null) {
            throw new RangeError("The weather patch start time is not valid");
        }
        this._startTime = value;
    }
    /**
     * Set the weather patch start time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set startTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The weather patch start time is not valid");
        }
        this._startTime = luxon_1.DateTime.fromISO(value);
    }
    /**
     * Get the weather patch end time as a Luxon DateTime.
     */
    get lEndTime() {
        return this._endTime;
    }
    /**
     * Get the weather patch end time as an ISO8601 string.
     * @deprecated
     */
    get endTime() {
        return this._endTime == null ? "" : this._endTime.toISO();
    }
    /**
     * Set the weather patch end time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lEndTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value == null) {
            throw new RangeError("The weather patch end time is not valid");
        }
        this._endTime = value;
    }
    /**
     * Set the weather patch end time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set endTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The weather patch end time is not valid");
        }
        this._endTime = luxon_1.DateTime.fromISO(value);
    }
    /**
     * Get the weather patch start time of day as a Duration.
     */
    get dStartTimeOfDay() {
        return this._startTimeOfDay;
    }
    /**
     * Get the weather patch start time of day as an ISO8601 string.
     * @deprecated
     */
    get startTimeOfDay() {
        return this._startTimeOfDay == null ? "" : this._startTimeOfDay.toString();
    }
    /**
     * Set the weather patch start time of day using a Duration. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set dStartTimeOfDay(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || !value.isValid())) {
            throw new RangeError("The weather patch start time of dayis not valid");
        }
        this._startTimeOfDay = value;
    }
    /**
     * Set the weather patch start time of day using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set startTimeOfDay(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The weather patch start time of day is not valid");
        }
        this._startTimeOfDay = new psaasGlobals_1.Duration();
        this._startTimeOfDay.fromString(value);
    }
    /**
     * Get the weather patch end time of day as a Duration.
     */
    get dEndTimeOfDay() {
        return this._endTimeOfDay;
    }
    /**
     * Get the weather patch end time of day as an ISO8601 string.
     * @deprecated
     */
    get endTimeOfDay() {
        return this._endTimeOfDay == null ? "" : this._endTimeOfDay.toString();
    }
    /**
     * Set the weather patch end time of day using a Duration. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set dEndTimeOfDay(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || !value.isValid())) {
            throw new RangeError("The weather patch end time of dayis not valid");
        }
        this._endTimeOfDay = value;
    }
    /**
     * Set the weather patch end time of day using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set endTimeOfDay(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The weather patch end time of day is not valid");
        }
        this._endTimeOfDay = new psaasGlobals_1.Duration();
        this._endTimeOfDay.fromString(value);
    }
    /**
     * Get the location of the file containing the weather patch.
     */
    get filename() {
        return this._filename;
    }
    /**
     * Set the location of the file containing the weather patch. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set filename(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && !psaasGlobals_1.SocketMsg.skipFileTests && !value.startsWith("attachment:/") && !fs.existsSync(value)) {
            throw new RangeError("The grid file does not exist.");
        }
        this._filename = value;
    }
    getId() {
        return this._id;
    }
    /**
     * Set the name of the weather patch. This name must be unique within
     * the simulation. The name will get a default value when the
     * weather patch is constructed but can be overriden with this method.
     */
    setName(name) {
        this._id = name.replace(/\|/g, "");
    }
    /**
     * Set the temperature operation for the weather patch.
     * @param operation The operation to apply.
     * @param value The value to apply
     */
    setTemperatureOperation(operation, value) {
        this.temperature = new WeatherPatch_Temperature();
        this.temperature.value = value;
        this.temperature.operation = operation;
    }
    /**
     * Unset the temperature operation for the weather patch.
     */
    unsetTemperatureOperation() {
        this.temperature = null;
    }
    /**
     * Set the relative humidity operation for the weather patch.
     * @param operation The operation to apply.
     * @param value The value to apply (as a percent [0-100]).
     */
    setRhOperation(operation, value) {
        this.rh = new WeatherPatch_RelativeHumidity();
        this.rh.value = value / 100.0;
        this.rh.operation = operation;
    }
    /**
     * Unset the relative humidty operation for the weather patch.
     */
    unsetRhOperation() {
        this.rh = null;
    }
    /**
     * Set the precipitation operation for the weather patch.
     * @param operation The operation to apply.
     * @param value The value to apply
     */
    setPrecipitationOperation(operation, value) {
        this.precip = new WeatherPatch_Precipitation();
        this.precip.value = value;
        this.precip.operation = operation;
    }
    /**
     * Unset the precipitation operation for the weather patch.
     */
    unsetPrecipitationOperation() {
        this.precip = null;
    }
    /**
     * Set the wind speed operation for the weather patch.
     * @param operation The operation to apply.
     * @param value The value to apply
     */
    setWindSpeedOperation(operation, value) {
        this.windSpeed = new WeatherPatch_WindSpeed();
        this.windSpeed.value = value;
        this.windSpeed.operation = operation;
    }
    /**
     * Unset the wind speed operation for the weather patch.
     */
    unsetWindSpeedOperation() {
        this.windSpeed = null;
    }
    /**
     * Set the wind direction operation for the weather patch.
     * @param operation The operation to apply.
     * @param value The value to apply
     */
    setWindDirOperation(operation, value) {
        this.windDirection = new WeatherPatch_WindDirection();
        this.windDirection.value = value;
        this.windDirection.operation = operation;
    }
    /**
     * Unset the wind direction operation for the weather patch.
     */
    unsetWindDirOperation() {
        this.windDirection = null;
    }
    /**
     * Are all required values set.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find all errors in the weather patch.
     * @returns A list of errors in the weather patch.
     */
    checkValid() {
        let errs = new Array();
        if (!this._id || this._id.length === 0) {
            errs.push(new psaasGlobals_1.ValidationError("id", "No ID has been set for the weather patch.", this));
        }
        if (this._startTimeOfDay == null) {
            errs.push(new psaasGlobals_1.ValidationError("dStartTimeOfDay", "No start time of day has been set on the weather patch.", this));
        }
        if (this._endTimeOfDay == null) {
            errs.push(new psaasGlobals_1.ValidationError("dEndTimeOfDay", "No end time of day has been set on the weather patch.", this));
        }
        if (this._startTime == null) {
            errs.push(new psaasGlobals_1.ValidationError("lStartTime", "No start time has been set on the weather patch.", this));
        }
        if (this._endTime == null) {
            errs.push(new psaasGlobals_1.ValidationError("lEndTime", "No end time has been set on the weather patch.", this));
        }
        if (this.type == WeatherPatchType.FILE) {
            if (!psaasGlobals_1.SocketMsg.skipFileTests) {
                //the filename must be an attachment or a local file
                if (!this._filename.startsWith("attachment:/") && !fs.existsSync(this._filename)) {
                    errs.push(new psaasGlobals_1.ValidationError("filename", "The weather patch file does not exist.", this));
                }
            }
        }
        else if (this.type == WeatherPatchType.POLYGON) {
            if (this.feature.length == 0) {
                errs.push(new psaasGlobals_1.ValidationError("feature", "No points have been added to the polygon weather patch.", this));
            }
        }
        if (this.temperature != null) {
            let tempErr = this.temperature.checkValid();
            if (tempErr.length > 0) {
                let err = new psaasGlobals_1.ValidationError("temperature", "Errors found in weather patch temperature details.", this.temperature);
                tempErr.forEach(temp => {
                    err.addChild(temp);
                });
                errs.push(err);
            }
        }
        if (this.rh != null) {
            let tempErr = this.rh.checkValid();
            if (tempErr.length > 0) {
                let err = new psaasGlobals_1.ValidationError("rh", "Errors found in weather patch relative humidity details.", this.rh);
                tempErr.forEach(temp => {
                    err.addChild(temp);
                });
                errs.push(err);
            }
        }
        if (this.precip != null) {
            let tempErr = this.precip.checkValid();
            if (tempErr.length > 0) {
                let err = new psaasGlobals_1.ValidationError("precip", "Errors found in weather patch precipitation details.", this.precip);
                tempErr.forEach(temp => {
                    err.addChild(temp);
                });
                errs.push(err);
            }
        }
        if (this.windSpeed != null) {
            let tempErr = this.windSpeed.checkValid();
            if (tempErr.length > 0) {
                let err = new psaasGlobals_1.ValidationError("windSpeed", "Errors found in weather patch wind speed details.", this.windSpeed);
                tempErr.forEach(temp => {
                    err.addChild(temp);
                });
                errs.push(err);
            }
        }
        if (this.windDirection != null) {
            let tempErr = this.windDirection.checkValid();
            if (tempErr.length > 0) {
                let err = new psaasGlobals_1.ValidationError("windDirection", "Errors found in weather patch wind direction details.", this.windDirection);
                tempErr.forEach(temp => {
                    err.addChild(temp);
                });
                errs.push(err);
            }
        }
        return errs;
    }
    /**
     * Streams the weather patch file to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this._id + '|' + this.comments + '|' + this._startTime.toISO() + '|' + this._endTime.toISO() + '|' + this._startTimeOfDay.toString() + '|' + this._endTimeOfDay.toString();
        if (this.temperature != null) {
            tmp = tmp + '|temperature|' + this.temperature.operation + '|' + this.temperature.value;
        }
        if (this.rh != null) {
            tmp = tmp + '|rh|' + this.rh.operation + '|' + this.rh.value;
        }
        if (this.precip != null) {
            tmp = tmp + '|precip|' + this.precip.operation + '|' + this.precip.value;
        }
        if (this.windSpeed != null) {
            tmp = tmp + '|windspeed|' + this.windSpeed.operation + '|' + this.windSpeed.value;
        }
        if (this.windDirection != null) {
            tmp = tmp + '|winddir|' + this.windDirection.operation + '|' + this.windDirection.value;
        }
        if (this.type == WeatherPatchType.FILE) {
            tmp = tmp + '|file|' + this._filename;
        }
        else if (this.type == WeatherPatchType.LANDSCAPE) {
            tmp = tmp + '|landscape';
        }
        else if (this.type == WeatherPatchType.POLYGON) {
            tmp = tmp + '|polygon';
            for (let ft of this.feature) {
                tmp = tmp + '|' + ft.latitude + '|' + ft.longitude;
            }
        }
        builder.write(WeatherPatch.PARAM_WEATHER_PATCH + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
exports.WeatherPatch = WeatherPatch;
WeatherPatch.PARAM_WEATHER_PATCH = "weatherpatch";
WeatherPatch.counter = 0;
var WeatherGridSector;
(function (WeatherGridSector) {
    WeatherGridSector[WeatherGridSector["NORTH"] = 0] = "NORTH";
    WeatherGridSector[WeatherGridSector["NORTHEAST"] = 1] = "NORTHEAST";
    WeatherGridSector[WeatherGridSector["EAST"] = 2] = "EAST";
    WeatherGridSector[WeatherGridSector["SOUTHEAST"] = 3] = "SOUTHEAST";
    WeatherGridSector[WeatherGridSector["SOUTH"] = 4] = "SOUTH";
    WeatherGridSector[WeatherGridSector["SOUTHWEST"] = 5] = "SOUTHWEST";
    WeatherGridSector[WeatherGridSector["WEST"] = 6] = "WEST";
    WeatherGridSector[WeatherGridSector["NORTHWEST"] = 7] = "NORTHWEST";
})(WeatherGridSector = exports.WeatherGridSector || (exports.WeatherGridSector = {}));
var WeatherGridType;
(function (WeatherGridType) {
    WeatherGridType["DIRECTION"] = "direction";
    WeatherGridType["SPEED"] = "speed";
})(WeatherGridType = exports.WeatherGridType || (exports.WeatherGridType = {}));
/**
 * Information about a grid file.
 * @author "Travis Redpath"
 */
class WeatherGrid_GridFile {
    constructor() {
        /**
         * The wind speed (required).
         */
        this._speed = -1;
        /**
         * The location of the grid file (required).
         */
        this._filename = "";
        /**
         * The projection file for the grid file (required).
         */
        this.projection = "";
    }
    /**
     * Get the wind speed.
     */
    get speed() {
        return this._speed;
    }
    /**
     * Set the wind speed (km/h).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set speed(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value < 0 || value > 250)) {
            throw new RangeError("The wind speed is not valid.");
        }
        this._speed = value;
    }
    /**
     * Get the location of the file containing the grid data.
     */
    get filename() {
        return this._filename;
    }
    /**
     * Set the location of the file containing the grid data. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set filename(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && !psaasGlobals_1.SocketMsg.skipFileTests && !value.startsWith("attachment:/") && !fs.existsSync(value)) {
            throw new RangeError("The grid file does not exist.");
        }
        this._filename = value;
    }
    /**
     * Check to make sure all parameters have been set to valid values.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find a list of all errors in the weather grid file.
     * @returns A list of errors.
     */
    checkValid() {
        let errs = new Array();
        if (this.speed < 0 || this.speed > 250) {
            errs.push(new psaasGlobals_1.ValidationError("speed", "The wind speed must be >= 0km/h and <= 250km/h.", this));
        }
        if (this.sector != WeatherGridSector.NORTH && this.sector != WeatherGridSector.NORTHEAST &&
            this.sector != WeatherGridSector.EAST && this.sector != WeatherGridSector.SOUTHEAST &&
            this.sector != WeatherGridSector.SOUTH && this.sector != WeatherGridSector.SOUTHWEST &&
            this.sector != WeatherGridSector.WEST && this.sector != WeatherGridSector.NORTHWEST) {
            errs.push(new psaasGlobals_1.ValidationError("sector", "The wind direction sector is not one of the valid values.", this));
        }
        if (!psaasGlobals_1.SocketMsg.skipFileTests) {
            //the filename must be an attachment or a local file
            if (!this._filename.startsWith("attachment:/") && !fs.existsSync(this._filename)) {
                errs.push(new psaasGlobals_1.ValidationError("filename", "The weather grid data file does not exist.", this));
            }
            //the projection file must be an attachment or a local file
            if (!this.projection.startsWith("attachment:/") && !fs.existsSync(this.projection)) {
                errs.push(new psaasGlobals_1.ValidationError("projection", "The weather grid data projection file does not exist.", this));
            }
        }
        return errs;
    }
}
exports.WeatherGrid_GridFile = WeatherGrid_GridFile;
/**
 * Information about a weather grid input.
 * @author "Travis Redpath"
 */
class WeatherGrid {
    constructor() {
        /**
         * Any comments about the weather grid (optional).
         */
        this.comments = "";
        /**
         * The grid start time (required).
         */
        this._startTime = null;
        /**
         * The grid end time (required).
         */
        this._endTime = null;
        /**
         * The patches start time of day (required).
         */
        this._startTimeOfDay = null;
        /**
         * The patches end time of day (required).
         */
        this._endTimeOfDay = null;
        /**
         * An array of WeatherGrid_GridFile. There can be one for each wind sector (North, Northeast, East, etc.).
         */
        this.gridData = new Array();
        this._id = "wthrgrd" + WeatherGrid.counter;
        WeatherGrid.counter += 1;
    }
    /**
     * Get the name of the weather grid.
     */
    get id() {
        return this._id;
    }
    /**
     * Set the name of the weather grid. Must be unique amongst the weather grid collection. Cannot be null or empty.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set id(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The name of the weather grid is not valid");
        }
        this.setName(value);
    }
    /**
     * Get the weather grid start time as a Luxon DateTime.
     */
    get lStartTime() {
        return this._startTime;
    }
    /**
     * Get the weather grid start time as an ISO8601 string.
     * @deprecated
     */
    get startTime() {
        return this._startTime == null ? "" : this._startTime.toISO();
    }
    /**
     * Set the weather grid start time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lStartTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value == null) {
            throw new RangeError("The weather grid start time is not valid");
        }
        this._startTime = value;
    }
    /**
     * Set the weather grid start time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set startTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The weather patch start time is not valid");
        }
        this._startTime = luxon_1.DateTime.fromISO(value);
    }
    /**
     * Get the weather grid end time as a Luxon DateTime.
     */
    get lEndTime() {
        return this._endTime;
    }
    /**
     * Get the weather grid end time as an ISO8601 string.
     * @deprecated
     */
    get endTime() {
        return this._endTime == null ? "" : this._endTime.toISO();
    }
    /**
     * Set the weather grid end time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lEndTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value == null) {
            throw new RangeError("The weather grid end time is not valid");
        }
        this._endTime = value;
    }
    /**
     * Set the weather grid end time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set endTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The weather grid end time is not valid");
        }
        this._endTime = luxon_1.DateTime.fromISO(value);
    }
    /**
     * Get the weather grid start time of day as a Duration.
     */
    get dStartTimeOfDay() {
        return this._startTimeOfDay;
    }
    /**
     * Get the weather grid start time of day as an ISO8601 string.
     * @deprecated
     */
    get startTimeOfDay() {
        return this._startTimeOfDay == null ? "" : this._startTimeOfDay.toString();
    }
    /**
     * Set the weather grid start time of day using a Duration. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set dStartTimeOfDay(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || !value.isValid())) {
            throw new RangeError("The weather grid start time of dayis not valid");
        }
        this._startTimeOfDay = value;
    }
    /**
     * Set the weather grid start time of day using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set startTimeOfDay(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The weather grid start time of day is not valid");
        }
        this._startTimeOfDay = new psaasGlobals_1.Duration();
        this._startTimeOfDay.fromString(value);
    }
    /**
     * Get the weather grid end time of day as a Duration.
     */
    get dEndTimeOfDay() {
        return this._endTimeOfDay;
    }
    /**
     * Get the weather grid end time of day as an ISO8601 string.
     * @deprecated
     */
    get endTimeOfDay() {
        return this._endTimeOfDay == null ? "" : this._endTimeOfDay.toString();
    }
    /**
     * Set the weather grid end time of day using a Duration. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set dEndTimeOfDay(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || !value.isValid())) {
            throw new RangeError("The weather grid end time of dayis not valid");
        }
        this._endTimeOfDay = value;
    }
    /**
     * Set the weather grid end time of day using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set endTimeOfDay(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The weather grid end time of day is not valid");
        }
        this._endTimeOfDay = new psaasGlobals_1.Duration();
        this._endTimeOfDay.fromString(value);
    }
    /**
     * A convenience method for specifying the default values grid file and its projection.
     * @param defaultValuesFile The file or attachment that contains a grid of default values for the grid.
     * @param defaultValuesProjection The projection file for the specified default values file.
     */
    setDefaultValuesGrid(defaultValuesFile, defaultValuesProjection) {
        this.defaultValuesFile = defaultValuesFile;
        this.defaultValuesProjection = defaultValuesProjection;
    }
    getId() {
        return this._id;
    }
    /**
     * Set the name of the weather grid. This name must be unique within
     * the simulation. The name will get a default value when the
     * weather grid is constructed but can be overriden with this method.
     */
    setName(name) {
        this._id = name.replace(/\|/g, "");
    }
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
    addDirectionFile(filename, projection, sector, speed) {
        for (let gd of this.gridData) {
            if (gd.sector == sector) {
                throw new Error("Only one grid allowed per sector");
            }
        }
        let dir = new WeatherGrid_GridFile();
        dir.sector = sector;
        dir.speed = speed;
        dir.filename = filename;
        dir.projection = projection;
        this.gridData.push(dir);
        return dir;
    }
    /**
     * Remove a WeatherGrid_GridFile object from the weather grid.
     * @param weatherGrid The WeatherGrid_GridFile object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeDirectionFile(weatherGrid) {
        var index = this.gridData.indexOf(weatherGrid);
        if (index != -1) {
            this.gridData.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Are all required values set.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find all errors in the weather grid.
     * @returns A list of errors found.
     */
    checkValid() {
        let errs = new Array();
        if (!this._id || this._id.length === 0) {
            errs.push(new psaasGlobals_1.ValidationError("id", "No ID has been set for the weather grid.", this));
        }
        if (this._startTimeOfDay == null) {
            errs.push(new psaasGlobals_1.ValidationError("dStartTimeOfDay", "No start time of day has been set on the weather grid.", this));
        }
        if (this._endTimeOfDay == null) {
            errs.push(new psaasGlobals_1.ValidationError("dEndTimeOfDay", "No end time of day has been set on the weather grid.", this));
        }
        if (this._startTime == null) {
            errs.push(new psaasGlobals_1.ValidationError("lStartTime", "No start time has been set on the weather grid.", this));
        }
        if (this._endTime == null) {
            errs.push(new psaasGlobals_1.ValidationError("lEndTime", "No start time has been set on the weather grid.", this));
        }
        let dataErrs = new Array();
        for (let i = 0; i < this.gridData.length; i++) {
            let tempErr = this.gridData[i].checkValid();
            if (tempErr.length > 0) {
                let err = new psaasGlobals_1.ValidationError(i, `Error in weather grid data file at ${i}.`, this.gridData);
                tempErr.forEach(temp => {
                    err.addChild(temp);
                });
                dataErrs.push(err);
            }
        }
        if (dataErrs.length > 0) {
            let tempErr = new psaasGlobals_1.ValidationError("gridData", "Errors in weather grid data.", this);
            dataErrs.forEach(err => {
                tempErr.addChild(err);
            });
            errs.push(tempErr);
        }
        if (this.defaultValuesFile != null && this.defaultValuesFile.length > 0) {
            if (this.defaultValuesProjection == null || this.defaultValuesProjection.length == 0) {
                errs.push(new psaasGlobals_1.ValidationError("defaultValuesProjection", "The projection for the default sector data is required.", this));
            }
            else if (!psaasGlobals_1.SocketMsg.skipFileTests) {
                //the filename must be an attachment or a local file
                if (!this.defaultValuesFile.startsWith("attachment:/") && !fs.existsSync(this.defaultValuesFile)) {
                    errs.push(new psaasGlobals_1.ValidationError("defaultValuesFile", "The default grid data file does not exist.", this));
                }
                //the projection file must be an attachment or a local file
                if (!this.defaultValuesProjection.startsWith("attachment:/") && !fs.existsSync(this.defaultValuesProjection)) {
                    errs.push(new psaasGlobals_1.ValidationError("defaultValuesProjection", "The default grid data projection file does not exist.", this));
                }
            }
        }
        return errs;
    }
    /**
     * Streams the weather grid file to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this._id + '|' + this.comments + '|' + this._startTime.toISO() + '|' + this._endTime.toISO() + '|' + this._startTimeOfDay.toString() + '|' + this._endTimeOfDay.toString() + '|' + this.type;
        tmp = tmp + '|' + this.gridData.length;
        for (let gd of this.gridData) {
            tmp = tmp + '|' + gd.speed + '|' + gd.sector + '|' + gd.filename + '|' + gd.projection;
        }
        if (this.defaultValuesFile != null && this.defaultValuesFile.length > 0) {
            tmp = tmp + '|' + this.defaultValuesFile + '|' + this.defaultValuesProjection;
        }
        else {
            tmp = tmp + '|-1|-1';
        }
        builder.write(WeatherGrid.PARAM_WEATHER_GRID + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
exports.WeatherGrid = WeatherGrid;
WeatherGrid.PARAM_WEATHER_GRID = "weathergrid_2";
WeatherGrid.counter = 0;
var FuelPatchType;
(function (FuelPatchType) {
    FuelPatchType[FuelPatchType["FILE"] = 0] = "FILE";
    FuelPatchType[FuelPatchType["POLYGON"] = 2] = "POLYGON";
    FuelPatchType[FuelPatchType["LANDSCAPE"] = 4] = "LANDSCAPE";
})(FuelPatchType = exports.FuelPatchType || (exports.FuelPatchType = {}));
var FromFuel;
(function (FromFuel) {
    FromFuel["NODATA"] = "noData";
    FromFuel["ALL"] = "allFuels";
    FromFuel["ALL_COMBUSTABLE"] = "allCombustibleFuels";
})(FromFuel = exports.FromFuel || (exports.FromFuel = {}));
/**
 * A fuel patch file.
 * @author "Travis Redpath"
 */
class FuelPatch {
    constructor() {
        /**
         * The fuel the patch changes to.
         */
        this.toFuel = "";
        /**
         * Any comments about the fuel patch (optional).
         */
        this.comments = "";
        /**
         * The type of fuel patch (required).
         */
        this.type = -1;
        /**
         * The filename associated with this fuel patch. Only valid if type is FILE.
         */
        this._filename = "";
        /**
         * An array of LatLon describing the fuel patch. Only valid if type is POLYGON.
         */
        this.feature = new Array();
        /**
         * The fuel that the patch changes from (one of this, {@link #fromFuelIndex}, or {@link #fromFuelRule} is required).
         */
        this.fromFuel = null;
        /**
         * The rule about which fuels to apply the patch to (one of this, {@link #fromFuelIndex}, or {@link #fromFuel} is required).
         * If fromFuel is not specified this must be set.
         */
        this.fromFuelRule = null;
        /**
         * Instead of using the name of a fuel, reference it by index.
         */
        this.toFuelIndex = null;
        /**
         * Instead of using the name of a fuel, reference it by index.
         */
        this.fromFuelIndex = null;
        this._id = "flptch" + FuelPatch.counter;
        FuelPatch.counter += 1;
    }
    /**
     * Get the name of the fuel patch.
     */
    get id() {
        return this._id;
    }
    /**
     * Set the name of the fuel patch. Must be unique amongst the fuel patch collection. Cannot be null or empty.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set id(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The name of the fuel patch is not valid");
        }
        this.setName(value);
    }
    /**
     * Get the location of the file containing the fuel patch.
     */
    get filename() {
        return this._filename;
    }
    /**
     * Set the location of the file containing the fuel patch. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set filename(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && !psaasGlobals_1.SocketMsg.skipFileTests && !value.startsWith("attachment:/") && !fs.existsSync(value)) {
            throw new RangeError("The fuel patch file does not exist.");
        }
        this._filename = value;
    }
    getId() {
        return this._id;
    }
    /**
     * Set the name of the fuel patch. This name must be unique within
     * the simulation. The name will get a default value when the
     * fuel patch is constructed but can be overriden with this method.
     */
    setName(name) {
        this._id = name.replace(/\|/g, "");
    }
    /**
     * Are all required values set.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find all errors that may be in the fuel patch.
     */
    checkValid() {
        let errs = new Array();
        if (!this._id || this._id.length === 0) {
            errs.push(new psaasGlobals_1.ValidationError("id", "No ID has been set for the fuel patch.", this));
        }
        if (this.type != FuelPatchType.FILE && this.type != FuelPatchType.LANDSCAPE && this.type != FuelPatchType.POLYGON) {
            errs.push(new psaasGlobals_1.ValidationError("type", "An invalid type has been set for the fuelbreak. Must be one of FILE, LANDSCAPE, or POLYGON.", this));
        }
        if (this.fromFuel == null && this.fromFuelRule != FromFuel.ALL && this.fromFuelRule != FromFuel.NODATA &&
            this.fromFuelRule != FromFuel.ALL_COMBUSTABLE && this.fromFuelIndex == null) {
            errs.push(new psaasGlobals_1.ValidationError("fromFuel", "No from fuel has been set on the fuel patch.", this));
        }
        if (this.toFuel.length == 0 && this.toFuelIndex == null) {
            errs.push(new psaasGlobals_1.ValidationError("toFuel", "No to fuel has been set on the fuel patch.", this));
        }
        if (this.type == FuelPatchType.FILE) {
            if (!psaasGlobals_1.SocketMsg.skipFileTests) {
                //the file must be an attachment or a local file
                if (!this._filename.startsWith("attachment:/") && !fs.existsSync(this._filename)) {
                    errs.push(new psaasGlobals_1.ValidationError("filename", "The fuel patch file does not exist.", this));
                }
            }
        }
        else if (this.type == FuelPatchType.POLYGON) {
            if (this.feature.length == 0) {
                errs.push(new psaasGlobals_1.ValidationError("feature", "No points have been added to the polygon fuel patch.", this));
            }
        }
        return errs;
    }
    /**
     * Streams the fuel patch file to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this._id + '|' + this.comments;
        if (this.toFuelIndex == null) {
            tmp = tmp + '|' + this.toFuel;
        }
        else {
            tmp = tmp + '|' + this.toFuelIndex;
        }
        if (this.fromFuelRule == null) {
            if (this.fromFuel == null) {
                tmp = tmp + '|ifuel|' + this.fromFuelIndex;
            }
            else {
                tmp = tmp + '|fuel|' + this.fromFuel;
            }
        }
        else {
            tmp = tmp + '|rule|' + this.fromFuelRule;
        }
        if (this.type == FuelPatchType.FILE) {
            tmp = tmp + '|file|' + this._filename;
        }
        else if (this.type == FuelPatchType.LANDSCAPE) {
            tmp = tmp + '|landscape';
        }
        else if (this.type == FuelPatchType.POLYGON) {
            tmp = tmp + '|polygon';
            for (let ft of this.feature) {
                tmp = tmp + '|' + ft.latitude + '|' + ft.longitude;
            }
        }
        builder.write(FuelPatch.PARAM_FUELPATCH + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
exports.FuelPatch = FuelPatch;
FuelPatch.PARAM_FUELPATCH = "fuelpatch";
FuelPatch.counter = 0;
var FuelBreakType;
(function (FuelBreakType) {
    FuelBreakType[FuelBreakType["FILE"] = 0] = "FILE";
    FuelBreakType[FuelBreakType["POLYLINE"] = 1] = "POLYLINE";
    FuelBreakType[FuelBreakType["POLYGON"] = 2] = "POLYGON";
})(FuelBreakType = exports.FuelBreakType || (exports.FuelBreakType = {}));
/**
 * A fuel break file.
 * @author "Travis Redpath"
 */
class FuelBreak {
    constructor() {
        /**
         * The width of the fuel break (required if type is POLYLINE, otherwise ignored).
         */
        this._width = -1;
        /**
         * Comments about the fuel break (optional).
         */
        this.comments = "";
        /**
         * The type of fuelbreak (required).
         */
        this.type = -1;
        /**
         * The filename associated with this fuel break. Only valid if type is FILE.
         */
        this._filename = "";
        /**
         * An array of LatLon describing the fuel break. Only valid if type is POLYLINE or POLYGON.
         */
        this.feature = new Array();
        this._id = "flbrk" + FuelBreak.counter;
        FuelBreak.counter += 1;
    }
    /**
     * Get the name of the fuel break.
     */
    get id() {
        return this._id;
    }
    /**
     * Set the name of the fuel break. Must be unique amongst the fuel break collection. Cannot be null or empty.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set id(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The name of the fuel break is not valid");
        }
        this.setName(value);
    }
    /**
     * Get the width of the fuel break.
     */
    get width() {
        return this._width;
    }
    /**
     * Set the width of the fuel break (m).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set width(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value < 0 || value > 250)) {
            throw new RangeError("The width of the fuel break is not valid.");
        }
        this._width = value;
    }
    /**
     * Get the location of the file containing the fuel break.
     */
    get filename() {
        return this._filename;
    }
    /**
     * Set the location of the file containing the fuel break. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set filename(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && !psaasGlobals_1.SocketMsg.skipFileTests && !value.startsWith("attachment:/") && !fs.existsSync(value)) {
            throw new RangeError("The fuel break file does not exist.");
        }
        this._filename = value;
    }
    getId() {
        return this._id;
    }
    /**
     * Set the name of the fuel break. This name must be unique within
     * the simulation. The name will get a default value when the
     * fuel break is constructed but can be overriden with this method.
     */
    setName(name) {
        this._id = name.replace(/\|/g, "");
    }
    /**
     * Are all required values set.
     * @return boolean
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find any errors that may exist in the fuelbreak.
     * @returns A list of errors.
     */
    checkValid() {
        let errs = new Array();
        if (!this._id || this._id.length === 0) {
            errs.push(new psaasGlobals_1.ValidationError("id", "No ID has been set for the fuelbreak.", this));
        }
        if (this.type == FuelBreakType.POLYLINE) {
            if (this._width < 0 || this._width > 250.0) {
                errs.push(new psaasGlobals_1.ValidationError("width", "The fuelbreak width must be greater than 0m and less than 250m.", this));
            }
        }
        else if (this.type == FuelBreakType.FILE) {
            if (!psaasGlobals_1.SocketMsg.skipFileTests) {
                //the file must be an attachment or a local file
                if (!this._filename.startsWith("attachment:/") && !fs.existsSync(this._filename)) {
                    errs.push(new psaasGlobals_1.ValidationError("filename", "The fuelbreak file does not exist.", this));
                }
            }
        }
        else if (this.type == FuelBreakType.POLYGON) {
            if (this.feature.length == 0) {
                errs.push(new psaasGlobals_1.ValidationError("feature", "No points have been added to the polygon fuelbreak.", this));
            }
        }
        else {
            errs.push(new psaasGlobals_1.ValidationError("type", "An invalid type has been set for the fuelbreak. Must be one of FILE, POLYLINE, or POLYGON.", this));
        }
        return errs;
    }
    /**
     * Streams the fuel break file to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this._id + '|' + this.width + '|' + this.comments;
        if (this.type == FuelBreakType.FILE) {
            tmp = tmp + '|file|' + this._filename;
        }
        else if (this.type == FuelBreakType.POLYLINE) {
            tmp = tmp + '|polyline';
            for (let ft of this.feature) {
                tmp = tmp + '|' + ft.latitude + '|' + ft.longitude;
            }
        }
        else if (this.type == FuelBreakType.POLYGON) {
            tmp = tmp + '|polygon';
            for (let ft of this.feature) {
                tmp = tmp + '|' + ft.latitude + '|' + ft.longitude;
            }
        }
        builder.write(FuelBreak.PARAM_FUELBREAK + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
exports.FuelBreak = FuelBreak;
FuelBreak.PARAM_FUELBREAK = "fuelbreakfile";
FuelBreak.counter = 0;
/**
 * All information regarding the input files for PSaaS.
 * @author "Travis Redpath"
 */
class PSaaSInputsFiles {
    constructor() {
        /**The projection file (required).
         * The location of the projection file.
         */
        this._projFile = "";
        /**The LUT file (required).
         * The location of the LUT file.
         */
        this._lutFile = "";
        /**The fuel map file (required).
         * The location of the fuel map file.
         */
        this._fuelmapFile = "";
        /**The elevation map file (optional).
         * The location of the elevation file.
         */
        this._elevFile = "";
        /**
         * An array of fuel break files.
         */
        this.fuelBreakFiles = new Array();
        /**
         * An array of fuel patch files.
         */
        this.fuelPatchFiles = new Array();
        /**
         * An array of weather files.
         */
        this.weatherGridFiles = new Array();
        /**
         * An array of weather patch files.
         */
        this.weatherPatchFiles = new Array();
        /**
         * An array of grid files.
         */
        this.gridFiles = new Array();
    }
    /**
     * Get the location of the projection file.
     */
    get projFile() {
        return this._projFile;
    }
    /**
     * Set the location of the projection file. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set projFile(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && !psaasGlobals_1.SocketMsg.skipFileTests && !value.startsWith("attachment:/") && !fs.existsSync(value)) {
            throw new RangeError("The projection file does not exist.");
        }
        this._projFile = value;
    }
    /**
     * Get the location of the lookup table file.
     */
    get lutFile() {
        return this._lutFile;
    }
    /**
     * Set the location of the lookup table file. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lutFile(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && !psaasGlobals_1.SocketMsg.skipFileTests && !value.startsWith("attachment:/") && !fs.existsSync(value)) {
            throw new RangeError("The lookup table file does not exist.");
        }
        this._lutFile = value;
    }
    /**
     * Get the location of the fuel map file.
     */
    get fuelmapFile() {
        return this._fuelmapFile;
    }
    /**
     * Set the location of the fuel map file. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set fuelmapFile(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && !psaasGlobals_1.SocketMsg.skipFileTests && !value.startsWith("attachment:/") && !fs.existsSync(value)) {
            throw new RangeError("The fuel map file does not exist.");
        }
        this._fuelmapFile = value;
    }
    /**
     * Get the location of the elevation file.
     */
    get elevFile() {
        return this._elevFile;
    }
    /**
     * Set the location of the elevation file. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set). Can be null to remove the elevation file.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set elevFile(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value != null && !psaasGlobals_1.SocketMsg.skipFileTests && !value.startsWith("attachment:/") && !fs.existsSync(value)) {
            throw new RangeError("The fuel break file does not exist.");
        }
        if (value == null) {
            this._elevFile = "";
        }
        else {
            this._elevFile = value;
        }
    }
    /**
     * Are all required values specified.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find all errors that exist in the PSaaS input files.
     * @returns A list of errors that were found.
     */
    checkValid() {
        let _errors = new Array();
        //check if the projection was specified
        if (this.projFile.length == 0) {
            _errors.push(new psaasGlobals_1.ValidationError("projFile", "No projection file has been specified.", this));
        }
        else if (!psaasGlobals_1.SocketMsg.skipFileTests && !this._projFile.startsWith("attachment:/") && !fs.existsSync(this._projFile)) {
            _errors.push(new psaasGlobals_1.ValidationError("projFile", "The specified projection file does not exist.", this));
        }
        //check if the LUT file was specified
        if (this.lutFile.length == 0) {
            _errors.push(new psaasGlobals_1.ValidationError("lutFile", "No lookup table has been specified.", this));
        }
        else if (!psaasGlobals_1.SocketMsg.skipFileTests && !this._lutFile.startsWith("attachment:/") && !fs.existsSync(this._lutFile)) {
            _errors.push(new psaasGlobals_1.ValidationError("lutFile", "The specified lookup table does not exist.", this));
        }
        //check if the fuelmap was specified
        if (this.fuelmapFile.length == 0) {
            _errors.push(new psaasGlobals_1.ValidationError("fuelmapFile", "No fuelmap file has been specified.", this));
        }
        else if (!psaasGlobals_1.SocketMsg.skipFileTests && !this._fuelmapFile.startsWith("attachment:/") && !fs.existsSync(this._fuelmapFile)) {
            _errors.push(new psaasGlobals_1.ValidationError("fuelmapFile", "The specified fuelmap file does not exist.", this));
        }
        //the elevation file is optional but if it was set make sure it exists
        if (this._elevFile.length > 0 && !psaasGlobals_1.SocketMsg.skipFileTests && !this.elevFile.startsWith("attachment:/") && !fs.existsSync(this._elevFile)) {
            _errors.push(new psaasGlobals_1.ValidationError("elevFile", "The specified elevation file does not exist.", this));
        }
        let tempErrs = new Array();
        //check the fuelbreak files for validity
        for (let i = 0; i < this.fuelBreakFiles.length; i++) {
            let fbErr = new psaasGlobals_1.ValidationError(i, `Errors found in the fuelbreak at index ${i}.`, this.fuelBreakFiles);
            for (let j = i + 1; j < this.fuelBreakFiles.length; j++) {
                if (this.fuelBreakFiles[i].id.toUpperCase() === this.fuelBreakFiles[j].id.toUpperCase()) {
                    let err = new psaasGlobals_1.ValidationError("id", "Duplicate fuelbreak IDs.", this.fuelBreakFiles[i]);
                    fbErr.addChild(err);
                    break;
                }
            }
            this.fuelBreakFiles[i].checkValid().forEach(err => {
                fbErr.addChild(err);
            });
            if (fbErr.children.length > 0) {
                tempErrs.push(fbErr);
            }
        }
        if (tempErrs.length > 0) {
            let err = new psaasGlobals_1.ValidationError("fuelBreakFiles", "Errors found in fuelbreaks.", this);
            tempErrs.forEach(temp => {
                err.addChild(temp);
            });
            _errors.push(err);
        }
        tempErrs = new Array();
        //check the fuel patch files for validity
        for (let i = 0; i < this.fuelPatchFiles.length; i++) {
            let fpErr = new psaasGlobals_1.ValidationError(i, `Errors found in the fuel patch at index ${i}.`, this.fuelPatchFiles);
            for (let j = i + 1; j < this.fuelPatchFiles.length; j++) {
                if (this.fuelPatchFiles[i].id.toUpperCase() === this.fuelPatchFiles[j].id.toUpperCase()) {
                    let err = new psaasGlobals_1.ValidationError("id", "Duplicate fuel patch IDs.", this.fuelPatchFiles[i]);
                    fpErr.addChild(err);
                    break;
                }
            }
            this.fuelPatchFiles[i].checkValid().forEach(err => {
                fpErr.addChild(err);
            });
            if (fpErr.children.length > 0) {
                tempErrs.push(fpErr);
            }
        }
        if (tempErrs.length > 0) {
            let err = new psaasGlobals_1.ValidationError("fuelPatchFiles", "Errors found in fuel patches.", this);
            tempErrs.forEach(temp => {
                err.addChild(temp);
            });
            _errors.push(err);
        }
        tempErrs = new Array();
        //check the weather grid files for validity
        for (let i = 0; i < this.weatherGridFiles.length; i++) {
            let wgErr = new psaasGlobals_1.ValidationError(i, `Errors found in the weather grid at index ${i}.`, this.weatherGridFiles);
            for (let j = i + 1; j < this.weatherGridFiles.length; j++) {
                if (this.weatherGridFiles[i].id.toUpperCase() === this.weatherGridFiles[j].id.toUpperCase()) {
                    let err = new psaasGlobals_1.ValidationError("id", "Duplicate weather grid IDs.", this.weatherGridFiles[i]);
                    wgErr.addChild(err);
                    break;
                }
            }
            this.weatherGridFiles[i].checkValid().forEach(err => {
                wgErr.addChild(err);
            });
            if (wgErr.children.length > 0) {
                tempErrs.push(wgErr);
            }
        }
        if (tempErrs.length > 0) {
            let err = new psaasGlobals_1.ValidationError("weatherGridFiles", "Errors found in weather grids.", this);
            tempErrs.forEach(temp => {
                err.addChild(temp);
            });
            _errors.push(err);
        }
        tempErrs = new Array();
        //check the weather patch files for validity
        for (let i = 0; i < this.weatherPatchFiles.length; i++) {
            let wgErr = new psaasGlobals_1.ValidationError(i, `Errors found in the weather patch at index ${i}.`, this.weatherPatchFiles);
            for (let j = i + 1; j < this.weatherPatchFiles.length; j++) {
                if (this.weatherPatchFiles[i].id.toUpperCase() === this.weatherPatchFiles[j].id.toUpperCase()) {
                    let err = new psaasGlobals_1.ValidationError("id", "Duplicate weather patch IDs.", this.weatherGridFiles[i]);
                    wgErr.addChild(err);
                    break;
                }
            }
            this.weatherPatchFiles[i].checkValid().forEach(err => {
                wgErr.addChild(err);
            });
            if (wgErr.children.length > 0) {
                tempErrs.push(wgErr);
            }
        }
        if (tempErrs.length > 0) {
            let err = new psaasGlobals_1.ValidationError("weatherPatchFiles", "Errors found in weather patches.", this);
            tempErrs.forEach(temp => {
                err.addChild(temp);
            });
            _errors.push(err);
        }
        tempErrs = new Array();
        //check the grid files for validity
        for (let i = 0; i < this.gridFiles.length; i++) {
            let gfErr = new psaasGlobals_1.ValidationError(i, `Errors found in the weather patch at index ${i}.`, this.weatherPatchFiles);
            for (let j = i + 1; j < this.gridFiles.length; j++) {
                if (this.gridFiles[i].id.toUpperCase() === this.gridFiles[j].id.toUpperCase()) {
                    let err = new psaasGlobals_1.ValidationError("id", "Duplicate grid file IDs.", this.weatherGridFiles[i]);
                    gfErr.addChild(err);
                    break;
                }
            }
            this.gridFiles[i].checkValid().forEach(err => {
                gfErr.addChild(err);
            });
            if (gfErr.children.length > 0) {
                tempErrs.push(gfErr);
            }
        }
        if (tempErrs.length > 0) {
            let err = new psaasGlobals_1.ValidationError("gridFiles", "Errors found in grid files.", this);
            tempErrs.forEach(temp => {
                err.addChild(temp);
            });
            _errors.push(err);
        }
        return _errors;
    }
    /**
     * Streams the input files to a socket.
     * @param builder
     */
    stream(builder) {
        builder.write(PSaaSInputsFiles.PARAM_PROJ + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(this.projFile + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(PSaaSInputsFiles.PARAM_LUT + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(this.lutFile + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(PSaaSInputsFiles.PARAM_FUELMAP + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(this.fuelmapFile + psaasGlobals_1.SocketMsg.NEWLINE);
        if (this.elevFile.length > 0) {
            builder.write(PSaaSInputsFiles.PARAM_ELEVATION + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(this.elevFile + psaasGlobals_1.SocketMsg.NEWLINE);
        }
        for (let fb of this.fuelBreakFiles) {
            fb.stream(builder);
        }
        for (let fp of this.fuelPatchFiles) {
            fp.stream(builder);
        }
        for (let wg of this.weatherGridFiles) {
            wg.stream(builder);
        }
        for (let wp of this.weatherPatchFiles) {
            wp.stream(builder);
        }
        for (let gf of this.gridFiles) {
            gf.stream(builder);
        }
        return "";
    }
}
exports.PSaaSInputsFiles = PSaaSInputsFiles;
PSaaSInputsFiles.PARAM_PROJ = "projfile";
PSaaSInputsFiles.PARAM_LUT = "lutfile";
PSaaSInputsFiles.PARAM_FUELMAP = "fuelmapfile";
PSaaSInputsFiles.PARAM_ELEVATION = "elevationfile";
var HFFMCMethod;
(function (HFFMCMethod) {
    HFFMCMethod[HFFMCMethod["VAN_WAGNER"] = 0] = "VAN_WAGNER";
    HFFMCMethod[HFFMCMethod["LAWSON"] = 1] = "LAWSON";
})(HFFMCMethod = exports.HFFMCMethod || (exports.HFFMCMethod = {}));
/**
 * Information about a weather stream.
 * @author "Travis Redpath"
 */
class WeatherStream {
    /**
     * Construct a new weather stream.
     * @param parentId The ID of the weather station that the stream came from.
     */
    constructor(parentId) {
        /**
         * User comments about the weather stream (optional).
         */
        this.comments = "";
        /**
         * The location of the file containing the stream data (required).
         */
        this._filename = "";
        /**
         * Yesterday's daily starting fine fuel moisture code (required).
         */
        this._starting_ffmc = -1;
        /**
         * Yesterday's daily starting duff moisture code (required).
         */
        this._starting_dmc = -1;
        /**
         * Yesterday's daily starting drought code (required).
         */
        this._starting_dc = -1;
        /**
         * Yesterday's daily starting precipitation (13:01-23:00 if daylight savings time, 12:01-23:00 otherwise) (required).
         */
        this._starting_precip = -1;
        /**
         * The HFFMC calculation method (required).
         */
        this.hffmc_method = -1;
        /**
         * Diurnal parameters - temperature alpha (optional).
         */
        this.diurnal_temperature_alpha = 9999;
        /**
         * Diurnal parameters - temperature beta (optional).
         */
        this.diurnal_temperature_beta = 9999;
        /**
         * Diurnal parameters - temperature gamma (optional).
         */
        this.diurnal_temperature_gamma = 9999;
        /**
         * Diurnal parameters - wind speed alpha (optional).
         */
        this.diurnal_windspeed_alpha = 9999;
        /**
         * Diurnal parameters - wind speed beta (optional).
         */
        this.diurnal_windspeed_beta = 9999;
        /**
         * Diurnal parameters - wind speed gamma (optional).
         */
        this.diurnal_windspeed_gamma = 9999;
        /**
         * The starting time of the weather stream (required).
         */
        this._start_time = null;
        /**
         * The ending time of the weather stream (required). Must be formatted as 'YYYY-MM-DD'.
         */
        this._end_time = null;
        /**
         * The ID of the weather station that this stream came from.
         */
        this.parentId = null;
        this._id = "wthrstrm" + WeatherStream.counter;
        WeatherStream.counter += 1;
        this.parentId = parentId;
    }
    /**
     * Get the name of the weather stream.
     */
    get id() {
        return this._id;
    }
    /**
     * Set the name of the weather stream. Must be unique amongst the weather stream collection. Cannot be null or empty.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set id(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The name of the weather stream is not valid");
        }
        this.setName(value);
    }
    /**
     * Get the location of the file containing the weather stream.
     */
    get filename() {
        return this._filename;
    }
    /**
     * Set the location of the file containing the weather stream. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set filename(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && !psaasGlobals_1.SocketMsg.skipFileTests && !value.startsWith("attachment:/") && !fs.existsSync(value)) {
            throw new RangeError("The weather stream file does not exist.");
        }
        this._filename = value;
    }
    /**
     * Get yesterday's daily starting fine fuel moisture code.
     */
    get starting_ffmc() {
        return this._starting_ffmc;
    }
    /**
     * Set yesterday's daily starting fine fuel moisture code. Must be in [0, 101].
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set starting_ffmc(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value < 0 || value > 101)) {
            throw new RangeError("The start FFMC value is not valid.");
        }
        this._starting_ffmc = value;
    }
    /**
     * Get yesterday's daily starting duff moisture code.
     */
    get starting_dmc() {
        return this._starting_dmc;
    }
    /**
     * Set yesterday's daily starting duff moisture code. Must be in [0, 500].
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set starting_dmc(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value < 0 || value > 500)) {
            throw new RangeError("The start DMC value is not valid.");
        }
        this._starting_dmc = value;
    }
    /**
     * Get yesterday's daily starting drought code.
     */
    get starting_dc() {
        return this._starting_dc;
    }
    /**
     * Set yesterday's daily starting drought code. Must be in [0, 1500].
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set starting_dc(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value < 0 || value > 1500)) {
            throw new RangeError("The start DC value is not valid.");
        }
        this._starting_dc = value;
    }
    /**
     * Get yesterday's daily starting precipitation.
     */
    get starting_precip() {
        return this._starting_precip;
    }
    /**
     * Set yesterday's daily starting precipitation. Must be greater than or equal to 0.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set starting_precip(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value < 0)) {
            throw new RangeError("The start precipitation value is not valid.");
        }
        this._starting_precip = value;
    }
    /**
     * Get the hour that the HFFMC value is for.
     */
    get hffmc_hour() {
        return this._hffmc_hour;
    }
    /**
     * Set the hour that the HFFMC value is for. Must be in [0,23]. Use -1 to use the default.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set hffmc_hour(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value < -1 || value > 23)) {
            throw new RangeError("The HFFMC hour is not valid.");
        }
        this._hffmc_hour = value;
    }
    /**
     * Get the weather stream starting date as a Luxon DateTime.
     */
    get lstart_time() {
        return this._start_time;
    }
    /**
     * Get the weather grid end time as an ISO8601 string.
     * @deprecated
     */
    get start_time() {
        return this._start_time == null ? "" : this._start_time.toISODate();
    }
    /**
     * Set the weather grid end time using a Luxon DateTime. Cannot be null. Only the date component will be used.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lstart_time(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value == null) {
            throw new RangeError("The weather stream start date is not valid");
        }
        this._start_time = value;
    }
    /**
     * Set the weather grid end time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set start_time(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The weather stream start date is not valid");
        }
        this._start_time = luxon_1.DateTime.fromISO(value);
    }
    /**
     * Get the weather stream end time as a Luxon DateTime.
     */
    get lend_time() {
        return this._end_time;
    }
    /**
     * Get the weather stream end time as an ISO8601 string.
     * @deprecated
     */
    get end_time() {
        return this._end_time == null ? "" : this._end_time.toISODate();
    }
    /**
     * Set the weather stream end date using a Luxon DateTime. Cannot be null. Only the date component will be used.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lend_time(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value == null) {
            throw new RangeError("The weather stream end date is not valid");
        }
        this._end_time = value;
    }
    /**
     * Set the weather stream end date using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set end_time(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The weather stream end date is not valid");
        }
        this._end_time = luxon_1.DateTime.fromISO(value);
    }
    /**
     * Get the unique ID of this weather stream.
     */
    getId() {
        return this._id;
    }
    /**
     * Set the name of the weather stream. This name must be unique within
     * the simulation. The name will get a default value when the
     * weather stream is constructed but can be overriden with this method.
     */
    setName(name) {
        this._id = name.replace(/\|/g, "");
    }
    /**
     * Get the unique ID of the weather station that this stream came from.
     */
    getParentId() {
        return this.parentId;
    }
    /**
     * Checks to see if all required values have been set.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find any errors that may be in the weather stream.
     * @returns A list of errors that were found.
     */
    checkValid() {
        let errs = new Array();
        if (!this._id || this._id.length === 0) {
            errs.push(new psaasGlobals_1.ValidationError("id", "No ID has been set for the weather stream.", this));
        }
        if (!psaasGlobals_1.SocketMsg.skipFileTests) {
            //the file must be an attachment or a local file
            if (!this._filename.startsWith("attachment:/") && !fs.existsSync(this._filename)) {
                errs.push(new psaasGlobals_1.ValidationError("filename", "The specified weather file does not exist.", this));
            }
        }
        if (this._starting_ffmc < 0 || this._starting_ffmc > 101.0) {
            errs.push(new psaasGlobals_1.ValidationError("starting_ffmc", "Invalid starting FFMC value for the weather stream.", this));
        }
        if (this._starting_dmc < 0 || this._starting_dmc > 500.0) {
            errs.push(new psaasGlobals_1.ValidationError("starting_dmc", "Invalid starting DMC value for the weather stream.", this));
        }
        if (this._starting_dc < 0 || this._starting_dc > 1500.0) {
            errs.push(new psaasGlobals_1.ValidationError("starting_dc", "Invalid starting DC value for the weather stream.", this));
        }
        if (this._starting_precip < 0) {
            errs.push(new psaasGlobals_1.ValidationError("starting_precip", "Invalid starting precipitation value for the weather stream.", this));
        }
        if (this._hffmc_hour < -1 || this._hffmc_hour > 23) {
            errs.push(new psaasGlobals_1.ValidationError("hffmc_hour", "Invalid starting HFFMC hour for the weather stream.", this));
        }
        if (this.hffmc_method != HFFMCMethod.LAWSON && this.hffmc_method != HFFMCMethod.VAN_WAGNER) {
            errs.push(new psaasGlobals_1.ValidationError("hffmc_method", "Invalid HFFMC calculation method for the weather stream.", this));
        }
        if (this._start_time == null) {
            errs.push(new psaasGlobals_1.ValidationError("lstart_time", "No start time has been set for the weather stream.", this));
        }
        if (this._end_time == null) {
            errs.push(new psaasGlobals_1.ValidationError("lend_time", "No end time has been set for the weather stream.", this));
        }
        return errs;
    }
    /**
     * Streams the weather station to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this._id + '|' + this._filename + '|' + this.hffmc_value + '|' + this.hffmc_hour + '|' + this.hffmc_method;
        tmp = tmp + '|' + this.starting_ffmc + '|' + this.starting_dmc + '|' + this.starting_dc + '|' + this.starting_precip;
        tmp = tmp + '|' + this._start_time.toISODate() + '|' + this._end_time.toISODate();
        tmp = tmp + '|' + this.parentId + '|' + this.comments;
        if (this.diurnal_temperature_alpha != 9999) {
            tmp = tmp + '|' + this.diurnal_temperature_alpha + '|' + this.diurnal_temperature_beta + '|' + this.diurnal_temperature_gamma;
            tmp = tmp + '|' + this.diurnal_windspeed_alpha + '|' + this.diurnal_windspeed_beta + '|' + this.diurnal_windspeed_gamma;
        }
        builder.write(WeatherStream.PARAM_WEATHERSTREAM + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
exports.WeatherStream = WeatherStream;
WeatherStream.PARAM_WEATHERSTREAM = "weatherstream";
WeatherStream.counter = 0;
class WeatherStation {
    constructor() {
        /**
         * The location of the weather station (required).
         */
        this.location = null;
        /**
         * The weather streams from this weather station.
         */
        this.streams = new Array();
        /**
         * User comments about the weather station (optional).
         */
        this.comments = "";
        /**
         * The elevation of the weather station (required).
         */
        this.elevation = 0;
        this._id = "wthrstn" + WeatherStation.counter;
        WeatherStation.counter += 1;
    }
    /**
     * Get the name of the weather station.
     */
    get id() {
        return this._id;
    }
    /**
     * Set the name of the weather station. Must be unique amongst the weather station collection. Cannot be null or empty.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set id(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The name of the weather station is not valid");
        }
        this.setName(value);
    }
    getId() {
        return this._id;
    }
    /**
     * Set the name of the weather station. This name must be unique within
     * the simulation. The name will get a default value when the
     * weather station is constructed but can be overriden with this method.
     */
    setName(name) {
        this._id = name.replace(/\|/g, "");
    }
    /**
     * Checks to see if all required values are specified.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Look for errors in the weather station.
     * @returns A list of all errors found in the weather station.
     */
    checkValid() {
        let errs = new Array();
        if (!this._id || this._id.length === 0) {
            errs.push(new psaasGlobals_1.ValidationError("id", "No ID has been set for the weather station.", this));
        }
        if (this.location == null) {
            errs.push(new psaasGlobals_1.ValidationError("location", "The location of the weather station has not been set.", this));
        }
        let weatherStreamErrs = new Array();
        for (let i = 0; i < this.streams.length; i++) {
            let wsErr = new psaasGlobals_1.ValidationError(i, `Errors found in the weather stream at index ${i}.`, this.streams);
            for (let j = i + 1; j < this.streams.length; j++) {
                if (this.streams[i].id.toUpperCase() === this.streams[j].id.toUpperCase()) {
                    let err = new psaasGlobals_1.ValidationError("id", "Duplicate weather stream IDs.", this.streams[i]);
                    wsErr.addChild(err);
                    break;
                }
            }
            this.streams[i].checkValid().forEach(err => {
                wsErr.addChild(err);
            });
            if (wsErr.children.length > 0) {
                weatherStreamErrs.push(wsErr);
            }
        }
        if (weatherStreamErrs.length > 0) {
            let temp = new psaasGlobals_1.ValidationError("streams", "Errors found in weather streams.", this);
            weatherStreamErrs.forEach(err => {
                temp.addChild(err);
            });
            errs.push(temp);
        }
        return errs;
    }
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
    addWeatherStream(filename, hffmc_value, hffmc_hour, hffmc_method, starting_ffmc, starting_dmc, starting_dc, starting_precip, start_time, end_time, comments) {
        let ws = new WeatherStream(this.id);
        if (comments != null) {
            ws.comments = comments;
        }
        ws.filename = filename;
        ws.hffmc_value = hffmc_value;
        ws.hffmc_hour = Math.round(hffmc_hour);
        ws.hffmc_method = hffmc_method;
        ws.starting_ffmc = starting_ffmc;
        ws.starting_dmc = starting_dmc;
        ws.starting_dc = starting_dc;
        ws.starting_precip = starting_precip;
        if (typeof start_time === "string") {
            ws.start_time = start_time;
        }
        else {
            ws.lstart_time = start_time;
        }
        if (typeof end_time === "string") {
            ws.end_time = end_time;
        }
        else {
            ws.lend_time = end_time;
        }
        this.streams.push(ws);
        return ws;
    }
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
    addWeatherStreamWithDiurnalParameters(filename, hffmc_value, hffmc_hour, hffmc_method, starting_ffmc, starting_dmc, starting_dc, starting_precip, start_time, end_time, talpha, tbeta, tgamma, wsalpha, wsbeta, wsgamma, comments) {
        let ws = new WeatherStream(this.id);
        if (comments != null) {
            ws.comments = comments;
        }
        ws.filename = filename;
        ws.hffmc_value = hffmc_value;
        ws.hffmc_hour = Math.round(hffmc_hour);
        ws.hffmc_method = hffmc_method;
        ws.starting_ffmc = starting_ffmc;
        ws.starting_dmc = starting_dmc;
        ws.starting_dc = starting_dc;
        ws.starting_precip = starting_precip;
        if (typeof start_time === "string") {
            ws.start_time = start_time;
        }
        else {
            ws.lstart_time = start_time;
        }
        if (typeof end_time === "string") {
            ws.end_time = end_time;
        }
        else {
            ws.lend_time = end_time;
        }
        ws.diurnal_temperature_alpha = talpha;
        ws.diurnal_temperature_beta = tbeta;
        ws.diurnal_temperature_gamma = tgamma;
        ws.diurnal_windspeed_alpha = wsalpha;
        ws.diurnal_windspeed_beta = wsbeta;
        ws.diurnal_windspeed_gamma = wsgamma;
        this.streams.push(ws);
        return ws;
    }
    /**
     * Remove a WeatherStream object from the weather grid.
     * @param weatherStream The WeatherStream object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeWeatherStream(weatherStream) {
        var index = this.streams.indexOf(weatherStream);
        if (index != -1) {
            this.streams.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Streams the weather station to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this._id + '|' + this.location.latitude + '|' + this.location.longitude + '|' + this.elevation + '|' + this.comments;
        builder.write(WeatherStation.PARAM_WEATHERSTATION + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
        for (let stream of this.streams) {
            stream.stream(builder);
        }
    }
}
exports.WeatherStation = WeatherStation;
WeatherStation.PARAM_WEATHERSTATION = "weatherstation";
WeatherStation.counter = 0;
var IgnitionType;
(function (IgnitionType) {
    IgnitionType[IgnitionType["FILE"] = 0] = "FILE";
    IgnitionType[IgnitionType["POLYLINE"] = 1] = "POLYLINE";
    IgnitionType[IgnitionType["POLYGON"] = 2] = "POLYGON";
    IgnitionType[IgnitionType["POINT"] = 4] = "POINT";
})(IgnitionType = exports.IgnitionType || (exports.IgnitionType = {}));
/**
 * Information about an ignition input.
 * @author "Travis Redpath"
 */
class Ignition {
    constructor() {
        /**
         * User comments about the ignition (optional).
         */
        this.comments = "";
        /**
         * The ignition start time (required).
         */
        this._startTime = null;
        /**
         * The type of ignition (required).
         */
        this.type = -1;
        /**
         * The filename associated with this ignition. Only valid if type is FILE.
         */
        this._filename = "";
        /**
         * An array of LatLon describing the ignition. Only valid if type is POLYLINE, POLYGON, or POINT.
         */
        this.feature = new Array();
        /**
         * A list of attributes for the ignition. Not valid for {@link #filename} types.
         * Valid types for the value are Integer, Long, Double, and String.
         */
        this.attributes = new Array();
        this._id = "ign" + Ignition.counter;
        Ignition.counter += 1;
    }
    /**
     * Get the name of the ignition.
     */
    get id() {
        return this._id;
    }
    /**
     * Set the name of the ignition. Must be unique amongst the ignition collection. Cannot be null or empty.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set id(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The name of the ignition is not valid");
        }
        this.setName(value);
    }
    /**
     * Get the ignition start time as a Luxon DateTime.
     */
    get lStartTime() {
        return this._startTime;
    }
    /**
     * Get the ignition start time as an ISO8601 string.
     * @deprecated
     */
    get startTime() {
        return this._startTime == null ? "" : this._startTime.toISO();
    }
    /**
     * Set the ignition start time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lStartTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value == null) {
            throw new RangeError("The ignition start time is not valid");
        }
        this._startTime = value;
    }
    /**
     * Set the ignition start time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set startTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The ignition start time is not valid");
        }
        this._startTime = luxon_1.DateTime.fromISO(value);
    }
    /**
     * Get the location of the file containing the ignition.
     */
    get filename() {
        return this._filename;
    }
    /**
     * Set the location of the file containing the ignition. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set filename(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && !psaasGlobals_1.SocketMsg.skipFileTests && !value.startsWith("attachment:/") && !fs.existsSync(value)) {
            throw new RangeError("The ignition file does not exist.");
        }
        this._filename = value;
    }
    getId() {
        return this._id;
    }
    /**
     * Set the name of the ignition. This name must be unique within
     * the simulation. The name will get a default value when the
     * ignition is constructed but can be overriden with this method.
     */
    setName(name) {
        this._id = name.replace(/\|/g, "");
    }
    /**
     * Add a new point to the ignition shape. Only valid for POLYLINE, POLYGON, or POINT.
     * @param point The point to add to the ignition.
     * @returns The current ignition object so that multiple additions can be chained.
     */
    addPoint(point) {
        this.feature.push(point);
        return this;
    }
    /**
     * Checks to see if all required values have been set.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    checkValid() {
        let errs = new Array();
        if (!this._id || this._id.length === 0) {
            errs.push(new psaasGlobals_1.ValidationError("id", "No ID has been set for the ignition.", this));
        }
        if (this._startTime == null) {
            errs.push(new psaasGlobals_1.ValidationError("lStartTime", "No start time has been set for the ignition.", this));
        }
        if (this.type == IgnitionType.FILE) {
            if (!psaasGlobals_1.SocketMsg.skipFileTests) {
                //the file must be an attachment or a local file
                if (!this._filename.startsWith("attachment:/") && fs.existsSync(this._filename)) {
                    errs.push(new psaasGlobals_1.ValidationError("filename", "The specified ignition file does not exist.", this));
                }
            }
        }
        else if ((this.type == IgnitionType.POLYLINE || this.type == IgnitionType.POLYGON || this.type == IgnitionType.POINT)) {
            if (this.feature.length == 0) {
                errs.push(new psaasGlobals_1.ValidationError("feature", "No locations have been added to the ignition.", this));
            }
        }
        else {
            errs.push(new psaasGlobals_1.ValidationError("type", "Invalid ignition type.", this));
        }
        return errs;
    }
    /**
     * Streams the ignition to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this._id + '|' + this._startTime.toISO() + '|' + this.comments;
        if (this.type == IgnitionType.FILE) {
            tmp = tmp + '|file|' + this._filename;
        }
        else if (this.type == IgnitionType.POINT) {
            tmp = tmp + '|point';
            for (let p of this.feature) {
                tmp = tmp + '|' + p.latitude + '|' + p.longitude;
            }
        }
        else if (this.type == IgnitionType.POLYGON) {
            tmp = tmp + '|polygon';
            for (let p of this.feature) {
                tmp = tmp + '|' + p.latitude + '|' + p.longitude;
            }
        }
        else if (this.type == IgnitionType.POLYLINE) {
            tmp = tmp + '|polyline';
            for (let p of this.feature) {
                tmp = tmp + '|' + p.latitude + '|' + p.longitude;
            }
        }
        tmp = tmp + "|attr|" + this.attributes.length;
        for (let a of this.attributes) {
            tmp = tmp + "|" + a.key + "|" + a.value;
        }
        builder.write(Ignition.PARAM_IGNITION + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
exports.Ignition = Ignition;
Ignition.PARAM_IGNITION = "ignition";
Ignition.counter = 0;
/**
 * The type of shape that is being used to describe an
 * asset.
 */
var AssetShapeType;
(function (AssetShapeType) {
    AssetShapeType[AssetShapeType["FILE"] = 0] = "FILE";
    AssetShapeType[AssetShapeType["POLYLINE"] = 1] = "POLYLINE";
    AssetShapeType[AssetShapeType["POLYGON"] = 2] = "POLYGON";
    AssetShapeType[AssetShapeType["POINT"] = 4] = "POINT";
})(AssetShapeType = exports.AssetShapeType || (exports.AssetShapeType = {}));
/**
 * An asset that can be used to stop a simulation early.
 * @author "Travis Redpath"
 */
class AssetFile {
    constructor() {
        /**
         * User comments about the asset (optional).
         */
        this.comments = "";
        /**
         * The type of asset (required).
         */
        this.type = -1;
        /**
         * The filename associated with this asset. Only valid if type is FILE.
         */
        this._filename = "";
        /**
         * An array of LatLon describing the asset. Only valid if type is POLYLINE, POLYGON, or POINT.
         */
        this.feature = new Array();
        /**
         * The buffer size to use for line or point assets. If negative, no buffer will be used.
         */
        this.buffer = -1.0;
        this._id = "asset" + AssetFile.counter;
        AssetFile.counter += 1;
    }
    /**
     * Get the name of the asset.
     */
    get id() {
        return this._id;
    }
    /**
     * Set the name of the asset. Must be unique amongst the asset collection. Cannot be null or empty.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set id(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The name of the asset is not valid");
        }
        this.setName(value);
    }
    /**
     * Get the location of the file containing the asset.
     */
    get filename() {
        return this._filename;
    }
    /**
     * Set the location of the file containing the asset. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set filename(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && !psaasGlobals_1.SocketMsg.skipFileTests && !value.startsWith("attachment:/") && !fs.existsSync(value)) {
            throw new RangeError("The asset file does not exist.");
        }
        this._filename = value;
    }
    getId() {
        return this._id;
    }
    /**
     * Set the name of the asset. This name must be unique within
     * the simulation. The name will get a default value when the
     * asset is constructed but can be overriden with this method.
     */
    setName(name) {
        this._id = name.replace(/\|/g, "");
    }
    /**
     * Checks to see if all required values have been set.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find all errors that may exist in the asset.
     * @returns A list of errors that were found.
     */
    checkValid() {
        const errs = new Array();
        if (!this._id || this._id.length === 0) {
            errs.push(new psaasGlobals_1.ValidationError("id", "No ID has been set for the asset.", this));
        }
        if (this.type == AssetShapeType.FILE) {
            if (!psaasGlobals_1.SocketMsg.skipFileTests) {
                //the file must be an attachment or a local file
                if (!this._filename.startsWith("attachment:/") && fs.existsSync(this._filename)) {
                    errs.push(new psaasGlobals_1.ValidationError("filename", "The specified asset file does not exist.", this));
                }
            }
        }
        else if ((this.type == AssetShapeType.POLYLINE || this.type == AssetShapeType.POLYGON || this.type == AssetShapeType.POINT) && this.feature.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("feature", "No locations have been added to the asset.", this));
        }
        else {
            errs.push(new psaasGlobals_1.ValidationError("type", "Invalid asset type.", this));
        }
        return errs;
    }
    /**
     * Streams the ignition to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this._id + '|' + this.comments + '|' + (+this.type) + '|' + this.buffer;
        if (this.type == AssetShapeType.FILE) {
            tmp = tmp + this._filename;
        }
        else {
            for (let p of this.feature) {
                tmp = tmp + '|' + p.latitude + '|' + p.longitude;
            }
        }
        builder.write(AssetFile.PARAM_ASSET_FILE + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
exports.AssetFile = AssetFile;
AssetFile.PARAM_ASSET_FILE = "asset_file";
AssetFile.counter = 0;
/**
 * A target to direct simulated weather towards.
 */
class TargetFile {
    constructor() {
        /**
         * User comments about the target (optional).
         */
        this.comments = "";
        /**
         * The type of target (required).
         */
        this.type = -1;
        /**
         * The filename associated with this target. Only valid if type is FILE.
         */
        this._filename = "";
        /**
         * An array of LatLon describing the target. Only valid if type is POLYLINE, POLYGON, or POINT.
         */
        this.feature = new Array();
        this._id = "target" + TargetFile.counter;
        TargetFile.counter += 1;
    }
    /**
     * Get the name of the target.
     */
    get id() {
        return this._id;
    }
    /**
     * Set the name of the target. Must be unique amongst the target collection. Cannot be null or empty.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set id(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The name of the target is not valid");
        }
        this.setName(value);
    }
    /**
     * Get the location of the file containing the target.
     */
    get filename() {
        return this._filename;
    }
    /**
     * Set the location of the file containing the target. The file must either be an attachment or exist on the disk (if {@link SocketMsg.skipFileTests} is not set).
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set filename(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && !psaasGlobals_1.SocketMsg.skipFileTests && !value.startsWith("attachment:/") && !fs.existsSync(value)) {
            throw new RangeError("The target file does not exist.");
        }
        this._filename = value;
    }
    getId() {
        return this._id;
    }
    /**
     * Set the name of the target. This name must be unique within
     * the simulation. The name will get a default value when the
     * target is constructed but can be overriden with this method.
     */
    setName(name) {
        this._id = name.replace(/\|/g, "");
    }
    /**
     * Checks to see if all required values have been set.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find all errors that may exist in the asset.
     * @returns A list of errors that were found.
     */
    checkValid() {
        const errs = new Array();
        if (!this._id || this._id.length === 0) {
            errs.push(new psaasGlobals_1.ValidationError("id", "No ID has been set for the target.", this));
        }
        if (this.type == AssetShapeType.FILE) {
            if (!psaasGlobals_1.SocketMsg.skipFileTests) {
                //the file must be an attachment or a local file
                if (!this._filename.startsWith("attachment:/") && fs.existsSync(this._filename)) {
                    errs.push(new psaasGlobals_1.ValidationError("filename", "The specified target file does not exist.", this));
                }
            }
        }
        else if ((this.type == AssetShapeType.POLYLINE || this.type == AssetShapeType.POLYGON || this.type == AssetShapeType.POINT) && this.feature.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("feature", "No locations have been added to the target.", this));
        }
        else {
            errs.push(new psaasGlobals_1.ValidationError("type", "Invalid target type.", this));
        }
        return errs;
    }
    /**
     * Streams the ignition to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this._id + '|' + this.comments + '|' + (+this.type);
        if (this.type == AssetShapeType.FILE) {
            tmp = tmp + this._filename;
        }
        else {
            for (let p of this.feature) {
                tmp = tmp + '|' + p.latitude + '|' + p.longitude;
            }
        }
        builder.write(TargetFile.PARAM_TARGET_FILE + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
exports.TargetFile = TargetFile;
TargetFile.PARAM_TARGET_FILE = "target_file";
TargetFile.counter = 0;
/**
 * Options for associating an ignition point with a scenario.
 */
class IgnitionReference {
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find all errors that may exist in the ignition reference.
     * @returns A list of errors that were found.
     */
    checkValid() {
        const errs = new Array();
        if (this.ignition == null || this.ignition.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("ignition", "No ignition reference was set.", this));
        }
        let count = 0;
        if (this.polylineIgnitionOptions != null) {
            count++;
            let optionsErrs = this.polylineIgnitionOptions.checkValid();
            if (optionsErrs.length > 0) {
                let temp = new psaasGlobals_1.ValidationError("polylineIgnitionOptions", "Errors in sub-scenario options for polyline ignitions.", this);
                optionsErrs.forEach(err => {
                    temp.addChild(err);
                });
                errs.push(temp);
            }
        }
        if (this.multiPointIgnitionOptions != null) {
            count++;
            let optionsErrs = this.multiPointIgnitionOptions.checkValid();
            if (optionsErrs.length > 0) {
                let temp = new psaasGlobals_1.ValidationError("multiPointIgnitionOptions", "Errors in sub-scenario options for multi-point ignitions.", this);
                optionsErrs.forEach(err => {
                    temp.addChild(err);
                });
                errs.push(temp);
            }
        }
        if (this.singlePointIgnitionOptions != null) {
            count++;
            let optionsErrs = this.singlePointIgnitionOptions.checkValid();
            if (optionsErrs.length > 0) {
                let temp = new psaasGlobals_1.ValidationError("singlePointIgnitionOptions", "Errors in sub-scenario options for single point ignitions.", this);
                optionsErrs.forEach(err => {
                    temp.addChild(err);
                });
                errs.push(temp);
            }
        }
        if (count > 0) {
            errs.push(new psaasGlobals_1.ValidationError(null, "More than one sub-scenario type has been specified.", this));
        }
        return errs;
    }
}
exports.IgnitionReference = IgnitionReference;
class PolylineIgnitionOptions {
    constructor() {
        /**
         * The spacing between points (expressed in meters)
         */
        this.pointSpacing = 0;
        /**
         * Index of the polyline to use, or -1 to use all polylines.
         */
        this.polyIndex = -1;
        /**
         * Index of the point ignition to use in the specified polyline(s), or -1 to use all points.
         */
        this.pointIndex = -1;
    }
    checkValid() {
        const errs = new Array();
        if (this.name == null || this.name.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("name", "No name has been set for the sub-scenario.", this));
        }
        return errs;
    }
}
exports.PolylineIgnitionOptions = PolylineIgnitionOptions;
class MultiPointIgnitionOptions {
    constructor() {
        /**
         * Index of the point ignition to use in the specified polyline(s), or -1 to use all points.
         */
        this.pointIndex = -1;
    }
    checkValid() {
        const errs = new Array();
        if (this.name == null || this.name.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("name", "No name has been set for the sub-scenario.", this));
        }
        return errs;
    }
}
exports.MultiPointIgnitionOptions = MultiPointIgnitionOptions;
class SinglePointIgnitionOptions {
    checkValid() {
        const errs = new Array();
        if (this.name == null || this.name.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("name", "No name has been set for the sub-scenario.", this));
        }
        return errs;
    }
}
exports.SinglePointIgnitionOptions = SinglePointIgnitionOptions;
/**
 * A condition for burning.
 * @author "Travis Redpath"
 */
class BurningConditions {
    constructor() {
        /**
         * The date the burning condition is in effect on (required).
         */
        this._date = null;
        /**
         * The time of day that the burning condition starts to take effect (optional).
         */
        this.startTime = null;
        /**
         * The time of day that the burning condition stops (optional).
         */
        this.endTime = null;
        /**
         * The minimum FWI value that will allow burning (optional).
         */
        this._fwiGreater = 0;
        /**
         * The minimum wind speed that will allow burning (optional).
         */
        this._wsGreater = 0;
        /**
         * The maximum relative humidity that will allow burning (optional).
         */
        this._rhLess = 100;
        /**
         * The minimum ISI that will allow burning (optional).
         */
        this._isiGreater = 0;
        this.startTime = psaasGlobals_1.Duration.createTime(0, 0, 0, false);
        this.endTime = psaasGlobals_1.Duration.createTime(23, 59, 59, false);
    }
    /**
     * Get the burning condition date as a Luxon DateTime.
     */
    get lDate() {
        return this._date;
    }
    /**
     * Get the burning condition date as an ISO8601 string.
     * @deprecated
     */
    get date() {
        return this._date == null ? "" : this._date.toISODate();
    }
    /**
     * Set the burning condition date using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lDate(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value == null) {
            throw new RangeError("The ignition start time is not valid");
        }
        this._date = value;
    }
    /**
     * Set the burning condition date using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set date(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The burning condition date is not valid");
        }
        this._date = luxon_1.DateTime.fromISO(value);
    }
    /**
     * Get the minimum FWI value that will allow burning.
     */
    get fwiGreater() {
        return this._fwiGreater;
    }
    /**
     * Set the minimum FWI value that will allow burning. Must be greater than or equal to 0.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set fwiGreater(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value != null && value < 0) {
            throw new RangeError("The minimum FWI value that will allow burning is not valid.");
        }
        this._fwiGreater = value;
    }
    /**
     * Get the minimum wind speed that will allow burning.
     */
    get wsGreater() {
        return this._wsGreater;
    }
    /**
     * Set the minimum wind speed that will allow burning. Must be in [0, 200].
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set wsGreater(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value != null && (value < 0 || value > 200)) {
            throw new RangeError("The minimum wind speed that will allow burning is not valid.");
        }
        this._wsGreater = value;
    }
    /**
     * Get the maximum relative humidity that will allow burning.
     */
    get rhLess() {
        return this._rhLess;
    }
    /**
     * Set the maximum relative humidity that will allow burning. Must be in [0, 100].
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set rhLess(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value != null && (value < 0 || value > 100)) {
            throw new RangeError("The maximum relative humidity that will allow burning is not valid.");
        }
        this._rhLess = value;
    }
    /**
     * Get the minimum ISI that will allow burning.
     */
    get isiGreater() {
        return this._isiGreater;
    }
    /**
     * Set the minimum ISI that will allow burning. Must be greater than or equal to 0.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set isiGreater(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value != null && value < 0) {
            throw new RangeError("The minimum ISI that will allow burning is not valid.");
        }
        this._isiGreater = value;
    }
    /**
     * Checks to see if all required values have been set.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find all errors that may exist in the burn condition.
     * @returns A list of errors that were found.
     */
    checkValid() {
        const errs = new Array();
        if (this._date == null) {
            errs.push(new psaasGlobals_1.ValidationError("date", "No date was set to apply the burn conditions to.", this));
        }
        let startReady = true;
        if (this.startTime == null) {
            startReady = false;
            errs.push(new psaasGlobals_1.ValidationError("startTime", "No start time of day has been set for the burn condition.", this));
        }
        else if (!this.startTime.isValid() || this.startTime.isNegative || this.startTime.years > 0 || this.startTime.days > 0 || this.startTime.hours > 23) {
            startReady = false;
            errs.push(new psaasGlobals_1.ValidationError("startTime", "The start time of day for the burn condition is invalid.", this));
        }
        if (this.endTime == null) {
            errs.push(new psaasGlobals_1.ValidationError("endTime", "No end time of day has been set for the burn condition.", this));
        }
        else if (!this.endTime.isValid() || this.endTime.isNegative || psaasGlobals_1.Duration.createTime(24, 0, 0, false).isLessThan(this.endTime)) {
            errs.push(new psaasGlobals_1.ValidationError("endTime", "The end time of day for the burn condition is invalid.", this));
        }
        else if (startReady && this.endTime.isLessThan(this.startTime)) {
            errs.push(new psaasGlobals_1.ValidationError("endTime", "The end time of day for the burn condition is before the start time of day.", this));
        }
        if (this._fwiGreater < 0) {
            errs.push(new psaasGlobals_1.ValidationError("fwiGreater", "The specified minimum FWI required for burning is invalid.", this));
        }
        if (this._wsGreater < 0 || this._wsGreater > 200) {
            errs.push(new psaasGlobals_1.ValidationError("wsGreater", "The specified minimum wind speed required for burning is invalid.", this));
        }
        if (this._rhLess < 0 || this._rhLess > 100) {
            errs.push(new psaasGlobals_1.ValidationError("rhLess", "The specified maximum relative humidity required for burning is invalid.", this));
        }
        if (this._isiGreater < 0) {
            errs.push(new psaasGlobals_1.ValidationError("isiGreater", "The specified minimum ISI required for burning is invalid.", this));
        }
        return errs;
    }
}
exports.BurningConditions = BurningConditions;
class LayerInfoOptions {
    constructor() {
        this.subNames = new Array();
    }
}
exports.LayerInfoOptions = LayerInfoOptions;
class LayerInfo {
    constructor(id) {
        /**
         * The name of the grid file to add.
         */
        this.name = "";
        /**
         * The layers index.
         */
        this.index = -1;
        /**
         * Options for the layer when creating sub-scenarios.
         */
        this.options = null;
        this.name = id;
    }
    getName() {
        return this.name;
    }
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find all errors that may exist in the layer reference.
     * @returns A list of all errors that were found.
     */
    checkValid() {
        const errs = new Array();
        if (this.name == null || this.name.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("name", "No layer reference has been set.", this));
        }
        if (this.index < 0) {
            errs.push(new psaasGlobals_1.ValidationError("index", "The layer index has not been set.", this));
        }
        return errs;
    }
}
exports.LayerInfo = LayerInfo;
/**
 * A reference to an asset that has been added to a scenario. Contains options
 * for how to handle the asset.
 */
class AssetReference {
    constructor(id) {
        /**
         * The name of the asset that was added.
         */
        this.name = "";
        /**
         * The affect the asset will have on the simulation.
         */
        this.operation = psaasGlobals_1.AssetOperation.UNDEFINED;
        /**
         * The number of assets that need to be reached before the simulation will stop. Only valid if operation is AssetOperation::STOP_AFTER_X.
         */
        this.collisionCount = -1;
        this.name = id;
    }
    getName() {
        return this.name;
    }
    checkValid() {
        const errs = new Array();
        if (this.name == null || this.name.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("name", "No aseet reference has been set.", this));
        }
        if (this.operation == psaasGlobals_1.AssetOperation.STOP_AFTER_X && this.collisionCount < 1) {
            errs.push(new psaasGlobals_1.ValidationError("collisionCount", "The collision count has not been set when the asset operation is to stop after reaching X assets.", this));
        }
        return errs;
    }
}
exports.AssetReference = AssetReference;
/**
 * A reference to a target that has been added to a scenario. Contains options
 * for how to handle the target.
 */
class TargetReference {
    constructor(id) {
        /**
         * The name of the target that was added.
         */
        this.name = "";
        /**
         * An index of a geometry within the shape to use as the target.
         */
        this.geometryIndex = -1;
        /**
         * An index of a point within the shape to use as the target.
         */
        this.pointIndex = -1;
        this.name = id;
    }
    getName() {
        return this.name;
    }
    checkValid() {
        const errs = new Array();
        if (this.name == null || this.name.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("name", "No target reference has been set.", this));
        }
        return errs;
    }
}
exports.TargetReference = TargetReference;
/**
 * Settings to modify PSaaS behaviour at the end of every timestep.
 * @author "Travis Redpath"
 */
class TimestepSettings {
    constructor() {
        this.statistics = new Array();
        /**
         * The amount to discritize the existing grid to (optional).
         * Will only be applied to statistics that require a discretization parameter.
         * Must be in [1,1001].
         */
        this.discretize = null;
    }
    /**
     * Check to see if a global statistic if valid to be used as a timestep setting.
     * @param stat True if the input statistic if valid for timestep settings.
     */
    static validateInput(stat) {
        if (stat != psaasGlobals_1.GlobalStatistics.TOTAL_BURN_AREA && stat != psaasGlobals_1.GlobalStatistics.TOTAL_PERIMETER &&
            stat != psaasGlobals_1.GlobalStatistics.EXTERIOR_PERIMETER && stat != psaasGlobals_1.GlobalStatistics.ACTIVE_PERIMETER && stat != psaasGlobals_1.GlobalStatistics.TOTAL_PERIMETER_CHANGE &&
            stat != psaasGlobals_1.GlobalStatistics.TOTAL_PERIMETER_GROWTH_RATE && stat != psaasGlobals_1.GlobalStatistics.EXTERIOR_PERIMETER_CHANGE && stat != psaasGlobals_1.GlobalStatistics.EXTERIOR_PERIMETER_GROWTH_RATE &&
            stat != psaasGlobals_1.GlobalStatistics.ACTIVE_PERIMETER_CHANGE && stat != psaasGlobals_1.GlobalStatistics.ACTIVE_PERIMETER_GROWTH_RATE && stat != psaasGlobals_1.GlobalStatistics.AREA_CHANGE &&
            stat != psaasGlobals_1.GlobalStatistics.AREA_GROWTH_RATE && stat != psaasGlobals_1.GlobalStatistics.NUM_VERTICES && stat != psaasGlobals_1.GlobalStatistics.NUM_ACTIVE_VERTICES &&
            stat != psaasGlobals_1.GlobalStatistics.CUMULATIVE_ACTIVE_VERTICES && stat != psaasGlobals_1.GlobalStatistics.CUMULATIVE_VERTICES && stat != psaasGlobals_1.GlobalStatistics.NUM_FRONTS &&
            stat != psaasGlobals_1.GlobalStatistics.NUM_ACTIVE_FRONTS && stat != psaasGlobals_1.GlobalStatistics.MAX_ROS && stat != psaasGlobals_1.GlobalStatistics.MAX_CFB && stat != psaasGlobals_1.GlobalStatistics.MAX_CFC &&
            stat != psaasGlobals_1.GlobalStatistics.MAX_SFC && stat != psaasGlobals_1.GlobalStatistics.MAX_TFC && stat != psaasGlobals_1.GlobalStatistics.MAX_FI && stat != psaasGlobals_1.GlobalStatistics.MAX_FL &&
            stat != psaasGlobals_1.GlobalStatistics.TICKS && stat != psaasGlobals_1.GlobalStatistics.PROCESSING_TIME && stat != psaasGlobals_1.GlobalStatistics.GROWTH_TIME &&
            stat != psaasGlobals_1.GlobalStatistics.DATE_TIME && stat != psaasGlobals_1.GlobalStatistics.SCENARIO_NAME && stat != psaasGlobals_1.GlobalStatistics.HFI && stat != psaasGlobals_1.GlobalStatistics.HCFB) {
            return false;
        }
        return true;
    }
    /**
     * Add a statistic to output.
     * @param stat The name of the statistic to add.
     * @returns The added statistic, or null if an invalid statistic was passed.
     */
    addStatistic(stat) {
        if (!TimestepSettings.validateInput(stat)) {
            return null;
        }
        this.statistics.push(stat);
        return stat;
    }
    /**
     * Remove a statistic string from the statistics.
     * @param statistic The statistic string to remove
     * @returns A boolean indicating if the string was found and removed
     */
    removeStatistic(statistic) {
        var index = this.statistics.indexOf(statistic);
        if (index != -1) {
            this.statistics.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Find all errors that may exist in the timestep settings.
     * @returns A list of all errors that were found.
     */
    checkValid() {
        const errs = new Array();
        let statErrs = new Array();
        for (let i = 0; i < this.statistics.length; i++) {
            if (!TimestepSettings.validateInput(this.statistics[i])) {
                let temp = new psaasGlobals_1.ValidationError(i, `Invalid timestep setting output found at ${i}.`, this.statistics);
                statErrs.push(temp);
            }
        }
        if (statErrs.length > 0) {
            let temp = new psaasGlobals_1.ValidationError("statistics", "Invalid timestep settings found.", this);
            statErrs.forEach(err => {
                temp.addChild(err);
            });
            errs.push(temp);
        }
        if (this.discretize != null && (this.discretize < 1 || this.discretize > 1000)) {
            errs.push(new psaasGlobals_1.ValidationError("discritize", "The discritization must be an integer greater than 0 and less than 1001.", this));
        }
        return errs;
    }
    /**
     * Streams the settings to a socket.
     * @param builder
     */
    stream(builder) {
        if (this.discretize != null) {
            builder.write(TimestepSettings.PARAM_EMIT_STATISTIC + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(`d|${this.discretize}${psaasGlobals_1.SocketMsg.NEWLINE}`);
        }
        this.statistics.forEach(element => {
            builder.write(TimestepSettings.PARAM_EMIT_STATISTIC + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(element + psaasGlobals_1.SocketMsg.NEWLINE);
        });
    }
}
exports.TimestepSettings = TimestepSettings;
TimestepSettings.PARAM_EMIT_STATISTIC = "mng_statistic";
/**
 * Options for creating sub-scenarios when adding weather streams to
 * a scenario.
 */
class StreamOptions {
    constructor() {
        /**
         * The name of the sub-scenario that will be built using these options.
         */
        this.name = "";
        /**
         * An override for the scenario start time.
         */
        this._startTime = null;
        /**
         * An override for the scenario end time.
         */
        this._endTime = null;
        /**
         * An override for the ignition start time for any ignitions attached
         * to this sub-scnario. Must be formatted as ISO-8601.
         */
        this._ignitionTime = null;
    }
    /**
     * Get the override for the weather stream start time as a Luxon DateTime.
     */
    get lStartTime() {
        return this._startTime;
    }
    /**
     * Get the override for the weather stream start time as an ISO8601 string.
     * @deprecated
     */
    get startTime() {
        return this._startTime == null ? "" : this._startTime.toISODate();
    }
    /**
     * Set the override for the weather stream start date using a Luxon DateTime. Cannot be null. Only the date component will be used.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lStartTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value == null) {
            throw new RangeError("The override for the weather stream start date is not valid");
        }
        this._startTime = value;
    }
    /**
     * Set the override for the weather stream start date using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set startTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The override for the weather stream start date is not valid");
        }
        this._startTime = luxon_1.DateTime.fromISO(value);
    }
    /**
     * Get the override for the weather stream end time as a Luxon DateTime.
     */
    get lEndTime() {
        return this._endTime;
    }
    /**
     * Get the override for the weather stream end time as an ISO8601 string.
     * @deprecated
     */
    get endTime() {
        return this._endTime == null ? "" : this._endTime.toISODate();
    }
    /**
     * Set the override for the weather stream end date using a Luxon DateTime. Cannot be null. Only the date component will be used.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lEndTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value == null) {
            throw new RangeError("The override for the weather stream end date is not valid");
        }
        this._endTime = value;
    }
    /**
     * Set the override for the weather stream end date using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set endTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The override for the weather stream end date is not valid");
        }
        this._endTime = luxon_1.DateTime.fromISO(value);
    }
    /**
     * Get the override for the ignition start time as a Luxon DateTime.
     */
    get lIgnitionTime() {
        return this._ignitionTime;
    }
    /**
     * Get the override for the ignition start time as an ISO8601 string.
     * @deprecated
     */
    get ignitionTime() {
        return this._ignitionTime == null ? "" : this._ignitionTime.toISO();
    }
    /**
     * Set the override for the ignition start date using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lIgnitionTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value == null) {
            throw new RangeError("The override for the ignition start time is not valid");
        }
        this._ignitionTime = value;
    }
    /**
     * Set the override for the ignition start time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set ignitionTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The override for the ignition start time is not valid");
        }
        this._ignitionTime = luxon_1.DateTime.fromISO(value);
    }
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find all errors that may exist in the stream sub-scenario options.
     * @returns A list of all errors that were found.
     */
    checkValid() {
        const errs = new Array();
        if (this.name == null) {
            errs.push(new psaasGlobals_1.ValidationError("name", "The sub-scenario name cannot be null.", this));
        }
        return errs;
    }
}
exports.StreamOptions = StreamOptions;
/**
 * A reference to a weather stream/station used by a scenario.
 */
class StationStream {
    constructor() {
        /**
         * Optional settings that determine how sub-scenarios will
         * be created if multiple weather streams are referenced.
         */
        this.streamOptions = null;
    }
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find all errors that may exist in the weather stream reference.
     * @returns A list of errors that were found.
     */
    checkValid() {
        const errs = new Array();
        if (this.station == null || this.station.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("station", "No weather station has been set on the weather stream reference.", this));
        }
        if (this.stream == null || this.stream.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("stream", "No weather stream has been set on the weather stream reference.", this));
        }
        if (this.streamOptions != null) {
            let streamErrs = this.streamOptions.checkValid();
            if (streamErrs.length > 0) {
                let temp = new psaasGlobals_1.ValidationError("streamOptions", "Errors found in stream sub-scenario options.", this);
                streamErrs.forEach(err => {
                    temp.addChild(err);
                });
                errs.push(temp);
            }
        }
        return errs;
    }
}
exports.StationStream = StationStream;
/**
 * A simulation scenario.
 * @author "Travis Redpath"
 */
class Scenario {
    constructor() {
        this.isCopy = false;
        /**
         * The scenario start time (required). Must be formatted as 'YYYY-MM-DDThh:mm:ss'.
         */
        this._startTime = null;
        /**
         * The scenario end time (required).
         */
        this._endTime = null;
        /**
         * User comments about the scenario (optional).
         */
        this.comments = "";
        /**
         *
         */
        this.stationStreams = new Array();
        /**
         * A set of burning conditions.
         */
        this.burningConditions = new Array();
        /**
         * A list of vectors used by this scenario.
         */
        this.vectorInfo = new Array();
        /**
         * A list of ignitions used by this scenario.
         */
        this.ignitionInfo = new Array();
        /**
         * A list of grids used by the scenario. The list contains an index value that defines the order of the layers.
         */
        this.layerInfo = new Array();
        /**
         * A list of assets used by this scenario. Assets will be used to end simulations early when a firefront
         * reaches the shape.
         */
        this.assetFiles = new Array();
        /**
         * A target used by this scenario to modify the wind direction.
         */
        this.windTargetFile = null;
        /**
         * A target used by this scenario to modify the vector behaviour.
         */
        this.vectorTargetFile = null;
        /**
         * The name of the scenario that will be copied.
         */
        this.scenToCopy = "";
        this._id = "scen" + Scenario.counter;
        Scenario.counter += 1;
        this.displayInterval = psaasGlobals_1.Duration.createTime(1, 0, 0, false);
        this.fgmOptions = new psaasGlobals_1.FGMOptions();
        this.fbpOptions = new psaasGlobals_1.FBPOptions();
        this.fmcOptions = new psaasGlobals_1.FMCOptions();
        this.fwiOptions = new psaasGlobals_1.FWIOptions();
    }
    /**
     * Get the name of the scenario.
     */
    get id() {
        return this._id;
    }
    /**
     * Set the name of the scenario. Must be unique amongst the scenario collection. Cannot be null or empty.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set id(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The name of the scenario is not valid");
        }
        this.setName(value);
    }
    /**
     * Get the scenario start time as a Luxon DateTime.
     */
    get lStartTime() {
        return this._startTime;
    }
    /**
     * Get the scenario start time as an ISO8601 string.
     * @deprecated
     */
    get startTime() {
        return this._startTime == null ? "" : this._startTime.toISO();
    }
    /**
     * Set the scenario start time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lStartTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value == null) {
            throw new RangeError("The scenario start time is not valid");
        }
        this._startTime = value;
    }
    /**
     * Set the scenario start time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set startTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The scenario start time is not valid");
        }
        this._startTime = luxon_1.DateTime.fromISO(value);
    }
    /**
     * Get the scenario end time as a Luxon DateTime.
     */
    get lEndTime() {
        return this._endTime;
    }
    /**
     * Get the scenario end time as an ISO8601 string.
     * @deprecated
     */
    get endTime() {
        return this._endTime == null ? "" : this._endTime.toISO();
    }
    /**
     * Set the scenario end time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lEndTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value == null) {
            throw new RangeError("The scenario end time is not valid");
        }
        this._endTime = value;
    }
    /**
     * Set the scenario end time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set endTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The scenario end time is not valid");
        }
        this._endTime = luxon_1.DateTime.fromISO(value);
    }
    getId() {
        return this._id;
    }
    /**
     * Set the name of the scenario. This name must be unique within
     * the simulation. The name will get a default value when the
     * scenario is constructed but can be overriden with this method.
     */
    setName(name) {
        this._id = name.replace(/\|/g, "");
    }
    makeCopy(toCopy) {
        this.isCopy = true;
        this.scenToCopy = toCopy.getId();
    }
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
    addBurningCondition(date, startTime, endTime, fwiGreater, wsGreater, rhLess, isiGreater) {
        let bc = new BurningConditions();
        if (typeof date === "string") {
            bc.date = date;
        }
        else {
            bc.lDate = date;
        }
        bc.startTime = psaasGlobals_1.Duration.createTime(startTime, 0, 0, false);
        if (endTime > 23) {
            bc.endTime = psaasGlobals_1.Duration.createDateTime(0, 0, 1, endTime - 24, 0, 0, false);
        }
        else {
            bc.endTime = psaasGlobals_1.Duration.createTime(endTime, 0, 0, false);
        }
        bc.fwiGreater = fwiGreater;
        bc.rhLess = rhLess;
        bc.wsGreater = wsGreater;
        bc.isiGreater = isiGreater;
        this.burningConditions.push(bc);
        return bc;
    }
    /**
     * Remove a BurningConditions object from the burning conditions.
     * @param burningCondition The BurningConditions object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeBurningCondition(burningCondition) {
        var index = this.burningConditions.indexOf(burningCondition);
        if (index != -1) {
            this.burningConditions.splice(index, 1);
            return true;
        }
        return false;
    }
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
    setFgmOptions(maxAccTS, distRes, perimRes, minimumSpreadingRos, stopAtGridEnd, breaching, dynamicSpatialThreshold, spotting, purgeNonDisplayable, growthPercentileApplied, growthPercentile) {
        this.fgmOptions.maxAccTS = maxAccTS;
        this.fgmOptions.distRes = distRes;
        this.fgmOptions.perimRes = perimRes;
        this.fgmOptions.minimumSpreadingROS = minimumSpreadingRos;
        this.fgmOptions.stopAtGridEnd = stopAtGridEnd;
        this.fgmOptions.breaching = breaching;
        this.fgmOptions.dynamicSpatialThreshold = dynamicSpatialThreshold;
        this.fgmOptions.spotting = spotting;
        this.fgmOptions.purgeNonDisplayable = purgeNonDisplayable;
        this.fgmOptions.growthPercentileApplied = growthPercentileApplied;
        this.fgmOptions.growthPercentile = growthPercentile;
    }
    /**
     * Clears the FGM options.
     */
    clearFgmOptions() {
        this.fgmOptions.maxAccTS = null;
        this.fgmOptions.distRes = null;
        this.fgmOptions.perimRes = null;
        this.fgmOptions.minimumSpreadingROS = null;
        this.fgmOptions.stopAtGridEnd = null;
        this.fgmOptions.breaching = null;
        this.fgmOptions.dynamicSpatialThreshold = null;
        this.fgmOptions.spotting = null;
        this.fgmOptions.purgeNonDisplayable = null;
        this.fgmOptions.growthPercentileApplied = null;
        this.fgmOptions.growthPercentile = null;
    }
    /**
     * How much to nudge ignitions to perform probabilistic analyses on ignition location and start time.
     * Primarily used when ignition information is not 100% reliable.
     * @param dx How much to nudge ignitions to perform probabilistic analyses on ignition location.
     * @param dy How much to nudge ignitions to perform probabilistic analyses on ignition location.
     * @param dt How much to nudge ignitions to perform probabilistic analyses on ignition location and start time.
     */
    setProbabilisticValues(dx, dy, dt) {
        this.fgmOptions.dx = dx;
        this.fgmOptions.dy = dy;
        this.fgmOptions.dt = dt;
    }
    /**
     * Clears the nudge to ignitions to perform probabilistic analyses on ignition location and start time.
     */
    clearProbabilisticValues() {
        this.fgmOptions.dx = null;
        this.fgmOptions.dy = null;
        this.fgmOptions.dt = null;
    }
    /**
     * Set the FBP options.
     * @param terrainEffect Use terrain effect.
     * @param windEffect Use wind effect.
     */
    setFbpOptions(terrainEffect, windEffect) {
        this.fbpOptions.terrainEffect = terrainEffect;
        this.fbpOptions.windEffect = windEffect;
    }
    /**
     * Clear the FBP options.
     */
    clearFbpOptions() {
        this.fbpOptions.terrainEffect = null;
        this.fbpOptions.windEffect = null;
    }
    /**
     * Set the FMC options.
     * @param perOverrideVal The value for the FMC (%) override. Use -1 for no override.
     * @param nodataElev The elevation where NODATA or no grid exists.
     * @param terrain
     * @param accurateLocation No longer used, left for compatibility.
     */
    setFmcOptions(perOverrideVal, nodataElev, terrain, accurateLocation) {
        this.fmcOptions.perOverride = perOverrideVal;
        this.fmcOptions.nodataElev = nodataElev;
        this.fmcOptions.terrain = terrain;
    }
    /**
     * Clears the FMC options.
     */
    clearFmcOptions() {
        this.fmcOptions.perOverride = -1;
        this.fmcOptions.nodataElev = -9999;
        this.fmcOptions.terrain = null;
    }
    /**
     * Set the FWI options.
     * @param fwiSpacInterp Apply spatial interpolation to FWI values.
     * @param fwiFromSpacWeather Calculate FWI values from temporally interpolated weather.
     * @param historyOnEffectedFWI Apply history to FWI values affected by patches, grids, etc..
     * @param burningConditionsOn Use burning conditions.
     * @param fwiTemporalInterp Apply spatial interpolation to FWI values.
     */
    setFwiOptions(fwiSpacInterp, fwiFromSpacWeather, historyOnEffectedFWI, burningConditionsOn, fwiTemporalInterp) {
        this.fwiOptions.fwiSpacInterp = fwiSpacInterp;
        this.fwiOptions.fwiFromSpacWeather = fwiFromSpacWeather;
        this.fwiOptions.historyOnEffectedFWI = historyOnEffectedFWI;
        this.fwiOptions.burningConditionsOn = burningConditionsOn;
        this.fwiOptions.fwiTemporalInterp = fwiTemporalInterp;
    }
    /**
     * Clear the FWI options.
     */
    clearFwiOptions() {
        this.fwiOptions.fwiSpacInterp = null;
        this.fwiOptions.fwiFromSpacWeather = null;
        this.fwiOptions.historyOnEffectedFWI = null;
        this.fwiOptions.burningConditionsOn = null;
        this.fwiOptions.fwiTemporalInterp = null;
    }
    /**
     * Add an ignition to the scenario.
     * @param ignition The ignition to add to the scenario.
     */
    addIgnitionReference(ignition) {
        var ref = new IgnitionReference();
        ref.ignition = ignition.getId();
        this.ignitionInfo.push(ref);
        return ref;
    }
    /**
     * Remove a Ignition object from the ignition info.
     * @param ignition The Ignition object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeIgnitionReference(ignition) {
        let item = this.ignitionInfo.find(i => i.ignition == ignition.getId());
        if (item != null) {
            this.ignitionInfo.splice(this.ignitionInfo.indexOf(item), 1);
            return true;
        }
        return false;
    }
    /**
     * Add a weather stream to the scenario.
     * @param stream The weather stream to add to the scenario.
     */
    addWeatherStreamReference(stream) {
        var add = new StationStream();
        add.stream = stream.getId();
        add.station = stream.getParentId();
        this.stationStreams.push(add);
        return add;
    }
    /**
     * Remove a WeatherStream object from the stream and station info.
     * @param stream The WeatherStream object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeWeatherStreamReference(stream) {
        var index1 = this.stationStreams.findIndex(element => element.stream == stream.getId());
        if (index1 != -1) {
            this.stationStreams.splice(index1, 1);
            return true;
        }
        return false;
    }
    /**
     * Add the primary weather stream to the scenario.
     * @param stream The weather stream to set as the scenario's primary stream.
     */
    addPrimaryWeatherStreamReference(stream) {
        var add = new StationStream();
        add.stream = stream.getId();
        add.station = stream.getParentId();
        add.primaryStream = true;
        this.stationStreams.push(add);
        return add;
    }
    /**
     * Remove the primary WeatherStream object from the stream and station info.
     * @param stream The WeatherStream object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removePrimaryWeatherStreamReference(stream) {
        var index1 = this.stationStreams.findIndex(element => element.primaryStream);
        if (index1 != -1) {
            this.stationStreams.splice(index1, 1);
            return true;
        }
        return false;
    }
    /**
     * Add a fuel breack to the scenario.
     * @param brck The fuel break to add to the scenario.
     */
    addFuelBreakReference(brck) {
        this.vectorInfo.push(brck.getId());
        return brck;
    }
    /**
     * Remove a FuelBreak object from the vector info.
     * @param brck The FuelBreak object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeFuelBreakReference(brck) {
        var index = this.vectorInfo.indexOf(brck.getId());
        if (index != -1) {
            this.vectorInfo.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Add a weather grid to the scenario.
     * @param wthr The weather grid to add to the scenario.
     * @param index The layers index in the scenario.
     * @return LayerInfo The reference that was just added.
     */
    addWeatherGridReference(wthr, index) {
        let tmp = new LayerInfo(wthr.getId());
        tmp.index = Math.round(index);
        this.layerInfo.push(tmp);
        return tmp;
    }
    /**
     * Add a grid file to the scenario.
     * @param grid The grid file to add to the scenario.
     * @param index The layers index in the scenario.
     * @return LayerInfo The reference that was just added.
     */
    addGridFileReference(grid, index) {
        let tmp = new LayerInfo(grid.getId());
        tmp.index = Math.round(index);
        this.layerInfo.push(tmp);
        return tmp;
    }
    /**
     * Add a fuel patch to the scenario.
     * @param patch The fuel patch to add to the scenario.
     * @param index The layers index in the scenario.
     * @return LayerInfo The reference that was just added.
     */
    addFuelPatchReference(patch, index) {
        let tmp = new LayerInfo(patch.getId());
        tmp.index = Math.round(index);
        this.layerInfo.push(tmp);
        return tmp;
    }
    /**
     * Add a weather patch to the scenario.
     * @param patch The weather patch to add to the scenario.
     * @param index The layers index in the scenario.
     * @return LayerInfo The reference that was just added.
     */
    addWeatherPatchReference(patch, index) {
        let tmp = new LayerInfo(patch.getId());
        tmp.index = Math.round(index);
        this.layerInfo.push(tmp);
        return tmp;
    }
    /**
     * Remove a layer from the layer info.
     * @param ref The layer to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeLayerInfo(ref) {
        var index = this.layerInfo.indexOf(ref);
        if (index != -1) {
            this.layerInfo.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Add an asset file to the scenario. Must already be added to the {@link PSaaS} object.
     * @param file The asset file to add to the scenario.
     */
    addAssetFile(file) {
        var ref = new AssetReference(file.getId());
        this.assetFiles.push(ref);
        return ref;
    }
    /**
     * Remove an asset file from the scenario.
     * @param file The asset file to remove from the scenario.
     */
    removeAssetFile(ref) {
        var index = this.assetFiles.indexOf(ref);
        if (index != -1) {
            this.assetFiles.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Add a target file to the scenario for wind direction. Must already be added to the {@link PSaaS} object.
     * @param file The target file to add to the scenario.
     */
    setWindTargetFile(file) {
        this.windTargetFile = new TargetReference(file.getId());
        return this.windTargetFile;
    }
    /**
     * Remove the wind target file from the scenario.
     */
    clearWindTargetFile() {
        if (this.windTargetFile == null) {
            return false;
        }
        this.windTargetFile = null;
        return true;
    }
    /**
     * Add a target file to the scenario for vector direction. Must already be added to the {@link PSaaS} object.
     * @param file The target file to add to the scenario.
     */
    setVectorTargetFile(file) {
        this.vectorTargetFile = new TargetReference(file.getId());
        return this.vectorTargetFile;
    }
    /**
     * Remove the vector target file from the scenario.
     */
    clearVectorTargetFile() {
        if (this.vectorTargetFile == null) {
            return false;
        }
        this.vectorTargetFile = null;
        return true;
    }
    /**
     * Checks to see if all required values have been set.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find all errors that may exist in the scenario.
     * @returns A list of errors that were found.
     */
    checkValid() {
        const errs = new Array();
        if (!this._id || this._id.length === 0) {
            errs.push(new psaasGlobals_1.ValidationError("id", "No ID has been set for the scenario.", this));
        }
        if (this.isCopy) {
            if (this.scenToCopy.length == 0) {
                errs.push(new psaasGlobals_1.ValidationError("scenToCopy", "The scenario has been specified as a copy of another but the other scenarios ID was not set.", this));
            }
        }
        else {
            if (this._startTime == null) {
                errs.push(new psaasGlobals_1.ValidationError("startTime", "The start time for the scenario has not been set.", this));
            }
            if (this._endTime == null) {
                errs.push(new psaasGlobals_1.ValidationError("endTime", "The end time for the scenario has not been set.", this));
            }
            if (this.displayInterval == null || this.displayInterval.toSeconds() == 0) {
                errs.push(new psaasGlobals_1.ValidationError("displayInterval", "The scenario display interval is not set.", this));
            }
            let tempErr = this.fgmOptions.checkValid();
            if (tempErr.length > 0) {
                let temp = new psaasGlobals_1.ValidationError("fgmOptions", "Invalid FGM options.", this);
                tempErr.forEach(err => {
                    temp.addChild(err);
                });
                errs.push(temp);
            }
            tempErr = this.fbpOptions.checkValid();
            if (tempErr.length > 0) {
                let temp = new psaasGlobals_1.ValidationError("fbpOptions", "Invalid FBP options.", this);
                tempErr.forEach(err => {
                    temp.addChild(err);
                });
                errs.push(temp);
            }
            tempErr = this.fmcOptions.checkValid();
            if (tempErr.length > 0) {
                let temp = new psaasGlobals_1.ValidationError("fmcOptions", "Invalid FMC options.", this);
                tempErr.forEach(err => {
                    temp.addChild(err);
                });
                errs.push(temp);
            }
            tempErr = this.fwiOptions.checkValid();
            if (tempErr.length > 0) {
                let temp = new psaasGlobals_1.ValidationError("fwiOptions", "Invalid FWI options.", this);
                tempErr.forEach(err => {
                    temp.addChild(err);
                });
                errs.push(temp);
            }
            let burns = new psaasGlobals_1.ValidationError("burningConditions", "Errors in burning condition.", this);
            for (let i = 0; i < this.burningConditions.length; i++) {
                const burnErr = new psaasGlobals_1.ValidationError(i, `Errors found in burn condition at ${i}.`, this.burningConditions);
                this.burningConditions[i].checkValid().forEach(err => {
                    burnErr.addChild(err);
                });
                if (burnErr.children.length > 0) {
                    burns.addChild(burnErr);
                }
            }
            if (burns.children.length > 0) {
                errs.push(burns);
            }
            let stationErrs = new Array();
            for (let i = 0; i < this.stationStreams.length; i++) {
                const station = new psaasGlobals_1.ValidationError(i, `Errors found in weather stream reference at ${i}.`, this.stationStreams);
                this.stationStreams[i].checkValid().forEach(err => {
                    station.addChild(err);
                });
                if (station.children.length > 0) {
                    stationErrs.push(station);
                }
            }
            if (stationErrs.length > 0) {
                let temp = new psaasGlobals_1.ValidationError("stationStreams", "Errors found in weather stream references.", this);
                stationErrs.forEach(err => {
                    temp.addChild(err);
                });
                errs.push(temp);
            }
            let vectorErrs = new Array();
            for (let i = 0; i < this.vectorInfo.length; i++) {
                if (this.vectorInfo[i].length == 0) {
                    const vector = new psaasGlobals_1.ValidationError(i, `Errors found in vector reference at ${i}.`, this.vectorInfo);
                    vector.addChild(new psaasGlobals_1.ValidationError(i, "No vector ID has been specified.", this));
                    vectorErrs.push(vector);
                }
            }
            if (vectorErrs.length > 0) {
                let temp = new psaasGlobals_1.ValidationError("vectorInfo", "Errors found in vector references.", this);
                vectorErrs.forEach(err => {
                    temp.addChild(err);
                });
                errs.push(temp);
            }
            let ignitionErrs = new Array();
            for (let i = 0; i < this.ignitionInfo.length; i++) {
                const ignition = new psaasGlobals_1.ValidationError(i, `Errors found in ignition reference at ${i}.`, this.ignitionInfo);
                this.ignitionInfo[i].checkValid().forEach(err => {
                    ignition.addChild(err);
                });
                if (ignition.children.length > 0) {
                    ignitionErrs.push(ignition);
                }
            }
            if (ignitionErrs.length > 0) {
                let temp = new psaasGlobals_1.ValidationError("ignitionInfo", "Errors found in ignition references.", this);
                ignitionErrs.forEach(err => {
                    temp.addChild(err);
                });
                errs.push(temp);
            }
            let layerErrs = new Array();
            for (let i = 0; i < this.layerInfo.length; i++) {
                const layer = new psaasGlobals_1.ValidationError(i, `Errors found in layer reference at ${i}.`, this.layerInfo);
                this.layerInfo[i].checkValid().forEach(err => {
                    layer.addChild(err);
                });
                if (layer.children.length > 0) {
                    layerErrs.push(layer);
                }
            }
            if (layerErrs.length > 0) {
                let temp = new psaasGlobals_1.ValidationError("layerInfo", "Errors found in layer references.", this);
                layerErrs.forEach(err => {
                    temp.addChild(err);
                });
                errs.push(temp);
            }
            let assetErrs = new Array();
            for (let i = 0; i < this.assetFiles.length; i++) {
                const asset = new psaasGlobals_1.ValidationError(i, `Errors found in asset reference at ${i}.`, this.assetFiles);
                this.assetFiles[i].checkValid().forEach(err => {
                    asset.addChild(err);
                });
                if (asset.children.length > 0) {
                    assetErrs.push(asset);
                }
            }
            if (assetErrs.length > 0) {
                let temp = new psaasGlobals_1.ValidationError("assetFiles", "Errors found in asset references.", this);
                assetErrs.forEach(err => {
                    temp.addChild(err);
                });
                errs.push(temp);
            }
            if (this.windTargetFile != null) {
                let temp = new psaasGlobals_1.ValidationError("windTargetFile", "Errors found in target reference.", this);
                this.windTargetFile.checkValid().forEach(err => {
                    temp.addChild(err);
                });
                if (temp.children.length > 0) {
                    errs.push(temp);
                }
            }
            if (this.vectorTargetFile != null) {
                let temp = new psaasGlobals_1.ValidationError("vectorTargetFile", "Errors found in target references.", this);
                this.vectorTargetFile.checkValid().forEach(err => {
                    temp.addChild(err);
                });
                if (temp.children.length > 0) {
                    errs.push(temp);
                }
            }
        }
        return errs;
    }
    /**
     * Streams the scenario to a socket.
     * @param builder
     */
    stream(builder) {
        builder.write(Scenario.PARAM_SCENARIO_BEGIN + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(Scenario.PARAM_SCENARIONAME + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(this._id + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(Scenario.PARAM_DISPLAY_INTERVAL + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(this.displayInterval + psaasGlobals_1.SocketMsg.NEWLINE);
        if (this.isCopy) {
            builder.write(Scenario.PARAM_SCENARIO_TO_COPY + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(this.scenToCopy + psaasGlobals_1.SocketMsg.NEWLINE);
        }
        if (!this.isCopy || this._startTime != null) {
            builder.write(Scenario.PARAM_STARTTIME + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(this._startTime.toISO() + psaasGlobals_1.SocketMsg.NEWLINE);
        }
        if (!this.isCopy || this._endTime != null) {
            builder.write(Scenario.PARAM_ENDTIME + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(this._endTime.toISO() + psaasGlobals_1.SocketMsg.NEWLINE);
        }
        if (this.comments.length > 0) {
            builder.write(Scenario.PARAM_COMMENTS + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(this.comments + psaasGlobals_1.SocketMsg.NEWLINE);
        }
        if (this.isCopy) {
            this.fgmOptions.streamCopy(builder);
            this.fbpOptions.streamCopy(builder);
            this.fmcOptions.streamCopy(builder);
        }
        else {
            this.fgmOptions.stream(builder);
            this.fbpOptions.stream(builder);
            this.fmcOptions.stream(builder);
        }
        this.fwiOptions.stream(builder);
        for (let bc of this.burningConditions) {
            let tmp = bc.date + '|' + bc.startTime + '|' + bc.endTime + '|' + bc.fwiGreater + '|' + bc.wsGreater + '|' + bc.rhLess + '|' + bc.isiGreater;
            builder.write(Scenario.PARAM_BURNINGCONDITION + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
        }
        for (let vi of this.vectorInfo) {
            builder.write(Scenario.PARAM_VECTOR_REF + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(vi + psaasGlobals_1.SocketMsg.NEWLINE);
        }
        for (let i = 0; i < this.stationStreams.length; i++) {
            let tmp = this.stationStreams[i].stream + '|' + this.stationStreams[i].station;
            if (this.stationStreams[i].streamOptions != null) {
                tmp = tmp + '|' + this.stationStreams[i].streamOptions.name + '|' + this.stationStreams[i].streamOptions.startTime;
                tmp = tmp + '|' + this.stationStreams[i].streamOptions.endTime + '|' + this.stationStreams[i].streamOptions.ignitionTime;
            }
            builder.write(Scenario.PARAM_STREAM_REF + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
        }
        for (let i = 0; i < this.layerInfo.length; i++) {
            let tmp = this.layerInfo[i].getName() + '|' + this.layerInfo[i].index;
            if (this.layerInfo[i].options != null) {
                tmp = tmp + '|' + this.layerInfo[i].options.subNames.length;
                for (let o of this.layerInfo[i].options.subNames) {
                    tmp = tmp + '|' + o;
                }
            }
            builder.write(Scenario.PARAM_LAYER_INFO + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
        }
        var index1 = this.stationStreams.findIndex(element => element.primaryStream);
        if (index1 != -1) {
            builder.write(Scenario.PARAM_PRIMARY_STREAM + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(this.stationStreams[index1].stream + psaasGlobals_1.SocketMsg.NEWLINE);
        }
        for (let ii of this.ignitionInfo) {
            let tmp = ii.ignition;
            if (ii.polylineIgnitionOptions != null) {
                tmp = tmp + '|line|' + ii.polylineIgnitionOptions.name + '|' + ii.polylineIgnitionOptions.pointSpacing;
                tmp = tmp + '|' + ii.polylineIgnitionOptions.polyIndex + '|' + ii.polylineIgnitionOptions.pointIndex;
            }
            else if (ii.multiPointIgnitionOptions != null) {
                tmp = tmp + '|mp|' + ii.multiPointIgnitionOptions.name + '|' + ii.multiPointIgnitionOptions.pointIndex;
            }
            else if (ii.singlePointIgnitionOptions != null) {
                tmp = tmp + '|sp|' + ii.singlePointIgnitionOptions.name;
            }
            builder.write(Scenario.PARAM_IGNITION_REF + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
        }
        for (let ii of this.assetFiles) {
            let tmp = ii.getName() + '|' + ii.operation + '|' + ii.collisionCount;
            builder.write(Scenario.PARAM_ASSET_REF + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
        }
        if (this.windTargetFile != null) {
            let tmp = this.windTargetFile.getName() + '|' + this.windTargetFile.geometryIndex + '|' + this.windTargetFile.pointIndex;
            builder.write(Scenario.PARAM_WIND_TARGET_REF + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
        }
        if (this.vectorTargetFile != null) {
            let tmp = this.vectorTargetFile.getName() + '|' + this.vectorTargetFile.geometryIndex + '|' + this.vectorTargetFile.pointIndex;
            builder.write(Scenario.PARAM_VECTOR_TARGET_REF + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
        }
        builder.write(Scenario.PARAM_SCENARIO_END + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
exports.Scenario = Scenario;
Scenario.PARAM_SCENARIO_BEGIN = "scenariostart";
Scenario.PARAM_SCENARIO_END = "scenarioend";
Scenario.PARAM_SCENARIONAME = "scenarioname";
Scenario.PARAM_DISPLAY_INTERVAL = "displayinterval";
Scenario.PARAM_COMMENTS = "comments";
Scenario.PARAM_STARTTIME = "starttime";
Scenario.PARAM_ENDTIME = "endtime";
Scenario.PARAM_BURNINGCONDITION = "burningcondition";
Scenario.PARAM_VECTOR_REF = "vectorref";
Scenario.PARAM_STREAM_REF = "streamref";
Scenario.PARAM_IGNITION_REF = "ignitionref";
Scenario.PARAM_LAYER_INFO = "layerinfo";
Scenario.PARAM_PRIMARY_STREAM = "primarystream";
Scenario.PARAM_SCENARIO_TO_COPY = "scenariotocopy";
Scenario.PARAM_ASSET_REF = "asset_ref";
Scenario.PARAM_WIND_TARGET_REF = "wind_target_ref";
Scenario.PARAM_VECTOR_TARGET_REF = "vector_target_ref";
Scenario.counter = 0;
/**
 * Types of options that can be applied to the fuels in
 * the lookup table.
 */
var FuelOptionType;
(function (FuelOptionType) {
    FuelOptionType[FuelOptionType["GRASS_FUEL_LOAD"] = 0] = "GRASS_FUEL_LOAD";
    FuelOptionType[FuelOptionType["GRASS_CURING"] = 1] = "GRASS_CURING";
    FuelOptionType[FuelOptionType["PERCENT_CONIFER"] = 2] = "PERCENT_CONIFER";
    FuelOptionType[FuelOptionType["PERCENT_DEAD_FIR"] = 3] = "PERCENT_DEAD_FIR";
    FuelOptionType[FuelOptionType["CROWN_BASE_HEIGHT"] = 4] = "CROWN_BASE_HEIGHT";
    FuelOptionType[FuelOptionType["CROWN_FUEL_LOAD"] = 5] = "CROWN_FUEL_LOAD";
})(FuelOptionType = exports.FuelOptionType || (exports.FuelOptionType = {}));
/**
 * Stores options for various fuel types including default grass fuel load,
 * grass curing, percent conifer, and percent dead fir.
 * @author Travis Redpath
 */
class FuelOption {
    /**
     * Find all errors that may exist in the fuel option.
     * @returns A list of all errors that were found.
     */
    checkValid() {
        const errs = new Array();
        if (this.fuelType == null || this.fuelType.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("fuelType", "No fuel type has been specified.", this));
        }
        if (this.optionType == FuelOptionType.CROWN_BASE_HEIGHT) {
            if (this.value < 0.0 || this.value > 25.0) {
                errs.push(new psaasGlobals_1.ValidationError("value", "An invalid crown base height has been specified.", this));
            }
        }
        else if (this.optionType == FuelOptionType.GRASS_CURING) {
            if (this.value < 0.0 || this.value > 1.0) {
                errs.push(new psaasGlobals_1.ValidationError("value", "An invalid grass curing degree has been specified.", this));
            }
        }
        else if (this.optionType == FuelOptionType.GRASS_FUEL_LOAD) {
            if (this.value < 0.0 || this.value > 5.0) {
                errs.push(new psaasGlobals_1.ValidationError("value", "An invalid grass fuel load has been specified.", this));
            }
        }
        else if (this.optionType == FuelOptionType.PERCENT_CONIFER) {
            if (this.value < 0.0 || this.value > 100.0) {
                errs.push(new psaasGlobals_1.ValidationError("value", "An invalid percent conifer has been specified.", this));
            }
        }
        else if (this.optionType == FuelOptionType.PERCENT_DEAD_FIR) {
            if (this.value < 0.0 || this.value > 100.0) {
                errs.push(new psaasGlobals_1.ValidationError("value", "An invalid percent dead fir has been specified.", this));
            }
        }
        else if (this.optionType == FuelOptionType.CROWN_FUEL_LOAD) {
            if (this.value < 0.0) {
                errs.push(new psaasGlobals_1.ValidationError("value", "An invalid crown fuel load has been specified.", this));
            }
        }
        return errs;
    }
    /**
     * Streams the fuel option to a socket.
     * @param builder
     */
    stream(builder) {
        let data = `${this.fuelType}|${this.optionType}|${this.value}${psaasGlobals_1.SocketMsg.NEWLINE}`;
        builder.write(FuelOption.PARAM_FUEL_OPTION + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(data);
    }
}
exports.FuelOption = FuelOption;
FuelOption.PARAM_FUEL_OPTION = "fuel_option_setting";
/**
 * A class that holds information about the files and settings that will be inputs to PSaaS.
 * @author "Travis Redpath"
 */
class PSaaSInputs {
    constructor() {
        /**
         * All weather stations. At least one is required.
         */
        this.weatherStations = new Array();
        /**
         * All ignition features.
         */
        this.ignitions = new Array();
        /**
         * The scenarios to run. At least one is required.
         */
        this.scenarios = new Array();
        /**
         * Options to apply to the fuel types in the LUT file.
         */
        this.fuelOptions = new Array();
        /**
         * Assets that can stop simulations when reached.
         */
        this.assetFiles = new Array();
        /**
         * Targets that can affect how weather information is processed.
         */
        this.targetFiles = new Array();
        this.files = new PSaaSInputsFiles();
        this.timezone = new psaasGlobals_1.Timezone();
    }
    /**
     * Validate the user specified inputs.
     * @returns A list of errors found during validation.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find any errors in the PSaaS input values.
     * @returns A list of errors that were found.
     */
    checkValid() {
        let _errors = new Array();
        let errs = this.timezone.checkValid();
        if (errs.length > 0) {
            let timeErr = new psaasGlobals_1.ValidationError("timezone", "Errors in the simulation timezone.", this);
            errs.forEach(err => {
                timeErr.addChild(err);
            });
            _errors.push(timeErr);
        }
        errs = this.files.checkValid();
        if (errs.length > 0) {
            let timeErr = new psaasGlobals_1.ValidationError("files", "Errors in PSaaS input files.", this);
            errs.forEach(err => {
                timeErr.addChild(err);
            });
            _errors.push(timeErr);
        }
        if (this.weatherStations.length < 1) {
            _errors.push(new psaasGlobals_1.ValidationError("weatherStations", "No weather stations have been added.", this));
        }
        if (this.scenarios.length < 1) {
            _errors.push(new psaasGlobals_1.ValidationError("scenarios", "No scenarios have been added.", this));
        }
        let weatherStationErrors = new Array();
        for (let i = 0; i < this.weatherStations.length; i++) {
            let wsErr = new psaasGlobals_1.ValidationError(i, `Errors found in weather station at index ${i}.`, this.weatherStations);
            for (let j = i + 1; j < this.weatherStations.length; j++) {
                if (this.weatherStations[i].id.toUpperCase() === this.weatherStations[j].id.toUpperCase()) {
                    let err = new psaasGlobals_1.ValidationError("id", "Duplicate weather station IDs.", this.weatherStations[i]);
                    wsErr.addChild(err);
                    break;
                }
            }
            this.weatherStations[i].checkValid().forEach(err => {
                wsErr.addChild(err);
            });
            if (wsErr.children.length > 0) {
                weatherStationErrors.push(wsErr);
            }
        }
        if (weatherStationErrors.length > 0) {
            let temp = new psaasGlobals_1.ValidationError("weatherStations", "Errors found in weather stations.", this);
            weatherStationErrors.forEach(err => {
                temp.addChild(err);
            });
            errs.push(temp);
        }
        let ignitionErrors = new Array();
        for (let i = 0; i < this.ignitions.length; i++) {
            let igErr = new psaasGlobals_1.ValidationError(i, `Errors found in ignition at index ${i}.`, this.ignitions);
            for (let j = i + 1; j < this.ignitions.length; j++) {
                if (this.ignitions[i].id.toUpperCase() === this.ignitions[j].id.toUpperCase()) {
                    let err = new psaasGlobals_1.ValidationError("id", "Duplicate ignition IDs.", this.ignitions[i]);
                    igErr.addChild(err);
                    break;
                }
            }
            this.ignitions[i].checkValid().forEach(err => {
                igErr.addChild(err);
            });
            if (igErr.children.length > 0) {
                ignitionErrors.push(igErr);
            }
        }
        if (ignitionErrors.length > 0) {
            let temp = new psaasGlobals_1.ValidationError("ignitions", "Errors found in ignitions.", this);
            ignitionErrors.forEach(err => {
                temp.addChild(err);
            });
            errs.push(temp);
        }
        let scenarioErrors = new Array();
        for (let i = 0; i < this.scenarios.length; i++) {
            let scErr = new psaasGlobals_1.ValidationError(i, `Errors found in scenario at index ${i}.`, this.scenarios);
            for (let j = i + 1; j < this.scenarios.length; j++) {
                if (this.scenarios[i].id.toUpperCase() === this.scenarios[j].id.toUpperCase()) {
                    let err = new psaasGlobals_1.ValidationError("id", "Duplicate scenario IDs.", this.scenarios[i]);
                    scErr.addChild(err);
                    break;
                }
            }
            this.scenarios[i].checkValid().forEach(err => {
                scErr.addChild(err);
            });
            if (scErr.children.length > 0) {
                scenarioErrors.push(scErr);
            }
        }
        if (scenarioErrors.length > 0) {
            let temp = new psaasGlobals_1.ValidationError("scenarios", "Errors found in scenarios.", this);
            scenarioErrors.forEach(err => {
                temp.addChild(err);
            });
            errs.push(temp);
        }
        let assetErrors = new Array();
        for (let i = 0; i < this.assetFiles.length; i++) {
            let asErr = new psaasGlobals_1.ValidationError(i, `Errors found in scenario at index ${i}.`, this.assetFiles);
            for (let j = i + 1; j < this.assetFiles.length; j++) {
                if (this.assetFiles[i].getId().toUpperCase() === this.assetFiles[j].getId().toUpperCase()) {
                    let err = new psaasGlobals_1.ValidationError("id", "Duplicate asset IDs.", this.assetFiles[i]);
                    asErr.addChild(err);
                    break;
                }
            }
            this.assetFiles[i].checkValid().forEach(err => {
                asErr.addChild(err);
            });
            if (asErr.children.length > 0) {
                scenarioErrors.push(asErr);
            }
        }
        if (assetErrors.length > 0) {
            let temp = new psaasGlobals_1.ValidationError("assetFiles", "Errors found in assets.", this);
            assetErrors.forEach(err => {
                temp.addChild(err);
            });
            errs.push(temp);
        }
        let targetErrors = new Array();
        for (let i = 0; i < this.targetFiles.length; i++) {
            let tgErr = new psaasGlobals_1.ValidationError(i, `Errors found in scenario at index ${i}.`, this.targetFiles);
            for (let j = i + 1; j < this.targetFiles.length; j++) {
                if (this.targetFiles[i].getId().toUpperCase() === this.targetFiles[j].getId().toUpperCase()) {
                    let err = new psaasGlobals_1.ValidationError("id", "Duplicate target IDs.", this.targetFiles[i]);
                    tgErr.addChild(err);
                    break;
                }
            }
            this.targetFiles[i].checkValid().forEach(err => {
                tgErr.addChild(err);
            });
            if (tgErr.children.length > 0) {
                scenarioErrors.push(tgErr);
            }
        }
        if (targetErrors.length > 0) {
            let temp = new psaasGlobals_1.ValidationError("targetFiles", "Errors found in targets.", this);
            targetErrors.forEach(err => {
                temp.addChild(err);
            });
            errs.push(temp);
        }
        let fuelOptionErrors = new Array();
        for (let i = 0; i < this.fuelOptions.length; i++) {
            let foErrs = this.fuelOptions[i].checkValid();
            if (foErrs.length > 0) {
                let temp = new psaasGlobals_1.ValidationError(i, `Errors found in fuel options at index ${i}.`, this.fuelOptions);
                foErrs.forEach(err => {
                    temp.addChild(err);
                });
                fuelOptionErrors.push(temp);
            }
        }
        if (fuelOptionErrors.length > 0) {
            let temp = new psaasGlobals_1.ValidationError("fuelOptions", "Errors found in fuel options.", this);
            fuelOptionErrors.forEach(err => {
                temp.addChild(err);
            });
            errs.push(temp);
        }
        return errs;
    }
    /**
     * Streams the input settings to a socket.
     * @param builder
     */
    stream(builder) {
        this.files.stream(builder);
        for (let ws of this.weatherStations) {
            ws.stream(builder);
        }
        for (let ig of this.ignitions) {
            ig.stream(builder);
        }
        for (let sc of this.scenarios) {
            sc.stream(builder);
        }
        for (let opt of this.fuelOptions) {
            opt.stream(builder);
        }
        for (let asset of this.assetFiles) {
            asset.stream(builder);
        }
        for (let target of this.targetFiles) {
            target.stream(builder);
        }
        return this.timezone.stream(builder);
    }
}
exports.PSaaSInputs = PSaaSInputs;
var Output_GridFileInterpolation;
(function (Output_GridFileInterpolation) {
    /**
     * Interpolate using the nearest vertex to the centre of the grid cell.
     */
    Output_GridFileInterpolation["CLOSEST_VERTEX"] = "ClosestVertex";
    /**
     * Interpolate using inverse distance weighting.
     */
    Output_GridFileInterpolation["IDW"] = "IDW";
    /**
     * Interpolate using voronoi area weighting.
     */
    Output_GridFileInterpolation["AREA_WEIGHTING"] = "AreaWeighting";
    Output_GridFileInterpolation["CALCULATE"] = "Calculate";
    Output_GridFileInterpolation["DISCRETIZED"] = "Discretized";
    Output_GridFileInterpolation["VORONOI_OVERLAP"] = "VoronoiOverlap";
})(Output_GridFileInterpolation = exports.Output_GridFileInterpolation || (exports.Output_GridFileInterpolation = {}));
/**
 * If the grid file is a TIF file its contents can be
 * compressed. This describes the algorithm used to
 * compress the data.
 */
var Output_GridFileCompression;
(function (Output_GridFileCompression) {
    Output_GridFileCompression[Output_GridFileCompression["NONE"] = 0] = "NONE";
    /**
     * Should only be used with byte data.
     */
    Output_GridFileCompression[Output_GridFileCompression["JPEG"] = 1] = "JPEG";
    Output_GridFileCompression[Output_GridFileCompression["LZW"] = 2] = "LZW";
    Output_GridFileCompression[Output_GridFileCompression["PACKBITS"] = 3] = "PACKBITS";
    Output_GridFileCompression[Output_GridFileCompression["DEFLATE"] = 4] = "DEFLATE";
    /**
     * Should only be used with bit data.
     */
    Output_GridFileCompression[Output_GridFileCompression["CCITTRLE"] = 5] = "CCITTRLE";
    /**
     * Should only be used with bit data.
     */
    Output_GridFileCompression[Output_GridFileCompression["CCITTFAX3"] = 6] = "CCITTFAX3";
    /**
     * Should only be used with bit data.
     */
    Output_GridFileCompression[Output_GridFileCompression["CCITTFAX4"] = 7] = "CCITTFAX4";
    Output_GridFileCompression[Output_GridFileCompression["LZMA"] = 8] = "LZMA";
    Output_GridFileCompression[Output_GridFileCompression["ZSTD"] = 9] = "ZSTD";
    Output_GridFileCompression[Output_GridFileCompression["LERC"] = 10] = "LERC";
    Output_GridFileCompression[Output_GridFileCompression["LERC_DEFLATE"] = 11] = "LERC_DEFLATE";
    Output_GridFileCompression[Output_GridFileCompression["LERC_ZSTD"] = 12] = "LERC_ZSTD";
    Output_GridFileCompression[Output_GridFileCompression["WEBP"] = 13] = "WEBP";
})(Output_GridFileCompression = exports.Output_GridFileCompression || (exports.Output_GridFileCompression = {}));
/**
 * Override the output time for a specific sub-scenario.
 */
class ExportTimeOverride {
    constructor() {
        /**
         * The name of the sub-scenario that the override time is for.
         */
        this.subScenarioName = null;
        /**
         * The export time to use instead of the one defined in the {@link Output_GridFile} class.
         */
        this._exportTime = null;
    }
    /**
     * Get the override for the export time as a Luxon DateTime.
     */
    get lExportTime() {
        return this._exportTime;
    }
    /**
     * Get the override for the export time as an ISO8601 string.
     * @deprecated
     */
    get exportTime() {
        return this.getExportOverrideTime();
    }
    /**
     * Set the override for the export time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lExportTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value == null) {
            throw new RangeError("The override for the export time is not valid");
        }
        this._exportTime = value;
    }
    /**
     * Set the override for the export time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set exportTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The override for the export time is not valid");
        }
        this._exportTime = luxon_1.DateTime.fromISO(value);
    }
    getExportOverrideTime() {
        return this._exportTime == null ? "" : this._exportTime.toISO();
    }
    checkValid() {
        const errs = new Array();
        if (this.subScenarioName == null || this.subScenarioName.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("subScenarioName", "The sub-scenario that the override is for has not been set.", this));
        }
        return errs;
    }
}
exports.ExportTimeOverride = ExportTimeOverride;
class Output_GridFile {
    constructor() {
        /**
         * The name of the output file (required).
         * The file will be located below the jobs output directory.
         * All global paths and relative paths that attempt to move
         * the file outside of this directory will be removed.
         */
        this.filename = "";
        /**
         * The end of the output time range (required). Will also be
         * used as the start of the output time range if the start
         * output time has not been specified.
         */
        this._outputTime = null;
        /**
         * The start of the output time range (optional).
         */
        this._startOutputTime = null;
        /**
         * The amount to discritize the existing grid to (optional).
         * Only applicable if the interpolation mode is set to {@link Output_GridFileInterpolation.DISCRETIZED}.
         * Must be in [1, 1000].
         */
        this.discretize = null;
        /**
         * The name of the scenario that this output is for (required).
         */
        this.scenarioName = "";
        /**
         * Should the file be streamed/uploaded to an external service after
         * it has been created? The streaming services are defined by
         * {@link OutputStreamInfo} and helper methods such as
         * {@link PSaaS#streamOutputToMqtt} or {@link PSaaS#streamOutputToGeoServer}.
         */
        this.shouldStream = false;
        /**
         * If the output file is a TIF file the contents will be compressed
         * using this method.
         */
        this.compression = Output_GridFileCompression.NONE;
        /**
         * Should the output file be minimized to just its bounding box (true) or should it cover the entire
         * grid area (false).
         */
        this.shouldMinimize = false;
        /**
         * The name of a specific sub-scenario that the output is for (if it should be for a subscenario).
         */
        this.subScenarioName = null;
        /**
         * A list of export time overrides for different sub-scenarios that may be created
         * for the specified scenario.
         */
        this.subScenarioOverrideTimes = new Array();
    }
    /**
     * Get the end export time as a Luxon DateTime.
     */
    get lOutputTime() {
        return this._outputTime;
    }
    /**
     * Get the end export time as an ISO8601 string.
     * @deprecated Use lOutputTime instead.
     */
    get outputTime() {
        return this._outputTime == null ? "" : this._outputTime.toISO();
    }
    /**
     * Set the end export time using a Luxon DateTime. Cannot be null. If
     * the start export time is not set this value will also be used for
     * the start time.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lOutputTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value == null) {
            throw new RangeError("The export time is not valid");
        }
        this._outputTime = value;
    }
    /**
     * Set the export time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * If the start export time is not set this value will also be used for
     * the start time.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated Use lOutputTime instead.
     */
    set outputTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The export time is not valid");
        }
        this._outputTime = luxon_1.DateTime.fromISO(value);
    }
    /**
     * Get the start export time as a Luxon DateTime.
     */
    get lStartOutputTime() {
        return this._startOutputTime;
    }
    /**
     * Get the start export time as an ISO8601 string.
     * @deprecated Use lStartOutputTime instead.
     */
    get startOutputTime() {
        return this._startOutputTime == null ? "" : this._startOutputTime.toISO();
    }
    /**
     * Set the start export time using a Luxon DateTime. Use null to clear the value.
     */
    set lStartOutputTime(value) {
        this._startOutputTime = value;
    }
    /**
     * Set the start export time using a string. Use null to clear the value.
     * @deprecated Use lOutputTime instead.
     */
    set startOutputTime(value) {
        this._startOutputTime = luxon_1.DateTime.fromISO(value);
    }
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
    get statistic() {
        return this._statistic;
    }
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
    set statistic(value) {
        this._statistic = value;
        if (value === psaasGlobals_1.GlobalStatistics.TOTAL_FUEL_CONSUMED || value === psaasGlobals_1.GlobalStatistics.SURFACE_FUEL_CONSUMED ||
            value === psaasGlobals_1.GlobalStatistics.CROWN_FUEL_CONSUMED || value === psaasGlobals_1.GlobalStatistics.RADIATIVE_POWER) {
            this.interpMethod = Output_GridFileInterpolation.DISCRETIZED;
        }
    }
    add_subScenarioOverrideTimes(add) {
        this.subScenarioOverrideTimes.push(add);
    }
    remove_subScenarioOverrideTimes(remove) {
        var ind = this.subScenarioOverrideTimes.indexOf(remove);
        this.subScenarioOverrideTimes.splice(ind, 1);
    }
    /**
     * Checks to see if all required values have been set.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    checkValid() {
        const errs = new Array();
        if (this.filename.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("filename", "No output filename has been specified.", this));
        }
        if (this._outputTime == null) {
            errs.push(new psaasGlobals_1.ValidationError("lOutputTime", "The simulation time to export at has not been specified.", this));
        }
        if (this.scenarioName.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("scenarioName", "The scenario that the output is for has not been specified.", this));
        }
        if (this.interpMethod == null) {
            errs.push(new psaasGlobals_1.ValidationError("interpMethod", "The interpolation method has not been specified.", this));
        }
        if (this.discretize != null && (this.discretize < 1 || this.discretize > 1000)) {
            errs.push(new psaasGlobals_1.ValidationError("discritize", "The discritization must be an integer greater than 0 and less than 1001.", this));
        }
        if (this.statistic == null) {
            errs.push(new psaasGlobals_1.ValidationError("statistic", "The statistic to export has not been specified.", this));
        }
        else if (this.statistic != psaasGlobals_1.GlobalStatistics.TEMPERATURE && this.statistic != psaasGlobals_1.GlobalStatistics.DEW_POINT && this.statistic != psaasGlobals_1.GlobalStatistics.RELATIVE_HUMIDITY &&
            this.statistic != psaasGlobals_1.GlobalStatistics.WIND_DIRECTION && this.statistic != psaasGlobals_1.GlobalStatistics.WIND_SPEED && this.statistic != psaasGlobals_1.GlobalStatistics.PRECIPITATION &&
            this.statistic != psaasGlobals_1.GlobalStatistics.FFMC && this.statistic != psaasGlobals_1.GlobalStatistics.ISI && this.statistic != psaasGlobals_1.GlobalStatistics.FWI &&
            this.statistic != psaasGlobals_1.GlobalStatistics.BUI && this.statistic != psaasGlobals_1.GlobalStatistics.MAX_FI && this.statistic != psaasGlobals_1.GlobalStatistics.MAX_FL &&
            this.statistic != psaasGlobals_1.GlobalStatistics.MAX_ROS && this.statistic != psaasGlobals_1.GlobalStatistics.MAX_SFC && this.statistic != psaasGlobals_1.GlobalStatistics.MAX_CFC &&
            this.statistic != psaasGlobals_1.GlobalStatistics.MAX_TFC && this.statistic != psaasGlobals_1.GlobalStatistics.MAX_CFB && this.statistic != psaasGlobals_1.GlobalStatistics.RAZ &&
            this.statistic != psaasGlobals_1.GlobalStatistics.BURN_GRID && this.statistic != psaasGlobals_1.GlobalStatistics.FIRE_ARRIVAL_TIME && this.statistic != psaasGlobals_1.GlobalStatistics.HROS &&
            this.statistic != psaasGlobals_1.GlobalStatistics.FROS && this.statistic != psaasGlobals_1.GlobalStatistics.BROS && this.statistic != psaasGlobals_1.GlobalStatistics.RSS &&
            this.statistic != psaasGlobals_1.GlobalStatistics.ACTIVE_PERIMETER && this.statistic != psaasGlobals_1.GlobalStatistics.BURN && this.statistic != psaasGlobals_1.GlobalStatistics.BURN_PERCENTAGE &&
            this.statistic != psaasGlobals_1.GlobalStatistics.FIRE_ARRIVAL_TIME_MIN && this.statistic != psaasGlobals_1.GlobalStatistics.FIRE_ARRIVAL_TIME_MAX && this.statistic != psaasGlobals_1.GlobalStatistics.TOTAL_FUEL_CONSUMED &&
            this.statistic != psaasGlobals_1.GlobalStatistics.SURFACE_FUEL_CONSUMED && this.statistic != psaasGlobals_1.GlobalStatistics.CROWN_FUEL_CONSUMED && this.statistic != psaasGlobals_1.GlobalStatistics.RADIATIVE_POWER &&
            this.statistic != psaasGlobals_1.GlobalStatistics.HFI && this.statistic != psaasGlobals_1.GlobalStatistics.HCFB && this.statistic != psaasGlobals_1.GlobalStatistics.HROS_MAP && this.statistic != psaasGlobals_1.GlobalStatistics.FROS_MAP &&
            this.statistic != psaasGlobals_1.GlobalStatistics.BROS_MAP && this.statistic != psaasGlobals_1.GlobalStatistics.RSS_MAP && this.statistic != psaasGlobals_1.GlobalStatistics.RAZ_MAP && this.statistic != psaasGlobals_1.GlobalStatistics.FMC_MAP &&
            this.statistic != psaasGlobals_1.GlobalStatistics.CFB_MAP && this.statistic != psaasGlobals_1.GlobalStatistics.CFC_MAP && this.statistic != psaasGlobals_1.GlobalStatistics.SFC_MAP && this.statistic != psaasGlobals_1.GlobalStatistics.TFC_MAP &&
            this.statistic != psaasGlobals_1.GlobalStatistics.FI_MAP && this.statistic != psaasGlobals_1.GlobalStatistics.FL_MAP && this.statistic != psaasGlobals_1.GlobalStatistics.CURINGDEGREE_MAP && this.statistic != psaasGlobals_1.GlobalStatistics.GREENUP_MAP &&
            this.statistic != psaasGlobals_1.GlobalStatistics.PC_MAP && this.statistic != psaasGlobals_1.GlobalStatistics.PDF_MAP && this.statistic != psaasGlobals_1.GlobalStatistics.CBH_MAP && this.statistic != psaasGlobals_1.GlobalStatistics.TREE_HEIGHT_MAP &&
            this.statistic != psaasGlobals_1.GlobalStatistics.FUEL_LOAD_MAP && this.statistic != psaasGlobals_1.GlobalStatistics.CFL_MAP && this.statistic != psaasGlobals_1.GlobalStatistics.GRASSPHENOLOGY_MAP &&
            this.statistic != psaasGlobals_1.GlobalStatistics.ROSVECTOR_MAP && this.statistic != psaasGlobals_1.GlobalStatistics.DIRVECTOR_MAP) {
            errs.push(new psaasGlobals_1.ValidationError("statistic", "Invalid statistic specified for grid export.", this));
        }
        //catch an error where the interpolation method is restricted for the output statistic
        else if ((this.statistic === psaasGlobals_1.GlobalStatistics.TOTAL_FUEL_CONSUMED || this.statistic === psaasGlobals_1.GlobalStatistics.SURFACE_FUEL_CONSUMED ||
            this.statistic === psaasGlobals_1.GlobalStatistics.CROWN_FUEL_CONSUMED || this.statistic === psaasGlobals_1.GlobalStatistics.RADIATIVE_POWER) &&
            this.interpMethod !== Output_GridFileInterpolation.DISCRETIZED) {
            errs.push(new psaasGlobals_1.ValidationError("interpMethod", "Interpolation method must be discretized.", this));
        }
        let subscenarioErrs = new Array();
        for (let i = 0; i < this.subScenarioOverrideTimes.length; i++) {
            let subscenario = this.subScenarioOverrideTimes[i].checkValid();
            if (subscenario.length > 0) {
                let temp = new psaasGlobals_1.ValidationError(i, `Errors found in sub-scenario override times at ${i}.`, this.subScenarioOverrideTimes);
                subscenario.forEach(err => {
                    temp.addChild(err);
                });
                subscenarioErrs.push(temp);
            }
        }
        if (subscenarioErrs.length > 0) {
            let temp = new psaasGlobals_1.ValidationError("subScenarioOverrideTimes", "Errors found in sub-scenario override times.", this);
            subscenarioErrs.forEach(err => {
                temp.addChild(err);
            });
            errs.push(temp);
        }
        return errs;
    }
    static streamNullableString(value) {
        return value || "";
    }
    /**
     * Streams the grid file to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this.scenarioName + '|' + this.filename + '|' + this._outputTime.toISO() + '|' + this.statistic + '|' + this.interpMethod + '|' + (+this.shouldStream) + '|' + this.compression;
        tmp = tmp + '|' + this.shouldMinimize + '|' + Output_GridFile.streamNullableString(this.subScenarioName) + '|' + this.subScenarioOverrideTimes.length;
        for (let e of this.subScenarioOverrideTimes) {
            tmp = tmp + '|' + e.subScenarioName + '|' + e.getExportOverrideTime();
        }
        if (this.discretize != null) {
            tmp = tmp + '|' + this.discretize;
        }
        else {
            tmp = tmp + '|null';
        }
        if (this._startOutputTime != null) {
            tmp = tmp + '|' + this._startOutputTime.toISO();
        }
        else {
            tmp = tmp + '|null';
        }
        builder.write(Output_GridFile.PARAM_GRIDFILE + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
exports.Output_GridFile = Output_GridFile;
Output_GridFile.PARAM_GRIDFILE = "gridfile";
var VectorFileType;
(function (VectorFileType) {
    VectorFileType["KML"] = "KML";
    VectorFileType["SHP"] = "SHP";
})(VectorFileType = exports.VectorFileType || (exports.VectorFileType = {}));
/**
 * An override start and end time for a specific sub-scenario.
 */
class PerimeterTimeOverride {
    constructor() {
        /**
         * The time to use instead of {@link VectorFile#perimStartTime}.
         */
        this._startTime = null;
        /**
         * The time to use instead of {@link VectorFile#perimEndTime}.
         */
        this._endTime = null;
    }
    /**
     * Get the override for the export start time as a Luxon DateTime.
     */
    get lStartTime() {
        return this._startTime;
    }
    /**
     * Get the override for the export start time as an ISO8601 string.
     * @deprecated
     */
    get startTime() {
        return this.getExportStartTime();
    }
    /**
     * Set the override for the export start time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lStartTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value == null) {
            throw new RangeError("The override for the export start time is not valid");
        }
        this._startTime = value;
    }
    /**
     * Set the override for the export start time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set startTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The override for the export start time is not valid");
        }
        this._startTime = luxon_1.DateTime.fromISO(value);
    }
    getExportStartTime() {
        return this._startTime == null ? "" : this._startTime.toISO();
    }
    /**
     * Get the override for the export end time as a Luxon DateTime.
     */
    get lEndTime() {
        return this._endTime;
    }
    /**
     * Get the override for the export end time as an ISO8601 string.
     * @deprecated
     */
    get endTime() {
        return this.getExportEndTime();
    }
    /**
     * Set the override for the export end time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lEndTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value == null) {
            throw new RangeError("The override for the export end time is not valid");
        }
        this._endTime = value;
    }
    /**
     * Set the override for the export end time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set endTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The override for the export end time is not valid");
        }
        this._endTime = luxon_1.DateTime.fromISO(value);
    }
    getExportEndTime() {
        return this._endTime == null ? "" : this._endTime.toISO();
    }
    checkValid() {
        const errs = new Array();
        if (this.subScenarioName == null) {
            errs.push(new psaasGlobals_1.ValidationError("subScenarioName", "No sub-scenario has been set.", this));
        }
        return errs;
    }
}
exports.PerimeterTimeOverride = PerimeterTimeOverride;
class VectorFile {
    constructor() {
        /**
         * The name of the output file (required).
         * The file will be located below the jobs output directory. All global paths and
         * relative paths that attempt to move the file outside of this directory will be removed.
         */
        this.filename = "";
        /**
         * The type of vector file to output (required).
         */
        this.type = null;
        /**
         * Whether multiple perimeters are needed (based on time steps) or only the final perimeter is needed (required).
         */
        this.multPerim = null;
        /**
         * Start output perimeter time (required).
         */
        this._perimStartTime = null;
        /**
         * End output perimeter time (required).
         */
        this._perimEndTime = null;
        /**
         * Remove unburned islands (holes) inside of the perimeter (required).
         */
        this.removeIslands = null;
        /**
         * Dissolve contacting fires into a single perimeter (required).
         */
        this.mergeContact = null;
        /**
         * Whether the exported file should contain only the active perimeter (required).
         */
        this.perimActive = null;
        /**
         * The name of the scenario that this output is for (required).
         */
        this.scenarioName = "";
        /**
         * The name of a sub-scenario to export instead of all sub-scenarios
         * being combined into a single output. Ignored if not using sub-scenarios.
         */
        this.subScenarioName = null;
        /**
         * A list of times to override for specific sub-scenarios, if sub-scenarios
         * are being created for the referenced scenario.
         */
        this.subScenarioOverrides = new Array();
        this.metadata = new psaasGlobals_1.VectorMetadata();
        this.shouldStream = false;
    }
    /**
     * Get the perimeter export start time as a Luxon DateTime.
     */
    get lPerimStartTime() {
        return this._perimStartTime;
    }
    /**
     * Get the perimeter export start time as an ISO8601 string.
     * @deprecated
     */
    get perimStartTime() {
        return this._perimStartTime == null ? "" : this._perimStartTime.toISO();
    }
    /**
     * Set the perimeter export start time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lPerimStartTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value == null) {
            throw new RangeError("The perimeter export start time is not valid");
        }
        this._perimStartTime = value;
    }
    /**
     * Set the perimeter export start time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set perimStartTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The perimeter export start time is not valid");
        }
        this._perimStartTime = luxon_1.DateTime.fromISO(value);
    }
    /**
     * Get the override for the export end time as a Luxon DateTime.
     */
    get lPerimEndTime() {
        return this._perimEndTime;
    }
    /**
     * Get the override for the export end time as an ISO8601 string.
     * @deprecated
     */
    get perimEndTime() {
        return this._perimEndTime == null ? "" : this._perimEndTime.toISO();
    }
    /**
     * Set the override for the export end time using a Luxon DateTime. Cannot be null.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     */
    set lPerimEndTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && value == null) {
            throw new RangeError("The override for the export end time is not valid");
        }
        this._perimEndTime = value;
    }
    /**
     * Set the override for the export end time using a string. Cannot be null or empty. Must be formatted in ISO8601.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if value is not valid.
     * @deprecated
     */
    set perimEndTime(value) {
        if (psaasGlobals_1.SocketMsg.inlineThrowOnError && (value == null || value.length == 0)) {
            throw new RangeError("The override for the export end time is not valid");
        }
        this._perimEndTime = luxon_1.DateTime.fromISO(value);
    }
    add_subScenarioOverrides(add) {
        if (add != null) {
            this.subScenarioOverrides.push(add);
        }
    }
    remove_subScenarioOverrides(remove) {
        var ind = this.subScenarioOverrides.indexOf(remove);
        this.subScenarioOverrides.splice(ind, 1);
    }
    static streamNullableBoolean(value) {
        return value == null ? -1 : (value ? 1 : 0);
    }
    static streamNullableString(value) {
        return value == null ? "" : value;
    }
    /**
     * Checks to see if all required values have been set.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    checkValid() {
        const errs = new Array();
        if (this.filename.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("filename", "No output filename has been specified.", this));
        }
        if (this._perimStartTime == null) {
            errs.push(new psaasGlobals_1.ValidationError("lPerimStartTime", "The simulation time to begin outputting the perimeter for has not been specified.", this));
        }
        if (this._perimEndTime == null) {
            errs.push(new psaasGlobals_1.ValidationError("lPerimEndTime", "The simulation time to stop outputting the perimeter for has not been specified.", this));
        }
        if (this.scenarioName.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("scenarioName", "The scenario that the output is for has not been specified.", this));
        }
        if (this.type !== VectorFileType.KML && this.type !== VectorFileType.SHP) {
            errs.push(new psaasGlobals_1.ValidationError("type", "Invalid output file type specified.", this));
        }
        if (this.multPerim == null) {
            errs.push(new psaasGlobals_1.ValidationError("multPerim", "The multiple perimeter setting is invalid.", this));
        }
        if (this.removeIslands == null) {
            errs.push(new psaasGlobals_1.ValidationError("removeIslands", "The remove islands setting is invalid.", this));
        }
        if (this.mergeContact == null) {
            errs.push(new psaasGlobals_1.ValidationError("mergeContact", "The merge contacting perimeters setting is invalid.", this));
        }
        if (this.perimActive == null) {
            errs.push(new psaasGlobals_1.ValidationError("perimActive", "The active perimeter setting is invalid.", this));
        }
        let metadataErrs = this.metadata.checkValid();
        if (metadataErrs.length > 0) {
            let temp = new psaasGlobals_1.ValidationError("metadata", "Errors in vector file metadata settings.", this);
            metadataErrs.forEach(err => {
                temp.addChild(err);
            });
            errs.push(temp);
        }
        let subscenarioErrs = new Array();
        for (let i = 0; i < this.subScenarioOverrides.length; i++) {
            let subscenario = this.subScenarioOverrides[i].checkValid();
            if (subscenario.length > 0) {
                let temp = new psaasGlobals_1.ValidationError(i, `Errors found in sub-scenario overrides at ${i}.`, this.subScenarioName);
                subscenario.forEach(err => {
                    temp.addChild(err);
                });
                subscenarioErrs.push(temp);
            }
        }
        if (subscenarioErrs.length > 0) {
            let temp = new psaasGlobals_1.ValidationError("subScenarioOverrides", "Errors in sub-scenario overrides.", this);
            subscenarioErrs.forEach(err => {
                temp.addChild(err);
            });
            errs.push(temp);
        }
        return errs;
    }
    /**
     * Streams the vector file to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this.scenarioName + '|' + this.filename + '|' + (+this.multPerim) + '|' + this._perimStartTime.toISO() + '|' + this._perimEndTime.toISO() + '|' + (+this.removeIslands) + '|' + (+this.mergeContact) + '|' + (+this.perimActive);
        tmp = tmp + '|' + this.metadata.version + '|' + this.metadata.scenName + '|' + this.metadata.jobName + '|' + this.metadata.igName + '|' + this.metadata.simDate;
        tmp = tmp + '|' + this.metadata.fireSize + '|' + this.metadata.perimTotal + '|' + this.metadata.perimActive + '|' + this.metadata.perimUnit + '|' + this.metadata.areaUnit + '|' + (+this.shouldStream);
        tmp = tmp + '|' + VectorFile.streamNullableBoolean(this.metadata.wxValues) + '|' + VectorFile.streamNullableBoolean(this.metadata.fwiValues);
        tmp = tmp + '|' + VectorFile.streamNullableBoolean(this.metadata.ignitionLocation) + '|' + VectorFile.streamNullableBoolean(this.metadata.maxBurnDistance);
        tmp = tmp + '|' + VectorFile.streamNullableBoolean(this.metadata.ignitionAttributes) + '|' + VectorFile.streamNullableString(this.subScenarioName);
        tmp = tmp + '|' + this.subScenarioOverrides.length;
        for (let s of this.subScenarioOverrides) {
            tmp = tmp + '|' + s.subScenarioName + '|' + s.getExportStartTime() + '|' + s.getExportEndTime();
        }
        tmp = tmp + '|' + VectorFile.streamNullableBoolean(this.metadata.assetArrivalTime) + '|' + VectorFile.streamNullableBoolean(this.metadata.assetArrivalCount);
        tmp = tmp + '|' + VectorFile.streamNullableBoolean(this.metadata.identifyFinalPerimeter);
        builder.write(VectorFile.PARAM_VECTORFILE + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
exports.VectorFile = VectorFile;
VectorFile.PARAM_VECTORFILE = "vectorfile";
/**
 * Output a summary for the specified scenario.
 * @author "Travis Redpath"
 */
class SummaryFile {
    /**
     * Create a new summary file.
     * @param scen The name of the scenario to output a summary for.
     */
    constructor(scen) {
        this.scenName = scen.getId();
        this.outputs = new psaasGlobals_1.SummaryOutputs();
        this.shouldStream = false;
    }
    /**
     * Determine if all of the required values have been set.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find all errors that may exist in the summary file output.
     * @returns A list of all errors that were found.
     */
    checkValid() {
        const errs = new Array();
        if (this.filename.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("filename", "The output filename was not specified.", this));
        }
        if (this.scenName.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("scenName", "The scenario that the output is for has not been specified.", this));
        }
        let outputsErrs = this.outputs.checkValid();
        if (outputsErrs.length > 0) {
            let temp = new psaasGlobals_1.ValidationError("outputs", "Errors found in the summary output settings.", this);
            outputsErrs.forEach(err => {
                temp.addChild(err);
            });
            errs.push(temp);
        }
        return errs;
    }
    /**
     * Streams the summary options to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this.scenName + '|' + this.filename;
        if (this.outputs.outputApplication == null) {
            tmp = tmp + '|-1';
        }
        else if (this.outputs.outputApplication) {
            tmp = tmp + '|1';
        }
        else {
            tmp = tmp + '|0';
        }
        if (this.outputs.outputGeoData == null) {
            tmp = tmp + '|-1';
        }
        else if (this.outputs.outputGeoData) {
            tmp = tmp + '|1';
        }
        else {
            tmp = tmp + '|0';
        }
        if (this.outputs.outputScenario == null) {
            tmp = tmp + '|-1';
        }
        else if (this.outputs.outputScenario) {
            tmp = tmp + '|1';
        }
        else {
            tmp = tmp + '|0';
        }
        if (this.outputs.outputScenarioComments == null) {
            tmp = tmp + '|-1';
        }
        else if (this.outputs.outputScenarioComments) {
            tmp = tmp + '|1';
        }
        else {
            tmp = tmp + '|0';
        }
        if (this.outputs.outputInputs == null) {
            tmp = tmp + '|-1';
        }
        else if (this.outputs.outputInputs) {
            tmp = tmp + '|1';
        }
        else {
            tmp = tmp + '|0';
        }
        if (this.outputs.outputLandscape == null) {
            tmp = tmp + '|-1';
        }
        else if (this.outputs.outputLandscape) {
            tmp = tmp + '|1';
        }
        else {
            tmp = tmp + '|0';
        }
        if (this.outputs.outputFBPPatches == null) {
            tmp = tmp + '|-1';
        }
        else if (this.outputs.outputFBPPatches) {
            tmp = tmp + '|1';
        }
        else {
            tmp = tmp + '|0';
        }
        if (this.outputs.outputWxPatches == null) {
            tmp = tmp + '|-1';
        }
        else if (this.outputs.outputWxPatches) {
            tmp = tmp + '|1';
        }
        else {
            tmp = tmp + '|0';
        }
        if (this.outputs.outputIgnitions == null) {
            tmp = tmp + '|-1';
        }
        else if (this.outputs.outputIgnitions) {
            tmp = tmp + '|1';
        }
        else {
            tmp = tmp + '|0';
        }
        if (this.outputs.outputWxStreams == null) {
            tmp = tmp + '|-1';
        }
        else if (this.outputs.outputWxStreams) {
            tmp = tmp + '|1';
        }
        else {
            tmp = tmp + '|0';
        }
        if (this.outputs.outputFBP == null) {
            tmp = tmp + '|-1';
        }
        else if (this.outputs.outputFBP) {
            tmp = tmp + '|1';
        }
        else {
            tmp = tmp + '|0';
        }
        tmp = tmp + '|' + (+this.shouldStream);
        if (this.outputs.outputWxData == null) {
            tmp = tmp + '|-1';
        }
        else if (this.outputs.outputWxData) {
            tmp = tmp + '|1';
        }
        else {
            tmp = tmp + '|0';
        }
        if (this.outputs.outputAssetInfo == null) {
            tmp = tmp + '|-1';
        }
        else if (this.outputs.outputAssetInfo) {
            tmp = tmp + '|1';
        }
        else {
            tmp = tmp + '|0';
        }
        builder.write(SummaryFile.PARAM_SUMMARYFILE + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
exports.SummaryFile = SummaryFile;
SummaryFile.PARAM_SUMMARYFILE = "summaryfile";
/**
 * The filetype of the exported stats file.
 */
var StatsFileType;
(function (StatsFileType) {
    /**
     * Detect the output type based on the file extension. *.json will
     * always be {@see JSON_ROW}.
     */
    StatsFileType[StatsFileType["AUTO_DETECT"] = 0] = "AUTO_DETECT";
    /**
     * Export to a CSV file.
     */
    StatsFileType[StatsFileType["COMMA_SEPARATED_VALUE"] = 1] = "COMMA_SEPARATED_VALUE";
    /**
     * Export to a JSON file with the data separated by timestep.
     */
    StatsFileType[StatsFileType["JSON_ROW"] = 2] = "JSON_ROW";
    /**
     * Export to a JSON file with the data separated by statistic.
     */
    StatsFileType[StatsFileType["JSON_COLUMN"] = 3] = "JSON_COLUMN";
})(StatsFileType = exports.StatsFileType || (exports.StatsFileType = {}));
/**
 * An output file to mimic the Prometheus stats view. Contains
 * stats from each timestep of a scenarios simulation.
 */
class StatsFile {
    /**
     * Create a new stats file.
     * @param scen The name of the scenario to output a stats file for.
     */
    constructor(scen) {
        this.location = null;
        /**
         * The file format to export to.
         */
        this.fileType = StatsFileType.AUTO_DETECT;
        /**
         * An array of {@link GlobalStatistics} that dictates which statistics
         * will be added to the file.
         */
        this.columns = new Array();
        /**
         * The amount to discritize the existing grid to (optional).
         * Must be in [1, 1000].
         */
        this.discretize = null;
        this.scenName = scen.getId();
        this.shouldStream = false;
    }
    /**
     * Set a location to use for exporting weather information to the stats file.
     * Either this or {@link setWeatherStream} should be used if weather information
     * is to be added to the stats file.
     * @param location The location that will be used for exporting weather information.
     */
    setLocation(location) {
        this.streamName = null;
        this.location = location;
    }
    /**
     * Set a weather stream to use for exporting weather information to the stats file.
     * Either this or {@link setLocation} should be used if weather information
     * is to be added to the stats file.
     * @param stream A weather stream that will be used for exporting weather information.
     */
    setWeatherStream(stream) {
        this.location = null;
        this.streamName = stream.getId();
    }
    /**
     * Add a new column to output in the statistics file.
     * @param col The new column to add.
     * @returns The column that was added, or null if the column was invalid or had already been added.
     */
    addColumn(col) {
        if (col == psaasGlobals_1.GlobalStatistics.DATE_TIME || col == psaasGlobals_1.GlobalStatistics.ELAPSED_TIME || col == psaasGlobals_1.GlobalStatistics.TIME_STEP_DURATION ||
            col == psaasGlobals_1.GlobalStatistics.TEMPERATURE || col == psaasGlobals_1.GlobalStatistics.DEW_POINT || col == psaasGlobals_1.GlobalStatistics.RELATIVE_HUMIDITY ||
            col == psaasGlobals_1.GlobalStatistics.WIND_SPEED || col == psaasGlobals_1.GlobalStatistics.WIND_DIRECTION || col == psaasGlobals_1.GlobalStatistics.PRECIPITATION ||
            col == psaasGlobals_1.GlobalStatistics.HFFMC || col == psaasGlobals_1.GlobalStatistics.HISI || col == psaasGlobals_1.GlobalStatistics.DMC ||
            col == psaasGlobals_1.GlobalStatistics.DC || col == psaasGlobals_1.GlobalStatistics.HFWI || col == psaasGlobals_1.GlobalStatistics.BUI ||
            col == psaasGlobals_1.GlobalStatistics.FFMC || col == psaasGlobals_1.GlobalStatistics.ISI || col == psaasGlobals_1.GlobalStatistics.FWI ||
            col == psaasGlobals_1.GlobalStatistics.TIMESTEP_AREA || col == psaasGlobals_1.GlobalStatistics.TIMESTEP_BURN_AREA || col == psaasGlobals_1.GlobalStatistics.TOTAL_AREA ||
            col == psaasGlobals_1.GlobalStatistics.TOTAL_BURN_AREA || col == psaasGlobals_1.GlobalStatistics.AREA_GROWTH_RATE || col == psaasGlobals_1.GlobalStatistics.EXTERIOR_PERIMETER ||
            col == psaasGlobals_1.GlobalStatistics.EXTERIOR_PERIMETER_GROWTH_RATE || col == psaasGlobals_1.GlobalStatistics.ACTIVE_PERIMETER || col == psaasGlobals_1.GlobalStatistics.ACTIVE_PERIMETER_GROWTH_RATE ||
            col == psaasGlobals_1.GlobalStatistics.TOTAL_PERIMETER || col == psaasGlobals_1.GlobalStatistics.TOTAL_PERIMETER_GROWTH_RATE || col == psaasGlobals_1.GlobalStatistics.FI_LT_10 ||
            col == psaasGlobals_1.GlobalStatistics.FI_10_500 || col == psaasGlobals_1.GlobalStatistics.FI_500_2000 || col == psaasGlobals_1.GlobalStatistics.FI_2000_4000 ||
            col == psaasGlobals_1.GlobalStatistics.FI_4000_10000 || col == psaasGlobals_1.GlobalStatistics.FI_GT_10000 || col == psaasGlobals_1.GlobalStatistics.ROS_0_1 ||
            col == psaasGlobals_1.GlobalStatistics.ROS_2_4 || col == psaasGlobals_1.GlobalStatistics.ROS_5_8 || col == psaasGlobals_1.GlobalStatistics.ROS_9_14 ||
            col == psaasGlobals_1.GlobalStatistics.ROS_GT_15 || col == psaasGlobals_1.GlobalStatistics.MAX_ROS || col == psaasGlobals_1.GlobalStatistics.MAX_FI ||
            col == psaasGlobals_1.GlobalStatistics.MAX_FL || col == psaasGlobals_1.GlobalStatistics.MAX_CFB || col == psaasGlobals_1.GlobalStatistics.MAX_CFC ||
            col == psaasGlobals_1.GlobalStatistics.MAX_SFC || col == psaasGlobals_1.GlobalStatistics.MAX_TFC || col == psaasGlobals_1.GlobalStatistics.TOTAL_FUEL_CONSUMED ||
            col == psaasGlobals_1.GlobalStatistics.CROWN_FUEL_CONSUMED || col == psaasGlobals_1.GlobalStatistics.SURFACE_FUEL_CONSUMED || col == psaasGlobals_1.GlobalStatistics.NUM_ACTIVE_VERTICES ||
            col == psaasGlobals_1.GlobalStatistics.NUM_VERTICES || col == psaasGlobals_1.GlobalStatistics.CUMULATIVE_VERTICES || col == psaasGlobals_1.GlobalStatistics.CUMULATIVE_ACTIVE_VERTICES ||
            col == psaasGlobals_1.GlobalStatistics.NUM_ACTIVE_FRONTS || col == psaasGlobals_1.GlobalStatistics.NUM_FRONTS || col == psaasGlobals_1.GlobalStatistics.MEMORY_USED_START ||
            col == psaasGlobals_1.GlobalStatistics.MEMORY_USED_END || col == psaasGlobals_1.GlobalStatistics.NUM_TIMESTEPS || col == psaasGlobals_1.GlobalStatistics.NUM_DISPLAY_TIMESTEPS ||
            col == psaasGlobals_1.GlobalStatistics.NUM_EVENT_TIMESTEPS || col == psaasGlobals_1.GlobalStatistics.NUM_CALC_TIMESTEPS || col == psaasGlobals_1.GlobalStatistics.TICKS ||
            col == psaasGlobals_1.GlobalStatistics.PROCESSING_TIME || col == psaasGlobals_1.GlobalStatistics.GROWTH_TIME) {
            if (this.columns.indexOf(col) < 0) {
                this.columns.push(col);
                return col;
            }
        }
        return null;
    }
    /**
     * Remove a column for the statistics file.
     */
    removeColumn(col) {
        var index = this.columns.indexOf(col);
        if (index != -1) {
            this.columns.splice(index, 1);
            return true;
        }
        return false;
    }
    validateColumn(value) {
        if (value != psaasGlobals_1.GlobalStatistics.DATE_TIME && value != psaasGlobals_1.GlobalStatistics.ELAPSED_TIME && value != psaasGlobals_1.GlobalStatistics.TIME_STEP_DURATION &&
            value != psaasGlobals_1.GlobalStatistics.TEMPERATURE && value != psaasGlobals_1.GlobalStatistics.DEW_POINT && value != psaasGlobals_1.GlobalStatistics.RELATIVE_HUMIDITY &&
            value != psaasGlobals_1.GlobalStatistics.WIND_SPEED && value != psaasGlobals_1.GlobalStatistics.WIND_DIRECTION && value != psaasGlobals_1.GlobalStatistics.PRECIPITATION &&
            value != psaasGlobals_1.GlobalStatistics.HFFMC && value != psaasGlobals_1.GlobalStatistics.HISI && value != psaasGlobals_1.GlobalStatistics.DMC &&
            value != psaasGlobals_1.GlobalStatistics.DC && value != psaasGlobals_1.GlobalStatistics.HFWI && value != psaasGlobals_1.GlobalStatistics.BUI &&
            value != psaasGlobals_1.GlobalStatistics.FFMC && value != psaasGlobals_1.GlobalStatistics.ISI && value != psaasGlobals_1.GlobalStatistics.FWI &&
            value != psaasGlobals_1.GlobalStatistics.TIMESTEP_AREA && value != psaasGlobals_1.GlobalStatistics.TIMESTEP_BURN_AREA && value != psaasGlobals_1.GlobalStatistics.TOTAL_AREA &&
            value != psaasGlobals_1.GlobalStatistics.TOTAL_BURN_AREA && value != psaasGlobals_1.GlobalStatistics.AREA_GROWTH_RATE && value != psaasGlobals_1.GlobalStatistics.EXTERIOR_PERIMETER &&
            value != psaasGlobals_1.GlobalStatistics.EXTERIOR_PERIMETER_GROWTH_RATE && value != psaasGlobals_1.GlobalStatistics.ACTIVE_PERIMETER && value != psaasGlobals_1.GlobalStatistics.ACTIVE_PERIMETER_GROWTH_RATE &&
            value != psaasGlobals_1.GlobalStatistics.TOTAL_PERIMETER && value != psaasGlobals_1.GlobalStatistics.TOTAL_PERIMETER_GROWTH_RATE && value != psaasGlobals_1.GlobalStatistics.FI_LT_10 &&
            value != psaasGlobals_1.GlobalStatistics.FI_10_500 && value != psaasGlobals_1.GlobalStatistics.FI_500_2000 && value != psaasGlobals_1.GlobalStatistics.FI_2000_4000 &&
            value != psaasGlobals_1.GlobalStatistics.FI_4000_10000 && value != psaasGlobals_1.GlobalStatistics.FI_GT_10000 && value != psaasGlobals_1.GlobalStatistics.ROS_0_1 &&
            value != psaasGlobals_1.GlobalStatistics.ROS_2_4 && value != psaasGlobals_1.GlobalStatistics.ROS_5_8 && value != psaasGlobals_1.GlobalStatistics.ROS_9_14 &&
            value != psaasGlobals_1.GlobalStatistics.ROS_GT_15 && value != psaasGlobals_1.GlobalStatistics.MAX_ROS && value != psaasGlobals_1.GlobalStatistics.MAX_FI &&
            value != psaasGlobals_1.GlobalStatistics.MAX_FL && value != psaasGlobals_1.GlobalStatistics.MAX_CFB && value != psaasGlobals_1.GlobalStatistics.MAX_CFC &&
            value != psaasGlobals_1.GlobalStatistics.MAX_SFC && value != psaasGlobals_1.GlobalStatistics.MAX_TFC && value != psaasGlobals_1.GlobalStatistics.TOTAL_FUEL_CONSUMED &&
            value != psaasGlobals_1.GlobalStatistics.CROWN_FUEL_CONSUMED && value != psaasGlobals_1.GlobalStatistics.SURFACE_FUEL_CONSUMED && value != psaasGlobals_1.GlobalStatistics.NUM_ACTIVE_VERTICES &&
            value != psaasGlobals_1.GlobalStatistics.NUM_VERTICES && value != psaasGlobals_1.GlobalStatistics.CUMULATIVE_VERTICES && value != psaasGlobals_1.GlobalStatistics.CUMULATIVE_ACTIVE_VERTICES &&
            value != psaasGlobals_1.GlobalStatistics.NUM_ACTIVE_FRONTS && value != psaasGlobals_1.GlobalStatistics.NUM_FRONTS && value != psaasGlobals_1.GlobalStatistics.MEMORY_USED_START &&
            value != psaasGlobals_1.GlobalStatistics.MEMORY_USED_END && value != psaasGlobals_1.GlobalStatistics.NUM_TIMESTEPS && value != psaasGlobals_1.GlobalStatistics.NUM_DISPLAY_TIMESTEPS &&
            value != psaasGlobals_1.GlobalStatistics.NUM_EVENT_TIMESTEPS && value != psaasGlobals_1.GlobalStatistics.NUM_CALC_TIMESTEPS && value != psaasGlobals_1.GlobalStatistics.TICKS &&
            value != psaasGlobals_1.GlobalStatistics.PROCESSING_TIME && value != psaasGlobals_1.GlobalStatistics.GROWTH_TIME) {
            return false;
        }
        return true;
    }
    /**
     * Determine if all of the required values have been set.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find all errors that may be in the statistics file output.
     * @returns A list of all errors that were found.
     */
    checkValid() {
        const errs = new Array();
        if (this.filename.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("filename", "The output filename was not specified.", this));
        }
        if (this.scenName.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("scenName", "The scenario that the output is for has not been specified.", this));
        }
        let columnErrs = new Array();
        for (let i = 0; i < this.columns.length; i++) {
            if (!this.validateColumn(this.columns[i])) {
                columnErrs.push(new psaasGlobals_1.ValidationError(i, `Invalid statistics column at ${i}.`, this.columns));
            }
        }
        if (columnErrs.length > 0) {
            let temp = new psaasGlobals_1.ValidationError("columns", "Invalid statistics columns.", this);
            columnErrs.forEach(err => {
                temp.addChild(err);
            });
            errs.push(temp);
        }
        if (this.discretize != null && (this.discretize < 1 || this.discretize > 1000)) {
            errs.push(new psaasGlobals_1.ValidationError("discritize", "The discritization must be an integer greater than 0 and less than 1001.", this));
        }
        return errs;
    }
    /**
     * Streams the stats options to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this.scenName + '|' + this.filename + '|' + this.fileType + '|' + (+this.shouldStream);
        if (this.location != null) {
            tmp = tmp + '|loc|' + this.location.latitude + '|' + this.location.longitude;
        }
        else {
            tmp = tmp + '|name|' + this.streamName;
        }
        tmp = tmp + '|0|' + this.columns.length;
        for (let col of this.columns) {
            tmp = tmp + '|' + col;
        }
        if (this.discretize == null) {
            tmp = tmp + '|null';
        }
        else {
            tmp = tmp + '|' + this.discretize;
        }
        builder.write(StatsFile.PARAM_STATSFILE + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
exports.StatsFile = StatsFile;
StatsFile.PARAM_STATSFILE = "statsfile";
/**
 * Information about which files should be output from the job.
 * @author "Travis Redpath"
 */
class PSaaSOutputs {
    constructor() {
        /**
         * The vector files that should be output (optional).
         */
        this.vectorFiles = new Array();
        /**
         * The grid files that should be output (optional).
         */
        this.gridFiles = new Array();
        /**
         * The summary files that should be output (optional).
         */
        this.summaryFiles = new Array();
        /**
         * Output a stats file with information from each scenario timestep.
         */
        this.statsFiles = new Array();
        /**
         * The default stream status for all newly created output
         * files. If true, newly created output files will be
         * defaulted to streaming to any specified stream
         * locations. If false, newly created output files will
         * be defaulted to not stream. The user can override
         * this setting on each output file.
         */
        this.streamAll = false;
    }
    /**
     * Create a new vector file and add it to the list of
     * vector file outputs.
     */
    newVectorFile(scen) {
        let file = new VectorFile();
        file.scenarioName = scen.getId();
        file.shouldStream = this.streamAll;
        this.vectorFiles.push(file);
        return file;
    }
    /**
     * Removes the output vector file from a scenario
     */
    removeOutputVectorFile(stat) {
        var index = this.vectorFiles.indexOf(stat);
        if (index != -1) {
            this.vectorFiles.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Create a new grid file and add it to the list of
     * grid file outputs.
     */
    newGridFile(scen) {
        let file = new Output_GridFile();
        file.scenarioName = scen.getId();
        file.shouldStream = this.streamAll;
        this.gridFiles.push(file);
        return file;
    }
    /**
     * Removes the output grid file from a scenario
     */
    removeOutputGridFile(stat) {
        var index = this.gridFiles.indexOf(stat);
        if (index != -1) {
            this.gridFiles.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Create a new summary file and add it to the list of
     * summary file outputs.
     */
    newSummaryFile(scen) {
        let file = new SummaryFile(scen);
        file.shouldStream = this.streamAll;
        this.summaryFiles.push(file);
        return file;
    }
    /**
     * Removes the output summary file from a scenario
     */
    removeOutputSummaryFile(stat) {
        var index = this.summaryFiles.indexOf(stat);
        if (index != -1) {
            this.summaryFiles.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Create a new stats file and add it to the list of
     * stats file outputs.
     * @param scen The scenario to output the stats for.
     */
    newStatsFile(scen) {
        let file = new StatsFile(scen);
        file.shouldStream = this.streamAll;
        this.statsFiles.push(file);
        return file;
    }
    /**
     * Remove a stats file from the scenario.
     * @param stat The stats file to remove.
     */
    removeOutputStatsFile(stat) {
        var index = this.statsFiles.indexOf(stat);
        if (index != -1) {
            this.statsFiles.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Checks to see if all of the required values have been set.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find all errors that may exist in the PSaaS outputs.
     * @returns A list of errors that were found.
     */
    checkValid() {
        const errs = new Array();
        let summaryErrs = new Array();
        for (let i = 0; i < this.summaryFiles.length; i++) {
            let summary = this.summaryFiles[i].checkValid();
            if (summary.length > 0) {
                let temp = new psaasGlobals_1.ValidationError(i, `Errors found in summary file at ${i}.`, this.summaryFiles);
                summary.forEach(err => {
                    temp.addChild(err);
                });
                summaryErrs.push(temp);
            }
        }
        if (summaryErrs.length > 0) {
            let temp = new psaasGlobals_1.ValidationError("summaryFiles", "Errors found in summary file outputs.", this);
            summaryErrs.forEach(err => {
                temp.addChild(err);
            });
            errs.push(temp);
        }
        let vectorErrs = new Array();
        for (let i = 0; i < this.vectorFiles.length; i++) {
            let vector = this.vectorFiles[i].checkValid();
            if (vector.length > 0) {
                let temp = new psaasGlobals_1.ValidationError(i, `Errors found in vector file at ${i}.`, this.vectorFiles);
                vector.forEach(err => {
                    temp.addChild(err);
                });
                vectorErrs.push(temp);
            }
        }
        if (vectorErrs.length > 0) {
            let temp = new psaasGlobals_1.ValidationError("vectorFiles", "Errors found in vector file outputs.", this);
            vectorErrs.forEach(err => {
                temp.addChild(err);
            });
            errs.push(temp);
        }
        let gridErrs = new Array();
        for (let i = 0; i < this.gridFiles.length; i++) {
            let grid = this.gridFiles[i].checkValid();
            if (grid.length > 0) {
                let temp = new psaasGlobals_1.ValidationError(i, `Errors found in grid file at ${i}.`, this.gridFiles);
                grid.forEach(err => {
                    temp.addChild(err);
                });
                gridErrs.push(temp);
            }
        }
        if (gridErrs.length > 0) {
            let temp = new psaasGlobals_1.ValidationError("gridFiles", "Errors found in grid file outputs.", this);
            gridErrs.forEach(err => {
                temp.addChild(err);
            });
            errs.push(temp);
        }
        let statErrs = new Array();
        for (let i = 0; i < this.statsFiles.length; i++) {
            let stats = this.statsFiles[i].checkValid();
            if (stats.length > 0) {
                let temp = new psaasGlobals_1.ValidationError(i, `Errors found in statistics file at ${i}.`, this.statsFiles);
                stats.forEach(err => {
                    temp.addChild(err);
                });
                statErrs.push(temp);
            }
        }
        if (statErrs.length > 0) {
            let temp = new psaasGlobals_1.ValidationError("statsFiles", "Errors found in statistics file outputs.", this);
            statErrs.forEach(err => {
                temp.addChild(err);
            });
            errs.push(temp);
        }
        return errs;
    }
    /**
     * Streams the output settings to a socket.
     * @param builder
     */
    stream(builder) {
        for (let s of this.summaryFiles) {
            s.stream(builder);
        }
        for (let v of this.vectorFiles) {
            v.stream(builder);
        }
        for (let g of this.gridFiles) {
            g.stream(builder);
        }
        for (let s of this.statsFiles) {
            s.stream(builder);
        }
    }
}
exports.PSaaSOutputs = PSaaSOutputs;
/**
 * After all simulations have completed the output files can be streamed to another
 * location to be consumed by a client side application. Currently only streaming
 * over MQTT is supported.
 * @author "Travis Redpath"
 */
class OutputStreamInfo extends psaasGlobals_1.IPSaaSSerializable {
}
exports.OutputStreamInfo = OutputStreamInfo;
OutputStreamInfo.PARAM_URL = "output_stream";
class MqttOutputStreamInfo extends OutputStreamInfo {
    /**
     * @inheritdoc
     */
    checkValid() {
        return [];
    }
    /**
     * Streams the output stream information to a socket.
     * @param builder
     */
    stream(builder) {
        builder.write(OutputStreamInfo.PARAM_URL + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write("mqtt" + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
exports.MqttOutputStreamInfo = MqttOutputStreamInfo;
/**
 * After a file has been written by PSaaS it can be uploaded to a GeoServer
 * instance by Manager. Currently only TIFF files are supported.
 */
class GeoServerOutputStreamInfo extends OutputStreamInfo {
    constructor() {
        super(...arguments);
        /**
         * The username to authenticate on GeoServer with.
         */
        this.username = "";
        /**
         * A password to authenticate on GeoServer with.
         * WARNING: this password will be saved in plain text.
         */
        this.password = "";
        /**
         * The URL of the GeoServer instance to upload the file to.
         * The address of the REST API should be {url}/rest and the
         * URL of the web interface should be {url}/web.
         */
        this.url = "";
        /**
         * The workspace to add the file to.
         * If the workspace doesn't exist it will be created.
         */
        this.workspace = "";
        /**
         * The coverage store to add the file to.
         * If the coverage store doesn't exist it will be created.
         */
        this.coverageStore = "";
        /**
         * The declared spatial reference system for the added coverage.
         * If this is not specified the uploaded coverage will not be
         * enabled.
         */
        this.declaredSrs = null;
    }
    /**
     * @inheritdoc
     */
    checkValid() {
        const errs = new Array();
        if (this.username == null || this.username.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("username", "No login username for the GeoServer instance was specified.", this));
        }
        if (this.password == null || this.password.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("password", "No login password for the GeoServer instance was specified.", this));
        }
        if (this.url == null || this.url.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("password", "No login password for the GeoServer instance was specified.", this));
        }
        if (this.workspace == null || this.workspace.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("password", "No GeoServer workspace to store the exported files in was specified.", this));
        }
        if (this.coverageStore == null || this.coverageStore.length == 0) {
            errs.push(new psaasGlobals_1.ValidationError("password", "No GeoServer coverage store inside the workspace to store the exported files in was specified.", this));
        }
        return errs;
    }
    /**
     * Streams the outptu stream information to a socket.
     */
    stream(builder) {
        builder.write(OutputStreamInfo.PARAM_URL + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(`geo|${this.username}|${this.password}|${this.url}|${this.workspace}|${this.coverageStore}|${this.declaredSrs == null ? "" : this.declaredSrs}` + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
exports.GeoServerOutputStreamInfo = GeoServerOutputStreamInfo;
/**
 * Stores file contents for use in the simulation. All file
 * names must begin with `attachment:/`.
 */
class FileAttachment {
    /**
     * Create a new file stream.
     * @param name The name of the file.
     * @param content The raw contents of the file. If the content is being constructed
     * manually this can be a string (ex. weather stream constructed from external sources).
     * If this is a file it is recommended that a Buffer be used.
     */
    constructor(name, content) {
        this.filename = name;
        this.contents = content;
    }
    /**
     * Streams the attachment to a socket.
     * @param builder
     */
    stream(builder) {
        builder.write(FileAttachment.PARAM_ATTACHMENT + psaasGlobals_1.SocketMsg.NEWLINE);
        if (Buffer.isBuffer(this.contents)) {
            builder.write(`${this.filename}|${this.contents.length}${psaasGlobals_1.SocketMsg.NEWLINE}`);
        }
        else {
            builder.write(this.filename + psaasGlobals_1.SocketMsg.NEWLINE);
        }
        builder.write(this.contents);
        builder.write(psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(FileAttachment.PARAM_ATTACHMENT_END + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
FileAttachment.PARAM_ATTACHMENT = "file_attachment";
FileAttachment.PARAM_ATTACHMENT_END = "file_attachment_end";
var TimeUnit;
(function (TimeUnit) {
    TimeUnit[TimeUnit["DEFAULT"] = -1] = "DEFAULT";
    TimeUnit[TimeUnit["MICROSECOND"] = 1572864] = "MICROSECOND";
    TimeUnit[TimeUnit["MILLISECOND"] = 1638400] = "MILLISECOND";
    TimeUnit[TimeUnit["SECOND"] = 1114112] = "SECOND";
    TimeUnit[TimeUnit["MINUTE"] = 1179648] = "MINUTE";
    TimeUnit[TimeUnit["HOUR"] = 1245184] = "HOUR";
    TimeUnit[TimeUnit["DAY"] = 1310720] = "DAY";
    TimeUnit[TimeUnit["WEEK"] = 1376256] = "WEEK";
    TimeUnit[TimeUnit["MONTH"] = 1441792] = "MONTH";
    TimeUnit[TimeUnit["YEAR"] = 1507328] = "YEAR";
    TimeUnit[TimeUnit["DECADE"] = 1703936] = "DECADE";
    TimeUnit[TimeUnit["CENTURY"] = 1769472] = "CENTURY";
})(TimeUnit = exports.TimeUnit || (exports.TimeUnit = {}));
var DistanceUnit;
(function (DistanceUnit) {
    DistanceUnit[DistanceUnit["DEFAULT"] = -1] = "DEFAULT";
    DistanceUnit[DistanceUnit["MM"] = 1] = "MM";
    DistanceUnit[DistanceUnit["CM"] = 2] = "CM";
    DistanceUnit[DistanceUnit["M"] = 3] = "M";
    DistanceUnit[DistanceUnit["KM"] = 4] = "KM";
    DistanceUnit[DistanceUnit["INCH"] = 5] = "INCH";
    DistanceUnit[DistanceUnit["FOOT"] = 6] = "FOOT";
    DistanceUnit[DistanceUnit["YARD"] = 7] = "YARD";
    DistanceUnit[DistanceUnit["CHAIN"] = 8] = "CHAIN";
    DistanceUnit[DistanceUnit["MILE"] = 9] = "MILE";
    DistanceUnit[DistanceUnit["NAUTICAL_MILE"] = 10] = "NAUTICAL_MILE";
    DistanceUnit[DistanceUnit["NAUTICAL_MILE_UK"] = 11] = "NAUTICAL_MILE_UK";
})(DistanceUnit = exports.DistanceUnit || (exports.DistanceUnit = {}));
var AreaUnit;
(function (AreaUnit) {
    AreaUnit[AreaUnit["DEFAULT"] = -1] = "DEFAULT";
    AreaUnit[AreaUnit["MM2"] = 256] = "MM2";
    AreaUnit[AreaUnit["CM2"] = 257] = "CM2";
    AreaUnit[AreaUnit["M2"] = 258] = "M2";
    AreaUnit[AreaUnit["HECTARE"] = 259] = "HECTARE";
    AreaUnit[AreaUnit["KM2"] = 260] = "KM2";
    AreaUnit[AreaUnit["IN2"] = 261] = "IN2";
    AreaUnit[AreaUnit["FT2"] = 262] = "FT2";
    AreaUnit[AreaUnit["YD2"] = 263] = "YD2";
    AreaUnit[AreaUnit["ACRE"] = 264] = "ACRE";
    AreaUnit[AreaUnit["MILE2"] = 265] = "MILE2";
})(AreaUnit = exports.AreaUnit || (exports.AreaUnit = {}));
var VolumeUnit;
(function (VolumeUnit) {
    VolumeUnit[VolumeUnit["DEFAULT"] = -1] = "DEFAULT";
    VolumeUnit[VolumeUnit["MM3"] = 512] = "MM3";
    VolumeUnit[VolumeUnit["CM3"] = 513] = "CM3";
    VolumeUnit[VolumeUnit["LITRE"] = 514] = "LITRE";
    VolumeUnit[VolumeUnit["M3"] = 515] = "M3";
    VolumeUnit[VolumeUnit["KM3"] = 516] = "KM3";
    VolumeUnit[VolumeUnit["IN3"] = 517] = "IN3";
    VolumeUnit[VolumeUnit["FT3"] = 518] = "FT3";
    VolumeUnit[VolumeUnit["YD3"] = 519] = "YD3";
    VolumeUnit[VolumeUnit["MILE3"] = 520] = "MILE3";
    VolumeUnit[VolumeUnit["UK_FL_OZ"] = 521] = "UK_FL_OZ";
    VolumeUnit[VolumeUnit["UK_PINT"] = 522] = "UK_PINT";
    VolumeUnit[VolumeUnit["UK_QUART"] = 523] = "UK_QUART";
    VolumeUnit[VolumeUnit["UK_GALLON"] = 524] = "UK_GALLON";
    VolumeUnit[VolumeUnit["BUSHEL"] = 525] = "BUSHEL";
    VolumeUnit[VolumeUnit["US_DRAM"] = 526] = "US_DRAM";
    VolumeUnit[VolumeUnit["US_FL_OZ"] = 527] = "US_FL_OZ";
    VolumeUnit[VolumeUnit["US_FL_PINT"] = 528] = "US_FL_PINT";
    VolumeUnit[VolumeUnit["US_FL_QUART"] = 529] = "US_FL_QUART";
    VolumeUnit[VolumeUnit["US_GALLON"] = 530] = "US_GALLON";
    VolumeUnit[VolumeUnit["US_FL_BARREL"] = 531] = "US_FL_BARREL";
    VolumeUnit[VolumeUnit["US_DRY_PINT"] = 532] = "US_DRY_PINT";
    VolumeUnit[VolumeUnit["US_DRY_QUART"] = 533] = "US_DRY_QUART";
    VolumeUnit[VolumeUnit["US_DRY_BARREL"] = 534] = "US_DRY_BARREL";
})(VolumeUnit = exports.VolumeUnit || (exports.VolumeUnit = {}));
var TemperatureUnit;
(function (TemperatureUnit) {
    TemperatureUnit[TemperatureUnit["DEFAULT"] = -1] = "DEFAULT";
    TemperatureUnit[TemperatureUnit["KELVIN"] = 1024] = "KELVIN";
    TemperatureUnit[TemperatureUnit["CELSIUS"] = 1025] = "CELSIUS";
    TemperatureUnit[TemperatureUnit["FAHRENHEIT"] = 1026] = "FAHRENHEIT";
    TemperatureUnit[TemperatureUnit["RANKINE"] = 1027] = "RANKINE";
})(TemperatureUnit = exports.TemperatureUnit || (exports.TemperatureUnit = {}));
var PressureUnit;
(function (PressureUnit) {
    PressureUnit[PressureUnit["DEFAULT"] = -1] = "DEFAULT";
    PressureUnit[PressureUnit["KPA"] = 1280] = "KPA";
    PressureUnit[PressureUnit["PSI"] = 1281] = "PSI";
    PressureUnit[PressureUnit["BAR"] = 1282] = "BAR";
    PressureUnit[PressureUnit["ATM"] = 1283] = "ATM";
    PressureUnit[PressureUnit["TORR"] = 1284] = "TORR";
})(PressureUnit = exports.PressureUnit || (exports.PressureUnit = {}));
var MassUnit;
(function (MassUnit) {
    MassUnit[MassUnit["DEFAULT"] = -1] = "DEFAULT";
    MassUnit[MassUnit["MILLIGRAM"] = 1536] = "MILLIGRAM";
    MassUnit[MassUnit["GRAM"] = 1537] = "GRAM";
    MassUnit[MassUnit["KG"] = 1538] = "KG";
    MassUnit[MassUnit["TONNE"] = 1539] = "TONNE";
    MassUnit[MassUnit["OUNCE"] = 1540] = "OUNCE";
    MassUnit[MassUnit["LB"] = 1541] = "LB";
    MassUnit[MassUnit["SHORT_TON"] = 1542] = "SHORT_TON";
    MassUnit[MassUnit["TON"] = 1543] = "TON";
})(MassUnit = exports.MassUnit || (exports.MassUnit = {}));
var EnergyUnit;
(function (EnergyUnit) {
    EnergyUnit[EnergyUnit["DEFAULT"] = -1] = "DEFAULT";
    EnergyUnit[EnergyUnit["JOULE"] = 1792] = "JOULE";
    EnergyUnit[EnergyUnit["KILOJOULE"] = 1802] = "KILOJOULE";
    EnergyUnit[EnergyUnit["ELECTRONVOLT"] = 1793] = "ELECTRONVOLT";
    EnergyUnit[EnergyUnit["ERG"] = 1794] = "ERG";
    EnergyUnit[EnergyUnit["FT_LB"] = 1795] = "FT_LB";
    EnergyUnit[EnergyUnit["CALORIE"] = 1796] = "CALORIE";
    EnergyUnit[EnergyUnit["KG_METRE"] = 1797] = "KG_METRE";
    EnergyUnit[EnergyUnit["BTU"] = 1798] = "BTU";
    EnergyUnit[EnergyUnit["WATT_SECOND"] = 1115911] = "WATT_SECOND";
    EnergyUnit[EnergyUnit["WATT_HOUR"] = 1246983] = "WATT_HOUR";
    EnergyUnit[EnergyUnit["KILOWATT_SECOND"] = 1115912] = "KILOWATT_SECOND";
    EnergyUnit[EnergyUnit["KILOWATT_HOUR"] = 1246984] = "KILOWATT_HOUR";
    EnergyUnit[EnergyUnit["THERM"] = 1801] = "THERM";
})(EnergyUnit = exports.EnergyUnit || (exports.EnergyUnit = {}));
var PercentUnit;
(function (PercentUnit) {
    PercentUnit[PercentUnit["DEFAULT"] = -1] = "DEFAULT";
    PercentUnit[PercentUnit["DECIMAL"] = 1216] = "DECIMAL";
    PercentUnit[PercentUnit["PERCENT"] = 1217] = "PERCENT";
    PercentUnit[PercentUnit["DECIMAL_INVERT"] = 1218] = "DECIMAL_INVERT";
    PercentUnit[PercentUnit["PERCENT_INVERT"] = 1219] = "PERCENT_INVERT";
})(PercentUnit = exports.PercentUnit || (exports.PercentUnit = {}));
var AngleUnit;
(function (AngleUnit) {
    AngleUnit[AngleUnit["DEFAULT"] = -1] = "DEFAULT";
    AngleUnit[AngleUnit["CARTESIAN_RADIAN"] = 1200] = "CARTESIAN_RADIAN";
    AngleUnit[AngleUnit["COMPASS_RADIAN"] = 16778416] = "COMPASS_RADIAN";
    AngleUnit[AngleUnit["CARTESIAN_DEGREE"] = 33555632] = "CARTESIAN_DEGREE";
    AngleUnit[AngleUnit["COMPASS_DEGREE"] = 50332848] = "COMPASS_DEGREE";
    AngleUnit[AngleUnit["CARTESIAN_ARCSECOND"] = 67110064] = "CARTESIAN_ARCSECOND";
    AngleUnit[AngleUnit["COMPASS_ARCSECOND"] = 83887280] = "COMPASS_ARCSECOND";
})(AngleUnit = exports.AngleUnit || (exports.AngleUnit = {}));
var CoordinateUnit;
(function (CoordinateUnit) {
    CoordinateUnit[CoordinateUnit["DEFAULT"] = -1] = "DEFAULT";
    CoordinateUnit[CoordinateUnit["DEGREE"] = 2048] = "DEGREE";
    CoordinateUnit[CoordinateUnit["DEGREE_MINUTE"] = 2049] = "DEGREE_MINUTE";
    CoordinateUnit[CoordinateUnit["DEGREE_MINUTE_SECOND"] = 2050] = "DEGREE_MINUTE_SECOND";
    CoordinateUnit[CoordinateUnit["UTM"] = 2051] = "UTM";
    CoordinateUnit[CoordinateUnit["RELATIVE_DISTANCE"] = 2052] = "RELATIVE_DISTANCE";
})(CoordinateUnit = exports.CoordinateUnit || (exports.CoordinateUnit = {}));
class VelocityUnit {
    constructor() {
        this.distance = DistanceUnit.DEFAULT;
        this.time = TimeUnit.DEFAULT;
    }
}
exports.VelocityUnit = VelocityUnit;
class IntensityUnit {
    constructor() {
        this.energy = EnergyUnit.DEFAULT;
        this.distance = DistanceUnit.DEFAULT;
    }
}
exports.IntensityUnit = IntensityUnit;
class MassAreaUnit {
    constructor() {
        this.mass = MassUnit.DEFAULT;
        this.area = AreaUnit.DEFAULT;
    }
}
exports.MassAreaUnit = MassAreaUnit;
/**
 * Settings that define which units will be used when data is exported in summary
 * or statistics files. All units are optional with application defaults being
 * used for anything that isn't specified.
 */
class UnitSettings {
    constructor() {
        /**
         * Units for displaying small distance measurements.
         */
        this.smallMeasureOutput = DistanceUnit.DEFAULT;
        /**
         * Units for displaying small distances.
         */
        this.smallDistanceOutput = DistanceUnit.DEFAULT;
        /**
         * Units for displaying distances.
         */
        this.distanceOutput = DistanceUnit.DEFAULT;
        /**
         * Alternate units for displaying distances.
         */
        this.alternateDistanceOutput = DistanceUnit.DEFAULT;
        /**
         * Units for displaying coordinates.
         */
        this.coordinateOutput = CoordinateUnit.DEFAULT;
        /**
         * Units for displaying areas.
         */
        this.areaOutput = AreaUnit.DEFAULT;
        /**
         * Units for displaying volumes.
         */
        this.volumeOutput = VolumeUnit.DEFAULT;
        /**
         * Units for displaying temperature.
         */
        this.temperatureOutput = TemperatureUnit.DEFAULT;
        /**
         * Units for displaying mass or weight.
         */
        this.massOutput = MassUnit.DEFAULT;
        /**
         * Units for displaying energy.
         */
        this.energyOutput = EnergyUnit.DEFAULT;
        /**
         * Units for displaying angles.
         */
        this.angleOutput = AngleUnit.DEFAULT;
        /**
         * Units for displaying velocity.
         */
        this.velocityOutput = new VelocityUnit();
        /**
         * An alternate unit for displaying velocity.
         */
        this.alternateVelocityOutput = new VelocityUnit();
        /**
         * Units for displaying fire intensity.
         */
        this.intensityOutput = new IntensityUnit();
        /**
         * Units for displaying mass.
         */
        this.massAreaOutput = new MassAreaUnit();
    }
    /**
     * Find all errors that may exist in the unit settings.
     * @returns A list of all errors that were found.
     */
    checkValid() {
        return [];
    }
    /**
     * Streams the attachment to a socket.
     * @param builder
     */
    stream(builder) {
        var tmp = `${this.smallMeasureOutput}|${this.smallDistanceOutput}|${this.distanceOutput}|${this.alternateDistanceOutput}`;
        var tmp = `${tmp}|${this.coordinateOutput}|${this.areaOutput}|${this.volumeOutput}|${this.temperatureOutput}`;
        var tmp = `${tmp}|${this.massOutput}|${this.energyOutput}|${this.angleOutput}|${this.velocityOutput.distance}`;
        var tmp = `${tmp}|${this.velocityOutput.time}|${this.alternateVelocityOutput.distance}|${this.alternateVelocityOutput.time}|${this.intensityOutput.energy}`;
        var tmp = `${tmp}|${this.intensityOutput.distance}|${this.massAreaOutput.mass}|${this.massAreaOutput.area}`;
        builder.write(UnitSettings.PARAM_UNITS + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
exports.UnitSettings = UnitSettings;
UnitSettings.PARAM_UNITS = "export_units";
/**
 * The types of load balancing available in PSaaS.
 */
var LoadBalanceType;
(function (LoadBalanceType) {
    /**
     * Don't use any load balancing. The generated FGM will be sent to
     * a single instance of PSaaS Manager and it will run all scenarios.
     */
    LoadBalanceType[LoadBalanceType["NONE"] = 0] = "NONE";
    /**
     * Every instance of PSaaS Manager in the same cluster will receive
     * the generated FGM. An external service will provide scenario
     * indices to run so that each instance of PSaaS that is processing
     * the FGM will run different scenarios. The indices will be
     * communicated to the PSaaS instance over MQTT. See the
     * [MQTT documentation](https://spydmobile.bitbucket.io/psaas_mqtt/#topic-psaas/{originator}/delegator/balance)
     * for more information.
     */
    LoadBalanceType[LoadBalanceType["EXTERNAL_COUNTER"] = 1] = "EXTERNAL_COUNTER";
    /**
     * The generated FGM will be sent to a single instance of PSaaS
     * Manager. A file that the user creates will provide scenario
     * indices to the instance of PSaaS that runs the FGM. The file
     * must be named balance.txt and each line must contian a valid
     * scenario index that should be run. Typically used for debugging
     * to force PSaaS to only process a single scenario when many
     * are present in the FGM.
     */
    LoadBalanceType[LoadBalanceType["LOCAL_FILE"] = 2] = "LOCAL_FILE";
})(LoadBalanceType = exports.LoadBalanceType || (exports.LoadBalanceType = {}));
/**
 * Options for running the job not related directly to
 * scenarios or fire growth.
 */
class JobOptions extends psaasGlobals_1.IPSaaSSerializable {
    constructor() {
        super(...arguments);
        /**
         * The type of load balancing to use to run the job.
         */
        this.loadBalance = LoadBalanceType.NONE;
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
        this.priority = 0;
        /**
         * Should the job be validated by PSaaS instead of
         * being run. The user can redo the job if there
         * is a validation error or restart the job so
         * that it simulates in PSaaS using MQTT commands.
         */
        this.validate = false;
    }
    /**
     * Find all errors that may exist in the job settings.
     * @readonly A list of all errors that were found.
     */
    checkValid() {
        return [];
    }
    /**
     * Streams the options to a socket.
     * @param builder
     */
    stream(builder) {
        var tmp = `${this.loadBalance}|${this.priority}|${this.validate}`;
        builder.write(JobOptions.PARAM_OPTIONS + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
exports.JobOptions = JobOptions;
JobOptions.PARAM_OPTIONS = "fgm_settings";
/**
 * The top level class where all information required to run a PSaaS job will be stored.
 * @author "Travis Redpath"
 */
class PSaaS extends psaasGlobals_1.IPSaaSSerializable {
    constructor() {
        super();
        /**
         * Optional user comments about the job.
         */
        this.comments = "";
        /**
         * An array of files that can be used in place of
         * regular files in the simulation. Stores both
         * a filename and the file contents.
         */
        this.attachments = new Array();
        /**
         * A counter to use when adding attachments to
         * make sure that the names are unique.
         */
        this.attachmentIndex = 1;
        this.inputs = new PSaaSInputs();
        this.outputs = new PSaaSOutputs();
        this.timestepSettings = new TimestepSettings();
        this.streamInfo = new Array();
        this.exportUnits = new UnitSettings();
        this.jobOptions = new JobOptions();
    }
    /**
     * Are the input and output values for the job valid.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Get a list of errors that exist in the current PSaaS configuration.
     * @returns A list of errors that were found.
     */
    checkValid() {
        let errs = new Array();
        let inputErrs = this.inputs.checkValid();
        if (inputErrs.length > 0) {
            let inErr = new psaasGlobals_1.ValidationError("inputs", "Errors in PSaaS input values.", this);
            inputErrs.forEach(err => {
                inErr.addChild(err);
            });
            errs.push(inErr);
        }
        let outputErrs = this.outputs.checkValid();
        if (outputErrs.length > 0) {
            let outErr = new psaasGlobals_1.ValidationError("outputs", "Errors in PSaaS output values.", this);
            outputErrs.forEach(err => {
                outErr.addChild(err);
            });
            errs.push(outErr);
        }
        let timestepErrs = this.timestepSettings.checkValid();
        if (timestepErrs.length > 0) {
            let timeErr = new psaasGlobals_1.ValidationError("timestepSettings", "Errors found in timestep settings.", this);
            timestepErrs.forEach(err => {
                timeErr.addChild(err);
            });
            errs.push(timeErr);
        }
        let streamErrs = new Array();
        for (let i = 0; i < this.streamInfo.length; i++) {
            let stream = this.streamInfo[i].checkValid();
            if (stream.length > 0) {
                let temp = new psaasGlobals_1.ValidationError(i, `Errors found in stream info at ${i}.`, this.streamInfo);
                stream.forEach(err => {
                    temp.addChild(err);
                });
                streamErrs.push(temp);
            }
        }
        if (streamErrs.length > 0) {
            let temp = new psaasGlobals_1.ValidationError("streamInfo", "Errors in stream settings.", this);
            streamErrs.forEach(err => {
                temp.addChild(err);
            });
            errs.push(temp);
        }
        let unitErrs = this.exportUnits.checkValid();
        if (unitErrs.length > 0) {
            let uErr = new psaasGlobals_1.ValidationError("exportUnits", "Errors found in unit settings.", this);
            unitErrs.forEach(err => {
                uErr.addChild(err);
            });
            errs.push(uErr);
        }
        let jobErrs = this.jobOptions.checkValid();
        if (jobErrs.length > 0) {
            let jErr = new psaasGlobals_1.ValidationError("jobOptions", "Errors found in job options.", this);
            jobErrs.forEach(err => {
                jErr.addChild(err);
            });
            errs.push(jErr);
        }
        return errs;
    }
    /**
     * Specify the timezone for all specified times.
     * @param zone The hour offset from UTC.
     * @param daylight Whether the offset is for daylight savings time or not.
     */
    setTimezone(zone, daylight) {
        this.inputs.timezone.offset = zone;
        this.inputs.timezone.dst = daylight;
    }
    /**
     * Clears the timezone for all specified times.
     */
    clearTimezone() {
        this.inputs.timezone.offset = null;
        this.inputs.timezone.dst = false;
    }
    /**
     * Specify the timezone for all specified times by name. Must be one of the names
     * provided by the timezone classes <code>getTimezoneNameList()</code> function.
     *
     * @param value The value associated with the time zone.
     */
    setTimezoneByValue(value) {
        this.inputs.timezone.value = Math.round(value);
    }
    /**
     * Unset the timezone for all specified times by name.
     */
    unsetTimezoneByValue(value) {
        this.inputs.timezone.value = null;
    }
    /**
     * Set the projection file. This file is required.
     * An exception will be thrown if the file does not exist.
     * @param filename
     */
    setProjectionFile(filename) {
        this.inputs.files.projFile = filename;
    }
    /**
     * Unset the projection file.
     */
    unsetProjectionFile() {
        this.inputs.files.projFile = "";
    }
    /**
     * Set the look up table. Replaces any existing LUT. One of this and {@link setLutDefinition} must be used but they
     * cannot be used together.
     * An exception will be thrown if the file does not exist.
     * @param filename
     */
    setLutFile(filename) {
        this.inputs.files.lutFile = filename;
    }
    /**
     * Set the LUT using an array of fuel definitions. Replaces any existing LUT. One of this and {@link setLutFile} must be used but they
     * cannot be used together.
     * @param fuels A list of fuel definitions to use as the LUT table.
     * @param filename An optional filename that will be used as a placeholder in the FGM for the LUT.
     * @returns False if the fuel definitions were not able to be added, the attachment name if setting the LUT was successful.
     */
    setLutDefinition(fuels, filename = "api_fuel_def.csv") {
        let s = "API_FUEL_DEF";
        for (const fuel of fuels) {
            s += "|API_FUEL|";
            s += fuel.toString();
        }
        const att = this.addAttachment(filename, s);
        if (!att) {
            throw new Error("Invalid LUT definition. Unable to attach to job.");
        }
        this.setLutFile('' + att);
        return att;
    }
    /**
     * Unset the look up table.
     */
    unsetLutFile() {
        this.inputs.files.lutFile = "";
    }
    /**
     * Set the percent conifer for the M-1, M-2, NZ-54, or NZ-69 fuel type.
     * @param fuel The fuel type to set the percent conifer for. Must be M-1, M-2, NZ-54, or NZ-69.
     * @param value The percent conifer as a percent (0 - 100%).
     */
    setPercentConifer(fuel, value) {
        let option = new FuelOption();
        option.fuelType = fuel;
        option.optionType = FuelOptionType.PERCENT_CONIFER;
        option.value = value;
        this.inputs.fuelOptions.push(option);
    }
    /**
     * Set the percent dead fir for either the M-3 or M-4 fuel type.
     * @param fuel The fuel type to set the percent dead fir for. Must be either M-3 or M-4.
     * @param value The percent dead fir as a percent (0 - 100%).
     */
    setPercentDeadFir(fuel, value) {
        let option = new FuelOption();
        option.fuelType = fuel;
        option.optionType = FuelOptionType.PERCENT_DEAD_FIR;
        option.value = value;
        this.inputs.fuelOptions.push(option);
    }
    /**
     * Set the grass curing for the O-1a, O-1b, NZ-2, NZ-15, NZ-30, NZ-31, NZ-32, NZ-33, NZ-40,
     * NZ-41, NZ-43, NZ-46, NZ-50, NZ-53, NZ-62, NZ-63, or NZ-65 fuel type. If unset, this also
     * sets the grass fuel load to 0.35kg/m^2.
     * @param fuel The fuel type to set the grass curing for.
     * @param value The grass curing (0 - 100%).
     */
    setGrassCuring(fuel, value) {
        let option = new FuelOption();
        option.fuelType = fuel;
        option.optionType = FuelOptionType.GRASS_CURING;
        option.value = value / 100.0;
        this.inputs.fuelOptions.push(option);
    }
    /**
     * Set the grass fuel load for either the O-1a, O-1b, NZ-2, NZ-15, NZ-30, NZ-31, NZ-32, NZ-33, NZ-40,
     * NZ-41, NZ-43, NZ-46, NZ-50, NZ-53, NZ-62, NZ-63, or NZ-65 fuel type. If unset, this also
     * sets the grass curing to 60%.
     * @param fuel The fuel type to set the grass fuel load for.
     * @param value The grass fuel load (kg/m^2).
     */
    setGrassFuelLoad(fuel, value) {
        let option = new FuelOption();
        option.fuelType = fuel;
        option.optionType = FuelOptionType.GRASS_FUEL_LOAD;
        option.value = value;
        this.inputs.fuelOptions.push(option);
    }
    /**
     * Set the crown base height.
     * @param fuel The fuel type to set the crown base height for. Must be C-1, C-6, NZ-60, NZ-61, NZ-66, NZ-67, or NZ-71.
     * @param value The crown base height (m).
     */
    setCrownBaseHeight(fuel, value) {
        let option = new FuelOption();
        option.fuelType = fuel;
        option.optionType = FuelOptionType.CROWN_BASE_HEIGHT;
        option.value = value;
        this.inputs.fuelOptions.push(option);
    }
    /**
     * Set the crown fuel load in kg/m^2.
     * @param fuel The fuel type to set the crown fuel load for. Must be C-1, C-6, NZ-60, NZ-61, NZ-66, NZ-67, or NZ-71.
     * @param value The crown fuel load (kg/m^2).
     */
    setCrownFuelLoad(fuel, value) {
        let option = new FuelOption();
        option.fuelType = fuel;
        option.optionType = FuelOptionType.CROWN_FUEL_LOAD;
        option.value = value;
        this.inputs.fuelOptions.push(option);
    }
    /**
     * Remove a FuelOption object from the input fuel options.
     * @param fuelOption The FuelOption object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeFuelOption(fuelOption) {
        var index = this.inputs.fuelOptions.indexOf(fuelOption);
        if (index != -1) {
            this.inputs.fuelOptions.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Set the fuel map file. This file is required.
     * An exception will be thrown if the file does not exist.
     * @param filename Can either be the actual file path or the
     * 			   attachment URL returned from {@link addAttachment}
     */
    setFuelmapFile(filename) {
        this.inputs.files.fuelmapFile = filename;
    }
    /**
     * Unset the fuel map file.
     */
    unsetFuelmapFile() {
        this.inputs.files.fuelmapFile = "";
    }
    /**
     * Set the default FMC value for the fuel map.
     * This value can be overridden by scenarios.
     * @param value The default FMC value. Set to -1 to disable.
     * @deprecated deprecated since 6.2.4.3. Project level default FMC is no longer used.
     */
    setDefaultFMC(value) {
    }
    /**
     * Set the elevation grid file. An elevation grid file is optional.
     * An exception will be thrown if the file does not exist.
     * @param filename Can either be the actual file path or the attachment
     * 			   URL returned from {@link addAttachment}
     */
    setElevationFile(filename) {
        this.inputs.files.elevFile = filename;
    }
    /**
     * Unset the elevation grid file
     */
    unsetElevationFile() {
        this.inputs.files.elevFile = "";
    }
    /**
     * Add a grid file to the project.
     * @param filename The location of the grid file. Can either
     * 			   be the actual file path or the attachment
     * 			   URL returned from {@link addAttachment}
     * @param proj The location of the grid files projection.
     * @param type Must be one of the GridFile::TYPE_* values.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set and {@link SocketMsg.skipFileTests} is not set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if the file doesn't exist.
     */
    addGridFile(filename, proj, type) {
        let gf = new GridFile();
        gf.filename = filename;
        gf.projection = proj;
        gf.type = type;
        this.inputs.files.gridFiles.push(gf);
        return gf;
    }
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
    addGridFileWithComment(filename, proj, type, comment) {
        let gf = new GridFile();
        gf.filename = filename;
        gf.projection = proj;
        gf.type = type;
        gf.comment = comment;
        this.inputs.files.gridFiles.push(gf);
        return gf;
    }
    /**
     * Remove a GridFile object from the grid files.
     * @param gridFile The GridFile object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeGridFile(gridFile) {
        var index = this.inputs.files.gridFiles.indexOf(gridFile);
        if (index != -1) {
            this.inputs.files.gridFiles.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Add a landscape fuel patch to the job.
     * @param fromFuel The fuel to change from. Can either be one of the {@link FromFuel} wildcard rules or the name of a fuel.
     * @param toFuel The name of the fuel to change to.
     * @param comment An optional user created comment to attach to the fuel patch.
     */
    addLandscapeFuelPatch(fromFuel, toFuel, comment) {
        let fp = new FuelPatch();
        fp.type = FuelPatchType.LANDSCAPE;
        if (fromFuel === FromFuel.ALL || fromFuel === FromFuel.ALL_COMBUSTABLE || fromFuel === FromFuel.NODATA) {
            fp.fromFuelRule = fromFuel;
        }
        else {
            fp.fromFuel = fromFuel;
        }
        fp.toFuel = toFuel;
        if (comment != null) {
            fp.comments = comment;
        }
        this.inputs.files.fuelPatchFiles.push(fp);
        return fp;
    }
    /**
     * Add a file fuel patch to the job.
     * @param filename The location of the shape file. Can either be the actual file path or the attachment URL returned from {@link addAttachment}
     * @param fromFuel The fuel to change from. Can either be one of the rules defined in FuelPatch (FROM_FUEL_*) or the name of a fuel.
     * @param toFuel The name of the fuel to change to.
     * @param comment An optional user created comment to attach to the fuel patch.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set and {@link SocketMsg.skipFileTests} is not set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if the file doesn't exist.
     */
    addFileFuelPatch(filename, fromFuel, toFuel, comment) {
        let fp = new FuelPatch();
        fp.type = FuelPatchType.FILE;
        fp.filename = filename;
        if (fromFuel === FromFuel.ALL || fromFuel === FromFuel.ALL_COMBUSTABLE || fromFuel === FromFuel.NODATA) {
            fp.fromFuelRule = fromFuel;
        }
        else {
            fp.fromFuel = fromFuel;
        }
        fp.toFuel = toFuel;
        if (comment != null) {
            fp.comments = comment;
        }
        this.inputs.files.fuelPatchFiles.push(fp);
        return fp;
    }
    /**
     * Add a polygon fuel patch to the job.
     * @param vertices The vertices of the polygon. Must be an array of LatLon values. The LatLon values will be copied by reference.
     * @param fromFuel The fuel to change from. Can either be one of the rules defined in FuelPatch (FROM_FUEL_*) or the name of a fuel.
     * @param toFuel The name of the fuel to change to.
     * @param comments An optional user created comment to attach to the fuel patch.
     */
    addPolygonFuelPatch(vertices, fromFuel, toFuel, comments) {
        let fp = new FuelPatch();
        fp.type = FuelPatchType.POLYGON;
        fp.feature = vertices;
        if (fromFuel === FromFuel.ALL || fromFuel === FromFuel.ALL_COMBUSTABLE || fromFuel === FromFuel.NODATA) {
            fp.fromFuelRule = fromFuel;
        }
        else {
            fp.fromFuel = fromFuel;
        }
        fp.toFuel = toFuel;
        if (comments != null) {
            fp.comments = comments;
        }
        this.inputs.files.fuelPatchFiles.push(fp);
        return fp;
    }
    /**
     * Remove a FuelPatch object from the fuel patch files.
     * @param fuelPatch The FuelPatch object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeFuelPatch(fuelPatch) {
        var index = this.inputs.files.fuelPatchFiles.indexOf(fuelPatch);
        if (index != -1) {
            this.inputs.files.fuelPatchFiles.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Add a fuel break to the project.
     * @param filename The file location of the fuel break. Can either be the actual file
     * 			   path or the attachment URL returned from {@link addAttachment}
     * @param comments An optional user created comment to attach to the fuel break.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set and {@link SocketMsg.skipFileTests} is not set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if the file doesn't exist.
     */
    addFileFuelBreak(filename, comments) {
        let fb = new FuelBreak();
        if (comments != null) {
            fb.comments = comments;
        }
        fb.type = FuelBreakType.FILE;
        fb.filename = filename;
        this.inputs.files.fuelBreakFiles.push(fb);
        return fb;
    }
    /**
     * Add a fuel break to the project.
     * @param vertices The vertices of the polygon. Must be an array of LatLon values. The LatLon values will be copied by reference.
     * @param comments An optional user created comment to attach to the fuel break;
     */
    addPolygonFuelBreak(vertices, comments) {
        let fb = new FuelBreak();
        if (comments != null) {
            fb.comments = comments;
        }
        fb.type = FuelBreakType.POLYGON;
        fb.feature = vertices;
        this.inputs.files.fuelBreakFiles.push(fb);
        return fb;
    }
    /**
     * Add a fuel break to the project.
     * @param vertices The vertices of the polyline. Must be an array of LatLon values. The LatLon values will be copied by reference.
     * @param width The width of the fuel break.
     * @param comments An optional user created comment to attach to the fuel break;
     */
    addPolylineFuelBreak(vertices, width, comments) {
        let fb = new FuelBreak();
        if (comments != null) {
            fb.comments = comments;
        }
        fb.type = FuelBreakType.POLYLINE;
        fb.width = width;
        fb.feature = vertices;
        this.inputs.files.fuelBreakFiles.push(fb);
        return fb;
    }
    /**
     * Remove a FuelBreak object from the fuel break files.
     * @param fuelBreak The FuelBreak object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeFuelBreak(fuelBreak) {
        var index = this.inputs.files.fuelBreakFiles.indexOf(fuelBreak);
        if (index != -1) {
            this.inputs.files.fuelBreakFiles.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Add a weather station to the project.
     * @param elevation The elevation of the weather station.
     * @param location The location of the weather station.
     * @param comments An optional user created comment to attach to the weather station.
     * @return WeatherStation
     */
    addWeatherStation(elevation, location, comments) {
        let ws = new WeatherStation();
        if (comments != null) {
            ws.comments = comments;
        }
        ws.elevation = elevation;
        ws.location = location;
        this.inputs.weatherStations.push(ws);
        return ws;
    }
    /**
     * Remove a WeatherStation object from the weather stations.
     * @param weatherStation The WeatherStation object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeWeatherStation(weatherStation) {
        var index = this.inputs.weatherStations.indexOf(weatherStation);
        if (index != -1) {
            this.inputs.weatherStations.splice(index, 1);
            return true;
        }
        return false;
    }
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
    addFileWeatherPatch(filename, startTime, startTimeOfDay, endTime, endTimeOfDay, comments) {
        let wp = new WeatherPatch();
        if (comments != null) {
            wp.comments = comments;
        }
        if (typeof endTime === "string") {
            wp.endTime = endTime;
        }
        else {
            wp.lEndTime = endTime;
        }
        if (typeof endTimeOfDay === "string") {
            wp.endTimeOfDay = endTimeOfDay;
        }
        else {
            wp.dEndTimeOfDay = endTimeOfDay;
        }
        wp.type = WeatherPatchType.FILE;
        wp.filename = filename;
        if (typeof startTime === "string") {
            wp.startTime = startTime;
        }
        else {
            wp.lStartTime = startTime;
        }
        if (typeof startTimeOfDay === "string") {
            wp.startTimeOfDay = startTimeOfDay;
        }
        else {
            wp.dStartTimeOfDay = startTimeOfDay;
        }
        this.inputs.files.weatherPatchFiles.push(wp);
        return wp;
    }
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
    addPolygonWeatherPatch(vertices, startTime, startTimeOfDay, endTime, endTimeOfDay, comments) {
        let wp = new WeatherPatch();
        if (comments != null) {
            wp.comments = comments;
        }
        if (typeof endTime === "string") {
            wp.endTime = endTime;
        }
        else {
            wp.lEndTime = endTime;
        }
        if (typeof endTimeOfDay === "string") {
            wp.endTimeOfDay = endTimeOfDay;
        }
        else {
            wp.dEndTimeOfDay = endTimeOfDay;
        }
        wp.type = WeatherPatchType.POLYGON;
        wp.feature = vertices;
        if (typeof startTime === "string") {
            wp.startTime = startTime;
        }
        else {
            wp.lStartTime = startTime;
        }
        if (typeof startTimeOfDay === "string") {
            wp.startTimeOfDay = startTimeOfDay;
        }
        else {
            wp.dStartTimeOfDay = startTimeOfDay;
        }
        this.inputs.files.weatherPatchFiles.push(wp);
        return wp;
    }
    /**
     * Add a landscape weather patch.
     * @param startTime The patch start time. If a string is used it must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param startTimeOfDay The patches start time of day. If a string is used it must be formatted as "hh:mm:ss".
     * @param endTime The patch end time. If a string is used it must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param endTimeOfDay The patches end time of day. If a string is used it must be formatted as "hh:mm:ss".
     * @param comments An optional user created comment to attach to the weather patch.
     * @return WeatherPatch
     */
    addLandscapeWeatherPatch(startTime, startTimeOfDay, endTime, endTimeOfDay, comments) {
        let wp = new WeatherPatch();
        if (comments != null) {
            wp.comments = comments;
        }
        if (typeof endTime === "string") {
            wp.endTime = endTime;
        }
        else {
            wp.lEndTime = endTime;
        }
        if (typeof endTimeOfDay === "string") {
            wp.endTimeOfDay = endTimeOfDay;
        }
        else {
            wp.dEndTimeOfDay = endTimeOfDay;
        }
        wp.type = WeatherPatchType.LANDSCAPE;
        if (typeof startTime === "string") {
            wp.startTime = startTime;
        }
        else {
            wp.lStartTime = startTime;
        }
        if (typeof startTimeOfDay === "string") {
            wp.startTimeOfDay = startTimeOfDay;
        }
        else {
            wp.dStartTimeOfDay = startTimeOfDay;
        }
        this.inputs.files.weatherPatchFiles.push(wp);
        return wp;
    }
    /**
     * Remove a WeatherPatch object from the weather patch files.
     * @param weatherPatch The WeatherPatch object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeWeatherPatch(weatherPatch) {
        var index = this.inputs.files.weatherPatchFiles.indexOf(weatherPatch);
        if (index != -1) {
            this.inputs.files.weatherPatchFiles.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Add a weather grid for wind directions to the project.
     * @param startTime The grids start time. If a string is used it must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param startTimeOfDay The grids start time of day. If a string is used it must be formatted as "hh:mm:ss".
     * @param endTime The grids end time. If a string is used it must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param endTimeOfDay The grids end time of day. If a string is used it must be formatted as "hh:mm:ss".
     * @param comments An optional user created comment to attach to the weather grid.
     * @return WeatherGrid
     */
    addDirectionWeatherGrid(startTime, startTimeOfDay, endTime, endTimeOfDay, comments) {
        let wg = new WeatherGrid();
        if (comments != null) {
            wg.comments = comments;
        }
        if (typeof endTime === "string") {
            wg.endTime = endTime;
        }
        else {
            wg.lEndTime = endTime;
        }
        if (typeof endTimeOfDay === "string") {
            wg.endTimeOfDay = endTimeOfDay;
        }
        else {
            wg.dEndTimeOfDay = endTimeOfDay;
        }
        if (typeof startTime === "string") {
            wg.startTime = startTime;
        }
        else {
            wg.lStartTime = startTime;
        }
        if (typeof startTimeOfDay === "string") {
            wg.startTimeOfDay = startTimeOfDay;
        }
        else {
            wg.dStartTimeOfDay = startTimeOfDay;
        }
        wg.type = WeatherGridType.DIRECTION;
        this.inputs.files.weatherGridFiles.push(wg);
        return wg;
    }
    /**
     * Add a weather grid for wind speeds to the project.
     * @param startTime The grids start time. If a string is used it must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param startTimeOfDay The grids start time of day. Must be formatted as "hh:mm:ss".
     * @param endTime The grids end time. If a string is used it must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param endTimeOfDay The grids end time of day. Must be formatted as "hh:mm:ss".
     * @param comments An optional user created comment to attach to the weather grid.
     * @return WeatherGrid
     */
    addSpeedWeatherGrid(startTime, startTimeOfDay, endTime, endTimeOfDay, comments) {
        let wg = new WeatherGrid();
        if (comments != null) {
            wg.comments = comments;
        }
        if (typeof endTime === "string") {
            wg.endTime = endTime;
        }
        else {
            wg.lEndTime = endTime;
        }
        if (typeof endTimeOfDay === "string") {
            wg.endTimeOfDay = endTimeOfDay;
        }
        else {
            wg.dEndTimeOfDay = endTimeOfDay;
        }
        if (typeof startTime === "string") {
            wg.startTime = startTime;
        }
        else {
            wg.lStartTime = startTime;
        }
        if (typeof startTimeOfDay === "string") {
            wg.startTimeOfDay = startTimeOfDay;
        }
        else {
            wg.dStartTimeOfDay = startTimeOfDay;
        }
        wg.type = WeatherGridType.SPEED;
        this.inputs.files.weatherGridFiles.push(wg);
        return wg;
    }
    /**
     * Remove a WeatherGrid object from the weather grid files.
     * @param weatherGrid The WeatherGrid object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeWeatherGrid(weatherGrid) {
        var index = this.inputs.files.weatherGridFiles.indexOf(weatherGrid);
        if (index != -1) {
            this.inputs.files.weatherGridFiles.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Add an ignition from a file.
     * @param filename The location of the ignitions file. Can either be the actual file path
     * 				   or the attachment URL returned from {@link addAttachment}
     * @param startTime The ignitions start time.
     * @param comments An optional user created comment to attach to the ignition.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set and {@link SocketMsg.skipFileTests} is not set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if the file doesn't exist.
     * @return Ignition
     */
    addFileIgnition(filename, startTime, comments) {
        let ig = new Ignition();
        if (typeof startTime === "string") {
            ig.startTime = startTime;
        }
        else {
            ig.lStartTime = startTime;
        }
        if (comments != null) {
            ig.comments = comments;
        }
        ig.type = IgnitionType.FILE;
        ig.filename = filename;
        this.inputs.ignitions.push(ig);
        return ig;
    }
    /**
     * Add an ignition from a single point. If this is to be a multipoint more points can be added
     * to the returned object using {@link Ignition#addPoint}.
     * @param startTime The ignitions start time.
     * @param point The location of the ignition.
     * @param comments An optional user created comment to attach to the ignition.
     * @return Ignition
     */
    addPointIgnition(point, startTime, comments) {
        let ig = new Ignition();
        if (typeof startTime === "string") {
            ig.startTime = startTime;
        }
        else {
            ig.lStartTime = startTime;
        }
        if (comments != null) {
            ig.comments = comments;
        }
        ig.type = IgnitionType.POINT;
        ig.feature.push(point);
        this.inputs.ignitions.push(ig);
        return ig;
    }
    /**
     * Add an ignition with multiple points.
     * @param points An array of LatLons that are all point ignitions.
     * @param startTime The ignitions start time.
     * @param comments An optional user created comment to attach to the ignition.
     * @return Ignition
     */
    addMultiPointIgnition(points, startTime, comments) {
        let ig = new Ignition();
        if (typeof startTime === "string") {
            ig.startTime = startTime;
        }
        else {
            ig.lStartTime = startTime;
        }
        if (comments != null) {
            ig.comments = comments;
        }
        ig.type = IgnitionType.POINT;
        ig.feature = points;
        this.inputs.ignitions.push(ig);
        return ig;
    }
    /**
     * Add an ignition from a set of vertices.
     * @param startTime The ignitions start time.
     * @param vertices An array of LatLons that describe the polygon.
     * @param comments An optional user created comment to attach to the ignition.
     * @return Ignition
     */
    addPolygonIgnition(vertices, startTime, comments) {
        let ig = new Ignition();
        if (typeof startTime === "string") {
            ig.startTime = startTime;
        }
        else {
            ig.lStartTime = startTime;
        }
        if (comments != null) {
            ig.comments = comments;
        }
        ig.type = IgnitionType.POLYGON;
        ig.feature = vertices;
        this.inputs.ignitions.push(ig);
        return ig;
    }
    /**
     * Add an ignition from a set of vertices.
     * @param vertices An array of LatLons that descrive the polyline.
     * @param startTime The ignitions start time.
     * @param comments An optional user created comment to attach to the ignition.
     * @return Ignition
     */
    addPolylineIgnition(vertices, startTime, comments) {
        let ig = new Ignition();
        if (typeof startTime === "string") {
            ig.startTime = startTime;
        }
        else {
            ig.lStartTime = startTime;
        }
        if (comments != null) {
            ig.comments = comments;
        }
        ig.type = IgnitionType.POLYLINE;
        ig.feature = vertices;
        this.inputs.ignitions.push(ig);
        return ig;
    }
    /**
     * Remove an Ignition object from the ignitions.
     * @param ignition The Ignition object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeIgnition(ignition) {
        var index = this.inputs.ignitions.indexOf(ignition);
        if (index != -1) {
            this.inputs.ignitions.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Add a new asset using a shapefile.
     * @param filename The location of the shapefile to use as the shape of the asset.
     * @param comments Any user defined comments for the asset. Can be null if there are no comments.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set and {@link SocketMsg.skipFileTests} is not set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if the file doesn't exist.
     */
    addFileAsset(filename, comments) {
        var asset = new AssetFile();
        if (comments != null) {
            asset.comments = comments;
        }
        asset.type = AssetShapeType.FILE;
        asset.filename = filename;
        this.inputs.assetFiles.push(asset);
        return asset;
    }
    /**
     * Add a new asset using a single point. A buffer around the point can be created
     * using the {@code buffer} property.
     * @param location The lat/lon of the asset.
     * @param comments Any user defined comments for the asset. Can be null if there are no comments.
     */
    addPointAsset(location, comments) {
        var asset = new AssetFile();
        if (comments != null) {
            asset.comments = comments;
        }
        asset.type = AssetShapeType.POINT;
        asset.feature.push(location);
        this.inputs.assetFiles.push(asset);
        return asset;
    }
    /**
     * Add a new asset using a polygon.
     * @param locations An array of lat/lons that make up the polygon.
     * @param comments Any user defined comments for the asset. Can be null if there are no comments.
     */
    addPolygonAsset(locations, comments) {
        var asset = new AssetFile();
        if (comments != null) {
            asset.comments = comments;
        }
        asset.type = AssetShapeType.POLYGON;
        asset.feature = locations;
        this.inputs.assetFiles.push(asset);
        return asset;
    }
    /**
     * Add a new asset using a polyline. A buffer around the line can be created
     * using the {@code buffer} property.
     * @param locations An array of lat/lons that make up the polyline.
     * @param comments Any user defined comments for the asset. Can be null if there are no comments.
     */
    addPolylineAsset(locations, comments) {
        var asset = new AssetFile();
        if (comments != null) {
            asset.comments = comments;
        }
        asset.type = AssetShapeType.POLYLINE;
        asset.feature = locations;
        this.inputs.assetFiles.push(asset);
        return asset;
    }
    /**
     * Remove an asset from the job. This will not remove it from any
     * scenarios that it may be associated with.
     * @param asset The asset to remove.
     */
    removeAsset(asset) {
        var index = this.inputs.assetFiles.indexOf(asset);
        if (index != -1) {
            this.inputs.assetFiles.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Add a new target using a shapefile.
     * @param filename The location of the shapefile to use as the shape of the target.
     * @param comments Any user defined comments for the target. Can be null if there are no comments.
     * @throws If {@link SocketMsg.inlineThrowOnError} is set and {@link SocketMsg.skipFileTests} is not set a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError RangeError} will be thrown if the file doesn't exist.
     */
    addFileTarget(filename, comments) {
        var target = new TargetFile();
        if (comments != null) {
            target.comments = comments;
        }
        target.type = AssetShapeType.FILE;
        target.filename = filename;
        this.inputs.targetFiles.push(target);
        return target;
    }
    /**
     * Add a new target using a single point.
     * @param location The lat/lon of the target.
     * @param comments Any user defined comments for the target. Can be null if there are no comments.
     */
    addPointTarget(location, comments) {
        var target = new TargetFile();
        if (comments != null) {
            target.comments = comments;
        }
        target.type = AssetShapeType.POINT;
        target.feature.push(location);
        this.inputs.targetFiles.push(target);
        return target;
    }
    /**
     * Add a new target using a polygon.
     * @param locations An array of lat/lons that make up the polygon.
     * @param comments Any user defined comments for the target. Can be null if there are no comments.
     */
    addPolygonTarget(locations, comments) {
        var target = new TargetFile();
        if (comments != null) {
            target.comments = comments;
        }
        target.type = AssetShapeType.POLYGON;
        target.feature = locations;
        this.inputs.targetFiles.push(target);
        return target;
    }
    /**
     * Add a new target using a polyline.
     * @param locations An array of lat/lons that make up the polyline.
     * @param comments Any user defined comments for the asset. Can be null if there are no comments.
     */
    addPolylineTarget(locations, comments) {
        var target = new TargetFile();
        if (comments != null) {
            target.comments = comments;
        }
        target.type = AssetShapeType.POLYLINE;
        target.feature = locations;
        this.inputs.targetFiles.push(target);
        return target;
    }
    /**
     * Remove an target from the job. This will not remove it from any
     * scenarios that it may be associated with.
     * @param target The target to remove.
     */
    removeTarget(target) {
        var index = this.inputs.targetFiles.indexOf(target);
        if (index != -1) {
            this.inputs.targetFiles.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Add a scenario to the job.
     * @param startTime The start time of the scenario. If a string is used it must be formatted as 'YYYY-MM-DDThh:mm:ss'.
     * @param endTime The end time of the scenario. If a string is used it must be formatted as 'YYYY-MM-DDThh:mm:ss'.
     * @param comments An optional user created comment to attach to the scenario.
     */
    addScenario(startTime, endTime, comments) {
        let scen = new Scenario();
        if (typeof startTime === "string") {
            scen.startTime = startTime;
        }
        else {
            scen.lStartTime = startTime;
        }
        if (typeof endTime === "string") {
            scen.endTime = endTime;
        }
        else {
            scen.lEndTime = endTime;
        }
        if (comments != null) {
            scen.comments = comments;
        }
        this.inputs.scenarios.push(scen);
        return scen;
    }
    /**
     * Remove a Scenario object from the scenarios.
     * @param scenario The Scenario object to remove
     * @returns A boolean indicating if the object was found and removed
     */
    removeScenario(scenario) {
        var index = this.inputs.scenarios.indexOf(scenario);
        if (index != -1) {
            this.inputs.scenarios.splice(index, 1);
            return true;
        }
        return false;
    }
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
    addOutputGridFileToScenario(stat, filename, time, interpMethod, scen) {
        let ogf = this.outputs.newGridFile(scen);
        ogf.filename = filename;
        if (typeof time === "string") {
            ogf.outputTime = time;
        }
        else {
            if (time instanceof psaasGlobals_1.TimeRange) {
                if (typeof time.endTime === "string") {
                    ogf.outputTime = time.endTime;
                }
                else {
                    ogf.lOutputTime = time.endTime;
                }
                if (time.startTime != null) {
                    if (typeof time.startTime === "string") {
                        ogf.startOutputTime = time.startTime;
                    }
                    else {
                        ogf.lStartOutputTime = time.startTime;
                    }
                }
            }
            else {
                ogf.lOutputTime = time;
            }
        }
        ogf.scenarioName = scen.getId();
        ogf.statistic = stat;
        ogf.interpMethod = interpMethod;
        return ogf;
    }
    /**
     * Removes the output grid file from a scenario
     */
    removeOutputGridFileFromScenario(stat) {
        return this.outputs.removeOutputGridFile(stat);
    }
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
    addOutputVectorFileToScenario(type, filename, perimStartTime, perimEndTime, scen) {
        let ovf = this.outputs.newVectorFile(scen);
        ovf.filename = filename;
        ovf.type = type;
        ovf.multPerim = false;
        ovf.perimActive = false;
        if (typeof perimStartTime === "string") {
            ovf.perimStartTime = perimStartTime;
        }
        else {
            ovf.lPerimStartTime = perimStartTime;
        }
        if (typeof perimEndTime === "string") {
            ovf.perimEndTime = perimEndTime;
        }
        else {
            ovf.lPerimEndTime = perimEndTime;
        }
        return ovf;
    }
    /**
     * Removes the output vector file from a scenario
     */
    removeOutputVectorFileFromScenario(stat) {
        return this.outputs.removeOutputVectorFile(stat);
    }
    /**
     * Add a summary output file to a scenario.
     * @param scen The scenario to add the summary file to.
     * @param filename The name of the file to output to. Can either be the actual file path
     * 				   or the attachment URL returned from {@link addAttachment}
     */
    addOutputSummaryFileToScenario(scen, filename) {
        let sum = this.outputs.newSummaryFile(scen);
        sum.filename = filename;
        return sum;
    }
    /**
     * Removes the output summary file from a scenario
     */
    removeOutputSummaryFileFromScenario(stat) {
        return this.outputs.removeOutputSummaryFile(stat);
    }
    /**
     * Add a stats file to a scenario. If you want to set the type of file exported
     * instead of relying on the file extension use the {@code fileType} parameter
     * of the returned object.
     * @param scen The scenario to add the stats file to.
     * @param filename The name of the file to output to.
     * @returns The newly created stats file export.
     */
    addOutputStatsFileToScenario(scen, filename) {
        let stat = this.outputs.newStatsFile(scen);
        stat.filename = filename;
        return stat;
    }
    /**
     * Remove a stats file from a scenario.
     * @param stat The stats file to remove.
     */
    removeOutputStatsFileFromScenario(stat) {
        return this.outputs.removeOutputStatsFile(stat);
    }
    /**
     * Stream output files to the MQTT connection.
     */
    streamOutputToMqtt() {
        this.streamInfo.push(new MqttOutputStreamInfo());
    }
    /**
     * Clear the stream output files for the MQTT connection.
     */
    clearStreamOutputToMqtt() {
        var rem = [];
        for (var i = 0; i < this.streamInfo.length; i++) {
            if (this.streamInfo[i] instanceof MqttOutputStreamInfo) {
                rem.push(this.streamInfo[i]);
            }
        }
        for (var i = 0; i < rem.length; i++) {
            var index = this.inputs.scenarios.indexOf(rem[i]);
            this.inputs.scenarios.splice(index, 1);
        }
    }
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
    streamOutputToGeoServer(username, password, url, workspace, coverageStore, srs = null) {
        let geo = new GeoServerOutputStreamInfo();
        geo.coverageStore = coverageStore;
        geo.declaredSrs = srs;
        geo.password = password;
        geo.url = url;
        geo.username = username;
        geo.workspace = workspace;
        this.streamInfo.push(geo);
    }
    /**
     * Test the validity of a filename.
     * - The filename must not contain any of the following characters: \ / : * ? " < > |
     * - The filename must not begin with a dot (.)
     * - The filename may not be any of the following: nul, prn, con, aux, lpt#, com#
     * @param filename The filename to test for validity.
     */
    validateFilename(filename) {
        let rg1 = /^[^\\/:\*\?"<>\|]+$/; //don't allow \ / : * ? " < > |
        let rg2 = /^\./; //don't start with a .
        let rg3 = /^(nul|prn|con|aux|lpt[0-9]|com[1-9])(\.|$)/i; //some special dissallowed names
        return rg1.test(filename) && !rg2.test(filename) && !rg3.test(filename);
    }
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
    addAttachment(filename, contents) {
        if (!this.validateFilename(filename)) {
            return false;
        }
        let name = "attachment:/" + this.attachmentIndex + "/" + encodeURIComponent(filename);
        this.attachmentIndex = this.attachmentIndex + 1;
        let stream = new FileAttachment(name, contents);
        this.attachments.push(stream);
        return name;
    }
    /**
     * Sends the job to the job manager for execution.
     * @throws This method can only be called once at a time per instance.
     */
    beginJob(callback) {
        if (this.fetchState < 0) {
            throw new Error("Multiple concurrent reqeusts");
        }
        this.beginJobInternal((wrapper) => callback(wrapper.job, wrapper.name));
    }
    /**
     * Sends the job to the job manager for execution.
     * @returns A {@link StartJobWrapper} that contains the name of the newly
     *          started job as well as the current {@link PSaaS} object.
     * @throws This method can only be called once at a time per instance.
     */
    async beginJobPromise() {
        if (this.fetchState < 0) {
            throw new Error("Multiple concurrent reqeusts");
        }
        return await new Promise((resolve, reject) => {
            this.beginJobInternal(resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /**
     * Sends the job to the job manager for validation.
     * @throws This method can only be called once at a time per instance.
     */
    validateJob(callback) {
        if (this.fetchState < 0) {
            throw new Error("Multiple concurrent reqeusts");
        }
        this.jobOptions.validate = true;
        this.beginJobInternal((wrapper) => callback(wrapper.job, wrapper.name));
    }
    /**
     * Sends the job to the job manager for validation. The job won't run
     * completely until the user issues the rerun command later.
     * @returns A {@link StartJobWrapper} that contains the name of the newly
     * 			started job as well as the current {@link PSaaS} object.
     * @throws This method can only be called once at a time per instance.
     */
    async validateJobPromise() {
        if (this.fetchState < 0) {
            throw new Error("Multiple concurrent reqeusts");
        }
        this.jobOptions.validate = true;
        return await new Promise((resolve, reject) => {
            this.beginJobInternal(resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /*
     * This method connects to the builder and begins the job
     */
    beginJobInternal(callback, error) {
        if (!this.isValid()) {
            throw new Error('Not all required values have been set.');
        }
        this.fetchState = -1;
        let retval = "";
        let builder = net.connect({ port: psaasGlobals_1.SocketHelper.getPort(), host: psaasGlobals_1.SocketHelper.getAddress() }, () => {
            psaasGlobals_1.PSaaSLogger.getInstance().debug("connected to builder, starting job !");
            builder.write(psaasGlobals_1.SocketMsg.STARTUP + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(psaasGlobals_1.SocketMsg.BEGINDATA + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(PSaaS.PARAM_COMMENT + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(this.comments + psaasGlobals_1.SocketMsg.NEWLINE);
            for (let att of this.attachments) {
                att.stream(builder);
            }
            this.inputs.stream(builder);
            this.outputs.stream(builder);
            this.timestepSettings.stream(builder);
            for (let str of this.streamInfo) {
                str.stream(builder);
            }
            this.exportUnits.stream(builder);
            this.jobOptions.stream(builder);
            builder.write(psaasGlobals_1.SocketMsg.ENDDATA + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(psaasGlobals_1.SocketMsg.STARTJOB + psaasGlobals_1.SocketMsg.NEWLINE);
        });
        builder.on('data', (data) => {
            retval = data.toString();
            builder.write(psaasGlobals_1.SocketMsg.SHUTDOWN + psaasGlobals_1.SocketMsg.NEWLINE, (err) => {
                builder.end();
            });
        });
        if (error) {
            builder.on('error', (err) => {
                if (this.fetchState < 0) {
                    this.fetchState = 2;
                    error(err);
                    builder.end();
                }
            });
        }
        builder.on('end', () => {
            if (callback && this.fetchState < 0) {
                this.fetchState = 1;
                callback(new StartJobWrapper(this, retval));
            }
            psaasGlobals_1.PSaaSLogger.getInstance().debug("disconnected from builder");
        });
    }
}
exports.PSaaS = PSaaS;
PSaaS.PARAM_COMMENT = "GLOBALCOMMENTS";
class StartJobWrapper {
    constructor(job, name) {
        this.job = job;
        this.name = name;
    }
}
exports.StartJobWrapper = StartJobWrapper;
var StopPriority;
(function (StopPriority) {
    /** Stop the job at the soonest time available (may not occur until currently running simulations have completed). */
    StopPriority[StopPriority["NONE"] = 0] = "NONE";
    /** Stop at the soonest time available but attempt to terminate the job if still running after 5 minutes. */
    StopPriority[StopPriority["SOON"] = 1] = "SOON";
    /** Attempt to terminate the executing process immediately. */
    StopPriority[StopPriority["NOW"] = 2] = "NOW";
})(StopPriority = exports.StopPriority || (exports.StopPriority = {}));
class Admin {
    /**
     * Creates a TAR archive of the specified job. Note this does not delete the job directory.
     * @param jobname The name of the job to archive.
     */
    static archiveTar(jobname, callback) {
        (new AdminHelper()).archiveTar(jobname, callback);
    }
    /**
     * Creates a TAR archive of the specified job. Note this does not delete the job directory.
     * @param jobname The name of the job to archive.
     */
    static async archiveTarPromise(jobname) {
        await new Promise((resolve, reject) => {
            (new AdminHelper()).archiveTar(jobname, resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /**
     * Creates a ZIP archive of the specified job. Note this does not delete the job directory.
     * @param jobname The name of the job to archive.
     */
    static archiveZip(jobname, callback) {
        (new AdminHelper()).archiveZip(jobname, callback);
    }
    /**
     * Creates a ZIP archive of the specified job. Note this does not delete the job directory.
     * @param jobname The name of the job to archive.
     */
    static async archiveZipPromise(jobname) {
        await new Promise((resolve, reject) => {
            (new AdminHelper()).archiveZip(jobname, resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /**
     * Deletes the specified job directory. This is not reversible.
     * @param jobname The name of the job to delete.
     */
    static deleteJob(jobname, callback) {
        (new AdminHelper()).deleteJob(jobname, callback);
    }
    /**
     * Deletes the specified job directory. This is not reversible.
     * @param jobname The name of the job to delete.
     */
    static async deleteJobPromise(jobname) {
        await new Promise((resolve, reject) => {
            (new AdminHelper()).deleteJob(jobname, resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /**
     * Requests that a specific job stop executing.
     * @param jobname The job to stop executing.
     * @param priority The priority with which to stop the job.
     */
    static stopJob(jobname, priority = StopPriority.NONE, callback) {
        (new AdminHelper()).stopJob(jobname, priority, callback);
    }
    /**
     * Requests that a specific job stop executing.
     * @param jobname The job to stop executing.
     * @param priority The priority with which to stop the job.
     */
    static async stopJobPromise(jobname, priority = StopPriority.NONE) {
        await new Promise((resolve, reject) => {
            (new AdminHelper()).stopJob(jobname, priority, resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /**
     * Echos the list of complete jobs (both failed and succeeded) in a format that can be used in a <select> tag.
     */
    static echoCompleteJobOptions(callback) {
        (new AdminHelper()).echoCompleteJobOptions(callback);
    }
    /**
     * Echos the list of complete jobs (both failed and succeeded) in a format that can be used in a <select> tag.
     * @returns A string containing a list of `<option>` tags with the completed job list that can be used
     *          to populate a webpage.
     */
    static async echoCompleteJobOptionsPromise() {
        return await new Promise((resolve, reject) => {
            (new AdminHelper()).echoCompleteJobOptions(resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /**
     * Echos the list of running jobs in a format that can be used in a <select> tag.
     */
    static echoRunningJobOptions(callback) {
        (new AdminHelper()).echoRunningJobOptions(callback);
    }
    /**
     * Echos the list of running jobs in a format that can be used in a <select> tag.
     * @returns A string containing a list of `<option>` tags with the running job list
     *          that can be used to populate a webpage.
     */
    static async echoRunningJobOptionsPromise() {
        return await new Promise((resolve, reject) => {
            (new AdminHelper()).echoRunningJobOptions(resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /**
     * Echos the list of queued jobs in a format that can be used in a <select> tag.
     */
    static echoQueuedJobOptions(callback) {
        (new AdminHelper()).echoQueuedJobOptions(callback);
    }
    /**
     * Echos the list of queued jobs in a format that can be used in a <select> tag.
     * @returns A string containing a list of `<option>` tags with the queued job list
     *          that can be used to populate a webpage.
     */
    static async echoQueuedJobOptionsPromise() {
        return await new Promise((resolve, reject) => {
            (new AdminHelper()).echoQueuedJobOptions(resolve, reject);
        })
            .catch(err => { throw err; });
    }
}
exports.Admin = Admin;
class AdminHelper extends psaasGlobals_1.IPSaaSSerializable {
    /**
     * Creates a TAR archive of the specified job. Note this does not delete the job directory.
     * @param jobname The name of the job to archive.
     */
    archiveTar(jobname, callback, error) {
        this.fetchState = -1;
        let data = "TAR " + jobname;
        let builder = net.connect({ port: psaasGlobals_1.SocketHelper.getPort(), host: psaasGlobals_1.SocketHelper.getAddress() }, function () {
            builder.write(data + psaasGlobals_1.SocketMsg.NEWLINE, (err) => {
                builder.end();
            });
        });
        if (error) {
            builder.on('error', (err) => {
                if (this.fetchState < 0) {
                    this.fetchState = 2;
                    error(err);
                    builder.end();
                }
            });
        }
        builder.on('end', () => {
            if (callback && this.fetchState < 0) {
                this.fetchState = 1;
                callback();
            }
            psaasGlobals_1.PSaaSLogger.getInstance().debug("disconnected from builder");
        });
    }
    /**
     * Creates a ZIP archive of the specified job. Note this does not delete the job directory.
     * @param jobname The name of the job to archive.
     */
    archiveZip(jobname, callback, error) {
        this.fetchState = -1;
        let data = "ZIP " + jobname;
        let builder = net.connect({ port: psaasGlobals_1.SocketHelper.getPort(), host: psaasGlobals_1.SocketHelper.getAddress() }, function () {
            builder.write(data + psaasGlobals_1.SocketMsg.NEWLINE, (err) => {
                builder.end();
            });
        });
        if (error) {
            builder.on('error', (err) => {
                if (this.fetchState < 0) {
                    this.fetchState = 2;
                    error(err);
                    builder.end();
                }
            });
        }
        builder.on('end', () => {
            if (callback && this.fetchState < 0) {
                this.fetchState = 1;
                callback();
            }
            psaasGlobals_1.PSaaSLogger.getInstance().debug("disconnected from builder");
        });
    }
    /**
     * Deletes the specified job directory. This is not reversible.
     * @param string jobname The name of the job to delete.
     */
    deleteJob(jobname, callback, error) {
        this.fetchState = -1;
        let data = "DELETE " + jobname;
        let builder = net.connect({ port: psaasGlobals_1.SocketHelper.getPort(), host: psaasGlobals_1.SocketHelper.getAddress() }, function () {
            builder.write(data + psaasGlobals_1.SocketMsg.NEWLINE, (err) => {
                builder.end();
            });
        });
        if (error) {
            builder.on('error', (err) => {
                if (this.fetchState < 0) {
                    this.fetchState = 2;
                    error(err);
                    builder.end();
                }
            });
        }
        builder.on('end', () => {
            if (callback && this.fetchState < 0) {
                this.fetchState = 1;
                callback();
            }
            psaasGlobals_1.PSaaSLogger.getInstance().debug("disconnected from builder");
        });
    }
    /**
     * Requests that a specific job stop executing.
     * @param jobname The job to stop executing.
     * @param priority The priority with which to stop the job.
     */
    stopJob(jobname, priority = StopPriority.NONE, callback, error) {
        this.fetchState = -1;
        let data = "STOP_JOB " + jobname + "|" + priority;
        let builder = net.connect({ port: psaasGlobals_1.SocketHelper.getPort(), host: psaasGlobals_1.SocketHelper.getAddress() }, function () {
            builder.write(data + psaasGlobals_1.SocketMsg.NEWLINE, (err) => {
                builder.end();
            });
        });
        if (error) {
            builder.on('error', (err) => {
                if (this.fetchState < 0) {
                    this.fetchState = 2;
                    error(err);
                    builder.end();
                }
            });
        }
        builder.on('end', () => {
            if (callback && this.fetchState < 0) {
                this.fetchState = 1;
                callback();
            }
            psaasGlobals_1.PSaaSLogger.getInstance().debug("disconnected from builder");
        });
    }
    /**
     * Echos the list of complete jobs (both failed and succeeded) in a format that can be used in a <select> tag.
     */
    echoCompleteJobOptions(callback, error) {
        this.fetchState = -1;
        let data = "LIST_OPTIONS_COMPLETE";
        let result = "";
        let builder = net.connect({ port: psaasGlobals_1.SocketHelper.getPort(), host: psaasGlobals_1.SocketHelper.getAddress() }, function () {
            builder.write(data + psaasGlobals_1.SocketMsg.NEWLINE);
        });
        builder.on('data', (data) => {
            let job = data.toString();
            if (job.indexOf('COMPLETE') >= 0) {
                builder.end();
            }
            else {
                job = job.replace(/[\r\n]/g, '');
                result += '<option data="' + job + '">' + job + '</option>\n';
            }
        });
        if (error) {
            builder.on('error', (err) => {
                if (this.fetchState < 0) {
                    this.fetchState = 2;
                    error(err);
                    builder.end();
                }
            });
        }
        builder.on('end', () => {
            if (callback && this.fetchState < 0) {
                this.fetchState = 1;
                callback(result);
            }
            psaasGlobals_1.PSaaSLogger.getInstance().debug("disconnected from builder");
        });
    }
    /**
     * Echos the list of running jobs in a format that can be used in a <select> tag.
     */
    echoRunningJobOptions(callback, error) {
        this.fetchState = -1;
        let data = "LIST_OPTIONS_RUNNING";
        let result = "";
        let builder = net.connect({ port: psaasGlobals_1.SocketHelper.getPort(), host: psaasGlobals_1.SocketHelper.getAddress() }, function () {
            builder.write(data + psaasGlobals_1.SocketMsg.NEWLINE);
        });
        builder.on('data', (data) => {
            let job = data.toString();
            if (job.indexOf('COMPLETE') >= 0) {
                builder.end();
            }
            else {
                job = job.replace(/[\r\n]/g, '');
                result += '<option data="' + job + '">' + job + '</option>\n';
            }
        });
        if (error) {
            builder.on('error', (err) => {
                if (this.fetchState < 0) {
                    this.fetchState = 2;
                    error(err);
                    builder.end();
                }
            });
        }
        builder.on('end', () => {
            if (callback && this.fetchState < 0) {
                this.fetchState = 1;
                callback(result);
            }
            psaasGlobals_1.PSaaSLogger.getInstance().debug("disconnected from builder");
        });
    }
    /**
     * Echos the list of queued jobs in a format that can be used in a <select> tag.
     */
    echoQueuedJobOptions(callback, error) {
        this.fetchState = -1;
        let data = "LIST_OPTIONS_QUEUED";
        let result = "";
        let builder = net.connect({ port: psaasGlobals_1.SocketHelper.getPort(), host: psaasGlobals_1.SocketHelper.getAddress() }, function () {
            builder.write(data + psaasGlobals_1.SocketMsg.NEWLINE);
        });
        builder.on('data', (data) => {
            let job = data.toString();
            if (job.indexOf('COMPLETE') >= 0) {
                builder.end();
            }
            else {
                job = job.replace(/[\r\n]/g, '');
                result += '<option data="' + job + '">' + job + '</option>\n';
            }
        });
        if (error) {
            builder.on('error', (err) => {
                if (this.fetchState < 0) {
                    this.fetchState = 2;
                    error(err);
                    builder.end();
                }
            });
        }
        builder.on('end', () => {
            if (callback && this.fetchState < 0) {
                this.fetchState = 1;
                callback(result);
            }
            psaasGlobals_1.PSaaSLogger.getInstance().debug("disconnected from builder");
        });
    }
}
//# sourceMappingURL=psaasInterface.js.map