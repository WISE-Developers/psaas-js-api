"use strict";
/**
 * Global classes needed for multiple parts of the API.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.GlobalStatistics = exports.SummaryOutputs = exports.PSaaSLogger = exports.PSaaSLogLevel = exports.VectorMetadata = exports.FWIOptions = exports.FMCOptions = exports.FBPOptions = exports.FGMOptions = exports.AssetOperation = exports.Timezone = exports.TimezoneName = exports.Duration = exports.LatLon = exports.Province = exports.Units = exports.IPSaaSSerializable = exports.SocketHelper = exports.SocketMsg = void 0;
/** ignore this comment */
const net = require("net");
class SocketMsg {
}
exports.SocketMsg = SocketMsg;
SocketMsg.STARTUP = "STARTUP";
SocketMsg.SHUTDOWN = "SHUTDOWN";
SocketMsg.BEGINDATA = "BEGINDATA";
SocketMsg.ENDDATA = "ENDDATA";
SocketMsg.STARTJOB = "STARTJOB";
SocketMsg.GETDEFAULTS = "GETDEFAULTS";
SocketMsg.GETTIMEZONES = "LIST_TIMEZONES";
SocketMsg.NEWLINE = "\n";
SocketMsg.DEBUG_NO_FILETEST = false;
class SocketHelper {
    constructor() {
        this.port = 80;
        this.address = "8.8.8.8";
    }
    static getInstance() {
        if (!SocketHelper.instance) {
            SocketHelper.instance = new SocketHelper();
        }
        return SocketHelper.instance;
    }
    /**
     * Initialize the socket helper by setting the IP address and
     * port to be used to communicate with the Java builder application.
     * @param address The IP address of the computer running the Java builder application.
     * @param port The port to use to communicate with the Java builder application.
     */
    static initialize(address, port) {
        let instance = SocketHelper.getInstance();
        instance.address = address;
        instance.port = port;
    }
    /**
     * Get the IP address to attempt to communicate with the Java builder with.
     * @return The IP address that is set for the computer running the Java builder.
     */
    static getAddress() {
        let instance = SocketHelper.getInstance();
        return instance.address;
    }
    /**
     * Get the port to communicate with the Java builder over.
     * @return The port that will be used to communicate with the Java builder.
     */
    static getPort() {
        let instance = SocketHelper.getInstance();
        return instance.port;
    }
}
exports.SocketHelper = SocketHelper;
class IPSaaSSerializable {
    constructor() {
        this.fetchState = 0;
    }
}
exports.IPSaaSSerializable = IPSaaSSerializable;
var Units;
(function (Units) {
    Units[Units["UNKNOWN"] = -1] = "UNKNOWN";
    /**
     * Kilometres
     */
    Units[Units["KM"] = 0] = "KM";
    /**
     * Metres
     */
    Units[Units["M"] = 1] = "M";
    /**
     * Miles
     */
    Units[Units["MI"] = 2] = "MI";
    /**
     * Feet
     */
    Units[Units["FT"] = 3] = "FT";
    /**
     * Square Kilometres
     */
    Units[Units["KM2"] = 4] = "KM2";
    /**
     * Square Metres
     */
    Units[Units["M2"] = 5] = "M2";
    /**
     * Square Miles
     */
    Units[Units["MI2"] = 6] = "MI2";
    /**
     * Square Feet
     */
    Units[Units["FT2"] = 7] = "FT2";
    /**
     * Hectares
     */
    Units[Units["HA"] = 8] = "HA";
    /**
     * Square yards
     */
    Units[Units["YD2"] = 9] = "YD2";
    /**
     * Acres
     */
    Units[Units["ACRE"] = 10] = "ACRE";
    /**
     * Yards
     */
    Units[Units["YARD"] = 11] = "YARD";
    /**
     * Chains
     */
    Units[Units["CHAIN"] = 12] = "CHAIN";
})(Units = exports.Units || (exports.Units = {}));
var Province;
(function (Province) {
    Province["ALBERTA"] = "ab";
    Province["BRITISH_COLUMBIA"] = "bc";
    Province["MANITOBA"] = "mb";
    Province["NEW_BRUNSWICK"] = "nb";
    Province["NEWFOUNDLAND"] = "nl";
    Province["NORTHWEST_TERRITORIES"] = "nt";
    Province["NOVA_SCOTIA"] = "ns";
    Province["NUNAVUT"] = "nu";
    Province["ONTARIO"] = "on";
    Province["PRINCE_EDWARD_ISLAND"] = "pe";
    Province["QUEBEC"] = "qc";
    Province["SASKATCHEWAN"] = "sk";
    Province["YUKON_TERRITORY"] = "yt";
})(Province = exports.Province || (exports.Province = {}));
/**
 * A class to store location information.
 * @author "Travis Redpath"
 */
class LatLon {
    /**
     * Construct a new LatLon with the given latitude and longitude.
     * @param lat The latitude.
     * @param lon The longitude.
     */
    constructor(lat, lon) {
        /**
         * The locations latitude.
         */
        this.latitude = 0;
        /**
         * The locations longitude.
         */
        this.longitude = 0;
        this.latitude = lat;
        this.longitude = lon;
    }
}
exports.LatLon = LatLon;
/**
 * A class that stores information about a time duration.
 * @author "Travis Redpath"
 */
class Duration {
    constructor() {
        /**
         * The number of years in the duration. Leave as 0 or less for no years.
         */
        this.years = -1;
        /**
         * The number of months in the duration. Leave as 0 or less for no months.
         */
        this.months = -1;
        /**
         * The number of days in the duration. Leave as 0 or less for no days.
         */
        this.days = -1;
        /**
         * The number of hours in the duration. Leave as 0 or less for no hours.
         */
        this.hours = -1;
        /**
         * The number of minutes in the duration. Leave as 0 or less for no miutes.
         */
        this.minutes = -1;
        /**
         * The number of seconds in the duration. Leave as 0 or less for no seconds.
         * Fractions of a second can be specified.
         */
        this.seconds = -1;
        /**
         * Is the duration negative in direction.
         */
        this.isNegative = false;
        //protected variables for parsing strings.
        this._token = "";
        this._tokenIndex = 0;
        this._duration = "";
        /**
         * Convert the Duration into a properly formatted xml duration string.
         */
        this.toString = () => {
            let temp = "";
            if (this.isNegative) {
                temp = '-P';
            }
            else {
                temp = 'P';
            }
            if (this.years > 0) {
                temp = temp + this.years + 'Y';
            }
            if (this.months > 0) {
                temp = temp + this.months + 'M';
            }
            if (this.days > 0) {
                temp = temp + this.days + 'D';
            }
            if (this.hours > 0 || this.minutes > 0 || this.seconds > 0) {
                temp = temp + 'T';
                if (this.hours > 0) {
                    temp = temp + this.hours + 'H';
                }
                if (this.minutes > 0) {
                    temp = temp + this.minutes + 'M';
                }
                if (this.seconds > 0) {
                    temp = temp + this.seconds + 'S';
                }
            }
            if (temp === "P" || temp === "-P") {
                temp = temp + "T0S";
            }
            return temp;
        };
    }
    /**
     * Is the duration valid (at least one value has been specified).
     * @return boolean
     */
    isValid() {
        if (this.years < 0 && this.months < 0 && this.days < 0 && this.hours < 0 && this.minutes < 0 && this.seconds < 0) {
            return false;
        }
        return true;
    }
    /**
     * Is the current duration less than another.
     * @param other The other duration to compare against.
     * @internal
     */
    isLessThan(other) {
        const myDays = this.toDays();
        const otherDays = other.toDays();
        if (myDays < otherDays) {
            return true;
        }
        else if (myDays == otherDays) {
            return this.toSeconds() < other.toSeconds();
        }
        return false;
    }
    /**
     * Convert the days/hours/minutes/seconds portion of the duration into a number of seconds.
     * @returns The number of seconds represented by the duration. Will be negative if {@link Duration#isNegative} is true.
     * @internal
     */
    toSeconds() {
        let val = 0;
        if (this.seconds > 0) {
            val = val + this.seconds;
        }
        if (this.minutes > 0) {
            val = val + (60 * this.minutes);
        }
        if (this.hours > 0) {
            val = val + (3600 * this.hours);
        }
        if (this.isNegative) {
            return -val;
        }
        return val;
    }
    /**
     * Convert the years/months/days portion of the duration into a number of days. Will be an
     * approximation because the duration doesn't reference a specific year.
     * @returns The number of days represented by the duration. Will be negative if {@link Duration#isNegative} is true.
     * @internal
     */
    toDays() {
        let val = 0;
        if (this.hours > 0) {
            val = val + (this.hours / 24);
        }
        if (this.days > 0) {
            val = val + this.days;
        }
        if (this.months > 0) {
            val = val + (30 * this.months);
        }
        if (this.years > 0) {
            val = val + (365.25 * this.years);
        }
        if (this.isNegative) {
            return -val;
        }
        return val;
    }
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
    static createDateTime(years, months, days, hours, minutes, seconds, negative) {
        let v = new Duration();
        v.years = Math.round(years);
        v.months = Math.round(months);
        v.days = Math.round(days);
        v.hours = Math.round(hours);
        v.minutes = Math.round(minutes);
        v.seconds = Math.round(seconds);
        v.isNegative = negative;
        return v;
    }
    /**
     * Create a new time duration with only date parameters.
     * @param years
     * @param months
     * @param days
     * @param negative Is the duration negative in time.
     */
    static createDate(years, months, days, negative) {
        let v = new Duration();
        v.years = Math.round(years);
        v.months = Math.round(months);
        v.days = Math.round(days);
        v.isNegative = negative;
        return v;
    }
    /**
     * Create a new time duration with only time parameters.
     * @param hours
     * @param minutes
     * @param seconds
     * @param negative Is the duration negative in time.
     */
    static createTime(hours, minutes, seconds, negative) {
        let v = new Duration();
        v.hours = Math.round(hours);
        v.minutes = Math.round(minutes);
        v.seconds = Math.round(seconds);
        v.isNegative = negative;
        return v;
    }
    /**
     * Convert an xml duration string into a Duration object.
     * @param val The xml duration string. An exception will be thrown if the string is not in the correct format.
     */
    fromString(val) {
        this._tokenIndex = 0;
        this._duration = val;
        this.isNegative = false;
        this.years = -1;
        this.days = -1;
        this.months = -1;
        this.hours = -1;
        this.minutes = -1;
        this.seconds = -1;
        this._parse();
    }
    _parse() {
        this._nextToken();
        if (this._token === '-') {
            this.isNegative = true;
            this._nextToken();
        }
        if (this._token !== 'P') {
            throw new SyntaxError(`Duration '${this._duration}' is not in the xml duration format`);
        }
        this._parseDate();
    }
    _parseDate() {
        this._nextToken();
        if (this._token === 'T') {
            this._parseTime();
        }
        else if (!isNaN(+this._token)) {
            let num = '';
            while (!isNaN(+this._token)) {
                num += this._token;
                this._nextToken();
            }
            this._parseDateModifier(num);
            this._parseDate();
        }
    }
    _parseDateModifier(num) {
        if (this._token === 'Y') {
            this.years = parseInt(num);
        }
        else if (this._token === 'M') {
            this.months = parseInt(num);
        }
        else if (this._token === 'D') {
            this.days = parseInt(num);
        }
        else {
            throw new SyntaxError("Unrecognized token '${this._token}' in '${this._duration}'");
        }
    }
    _parseTime() {
        this._nextToken();
        if (!isNaN(+this._token)) {
            let num = '';
            while (!isNaN(+this._token) || this._token === '.') {
                num += this._token;
                this._nextToken();
            }
            this._parseTimeModifier(num);
            this._parseTime();
        }
    }
    _parseTimeModifier(num) {
        if (this._token === 'H') {
            this.hours = parseInt(num);
        }
        else if (this._token === 'M') {
            this.minutes = parseInt(num);
        }
        else if (this._token === 'S') {
            this.seconds = parseInt(num);
        }
        else {
            throw new SyntaxError("Unrecognized token '${this._token}' in '${this._duration}'");
        }
    }
    _nextToken() {
        if (this._tokenIndex >= this._duration.length) {
            return null;
        }
        this._token = this._duration[this._tokenIndex];
        this._tokenIndex += 1;
        return this._token;
    }
}
exports.Duration = Duration;
/**
 * A class to hold information about time zone names retrieved from Java.
 * The value is what will be passed back to the job builder.
 * @author "Travis Redpath"
 */
class TimezoneName {
    constructor() {
        /**
         * The name of the time zone to display to the user.
         */
        this.name = "";
        /**
         * A unique identifier for the time zone that can be
         * passed to the job builder in place of a time zone
         * offset.
         */
        this.value = -1;
    }
}
exports.TimezoneName = TimezoneName;
/**
 * A timezone.
 * @author "Travis Redpath"
 */
class Timezone {
    /**
     * Construct a new timezone.
     */
    constructor() {
        /**
         * Is the timezone currently in daylight savings time.
         */
        this.dst = false;
        this.offset = new Duration();
        this.value = -1;
    }
    /**
     * Is the timezone valid.
     */
    isValid() {
        let err = this.checkValid();
        return err.length == 0;
    }
    /**
     * Check to find errors in the timezone.
     */
    checkValid() {
        let errs = new Array();
        if (this.value < 0) {
            if (!this.offset.isValid()) {
                errs.push(new ValidationError("offset", "The timezone offset is not valid.", this));
            }
        }
        return errs;
    }
    /**
     * Streams the timezone to a socket.
     * @param builder A socket connection to stream to.
     */
    stream(builder) {
        let tmp = "";
        if (this.value >= 0) {
            tmp = '' + this.value;
        }
        else {
            tmp = this.offset + '|' + (+this.dst);
        }
        builder.write(Timezone.PARAM_TIMEZONE + SocketMsg.NEWLINE);
        builder.write(tmp + SocketMsg.NEWLINE);
    }
    static ParseTimezone(str) {
        let zoneList = str.split('|');
        let retval = new Array();
        for (let i = 0; i < zoneList.length;) {
            if (zoneList[i] == null || zoneList[i + 1] == null) {
                i += 2;
                continue;
            }
            let el = new TimezoneName();
            el.name = zoneList[i];
            i++;
            el.value = parseInt(zoneList[i]);
            i++;
            retval.push(el);
        }
        return retval;
    }
    /**
     * Gets a list of possible time zones from Java.
     * @return An array of timezone names.
     */
    static getTimezoneNameList(callback) {
        Timezone.getTimezoneList((str) => {
            let retval = this.ParseTimezone(str);
            if (callback) {
                callback(retval);
            }
        });
    }
    /**
     * Gets a list of possible time zones from Java.
     * @return An array of timezone names.
     */
    static async getTimezoneNameListPromise() {
        let str = await Timezone.getTimezoneListPromise();
        return this.ParseTimezone(str);
    }
    /**
     * Gets a list of the possible time zones from Java. The list is combined into
     * a single string with name/value pairs separated by a '|'.
     * @deprecated Use {@link Timezone#getTimezoneNameList()} instead.
     */
    static getTimezoneList(callback) {
        (new TimezoneGetter()).getTimezoneList(callback);
    }
    /**
     * Gets a list of the possible time zones from Java. The list is combined into
     * a single string with name/value pairs separated by a '|'.
     * @returns The list of timezone names and their UTC offsets in a single string separated by '|'.
     * @deprecated Use {@link Timezone#getTimezoneNameListPromise()} instead.
     */
    static async getTimezoneListPromise() {
        return await new Promise((resolve, reject) => {
            (new TimezoneGetter()).getTimezoneList(resolve, reject);
        })
            .catch(err => { throw err; });
    }
}
exports.Timezone = Timezone;
Timezone.PARAM_TIMEZONE = "timezone";
class TimezoneGetter extends IPSaaSSerializable {
    /*
     * This method connects to the builder and retrieves the timezones
     * @returns A List of the retrieved timezones
     */
    getTimezoneList(callback, error) {
        this.fetchState = -1;
        let retval = '';
        let builder = net.connect({ port: SocketHelper.getPort(), host: SocketHelper.getAddress() }, function () {
            PSaaSLogger.getInstance().debug("connected to builder, getting timezones !");
            builder.write(SocketMsg.GETTIMEZONES + SocketMsg.NEWLINE);
        });
        builder.on('data', (data) => {
            retval += data.toString();
            if (retval.indexOf("COMPLETE") >= 0) {
                let split = retval.split('\n');
                retval = split[0];
                builder.end();
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
                callback(retval);
            }
            PSaaSLogger.getInstance().debug("disconnected from builder");
        });
    }
}
/**
 * The affect that an asset will have on a simulation.
 */
var AssetOperation;
(function (AssetOperation) {
    AssetOperation[AssetOperation["UNDEFINED"] = -1] = "UNDEFINED";
    /**
     * The asset will have no effect on the simulation. The arrival time will be noted then the simulation will continue.
     */
    AssetOperation[AssetOperation["NO_EFFECT"] = 0] = "NO_EFFECT";
    /**
     * The simulation will stop as soon as the first asset has been reached.
     */
    AssetOperation[AssetOperation["STOP_IMMEDIATELY"] = 1] = "STOP_IMMEDIATELY";
    /**
     * The simulation will stop after a certain number of assets have been reached. The default is all assets.
     */
    AssetOperation[AssetOperation["STOP_AFTER_X"] = 2] = "STOP_AFTER_X";
})(AssetOperation = exports.AssetOperation || (exports.AssetOperation = {}));
/**
 * The fire growth model options.
 * @author "Travis Redpath"
 */
class FGMOptions {
    constructor() {
        /**
         * The maximum time step during acceleration (optional). This value must be <= 5min.
         * Has a default value.
         */
        this.maxAccTS = null;
        /**
         * The distance resolution (required). Must be between 0.2 and 10.0.
         * Has a default value.
         */
        this.distRes = null;
        /**
         * The perimeter resolution (required). Must be between 0.2 and 10.0.
         * Has a default value.
         */
        this.perimRes = null;
        /**
         * Minimum Spreading ROS (optional). Must be between 0.0000001 and 1.0.
         * Has a default value.
         */
        this.minimumSpreadingROS = null;
        /**
         * Whether to stop the fire spread when the simulated fire reaches the boundary of the grid data (required).
         * Has a default value.
         */
        this.stopAtGridEnd = null;
        /**
         * Whether breaching is turned on or off (required).
         * Has a default value.
         */
        this.breaching = null;
        /**
         * Whether using the dynamic spatial threshold algorithm is turned on or off (optional).
         * Has a default value.
         */
        this.dynamicSpatialThreshold = null;
        /**
         * Whether the spotting model should be activated (optional).
         * Has a default value.
         */
        this.spotting = null;
        /**
         * Whether internal/hidden time steps are retained.
         * Has a default value.
         */
        this.purgeNonDisplayable = null;
        /**
         * How much to nudge ignitions to perform probabilistic analyses on ignition location.
         * Primarily used when ignition information is not 100% reliable.
         * Must be between -250 and 250.
         * Has a default value.
         */
        this.dx = null;
        /**
         * How much to nudge ignitions to perform probabilistic analyses on ignition location.
         * Primarily used when ignition information is not 100% reliable.
         * Must be between -250 and 250.
         * Has a default value.
         */
        this.dy = null;
        /**
         * How much to nudge ignitions to perform probabilistic analyses on ignition location and start time.
         * Primarily used when ignition information is not 100% reliable.
         * Has a default value.
         */
        this.dt = null;
        /**
         * How much to nudge wind direction to perform probabilistic analyses on weather.
         * Applied after all patches and grids, and does not recalculate any FWI calculations.
         * Applied before any FBP calculations.
         * Provided in compass degrees, -360 to 360 is acceptable.
         * Applied to both simulations, and to instantaneous calculations as shown on the map trace view query, for consistency.
         * Primarily used when weather information does not have the expected fidelity.
         */
        this.dwd = null;
        /**
         * Whether the growth percentile value is applied (optional).
         * Has a default value.
         */
        this.growthPercentileApplied = null;
        /**
         * Growth percentile, to apply to specific fuel types (optional).
         * Has a default value.
         */
        this.growthPercentile = null;
        /**
         * The initial number of vertices used to create a polygon aroung point ignitions.
         */
        this.initialVertexCount = 16;
        /**
         * The initial size of the polygon around point ignitions, in metres.
         */
        this.ignitionSize = 0.5;
        /**
         * A global asset operation that can be used to force an asset behaviour for all attached assets.
         */
        this.globalAssetOperation = AssetOperation.UNDEFINED;
        /**
         * An asset collision count. Will allow the simulation to be stopped after a certain number of assets have been reached.
         * Only valid if globalAssetOperation in AssetOperation::STOP_AFTER_X.
         */
        this.assetCollisionCount = -1;
    }
    /**
     * Checks to see if all required values have been set.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find all errors that may exist in the FGM options.
     * @returns A list of errors that were found.
     */
    checkValid() {
        const errs = new Array();
        if (this.stopAtGridEnd == null) {
            errs.push(new ValidationError("stopAtGridEnd", "Whether to the simulation should stop if it reaches the grid boundary is not set.", this));
        }
        if (this.breaching == null) {
            errs.push(new ValidationError("breaching", "Whether breaching should be used is not set.", this));
        }
        if (this.maxAccTS == null) {
            errs.push(new ValidationError("maxAccTS", "The maximum timestep to use during acceleration is not set.", this));
        }
        else if (!this.maxAccTS.isValid()) {
            errs.push(new ValidationError("maxAccTS", "The maximum timestep to use during acceleration is not valid.", this));
        }
        if (this.spotting == null) {
            errs.push(new ValidationError("spotting", "Whether spotting should be used is not set.", this));
        }
        if (this.distRes == null) {
            errs.push(new ValidationError("distRes", "The distance resolution is not set.", this));
        }
        else if (this.distRes < 0.2 || this.distRes > 10.0) {
            errs.push(new ValidationError("distRes", "The specified distance resolution is invalid.", this));
        }
        if (this.perimRes == null) {
            errs.push(new ValidationError("perimRes", "The perimeter resolution is not set.", this));
        }
        else if (this.perimRes < 0.2 || this.perimRes > 10.0) {
            errs.push(new ValidationError("perimRes", "The perimeter resolution is not valid.", this));
        }
        if (this.minimumSpreadingROS != null) {
            if (this.minimumSpreadingROS < 0.0000001 || this.minimumSpreadingROS > 1.0) {
                errs.push(new ValidationError("minimumSpreadingROS", "The minimum spreading ROS is set but is not valid.", this));
            }
        }
        if (this.dx != null) {
            if (this.dx < -250.0 || this.dx > 250.0) {
                errs.push(new ValidationError("dx", "A delta value for the x direction of the ignition points is set but is not valid.", this));
            }
        }
        if (this.dy != null) {
            if (this.dy < -250.0 || this.dy > 250.0) {
                errs.push(new ValidationError("dy", "A delta value for the y direction of the ignition points is set but is not valid.", this));
            }
        }
        if (this.dt != null) {
            if (this.dt.hours < -4.0 || this.dt.hours > 4.0) {
                errs.push(new ValidationError("dt", "A delta value for the start time of the ignition points is set but is not valid.", this));
            }
        }
        if (this.dwd != null) {
            if (this.dwd < -360.0 || this.dwd > 360.0) {
                errs.push(new ValidationError("dwd", "A delta value for the wind direction is set but is not valid.", this));
            }
        }
        if (this.growthPercentileApplied != null && this.growthPercentileApplied) {
            if (this.growthPercentile == null || this.growthPercentile <= 0.0 || this.growthPercentile >= 100.0) {
                errs.push(new ValidationError("growthPercentile", "Growth percentile is enabled but the specified growth percentile is not valid.", this));
            }
        }
        if (this.initialVertexCount < 6 || this.initialVertexCount > 64) {
            errs.push(new ValidationError("initialVertexCount", "The specified initial vertex count is not valid.", this));
        }
        if (this.ignitionSize <= 0.0 || this.ignitionSize > 25.0) {
            errs.push(new ValidationError("ignitionSize", "The specified ignition size is not valid.", this));
            }
        if (this.globalAssetOperation == AssetOperation.STOP_AFTER_X && this.assetCollisionCount < 0) {
            errs.push(new ValidationError("assetCollisionCount", "The number of assets to stop the simulation after reaching has not been set.", this));
        }
        return errs;
    }
    /**
     * Check to see if the type is part of this class. Assign $data to the appropriate variable if it is.
     * @param type
     * @param data
     */
    tryParse(type, data) {
        if (type === FGMOptions.DEFAULT_MAXACCTS) {
            this.maxAccTS = new Duration();
            this.maxAccTS.fromString(data);
            return true;
        }
        else if (type === FGMOptions.DEFAULT_DISTRES) {
            this.distRes = parseInt(data);
            return true;
        }
        else if (type === FGMOptions.DEFAULT_PERIMRES) {
            this.perimRes = parseInt(data);
            return true;
        }
        else if (type === FGMOptions.DEFAULT_MINSPREADROS) {
            this.minimumSpreadingROS = parseFloat(data);
            return true;
        }
        else if (type === FGMOptions.DEFAULT_STOPGRIDEND) {
            this.stopAtGridEnd = !!data;
            return true;
        }
        else if (type === FGMOptions.DEFAULT_BREACHING) {
            this.breaching = !!data;
            return true;
        }
        else if (type === FGMOptions.DEFAULT_DYNAMICTHRESHOLD) {
            this.dynamicSpatialThreshold = !!data;
            return true;
        }
        else if (type === FGMOptions.DEFAULT_SPOTTING) {
            this.spotting = !!data;
            return true;
        }
        else if (type === FGMOptions.DEFAULT_PURGENONDISPLAY) {
            this.purgeNonDisplayable = !!data;
            return true;
        }
        else if (type === FGMOptions.DEFAULT_DX) {
            this.dx = parseFloat(data);
            return true;
        }
        else if (type === FGMOptions.DEFAULT_DY) {
            this.dy = parseFloat(data);
            return true;
        }
        else if (type === FGMOptions.DEFAULT_DT) {
            this.dt = new Duration();
            this.dt.fromString(data);
            return true;
        }
        else if (type === FGMOptions.DEFAULT_GROWTHAPPLIED) {
            this.growthPercentileApplied = !!data;
            return true;
        }
        else if (type === FGMOptions.DEFAULT_GROWTHPERC) {
            this.growthPercentile = parseFloat(data);
            return true;
        }
        return false;
    }
    /**
     * Streams the FGM options to a socket.
     * @param builder
     */
    stream(builder) {
        if (this.maxAccTS != null) {
            builder.write(FGMOptions.PARAM_MAXACCTS + SocketMsg.NEWLINE);
            builder.write(this.maxAccTS + SocketMsg.NEWLINE);
        }
        builder.write(FGMOptions.PARAM_DISTRES + SocketMsg.NEWLINE);
        builder.write(this.distRes + SocketMsg.NEWLINE);
        builder.write(FGMOptions.PARAM_PERIMRES + SocketMsg.NEWLINE);
        builder.write(this.perimRes + SocketMsg.NEWLINE);
        if (this.minimumSpreadingROS != null) {
            builder.write(FGMOptions.PARAM_MINSPREADROS + SocketMsg.NEWLINE);
            builder.write(this.minimumSpreadingROS + SocketMsg.NEWLINE);
        }
        builder.write(FGMOptions.PARAM_STOPGRIDEND + SocketMsg.NEWLINE);
        builder.write((+this.stopAtGridEnd) + SocketMsg.NEWLINE);
        builder.write(FGMOptions.PARAM_BREACHING + SocketMsg.NEWLINE);
        builder.write((+this.breaching) + SocketMsg.NEWLINE);
        if (this.dynamicSpatialThreshold != null) {
            builder.write(FGMOptions.PARAM_DYNAMICTHRESHOLD + SocketMsg.NEWLINE);
            builder.write((+this.dynamicSpatialThreshold) + SocketMsg.NEWLINE);
        }
        if (this.spotting != null) {
            builder.write(FGMOptions.PARAM_SPOTTING + SocketMsg.NEWLINE);
            builder.write((+this.spotting) + SocketMsg.NEWLINE);
        }
        if (this.purgeNonDisplayable != null) {
            builder.write(FGMOptions.PARAM_PURGENONDISPLAY + SocketMsg.NEWLINE);
            builder.write((+this.purgeNonDisplayable) + SocketMsg.NEWLINE);
        }
        if (this.dx != null) {
            builder.write(FGMOptions.PARAM_DX + SocketMsg.NEWLINE);
            builder.write(this.dx + SocketMsg.NEWLINE);
        }
        if (this.dy != null) {
            builder.write(FGMOptions.PARAM_DY + SocketMsg.NEWLINE);
            builder.write(this.dy + SocketMsg.NEWLINE);
        }
        if (this.dt != null) {
            builder.write(FGMOptions.PARAM_DT + SocketMsg.NEWLINE);
            builder.write(this.dt + SocketMsg.NEWLINE);
        }
        if (this.dwd != null) {
            builder.write(FGMOptions.PARAM_DWD + SocketMsg.NEWLINE);
            builder.write(this.dwd + SocketMsg.NEWLINE);
        }
        if (this.growthPercentileApplied != null) {
            builder.write(FGMOptions.PARAM_GROWTHAPPLIED + SocketMsg.NEWLINE);
            builder.write((+this.growthPercentileApplied) + SocketMsg.NEWLINE);
        }
        if (this.growthPercentile != null) {
            builder.write(FGMOptions.PARAM_GROWTHPERC + SocketMsg.NEWLINE);
            builder.write(this.growthPercentile + SocketMsg.NEWLINE);
        }
        builder.write(FGMOptions.PARAM_SIM_PROPS + SocketMsg.NEWLINE);
        builder.write((+this.ignitionSize) + "|" + this.initialVertexCount.toFixed() + "|" + this.globalAssetOperation + "|" + this.assetCollisionCount + SocketMsg.NEWLINE);
    }
    /**
     * Streams the FGM options to a socket.
     * @param builder
     */
    streamCopy(builder) {
        if (this.maxAccTS != null) {
            builder.write(FGMOptions.PARAM_MAXACCTS + SocketMsg.NEWLINE);
            builder.write(this.maxAccTS + SocketMsg.NEWLINE);
        }
        if (this.distRes != -1) {
            builder.write(FGMOptions.PARAM_DISTRES + SocketMsg.NEWLINE);
            builder.write(this.distRes + SocketMsg.NEWLINE);
        }
        if (this.perimRes != -1) {
            builder.write(FGMOptions.PARAM_PERIMRES + SocketMsg.NEWLINE);
            builder.write(this.perimRes + SocketMsg.NEWLINE);
        }
        if (this.minimumSpreadingROS != null) {
            builder.write(FGMOptions.PARAM_MINSPREADROS + SocketMsg.NEWLINE);
            builder.write(this.minimumSpreadingROS + SocketMsg.NEWLINE);
        }
        if (this.stopAtGridEnd != null) {
            builder.write(FGMOptions.PARAM_STOPGRIDEND + SocketMsg.NEWLINE);
            builder.write((+this.stopAtGridEnd) + SocketMsg.NEWLINE);
        }
        if (this.breaching != null) {
            builder.write(FGMOptions.PARAM_BREACHING + SocketMsg.NEWLINE);
            builder.write((+this.breaching) + SocketMsg.NEWLINE);
        }
        if (this.dynamicSpatialThreshold != null) {
            builder.write(FGMOptions.PARAM_DYNAMICTHRESHOLD + SocketMsg.NEWLINE);
            builder.write((+this.dynamicSpatialThreshold) + SocketMsg.NEWLINE);
        }
        if (this.spotting != null) {
            builder.write(FGMOptions.PARAM_SPOTTING + SocketMsg.NEWLINE);
            builder.write((+this.spotting) + SocketMsg.NEWLINE);
        }
        if (this.purgeNonDisplayable != null) {
            builder.write(FGMOptions.PARAM_PURGENONDISPLAY + SocketMsg.NEWLINE);
            builder.write((+this.purgeNonDisplayable) + SocketMsg.NEWLINE);
        }
        if (this.dx != null) {
            builder.write(FGMOptions.PARAM_DX + SocketMsg.NEWLINE);
            builder.write(this.dx + SocketMsg.NEWLINE);
        }
        if (this.dy != null) {
            builder.write(FGMOptions.PARAM_DY + SocketMsg.NEWLINE);
            builder.write(this.dy + SocketMsg.NEWLINE);
        }
        if (this.dt != null) {
            builder.write(FGMOptions.PARAM_DT + SocketMsg.NEWLINE);
            builder.write(this.dt + SocketMsg.NEWLINE);
        }
        if (this.growthPercentileApplied != null) {
            builder.write(FGMOptions.PARAM_GROWTHAPPLIED + SocketMsg.NEWLINE);
            builder.write((+this.growthPercentileApplied) + SocketMsg.NEWLINE);
        }
        if (this.growthPercentile != null) {
            builder.write(FGMOptions.PARAM_GROWTHPERC + SocketMsg.NEWLINE);
            builder.write(this.growthPercentile + SocketMsg.NEWLINE);
        }
        builder.write(FGMOptions.PARAM_SIM_PROPS + SocketMsg.NEWLINE);
        builder.write((+this.ignitionSize) + "|" + this.initialVertexCount.toFixed() + "|" + this.globalAssetOperation + "|" + this.assetCollisionCount + SocketMsg.NEWLINE);
        return "";
    }
}
exports.FGMOptions = FGMOptions;
FGMOptions.PARAM_MAXACCTS = "maxaccts";
FGMOptions.PARAM_DISTRES = "distres";
FGMOptions.PARAM_PERIMRES = "perimres";
FGMOptions.PARAM_MINSPREADROS = "fgm_minspreadros";
FGMOptions.PARAM_STOPGRIDEND = "stopatgridends";
FGMOptions.PARAM_BREACHING = "breaching";
FGMOptions.PARAM_DYNAMICTHRESHOLD = "fgm_dynamicthreshold";
FGMOptions.PARAM_SPOTTING = "spotting";
FGMOptions.PARAM_PURGENONDISPLAY = "fgm_purgenondisplay";
FGMOptions.PARAM_DX = "fgm_dx";
FGMOptions.PARAM_DY = "fgm_dy";
FGMOptions.PARAM_DT = "fgm_dt";
FGMOptions.PARAM_DWD = "fgm_dwd";
FGMOptions.PARAM_GROWTHAPPLIED = "fgm_growthPercApplied";
FGMOptions.PARAM_GROWTHPERC = "fgm_growthPercentile";
FGMOptions.PARAM_SIM_PROPS = "simulation_properties";
FGMOptions.DEFAULT_MAXACCTS = "MAXACCTS";
FGMOptions.DEFAULT_DISTRES = "DISTRES";
FGMOptions.DEFAULT_PERIMRES = "PERIMRES";
FGMOptions.DEFAULT_MINSPREADROS = "fgmd_minspreadros";
FGMOptions.DEFAULT_STOPGRIDEND = "STOPGRIDEND";
FGMOptions.DEFAULT_BREACHING = "BREACHING";
FGMOptions.DEFAULT_DYNAMICTHRESHOLD = "fgmd_dynamicthreshold";
FGMOptions.DEFAULT_SPOTTING = "fgmd_spotting";
FGMOptions.DEFAULT_PURGENONDISPLAY = "fgmd_purgenondisplay";
FGMOptions.DEFAULT_DX = "fgmd_dx";
FGMOptions.DEFAULT_DY = "fgmd_dy";
FGMOptions.DEFAULT_DT = "fmgd_dt";
FGMOptions.DEFAULT_GROWTHAPPLIED = "fgmd_growthPercApplied";
FGMOptions.DEFAULT_GROWTHPERC = "fgmd_growthPercentile";
/**
 * The fire behaviour prediction options.
 * @author "Travis Redpath"
 */
class FBPOptions {
    constructor() {
        /**
         * Use terrain effect (optional).
         * Has a default value.
         */
        this.terrainEffect = null;
        /**
         * Use wind effect (optional).
         */
        this.windEffect = null;
        /**
         * Checks to see if all of the required values have been set.
         */
        this.isValid = () => {
            return this.checkValid().length == 0;
        };
        /**
         * Find all errors that may be in the FBP options.
         * @returns A list of the errors that were found.
         */
        this.checkValid = () => {
            return new Array();
        };
    }
    tryParse(type, data) {
        if (type === FBPOptions.DEFAULT_TERRAINEFF) {
            this.terrainEffect = !!data;
            return true;
        }
        else if (type === FBPOptions.DEFAULT_WINDEFFECT) {
            this.windEffect = !!data;
            return true;
        }
        return false;
    }
    /**
     * Streams the FBP options to a socket.
     * @param builder
     */
    stream(builder) {
        if (this.terrainEffect != null) {
            builder.write(FBPOptions.PARAM_TERRAIN + SocketMsg.NEWLINE);
            builder.write((+this.terrainEffect) + SocketMsg.NEWLINE);
        }
        if (this.windEffect != null) {
            builder.write(FBPOptions.PARAM_WINDEFF + SocketMsg.NEWLINE);
            builder.write((+this.windEffect) + SocketMsg.NEWLINE);
        }
    }
    /**
     * Streams the FBP options to a socket.
     * @param builder
     */
    streamCopy(builder) {
        if (this.terrainEffect != null) {
            builder.write(FBPOptions.PARAM_TERRAIN + SocketMsg.NEWLINE);
            builder.write((+this.terrainEffect) + SocketMsg.NEWLINE);
        }
        if (this.windEffect != null) {
            builder.write(FBPOptions.PARAM_WINDEFF + SocketMsg.NEWLINE);
            builder.write((+this.windEffect) + SocketMsg.NEWLINE);
        }
    }
}
exports.FBPOptions = FBPOptions;
FBPOptions.PARAM_TERRAIN = "terraineffect";
FBPOptions.PARAM_WINDEFF = "windeffect";
FBPOptions.DEFAULT_TERRAINEFF = "TERRAINEFFECT";
FBPOptions.DEFAULT_WINDEFFECT = "fgmd_windeffect";
/**
 * The foliar moisture content options.
 * @author "Travis Redpath"
 */
class FMCOptions {
    constructor() {
        /**
         * The value for the FMC (%) override (optional). Must be between 0 and 300.
         * Has a default value.
         */
        this.perOverride = -1;
        /**
         * The elevation where NODATA or no grid exists (required). Must be between 0 and 7000.
         * Has a default value.
         */
        this.nodataElev = -9999;
        /**
         * Optional.
         * Has a default value.
         */
        this.terrain = null;
        /**
         * Optional.
         * Has a default value.
         * @deprecated deprecated. Always true.
         */
        this.accurateLocation = null;
    }
    /**
     * Checks to see if all required values have been set.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find all errors that may exist in the FMC options.
     * @returns A list of errors that were found.
     */
    checkValid() {
        const errs = new Array();
        if (this.nodataElev == null) {
            errs.push(new ValidationError("nodataElev", "The elevation to use where NODATA exists was not set.", this));
        }
        else if ((this.nodataElev < 0 && this.nodataElev != -9999) || this.nodataElev > 7000) {
            errs.push(new ValidationError("nodataElev", "The elevation to use where NODATA exists is invalid.", this));
        }
        if (this.perOverride != null && this.perOverride != -1) {
            if (this.perOverride < 0.0 || this.perOverride > 300.0) {
                errs.push(new ValidationError("perOverride", "The FMC percent override was set but is invalid.", this));
            }
        }
        return errs;
    }
    tryParse(type, data) {
        if (type === FMCOptions.DEFAULT_PEROVER) {
            this.perOverride = parseFloat(data);
            return true;
        }
        else if (type === FMCOptions.DEFAULT_NODATAELEV) {
            this.nodataElev = parseFloat(data);
            return true;
        }
        else if (type === FMCOptions.DEFAULT_TERRAIN) {
            this.terrain = !!data;
            return true;
        }
        else if (type === FMCOptions.DEFAULT_ACCURATELOCATION) {
            this.accurateLocation = !!data;
            return true;
        }
        return false;
    }
    /**
     * Streams the FMC options to a socket.
     * @param builder
     */
    stream(builder) {
        if (this.perOverride != null && this.perOverride >= 0) {
            builder.write(FMCOptions.PARAM_PEROVER + SocketMsg.NEWLINE);
            builder.write(this.perOverride + SocketMsg.NEWLINE);
        }
        builder.write(FMCOptions.PARAM_NODATAELEV + SocketMsg.NEWLINE);
        builder.write(this.nodataElev + SocketMsg.NEWLINE);
        if (this.terrain != null) {
            builder.write(FMCOptions.PARAM_TERRAIN + SocketMsg.NEWLINE);
            builder.write((+this.terrain) + SocketMsg.NEWLINE);
        }
    }
    /**
     * Streams the FMC options to a socket.
     * @param builder
     */
    streamCopy(builder) {
        if (this.perOverride != null && this.perOverride >= 0) {
            builder.write(FMCOptions.PARAM_PEROVER + SocketMsg.NEWLINE);
            builder.write(this.perOverride + SocketMsg.NEWLINE);
        }
        if (this.nodataElev != null && this.nodataElev != -9999) {
            builder.write(FMCOptions.PARAM_NODATAELEV + SocketMsg.NEWLINE);
            builder.write(this.nodataElev + SocketMsg.NEWLINE);
        }
        if (this.terrain != null) {
            builder.write(FMCOptions.PARAM_TERRAIN + SocketMsg.NEWLINE);
            builder.write((+this.terrain) + SocketMsg.NEWLINE);
        }
    }
}
exports.FMCOptions = FMCOptions;
FMCOptions.PARAM_PEROVER = "peroverride";
FMCOptions.PARAM_NODATAELEV = "nodataelev";
FMCOptions.PARAM_TERRAIN = "fmc_terrain";
FMCOptions.DEFAULT_PEROVER = "PEROVERRIDEVAL";
FMCOptions.DEFAULT_NODATAELEV = "NODATAELEV";
FMCOptions.DEFAULT_TERRAIN = "fmcd_terrain";
FMCOptions.DEFAULT_ACCURATELOCATION = "fmcd_accuratelocation";
/**
 * The fire weather index options.
 * @author "Travis Redpath"
 */
class FWIOptions {
    constructor() {
        /**
         * Apply spatial interpolation to FWI values (optional).
         * Has a default value.
         */
        this.fwiSpacInterp = null;
        /**
         * Calculate FWI values from temporally interpolated weather (optional).
         * Has a default value.
         */
        this.fwiFromSpacWeather = null;
        /**
         * Apply history to FWI values affected by patches, grids, etc. (optional).
         * Has a default value.
         */
        this.historyOnEffectedFWI = null;
        /**
         * Use burning conditions (optional).
         */
        this.burningConditionsOn = null;
        /**
         * Apply spatial interpolation to FWI values (optional).
         */
        this.fwiTemporalInterp = null;
    }
    /**
     * Checks to see if all required values have been set.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find all errors that may exist in the FWI options.
     * @returns A list of errors that were found.
     */
    checkValid() {
        return new Array();
    }
    tryParse(type, data) {
        if (type === FWIOptions.DEFAULT_FWISPACINTERP) {
            this.fwiSpacInterp = !!data;
            return true;
        }
        else if (type === FWIOptions.DEFAULT_FWIFROMSPACWEATH) {
            this.fwiFromSpacWeather = !!data;
            return true;
        }
        else if (type === FWIOptions.DEFAULT_HISTORYONFWI) {
            this.historyOnEffectedFWI = !!data;
            return true;
        }
        else if (type === FWIOptions.DEFAULT_BURNINGCONDITIONSON) {
            this.burningConditionsOn = !!data;
            return true;
        }
        else if (type === FWIOptions.DEFAULT_TEMPORALINTERP) {
            this.fwiTemporalInterp = !!data;
            return true;
        }
        return false;
    }
    /**
     * Streams the FWI options to a socket.
     * @param builder
     */
    stream(builder) {
        if (this.fwiSpacInterp != null) {
            builder.write(FWIOptions.PARAM_FWISPACIAL + SocketMsg.NEWLINE);
            builder.write((+this.fwiSpacInterp) + SocketMsg.NEWLINE);
        }
        if (this.fwiFromSpacWeather != null) {
            builder.write(FWIOptions.PARAM_FWIFROMSPACIAL + SocketMsg.NEWLINE);
            builder.write((+this.fwiFromSpacWeather) + SocketMsg.NEWLINE);
        }
        if (this.historyOnEffectedFWI != null) {
            builder.write(FWIOptions.PARAM_HISTORYFWI + SocketMsg.NEWLINE);
            builder.write((+this.historyOnEffectedFWI) + SocketMsg.NEWLINE);
        }
        if (this.burningConditionsOn != null) {
            builder.write(FWIOptions.PARAM_BURNINGCONDON + SocketMsg.NEWLINE);
            builder.write((+this.burningConditionsOn) + SocketMsg.NEWLINE);
        }
        if (this.fwiTemporalInterp != null) {
            builder.write(FWIOptions.PARAM_FWITEMPORALINTERP + SocketMsg.NEWLINE);
            builder.write((+this.fwiTemporalInterp) + SocketMsg.NEWLINE);
        }
    }
}
exports.FWIOptions = FWIOptions;
FWIOptions.PARAM_FWISPACIAL = "fwispacinterp";
FWIOptions.PARAM_FWIFROMSPACIAL = "fwifromspacweather";
FWIOptions.PARAM_HISTORYFWI = "historyonfwi";
FWIOptions.PARAM_BURNINGCONDON = "burningconditionon";
FWIOptions.PARAM_FWITEMPORALINTERP = "fwitemporalinterp";
FWIOptions.DEFAULT_FWISPACINTERP = "FWISPACINTERP";
FWIOptions.DEFAULT_FWIFROMSPACWEATH = "FWIFROMSPACWEATH";
FWIOptions.DEFAULT_HISTORYONFWI = "HISTORYONFWI";
FWIOptions.DEFAULT_BURNINGCONDITIONSON = "fwid_burnconditions";
FWIOptions.DEFAULT_TEMPORALINTERP = "fwid_tempinterp";
/**
 * Possible metadata that could be written to vector files.
 * @author "Travis Redpath"
 */
class VectorMetadata {
    constructor() {
        /**
         * PSaaS version and build date (required).
         * Has a default value.
         */
        this.version = null;
        /**
         * Scenario name (required).
         * Has a default value.
         */
        this.scenName = null;
        /**
         * Job name (required).
         * Has a default value.
         */
        this.jobName = null;
        /**
         * Ignition name(s) (required).
         * Has a default value.
         */
        this.igName = null;
        /**
         * Simulated date/time (required).
         * Has a default value.
         */
        this.simDate = null;
        /**
         * Fire size (area) (required).
         * Has a default value.
         */
        this.fireSize = null;
        /**
         * Total perimeter (required).
         * Has a default value.
         */
        this.perimTotal = null;
        /**
         * Active perimeter (required).
         * Has a default value.
         */
        this.perimActive = null;
        /**
         * Units of measure for area outputs (required). Must be one of the area values defined in the UNITS class.
         * Has a default value.
         * @deprecated Use the global unit settings instead. Will be removed in the future.
         */
        this.areaUnit = Units.UNKNOWN;
        /**
         * Units of measure for perimeter outputs (required). Must be one of the distance values defined in the UNITS class.
         * Has a default value.
         * @deprecated Use the global unit settings instead. Will be removed in the future.
         */
        this.perimUnit = Units.UNKNOWN;
        /**
         * Include the weather information in the output vector file (optional).
         */
        this.wxValues = null;
        /**
         * Include the FWI values in the output vector file (optional).
         */
        this.fwiValues = null;
        /**
         * Include the location of the ignition that created the perimeter in the vector file (optional).
         */
        this.ignitionLocation = null;
        /**
         * Add the max burn distance for each perimeter to the vector file (optional).
         */
        this.maxBurnDistance = null;
        /**
         * Pass ignition attributes from the input ignition file to the output perimeter (optional).
         */
        this.ignitionAttributes = null;
        /**
         * The time that the fire front reached an asset and the simulation stopped (optional).
         */
        this.assetArrivalTime = null;
        /**
         * The number of assets that were reached when the simulation stopped, if any (optional).
         */
        this.assetArrivalCount = null;
        /**
         * Add a column of 0s and 1s to indicate if a perimeter is the final perimeter of a simulation
         * or an intermediate step.
         */
        this.identifyFinalPerimeter = null;
    }
    /**
     * Checks to see if all required values have been set.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    checkValid() {
        const errs = new Array();
        if (this.version == null) {
            errs.push(new ValidationError("version", "Whether the Prometheus version metadata should be exported or not has not been set.", this));
        }
        if (this.scenName == null) {
            errs.push(new ValidationError("version", "Whether the scenario name metadata should be exported or not has not been set.", this));
        }
        if (this.jobName == null) {
            errs.push(new ValidationError("version", "Whether the job name metadata should be exported or not has not been set.", this));
        }
        if (this.igName == null) {
            errs.push(new ValidationError("version", "Whether the ignition name metadata should be exported or not has not been set.", this));
        }
        if (this.simDate == null) {
            errs.push(new ValidationError("version", "Whether the simulation date metadata should be exported or not has not been set.", this));
        }
        if (this.fireSize == null) {
            errs.push(new ValidationError("version", "Whether the fire area metadata should be exported or not has not been set.", this));
        }
        if (this.perimTotal == null) {
            errs.push(new ValidationError("version", "Whether the total perimeter size metadata should be exported or not has not been set.", this));
        }
        if (this.perimActive == null) {
            errs.push(new ValidationError("version", "Whether the active perimeter size metadata should be exported or not has not been set.", this));
        }
        if (this.areaUnit != Units.FT2 && this.areaUnit != Units.KM2 && this.areaUnit != Units.M2 && this.areaUnit != Units.MI2 &&
            this.areaUnit != Units.HA && this.areaUnit != Units.YD2 && this.areaUnit != Units.ACRE) {
            errs.push(new ValidationError("areaUnit", "Invalid unit for area metadata.", this));
        }
        if (this.perimUnit != Units.FT && this.perimUnit != Units.KM && this.perimUnit != Units.M && this.perimUnit != Units.MI &&
            this.perimUnit != Units.YARD && this.perimUnit != Units.CHAIN) {
            errs.push(new ValidationError("areaUnit", "Invalid unit for perimeter size metadata.", this));
        }
        return errs;
    }
    tryParse(type, data) {
        if (type === VectorMetadata.DEFAULT_VERSION) {
            this.version = !!data;
            return true;
        }
        else if (type === VectorMetadata.DEFAULT_SCENNAME) {
            this.scenName = !!data;
            return true;
        }
        else if (type === VectorMetadata.DEFAULT_JOBNAME) {
            this.jobName = !!data;
            return true;
        }
        else if (type === VectorMetadata.DEFAULT_IGNAME) {
            this.igName = !!data;
            return true;
        }
        else if (type === VectorMetadata.DEFAULT_SIMDATE) {
            this.simDate = !!data;
            return true;
        }
        else if (type === VectorMetadata.DEFAULT_FIRESIZE) {
            this.fireSize = !!data;
            return true;
        }
        else if (type === VectorMetadata.DEFAULT_PERIMTOTAL) {
            this.perimTotal = !!data;
            return true;
        }
        else if (type === VectorMetadata.DEFAULT_PERIMACTIVE) {
            this.perimActive = !!data;
            return true;
        }
        else if (type === VectorMetadata.DEFAULT_AREAUNIT) {
            this.areaUnit = parseInt(data);
            return true;
        }
        else if (type === VectorMetadata.DEFAULT_PERIMUNIT) {
            this.perimUnit = parseInt(data);
            return true;
        }
        return false;
    }
}
exports.VectorMetadata = VectorMetadata;
VectorMetadata.DEFAULT_VERSION = "VERSION";
VectorMetadata.DEFAULT_SCENNAME = "SCENNAME";
VectorMetadata.DEFAULT_JOBNAME = "JOBNAME";
VectorMetadata.DEFAULT_IGNAME = "IGNAME";
VectorMetadata.DEFAULT_SIMDATE = "SIMDATE";
VectorMetadata.DEFAULT_FIRESIZE = "FIRESIZE";
VectorMetadata.DEFAULT_PERIMTOTAL = "PERIMTOTAL";
VectorMetadata.DEFAULT_PERIMACTIVE = "PERIMACTIVE";
VectorMetadata.DEFAULT_AREAUNIT = "AREAUNIT";
VectorMetadata.DEFAULT_PERIMUNIT = "PERIMUNIT";
var PSaaSLogLevel;
(function (PSaaSLogLevel) {
    PSaaSLogLevel[PSaaSLogLevel["VERBOSE"] = 1] = "VERBOSE";
    PSaaSLogLevel[PSaaSLogLevel["DEBUG"] = 2] = "DEBUG";
    PSaaSLogLevel[PSaaSLogLevel["INFO"] = 3] = "INFO";
    PSaaSLogLevel[PSaaSLogLevel["WARN"] = 4] = "WARN";
    PSaaSLogLevel[PSaaSLogLevel["NONE"] = 5] = "NONE";
})(PSaaSLogLevel = exports.PSaaSLogLevel || (exports.PSaaSLogLevel = {}));
class PSaaSLogger {
    constructor() {
        this.level = PSaaSLogLevel.WARN;
    }
    static getInstance() {
        if (PSaaSLogger.instance == null) {
            PSaaSLogger.instance = new PSaaSLogger();
        }
        return PSaaSLogger.instance;
    }
    setLogLevel(level) {
        this.level = level;
    }
    /*
     * Sets the log level back to the default, WARN
     */
    unsetLogLevel() {
        this.level = PSaaSLogLevel.WARN;
        ;
    }
    error(message) {
        if (this.level <= PSaaSLogLevel.VERBOSE) {
            console.log("[verbose] " + new Date().toISOString() + " . " + message);
        }
    }
    debug(message) {
        if (this.level <= PSaaSLogLevel.DEBUG) {
            console.log("[debug]   " + new Date().toISOString() + " . " + message);
        }
    }
    info(message) {
        if (this.level <= PSaaSLogLevel.INFO) {
            console.log("[info]    " + new Date().toISOString() + " . " + message);
        }
    }
    warn(message) {
        if (this.level <= PSaaSLogLevel.WARN) {
            console.log("[warn]    " + new Date().toISOString() + " . " + message);
        }
    }
}
exports.PSaaSLogger = PSaaSLogger;
PSaaSLogger.instance = null;
/**
 * Which summary values to output.
 * @author "Travis Redpath"
 */
class SummaryOutputs {
    constructor() {
        /**
         * Application information (optional).
         * Has a default value.
         */
        this.outputApplication = null;
        /**
         * Grid information (cell size, dimensions) (optional).
         * Has a default value.
         */
        this.outputGeoData = null;
        /**
         * Scenario Information (optional).
         * Has a default value.
         */
        this.outputScenario = null;
        /**
         * Scenario comments (optional).
         * Has a default value.
         */
        this.outputScenarioComments = null;
        /**
         * Inputs (optional).
         * Has a default value.
         */
        this.outputInputs = null;
        /**
         * Landscape information (optional).
         */
        this.outputLandscape = null;
        /**
         * Fuel patch information (optional).
         */
        this.outputFBPPatches = null;
        /**
         * Wx patches and grids information (optional).
         */
        this.outputWxPatches = null;
        /**
         * Ignition information (optional).
         */
        this.outputIgnitions = null;
        /**
         * Wx stream information (optional).
         */
        this.outputWxStreams = null;
        /**
         * Fuel type information (optional).
         */
        this.outputFBP = null;
        /**
         * Wx stream data (temperature, RH, etc.) (optional).
         */
        this.outputWxData = null;
        /**
         * Asset related information (asset file reference) (optional).
         */
        this.outputAssetInfo = null;
    }
    /**
     * Checks to see if all required values have been set.
     */
    isValid() {
        return this.checkValid().length == 0;
    }
    /**
     * Find all errors that may exist in the summary output settings.
     * @returns A list of all errors that were found.
     */
    checkValid() {
        return [];
    }
    tryParse(type, data) {
        //TODO parse
        return false;
    }
}
exports.SummaryOutputs = SummaryOutputs;
SummaryOutputs.DEFAULT_TIMETOEXEC = "TIMETOEXEC";
SummaryOutputs.DEFAULT_GRIDINFO = "GRIDINFO";
SummaryOutputs.DEFAULT_LOCATION = "LOCATION";
SummaryOutputs.DEFAULT_ELEVINFO = "ELEVINFO";
SummaryOutputs.DEFAULT_INPUTSUM = "INPUTSUMMARY";
/**
 * All supported statistics values that can be used across the API.
 * Not all locations will support all statistics.
 */
var GlobalStatistics;
(function (GlobalStatistics) {
    GlobalStatistics[GlobalStatistics["DATE_TIME"] = 0] = "DATE_TIME";
    GlobalStatistics[GlobalStatistics["ELAPSED_TIME"] = 1] = "ELAPSED_TIME";
    GlobalStatistics[GlobalStatistics["TIME_STEP_DURATION"] = 2] = "TIME_STEP_DURATION";
    GlobalStatistics[GlobalStatistics["TEMPERATURE"] = 3] = "TEMPERATURE";
    GlobalStatistics[GlobalStatistics["DEW_POINT"] = 4] = "DEW_POINT";
    GlobalStatistics[GlobalStatistics["RELATIVE_HUMIDITY"] = 5] = "RELATIVE_HUMIDITY";
    GlobalStatistics[GlobalStatistics["WIND_SPEED"] = 6] = "WIND_SPEED";
    GlobalStatistics[GlobalStatistics["WIND_DIRECTION"] = 7] = "WIND_DIRECTION";
    GlobalStatistics[GlobalStatistics["PRECIPITATION"] = 8] = "PRECIPITATION";
    GlobalStatistics[GlobalStatistics["HFFMC"] = 9] = "HFFMC";
    GlobalStatistics[GlobalStatistics["HISI"] = 10] = "HISI";
    GlobalStatistics[GlobalStatistics["DMC"] = 11] = "DMC";
    GlobalStatistics[GlobalStatistics["DC"] = 12] = "DC";
    GlobalStatistics[GlobalStatistics["HFWI"] = 13] = "HFWI";
    GlobalStatistics[GlobalStatistics["BUI"] = 14] = "BUI";
    GlobalStatistics[GlobalStatistics["FFMC"] = 15] = "FFMC";
    GlobalStatistics[GlobalStatistics["ISI"] = 16] = "ISI";
    GlobalStatistics[GlobalStatistics["FWI"] = 17] = "FWI";
    GlobalStatistics[GlobalStatistics["TIMESTEP_AREA"] = 18] = "TIMESTEP_AREA";
    GlobalStatistics[GlobalStatistics["TIMESTEP_BURN_AREA"] = 19] = "TIMESTEP_BURN_AREA";
    GlobalStatistics[GlobalStatistics["TOTAL_AREA"] = 20] = "TOTAL_AREA";
    /**
     * Total area of the fire. (sq. metres)
     */
    GlobalStatistics[GlobalStatistics["TOTAL_BURN_AREA"] = 21] = "TOTAL_BURN_AREA";
    /**
     * Rate of change in the fire area. (sq. metres)
     */
    GlobalStatistics[GlobalStatistics["AREA_GROWTH_RATE"] = 22] = "AREA_GROWTH_RATE";
    /**
     * Total exterior fire perimeter, including active and inactive portions. (metres)
     */
    GlobalStatistics[GlobalStatistics["EXTERIOR_PERIMETER"] = 23] = "EXTERIOR_PERIMETER";
    /**
     * Rate of change in the exterior perimeter growth rate. (metres per minute)
     */
    GlobalStatistics[GlobalStatistics["EXTERIOR_PERIMETER_GROWTH_RATE"] = 24] = "EXTERIOR_PERIMETER_GROWTH_RATE";
    /**
     * Portion of the fire front considered active (interior and exterior) (where 1 or both vertices are active). (metres)
     */
    GlobalStatistics[GlobalStatistics["ACTIVE_PERIMETER"] = 25] = "ACTIVE_PERIMETER";
    /**
     * Rate of change in the active perimeter growth rate. (metres per minute)
     */
    GlobalStatistics[GlobalStatistics["ACTIVE_PERIMETER_GROWTH_RATE"] = 26] = "ACTIVE_PERIMETER_GROWTH_RATE";
    /**
     * Total fire perimeter, including interior and exterior and active/inactive portions. (metres)
     */
    GlobalStatistics[GlobalStatistics["TOTAL_PERIMETER"] = 27] = "TOTAL_PERIMETER";
    /**
     * Rate of change in the total perimeter growth rate. (metres per minute)
     */
    GlobalStatistics[GlobalStatistics["TOTAL_PERIMETER_GROWTH_RATE"] = 28] = "TOTAL_PERIMETER_GROWTH_RATE";
    GlobalStatistics[GlobalStatistics["FI_LT_10"] = 29] = "FI_LT_10";
    GlobalStatistics[GlobalStatistics["FI_10_500"] = 30] = "FI_10_500";
    GlobalStatistics[GlobalStatistics["FI_500_2000"] = 31] = "FI_500_2000";
    GlobalStatistics[GlobalStatistics["FI_2000_4000"] = 32] = "FI_2000_4000";
    GlobalStatistics[GlobalStatistics["FI_4000_10000"] = 33] = "FI_4000_10000";
    GlobalStatistics[GlobalStatistics["FI_GT_10000"] = 34] = "FI_GT_10000";
    GlobalStatistics[GlobalStatistics["ROS_0_1"] = 35] = "ROS_0_1";
    GlobalStatistics[GlobalStatistics["ROS_2_4"] = 36] = "ROS_2_4";
    GlobalStatistics[GlobalStatistics["ROS_5_8"] = 37] = "ROS_5_8";
    GlobalStatistics[GlobalStatistics["ROS_9_14"] = 38] = "ROS_9_14";
    GlobalStatistics[GlobalStatistics["ROS_GT_15"] = 39] = "ROS_GT_15";
    /**
     * Maximum rate of spread calculated from Dr. Richards' ellipse equations (metres per minute).
     */
    GlobalStatistics[GlobalStatistics["MAX_ROS"] = 40] = "MAX_ROS";
    GlobalStatistics[GlobalStatistics["MAX_FI"] = 41] = "MAX_FI";
    /**
     * Maximum flame length (metres), based on ROS from Dr. Richards' ellipse equations.
     */
    GlobalStatistics[GlobalStatistics["MAX_FL"] = 42] = "MAX_FL";
    /**
     * Maximum crown fraction burned (unitless), based on ROS from Dr. Richards' ellipse equations.
     */
    GlobalStatistics[GlobalStatistics["MAX_CFB"] = 43] = "MAX_CFB";
    /**
     * Maximum crown fuel consumption (kg/m2), based on ROS from Dr. Richards' ellipse equations.
     */
    GlobalStatistics[GlobalStatistics["MAX_CFC"] = 44] = "MAX_CFC";
    /**
     * Maximum surface fuel consumption (kg/m2), based on ROS from Dr. Richards' ellipse equations.
     */
    GlobalStatistics[GlobalStatistics["MAX_SFC"] = 45] = "MAX_SFC";
    /**
     * Maximum total fuel consumption (kg/m2), based on ROS from Dr. Richards' ellipse equations.
     */
    GlobalStatistics[GlobalStatistics["MAX_TFC"] = 46] = "MAX_TFC";
    GlobalStatistics[GlobalStatistics["TOTAL_FUEL_CONSUMED"] = 47] = "TOTAL_FUEL_CONSUMED";
    GlobalStatistics[GlobalStatistics["CROWN_FUEL_CONSUMED"] = 48] = "CROWN_FUEL_CONSUMED";
    GlobalStatistics[GlobalStatistics["SURFACE_FUEL_CONSUMED"] = 49] = "SURFACE_FUEL_CONSUMED";
    /**
     * Number of active vertices defining the fire perimeter(s).
     */
    GlobalStatistics[GlobalStatistics["NUM_ACTIVE_VERTICES"] = 50] = "NUM_ACTIVE_VERTICES";
    /**
     * Number of vertices defining the fire perimeter(s).
     */
    GlobalStatistics[GlobalStatistics["NUM_VERTICES"] = 51] = "NUM_VERTICES";
    /**
     * Total, cumulative number of verticies defining the simulation's perimeters.
     */
    GlobalStatistics[GlobalStatistics["CUMULATIVE_VERTICES"] = 52] = "CUMULATIVE_VERTICES";
    /**
     * Cumulative number of active vertices defining the fire perimeter(s).
     */
    GlobalStatistics[GlobalStatistics["CUMULATIVE_ACTIVE_VERTICES"] = 53] = "CUMULATIVE_ACTIVE_VERTICES";
    /**
     * Number of fire fronts (interior and exterior) which have at least 1 active vertex.
     */
    GlobalStatistics[GlobalStatistics["NUM_ACTIVE_FRONTS"] = 54] = "NUM_ACTIVE_FRONTS";
    /**
     * Number of fire fronts (interior and exterior).
     */
    GlobalStatistics[GlobalStatistics["NUM_FRONTS"] = 55] = "NUM_FRONTS";
    GlobalStatistics[GlobalStatistics["MEMORY_USED_START"] = 56] = "MEMORY_USED_START";
    GlobalStatistics[GlobalStatistics["MEMORY_USED_END"] = 57] = "MEMORY_USED_END";
    GlobalStatistics[GlobalStatistics["NUM_TIMESTEPS"] = 58] = "NUM_TIMESTEPS";
    GlobalStatistics[GlobalStatistics["NUM_DISPLAY_TIMESTEPS"] = 59] = "NUM_DISPLAY_TIMESTEPS";
    GlobalStatistics[GlobalStatistics["NUM_EVENT_TIMESTEPS"] = 60] = "NUM_EVENT_TIMESTEPS";
    GlobalStatistics[GlobalStatistics["NUM_CALC_TIMESTEPS"] = 61] = "NUM_CALC_TIMESTEPS";
    /**
     * Number of real-time (clock) seconds to calculate the current display time step.
     */
    GlobalStatistics[GlobalStatistics["TICKS"] = 62] = "TICKS";
    /**
     * Number of real-time (clock) seconds to calculate all display time steps.
     */
    GlobalStatistics[GlobalStatistics["PROCESSING_TIME"] = 63] = "PROCESSING_TIME";
    /**
     * Number of simulated seconds that burning was allowed since the start of the simulation.
     */
    GlobalStatistics[GlobalStatistics["GROWTH_TIME"] = 64] = "GROWTH_TIME";
    GlobalStatistics[GlobalStatistics["RAZ"] = 65] = "RAZ";
    GlobalStatistics[GlobalStatistics["BURN_GRID"] = 66] = "BURN_GRID";
    GlobalStatistics[GlobalStatistics["FIRE_ARRIVAL_TIME"] = 67] = "FIRE_ARRIVAL_TIME";
    GlobalStatistics[GlobalStatistics["FIRE_ARRIVAL_TIME_MIN"] = 68] = "FIRE_ARRIVAL_TIME_MIN";
    GlobalStatistics[GlobalStatistics["FIRE_ARRIVAL_TIME_MAX"] = 69] = "FIRE_ARRIVAL_TIME_MAX";
    GlobalStatistics[GlobalStatistics["HROS"] = 70] = "HROS";
    GlobalStatistics[GlobalStatistics["FROS"] = 71] = "FROS";
    GlobalStatistics[GlobalStatistics["BROS"] = 72] = "BROS";
    GlobalStatistics[GlobalStatistics["RSS"] = 73] = "RSS";
    GlobalStatistics[GlobalStatistics["RADIATIVE_POWER"] = 74] = "RADIATIVE_POWER";
    /**
     * Maximum fire intensity, based on ROS the standard FBP equations.
     */
    GlobalStatistics[GlobalStatistics["HFI"] = 75] = "HFI";
    /**
     * Maximum crown fraction burned (unitless), based on ROS from standard FBP equations.
     */
    GlobalStatistics[GlobalStatistics["HCFB"] = 76] = "HCFB";
    /**
     * The current simulation time as of the end of the timestep.
     */
    GlobalStatistics[GlobalStatistics["CURRENT_TIME"] = 77] = "CURRENT_TIME";
    /**
     * The name of the scenario that is reporting statistics.
     */
    GlobalStatistics[GlobalStatistics["SCENARIO_NAME"] = 78] = "SCENARIO_NAME";
    GlobalStatistics[GlobalStatistics["BURN_PERCENTAGE"] = 79] = "BURN_PERCENTAGE";
    /**
     * Change in the total perimeter growth. (metres)
     */
    GlobalStatistics[GlobalStatistics["TOTAL_PERIMETER_CHANGE"] = 80] = "TOTAL_PERIMETER_CHANGE";
    /**
     * Change in the exterior perimeter growth. (metres)
     */
    GlobalStatistics[GlobalStatistics["EXTERIOR_PERIMETER_CHANGE"] = 81] = "EXTERIOR_PERIMETER_CHANGE";
    /**
     * Change in the active perimeter growth. (metres)
     */
    GlobalStatistics[GlobalStatistics["ACTIVE_PERIMETER_CHANGE"] = 82] = "ACTIVE_PERIMETER_CHANGE";
    /**
     * Change in fire area. (sq. metres)
     */
    GlobalStatistics[GlobalStatistics["AREA_CHANGE"] = 83] = "AREA_CHANGE";
    GlobalStatistics[GlobalStatistics["BURN"] = 84] = "BURN";
})(GlobalStatistics = exports.GlobalStatistics || (exports.GlobalStatistics = {}));
class ValidationError {
    constructor(propertyName, message, object) {
        this.children = new Array();
        this.propertyName = propertyName;
        this.message = message;
        this.object = object;
    }
    addChild(child) {
        this.children.push(child);
    }
    getValue() {
        if (this.propertyName == null) {
            return this;
        }
        return this.object[this.propertyName];
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=psaasGlobals.js.map