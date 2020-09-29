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
/** ignore this comment */
const fs = require("fs");
const net = require("net");
const psaasGlobals_1 = require("./psaasGlobals");
class VersionInfo {
}
VersionInfo.version_info = '6.2.5.7' /*/vers*/;
VersionInfo.release_date = 'date' /*/rld*/;
exports.VersionInfo = VersionInfo;
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
        this.comment = "";
        /**
         * The type of grid file (required).
         */
        this.type = GridFileType.NONE;
        /**
         * The location of the file containing the grid data (required).
         */
        this.filename = "";
        /**
         * The projection file for the grid file (required).
         */
        this.projection = "";
        this.id = "grdfl" + GridFile.counter;
        GridFile.counter += 1;
    }
    getId() {
        return this.id;
    }
    /**
     * Set the name of the grid file. This name must be unique within
     * the simulation. The name will get a default value when the
     * grid file is constructed but can be overriden with this method.
     */
    setName(name) {
        this.id = name.replace(/\|/g, "");
    }
    /**
     * Are all required values set.
     */
    isValid() {
        if (!this.id || this.id.length === 0) {
            return false;
        }
        if (this.type < GridFileType.FUEL_GRID && this.type > GridFileType.TREE_HEIGHT) {
            return false;
        }
        if (!psaasGlobals_1.SocketMsg.DEBUG_NO_FILETEST) {
            //the filename must be either an attachment or a local file
            if (!this.filename.startsWith("attachment:/") && !fs.existsSync(this.filename)) {
                return false;
            }
            //the projection must be either an attachment or a local file
            if (!this.projection.startsWith("attachment:/") && !fs.existsSync(this.projection)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Streams the grid file to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this.id + '|' + this.comment + '|' + this.type + '|' + this.filename + '|' + this.projection;
        builder.write(GridFile.PARAM_GRID_FILE + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
GridFile.PARAM_GRID_FILE = "inputgridfile";
GridFile.counter = 0;
exports.GridFile = GridFile;
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
    isValid() {
        if (this.operation < 0 || this.operation > WeatherPatchOperation.DIVIDE) {
            return false;
        }
        if (this.value <= 0) {
            return false;
        }
        return true;
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
    isValid() {
        if (this.operation < 0 || this.operation > WeatherPatchOperation.MINUS) {
            return false;
        }
        if (this.value <= 0) {
            return false;
        }
        return true;
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
         * The patch start time (required). Must be formatted as "YYYY-MM-DDThh:mm:ss".
         */
        this.startTime = "";
        /**
         * The patch end time (required). Must be formatted as "YYYY-MM-DDThh:mm:ss".
         */
        this.endTime = "";
        /**
         * The patches start time of day (required). Must be formatted as "hh:mm:ss".
         */
        this.startTimeOfDay = "";
        /**
         * The patches end time of day (required). Must be formatted as "hh:mm:ss".
         */
        this.endTimeOfDay = "";
        /**
         * Any user comments about the weather patch (optional).
         */
        this.comments = "";
        /**
         * The filename associated with this weather patch. Only valid if type is FILE.
         */
        this.filename = "";
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
        this.id = "wthrptch" + WeatherPatch.counter;
        WeatherPatch.counter += 1;
    }
    getId() {
        return this.id;
    }
    /**
     * Set the name of the weather patch. This name must be unique within
     * the simulation. The name will get a default value when the
     * weather patch is constructed but can be overriden with this method.
     */
    setName(name) {
        this.id = name.replace(/\|/g, "");
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
        if (!this.id || this.id.length === 0) {
            return false;
        }
        if (this.startTime.length == 0 || this.endTime.length == 0 || this.startTimeOfDay.length == 0 ||
            this.endTimeOfDay.length == 0) {
            return false;
        }
        if (this.type == WeatherPatchType.FILE) {
            if (!psaasGlobals_1.SocketMsg.DEBUG_NO_FILETEST) {
                //the filename must be an attachment or a local file
                if (!this.filename.startsWith("attachment:/") && !fs.existsSync(this.filename)) {
                    return false;
                }
            }
        }
        else if (this.type == WeatherPatchType.POLYGON && this.feature.length == 0) {
            return false;
        }
        return true;
    }
    /**
     * Streams the weather patch file to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this.id + '|' + this.comments + '|' + this.startTime + '|' + this.endTime + '|' + this.startTimeOfDay + '|' + this.endTimeOfDay;
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
            tmp = tmp + '|file|' + this.filename;
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
WeatherPatch.PARAM_WEATHER_PATCH = "weatherpatch";
WeatherPatch.counter = 0;
exports.WeatherPatch = WeatherPatch;
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
        this.speed = -1;
        /**
         * The location of the grid file (required).
         */
        this.filename = "";
        /**
         * The projection file for the grid file (required).
         */
        this.projection = "";
    }
    /**
     * Check to make sure all parameters have been set to valid values.
     */
    isValid() {
        if (this.speed < 0) {
            return false;
        }
        if (this.sector != WeatherGridSector.NORTH && this.sector != WeatherGridSector.NORTHEAST &&
            this.sector != WeatherGridSector.EAST && this.sector != WeatherGridSector.SOUTHEAST &&
            this.sector != WeatherGridSector.SOUTH && this.sector != WeatherGridSector.SOUTHWEST &&
            this.sector != WeatherGridSector.WEST && this.sector != WeatherGridSector.NORTHWEST) {
            return false;
        }
        if (!psaasGlobals_1.SocketMsg.DEBUG_NO_FILETEST) {
            //the filename must be an attachment or a local file
            if (!this.filename.startsWith("attachment:/") && !fs.existsSync(this.filename)) {
                return false;
            }
            //the projection file must be an attachment or a local file
            if (!this.projection.startsWith("attachment:/") && !fs.existsSync(this.projection)) {
                return false;
            }
        }
        return true;
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
         * The grid start time (required). Must be formatted as "YYYY-MM-DDThh:mm:ss".
         */
        this.startTime = "";
        /**
         * The grid end time (required). Must be formatted as "YYYY-MM-DDThh:mm:ss".
         */
        this.endTime = "";
        /**
         * The patches start time of day (required). Must be formatted as "hh:mm:ss".
         */
        this.startTimeOfDay = "";
        /**
         * The patches end time of day (required). Must be formatted as "hh:mm:ss".
         */
        this.endTimeOfDay = "";
        /**
         * An array of WeatherGrid_GridFile. There can be one for each wind sector (North, Northeast, East, etc.).
         */
        this.gridData = new Array();
        this.id = "wthrgrd" + WeatherGrid.counter;
        WeatherGrid.counter += 1;
    }
    getId() {
        return this.id;
    }
    /**
     * Set the name of the weather grid. This name must be unique within
     * the simulation. The name will get a default value when the
     * weather grid is constructed but can be overriden with this method.
     */
    setName(name) {
        this.id = name.replace(/\|/g, "");
    }
    /**
     * Add a direction file to the weather grid.
     * @param filename The location of the grid file. Can either be the actual file path or the attachment URL returned
     * 				   from {@link PSaaS#addAttachment}
     * @param projection The projection file.
     * @param sector The sector (wind direction) to apply this grid file to. Only one of each sector is allowed per station.
     * @param speed The wind speed.
     * @throws Exception Throws an exception if a file for the same sector has already been added.
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
        if (!this.id || this.id.length === 0) {
            return false;
        }
        if (this.startTimeOfDay.length == 0 || this.endTimeOfDay.length == 0 ||
            this.startTime.length == 0 || this.endTime.length == 0) {
            return false;
        }
        return true;
    }
    /**
     * Streams the weather grid file to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this.id + '|' + this.comments + '|' + this.startTime + '|' + this.endTime + '|' + this.startTimeOfDay + '|' + this.endTimeOfDay + '|' + this.type;
        for (let gd of this.gridData) {
            tmp = tmp + '|' + gd.speed + '|' + gd.sector + '|' + gd.filename + '|' + gd.projection;
        }
        builder.write(WeatherGrid.PARAM_WEATHER_GRID + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
WeatherGrid.PARAM_WEATHER_GRID = "weathergrid";
WeatherGrid.counter = 0;
exports.WeatherGrid = WeatherGrid;
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
        this.filename = "";
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
         * If $fromFuel is not specified this must be set.
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
        this.id = "flptch" + FuelPatch.counter;
        FuelPatch.counter += 1;
    }
    getId() {
        return this.id;
    }
    /**
     * Set the name of the fuel patch. This name must be unique within
     * the simulation. The name will get a default value when the
     * fuel patch is constructed but can be overriden with this method.
     */
    setName(name) {
        this.id = name.replace(/\|/g, "");
    }
    /**
     * Are all required values set.
     */
    isValid() {
        if (!this.id || this.id.length === 0) {
            return false;
        }
        if (this.type != FuelPatchType.FILE && this.type != FuelPatchType.LANDSCAPE && this.type != FuelPatchType.POLYGON) {
            return false;
        }
        if (this.fromFuel == null && this.fromFuelRule != FromFuel.ALL && this.fromFuelRule != FromFuel.NODATA &&
            this.fromFuelRule != FromFuel.ALL_COMBUSTABLE && this.fromFuelIndex == null) {
            return false;
        }
        if (this.toFuel.length == 0 && this.toFuelIndex == null) {
            return false;
        }
        if (this.type == FuelPatchType.FILE) {
            if (!psaasGlobals_1.SocketMsg.DEBUG_NO_FILETEST) {
                //the file must be an attachment or a local file
                if (!this.filename.startsWith("attachment:/") && !fs.existsSync(this.filename)) {
                    return false;
                }
            }
        }
        else if (this.type == FuelPatchType.POLYGON && this.feature.length == 0) {
            return false;
        }
        return true;
    }
    /**
     * Streams the fuel patch file to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this.id + '|' + this.comments;
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
            tmp = tmp + '|file|' + this.filename;
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
FuelPatch.PARAM_FUELPATCH = "fuelpatch";
FuelPatch.counter = 0;
exports.FuelPatch = FuelPatch;
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
        this.width = -1;
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
        this.filename = "";
        /**
         * An array of LatLon describing the fuel break. Only valid if type is POLYLINE or POLYGON.
         */
        this.feature = new Array();
        this.id = "flbrk" + FuelBreak.counter;
        FuelBreak.counter += 1;
    }
    getId() {
        return this.id;
    }
    /**
     * Set the name of the fuel break. This name must be unique within
     * the simulation. The name will get a default value when the
     * fuel break is constructed but can be overriden with this method.
     */
    setName(name) {
        this.id = name.replace(/\|/g, "");
    }
    /**
     * Are all required values set.
     * @return boolean
     */
    isValid() {
        if (!this.id || this.id.length === 0) {
            return false;
        }
        if (this.type != FuelBreakType.FILE && this.type != FuelBreakType.POLYLINE && this.type != FuelBreakType.POLYGON) {
            return false;
        }
        if (this.type == FuelBreakType.POLYLINE && this.width < 0) {
            return false;
        }
        else if (this.type == FuelBreakType.FILE) {
            if (!psaasGlobals_1.SocketMsg.DEBUG_NO_FILETEST) {
                //the file must be an attachment or a local file
                if (!this.filename.startsWith("attachment:/") && !fs.existsSync(this.filename)) {
                    return false;
                }
            }
        }
        else if (this.type == FuelBreakType.POLYGON && this.feature.length == 0) {
            return false;
        }
        return true;
    }
    /**
     * Streams the fuel break file to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this.id + '|' + this.width + '|' + this.comments;
        if (this.type == FuelBreakType.FILE) {
            tmp = tmp + '|file|' + this.filename;
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
FuelBreak.PARAM_FUELBREAK = "fuelbreakfile";
FuelBreak.counter = 0;
exports.FuelBreak = FuelBreak;
/**
 * All information regarding the input files for PSaaS.
 * @author "Travis Redpath"
 */
class PSaaSInputsFiles {
    constructor() {
        /**The projection file (required).
         * The location of the projection file.
         */
        this.projFile = "";
        /**The LUT file (required).
         * The location of the LUT file.
         */
        this.lutFile = "";
        /**The fuel map file (required).
         * The location of the fuel map file.
         */
        this.fuelmapFile = "";
        /**The elevation map file (optional).
         * The location of the elevation file.
         */
        this.elevFile = "";
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
     * Get the error if isValid returns false.
     */
    error() {
        return this._error;
    }
    /**
     * Are all required values specified.
     */
    isValid() {
        this._error = "";
        if (this.projFile.length == 0) {
            this._error = "Projection file was not specified.";
            return false;
        }
        if (this.lutFile.length == 0) {
            this._error = "LUT file was not specified.";
            return false;
        }
        if (this.fuelmapFile.length == 0) {
            this._error = "Fuel map file was not specified.";
            return false;
        }
        if (!psaasGlobals_1.SocketMsg.DEBUG_NO_FILETEST) {
            if (!this.projFile.startsWith("attachment:/") && !fs.existsSync(this.projFile)) {
                this._error = "Projection file file does not exist (" + this.projFile + ").";
                return false;
            }
            if (!this.lutFile.startsWith("attachment:/") && !fs.existsSync(this.lutFile)) {
                this._error = "LUT file does not exist.";
                return false;
            }
            if (!this.fuelmapFile.startsWith("attachment:/") && !fs.existsSync(this.fuelmapFile)) {
                this._error = "Fuel map file does not exist.";
                return false;
            }
            if (this.elevFile.length > 0 && !this.elevFile.startsWith("attachment:/") && !fs.existsSync(this.elevFile)) {
                this._error = "Elevation file does not exist.";
                return false;
            }
        }
        for (let i = 0; i < this.fuelBreakFiles.length - 1; i++) {
            for (let j = i + 1; j < this.fuelBreakFiles.length; j++) {
                if (this.fuelBreakFiles[i].id.toUpperCase() === this.fuelBreakFiles[j].id.toUpperCase()) {
                    this._error = "Fuel break names must be unique.";
                    return false;
                }
            }
        }
        for (let i = 0; i < this.fuelPatchFiles.length - 1; i++) {
            for (let j = i + 1; j < this.fuelPatchFiles.length; j++) {
                if (this.fuelPatchFiles[i].id.toUpperCase() === this.fuelPatchFiles[j].id.toUpperCase()) {
                    this._error = "Fuel patch names must be unique.";
                    return false;
                }
            }
        }
        for (let i = 0; i < this.weatherGridFiles.length - 1; i++) {
            for (let j = i + 1; j < this.weatherGridFiles.length; j++) {
                if (this.weatherGridFiles[i].id.toUpperCase() === this.weatherGridFiles[j].id.toUpperCase()) {
                    this._error = "Weather grid names must be unique.";
                    return false;
                }
            }
        }
        for (let i = 0; i < this.weatherPatchFiles.length - 1; i++) {
            for (let j = i + 1; j < this.weatherPatchFiles.length; j++) {
                if (this.weatherPatchFiles[i].id.toUpperCase() === this.weatherPatchFiles[j].id.toUpperCase()) {
                    this._error = "Weather patch names must be unique.";
                    return false;
                }
            }
        }
        for (let i = 0; i < this.gridFiles.length - 1; i++) {
            for (let j = i + 1; j < this.gridFiles.length; j++) {
                if (this.gridFiles[i].id.toUpperCase() === this.gridFiles[j].id.toUpperCase()) {
                    this._error = "Grid file names must be unique.";
                    return false;
                }
            }
        }
        return true;
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
PSaaSInputsFiles.PARAM_PROJ = "projfile";
PSaaSInputsFiles.PARAM_LUT = "lutfile";
PSaaSInputsFiles.PARAM_FUELMAP = "fuelmapfile";
PSaaSInputsFiles.PARAM_ELEVATION = "elevationfile";
exports.PSaaSInputsFiles = PSaaSInputsFiles;
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
        this.filename = "";
        /**
         * Yesterday's daily starting fine fuel moisture code (required).
         */
        this.starting_ffmc = -1;
        /**
         * Yesterday's daily starting duff moisture code (required).
         */
        this.starting_dmc = -1;
        /**
         * Yesterday's daily starting drought code (required).
         */
        this.starting_dc = -1;
        /**
         * Yesterday's daily starting precipitation (13:01-23:00 if daylight savings time, 12:01-23:00 otherwise) (required).
         */
        this.starting_precip = -1;
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
         * The starting time of the weather stream (required). Must be formatted as 'YYYY-MM-DD'.
         */
        this.start_time = "";
        /**
         * The ending time of the weather stream (required). Must be formatted as 'YYYY-MM-DD'.
         */
        this.end_time = "";
        /**
         * The ID of the weather station that this stream came from.
         */
        this.parentId = null;
        this.id = "wthrstrm" + WeatherStream.counter;
        WeatherStream.counter += 1;
        this.parentId = parentId;
    }
    /**
     * Get the unique ID of this weather stream.
     */
    getId() {
        return this.id;
    }
    /**
     * Set the name of the weather stream. This name must be unique within
     * the simulation. The name will get a default value when the
     * weather stream is constructed but can be overriden with this method.
     */
    setName(name) {
        this.id = name.replace(/\|/g, "");
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
        if (!this.id || this.id.length === 0) {
            return false;
        }
        if (!psaasGlobals_1.SocketMsg.DEBUG_NO_FILETEST) {
            //the file must be an attachment or a local file
            if (!this.filename.startsWith("attachment:/") && !fs.existsSync(this.filename)) {
                return false;
            }
        }
        if (this.starting_ffmc < 0 || this.starting_dmc < 0 || this.starting_dc < 0 ||
            this.starting_precip < 0 || this.hffmc_hour < -1 || this.hffmc_hour > 23 ||
            (this.hffmc_method != HFFMCMethod.LAWSON && this.hffmc_method != HFFMCMethod.VAN_WAGNER)) {
            return false;
        }
        if (this.start_time.length == 0 || this.end_time.length == 0) {
            return false;
        }
        return true;
    }
    /**
     * Streams the weather station to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this.id + '|' + this.filename + '|' + this.hffmc_value + '|' + this.hffmc_hour + '|' + this.hffmc_method;
        tmp = tmp + '|' + this.starting_ffmc + '|' + this.starting_dmc + '|' + this.starting_dc + '|' + this.starting_precip;
        tmp = tmp + '|' + this.start_time + '|' + this.end_time;
        tmp = tmp + '|' + this.parentId + '|' + this.comments;
        if (this.diurnal_temperature_alpha != 9999) {
            tmp = tmp + '|' + this.diurnal_temperature_alpha + '|' + this.diurnal_temperature_beta + '|' + this.diurnal_temperature_gamma;
            tmp = tmp + '|' + this.diurnal_windspeed_alpha + '|' + this.diurnal_windspeed_beta + '|' + this.diurnal_windspeed_gamma;
        }
        builder.write(WeatherStream.PARAM_WEATHERSTREAM + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
WeatherStream.PARAM_WEATHERSTREAM = "weatherstream";
WeatherStream.counter = 0;
exports.WeatherStream = WeatherStream;
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
        this.id = "wthrstn" + WeatherStation.counter;
        WeatherStation.counter += 1;
    }
    getId() {
        return this.id;
    }
    /**
     * Set the name of the weather station. This name must be unique within
     * the simulation. The name will get a default value when the
     * weather station is constructed but can be overriden with this method.
     */
    setName(name) {
        this.id = name.replace(/\|/g, "");
    }
    /**
     * Checks to see if all required values are specified.
     */
    isValid() {
        if (!this.id || this.id.length === 0) {
            return false;
        }
        if (this.location == null) {
            return false;
        }
        for (let v of this.streams) {
            if (!v.isValid()) {
                return false;
            }
        }
        for (let i = 0; i < this.streams.length - 1; i++) {
            for (let j = i + 1; j < this.streams.length; j++) {
                if (this.streams[i].id.toUpperCase() === this.streams[j].id.toUpperCase()) {
                    return false;
                }
            }
        }
        return true;
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
     * @param start_time The starting time of the weather stream. Must be formatted as "YYYY-MM-DD"
     * @param end_time The ending time of the weather stream. Must be formatted as "YYYY-MM-DD"
     * @param comments An optional user comment to attach to the weather stream.
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
        ws.start_time = start_time;
        ws.end_time = end_time;
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
        ws.start_time = start_time;
        ws.end_time = end_time;
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
        let tmp = this.id + '|' + this.location.latitude + '|' + this.location.longitude + '|' + this.elevation + '|' + this.comments;
        builder.write(WeatherStation.PARAM_WEATHERSTATION + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
        for (let stream of this.streams) {
            stream.stream(builder);
        }
    }
}
WeatherStation.PARAM_WEATHERSTATION = "weatherstation";
WeatherStation.counter = 0;
exports.WeatherStation = WeatherStation;
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
         * The ignition start time (required). Must be formatted as 'YYYY-MM-DDThh:mm:ss'.
         */
        this.startTime = "";
        /**
         * The type of ignition (required).
         */
        this.type = -1;
        /**
         * The filename associated with this ignition. Only valid if type is FILE.
         */
        this.filename = "";
        /**
         * An array of LatLon describing the ignition. Only valid if type is POLYLINE, POLYGON, or POINT.
         */
        this.feature = new Array();
        /**
         * A list of attributes for the ignition. Not valid for {@link #filename} types.
         * Valid types for the value are Integer, Long, Double, and String.
         */
        this.attributes = new Array();
        this.id = "ign" + Ignition.counter;
        Ignition.counter += 1;
    }
    getId() {
        return this.id;
    }
    /**
     * Set the name of the ignition. This name must be unique within
     * the simulation. The name will get a default value when the
     * ignition is constructed but can be overriden with this method.
     */
    setName(name) {
        this.id = name.replace(/\|/g, "");
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
        if (!this.id || this.id.length === 0) {
            return false;
        }
        if (this.startTime.length == 0) {
            return false;
        }
        if (this.type != IgnitionType.FILE && this.type != IgnitionType.POLYLINE && this.type != IgnitionType.POLYGON && this.type != IgnitionType.POINT) {
            return false;
        }
        if (this.type == IgnitionType.FILE) {
            if (!psaasGlobals_1.SocketMsg.DEBUG_NO_FILETEST) {
                //the file must be an attachment or a local file
                if (!this.filename.startsWith("attachment:/") && fs.existsSync(this.filename)) {
                    return false;
                }
            }
        }
        else if ((this.type == IgnitionType.POLYLINE || this.type == IgnitionType.POLYGON || this.type == IgnitionType.POINT) && this.feature.length == 0) {
            return false;
        }
        return true;
    }
    /**
     * Streams the ignition to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this.id + '|' + this.startTime + '|' + this.comments;
        if (this.type == IgnitionType.FILE) {
            tmp = tmp + '|file|' + this.filename;
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
Ignition.PARAM_IGNITION = "ignition";
Ignition.counter = 0;
exports.Ignition = Ignition;
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
        this.filename = "";
        /**
         * An array of LatLon describing the asset. Only valid if type is POLYLINE, POLYGON, or POINT.
         */
        this.feature = new Array();
        /**
         * The buffer size to use for line or point assets. If negative, no buffer will be used.
         */
        this.buffer = -1.0;
        this.id = "asset" + AssetFile.counter;
        AssetFile.counter += 1;
    }
    getId() {
        return this.id;
    }
    /**
     * Set the name of the asset. This name must be unique within
     * the simulation. The name will get a default value when the
     * asset is constructed but can be overriden with this method.
     */
    setName(name) {
        this.id = name.replace(/\|/g, "");
    }
    /**
     * Checks to see if all required values have been set.
     */
    isValid() {
        if (!this.id || this.id.length === 0) {
            return false;
        }
        if (this.type != AssetShapeType.FILE && this.type != AssetShapeType.POLYLINE && this.type != AssetShapeType.POLYGON && this.type != AssetShapeType.POINT) {
            return false;
        }
        if (this.type == AssetShapeType.FILE) {
            if (!psaasGlobals_1.SocketMsg.DEBUG_NO_FILETEST) {
                //the file must be an attachment or a local file
                if (!this.filename.startsWith("attachment:/") && fs.existsSync(this.filename)) {
                    return false;
                }
            }
        }
        else if ((this.type == AssetShapeType.POLYLINE || this.type == AssetShapeType.POLYGON || this.type == AssetShapeType.POINT) && this.feature.length == 0) {
            return false;
        }
        return true;
    }
    /**
     * Streams the ignition to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this.id + '|' + this.comments + '|' + (+this.type) + '|' + this.buffer;
        if (this.type == AssetShapeType.FILE) {
            tmp = tmp + this.filename;
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
AssetFile.PARAM_ASSET_FILE = "asset_file";
AssetFile.counter = 0;
exports.AssetFile = AssetFile;
/**
 * Options for associating an ignition point with a scenario.
 */
class IgnitionReference {
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
}
exports.PolylineIgnitionOptions = PolylineIgnitionOptions;
class MultiPointIgnitionOptions {
    constructor() {
        /**
         * Index of the point ignition to use in the specified polyline(s), or -1 to use all points.
         */
        this.pointIndex = -1;
    }
}
exports.MultiPointIgnitionOptions = MultiPointIgnitionOptions;
class SinglePointIgnitionOptions {
}
exports.SinglePointIgnitionOptions = SinglePointIgnitionOptions;
/**
 * A condition for burning.
 * @author "Travis Redpath"
 */
class BurningConditions {
    constructor() {
        /**
         * The date the burning condition is in effect on (required). Must be formatted as 'YYYY-MM-DD'.
         */
        this.date = "";
        /**
         * The minimum FWI value that will allow burning (optional).
         */
        this.fwiGreater = -1;
        /**
         * The minimum wind speed that will allow burning (optional).
         */
        this.wsGreater = -1;
        /**
         * The maximum relative humidity that will allow burning (optional).
         */
        this.rhLess = -1;
        /**
         * The minimum ISI that will allow burning (optional).
         */
        this.isiGreater = -1;
    }
    /**
     * Checks to see if all required values have been set.
     */
    isValid() {
        return this.date.length > 0;
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
        if (this.name.length == 0 || this.index < 0) {
            return false;
        }
        return true;
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
}
exports.AssetReference = AssetReference;
/**
 * Settings to modify PSaaS behaviour at the end of every timestep.
 * @author "Travis Redpath"
 */
class TimestepSettings {
    constructor() {
        this.statistics = new Array();
    }
    /**
     * Add a statistic to output.
     * @param stat The name of the statistic to add.
     * @returns The added statistic, or null if an invalid statistic was passed.
     */
    addStatistic(stat) {
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
     * Streams the settings to a socket.
     * @param builder
     */
    stream(builder) {
        this.statistics.forEach(element => {
            builder.write(TimestepSettings.PARAM_EMIT_STATISTIC + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(element + psaasGlobals_1.SocketMsg.NEWLINE);
        });
    }
}
TimestepSettings.PARAM_EMIT_STATISTIC = "mng_statistic";
exports.TimestepSettings = TimestepSettings;
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
         * An override for the scenario start time. Must be formatted as ISO-8601.
         */
        this.startTime = "";
        /**
         * An override for the scenario end time. Must be formatted as ISO-8601.
         */
        this.endTime = "";
        /**
         * An override for the ignition start time for any ignitions attached
         * to this sub-scnario. Must be formatted as ISO-8601.
         */
        this.ignitionTime = "";
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
        this.startTime = "";
        /**
         * The scenario end time (required). Must be formatted as 'YYYY-MM-DDThh:mm:ss'.
         */
        this.endTime = "";
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
         * The name of the scenario that will be copied.
         */
        this.scenToCopy = "";
        this.id = "scen" + Scenario.counter;
        Scenario.counter += 1;
        this.displayInterval = psaasGlobals_1.Duration.createTime(1, 0, 0, false);
        this.fgmOptions = new psaasGlobals_1.FGMOptions();
        this.fbpOptions = new psaasGlobals_1.FBPOptions();
        this.fmcOptions = new psaasGlobals_1.FMCOptions();
        this.fwiOptions = new psaasGlobals_1.FWIOptions();
    }
    getId() {
        return this.id;
    }
    /**
     * Set the name of the scenario. This name must be unique within
     * the simulation. The name will get a default value when the
     * scenario is constructed but can be overriden with this method.
     */
    setName(name) {
        this.id = name.replace(/\|/g, "");
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
        bc.date = date;
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
     * Checks to see if all required values have been set.
     */
    isValid() {
        if (!this.id || this.id.length === 0) {
            return false;
        }
        if (this.isCopy) {
            if (this.scenToCopy.length == 0) {
                return false;
            }
        }
        else {
            if (this.startTime.length == 0 || this.endTime.length == 0) {
                return false;
            }
            if (!this.fgmOptions.isValid()) {
                return false;
            }
            if (!this.fbpOptions.isValid()) {
                return false;
            }
            if (!this.fmcOptions.isValid()) {
                return false;
            }
            if (!this.fwiOptions.isValid()) {
                return false;
            }
            for (let bc of this.burningConditions) {
                if (!bc.isValid()) {
                    return false;
                }
            }
        }
        return true;
    }
    /**
     * Streams the scenario to a socket.
     * @param builder
     */
    stream(builder) {
        builder.write(Scenario.PARAM_SCENARIO_BEGIN + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(Scenario.PARAM_SCENARIONAME + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(this.id + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(Scenario.PARAM_DISPLAY_INTERVAL + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(this.displayInterval + psaasGlobals_1.SocketMsg.NEWLINE);
        if (this.isCopy) {
            builder.write(Scenario.PARAM_SCENARIO_TO_COPY + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(this.scenToCopy + psaasGlobals_1.SocketMsg.NEWLINE);
        }
        if (!this.isCopy || this.startTime.length > 0) {
            builder.write(Scenario.PARAM_STARTTIME + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(this.startTime + psaasGlobals_1.SocketMsg.NEWLINE);
        }
        if (!this.isCopy || this.endTime.length > 0) {
            builder.write(Scenario.PARAM_ENDTIME + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(this.endTime + psaasGlobals_1.SocketMsg.NEWLINE);
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
        builder.write(Scenario.PARAM_SCENARIO_END + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
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
Scenario.counter = 0;
exports.Scenario = Scenario;
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
})(FuelOptionType = exports.FuelOptionType || (exports.FuelOptionType = {}));
/**
 * Stores options for various fuel types including default grass fuel load,
 * grass curing, percent conifer, and percent dead fir.
 * @author Travis Redpath
 */
class FuelOption {
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
FuelOption.PARAM_FUEL_OPTION = "fuel_option_setting";
exports.FuelOption = FuelOption;
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
        this.files = new PSaaSInputsFiles();
        this.timezone = new psaasGlobals_1.Timezone();
    }
    /**
     * Get a string describing an error if isValid returned false.
     */
    error() {
        return this._error;
    }
    /**
     * Are required inputs set.
     */
    isValid() {
        this._error = "";
        if (!this.timezone.isValid()) {
            this._error = "Invalid timezone offset";
            return false;
        }
        if (!this.files.isValid()) {
            this._error = this.files.error();
            return false;
        }
        if (this.weatherStations.length < 1) {
            this._error = "There were no weather stations specified.";
            return false;
        }
        if (this.scenarios.length < 1) {
            this._error = "There were no scenarios specified.";
            return false;
        }
        for (let i = 0; i < this.weatherStations.length - 1; i++) {
            if (!this.weatherStations[i].isValid()) {
                this._error = `Invalid weather station ${this.weatherStations[i].getId()}`;
                return false;
            }
            for (let j = i + 1; j < this.weatherStations.length; j++) {
                if (this.weatherStations[i].id.toUpperCase() === this.weatherStations[j].id.toUpperCase()) {
                    this._error = "Weather station names must be unique.";
                    return false;
                }
            }
        }
        for (let i = 0; i < this.ignitions.length - 1; i++) {
            if (!this.ignitions[i].isValid()) {
                this._error = `Invalid ignition ${this.ignitions[i].getId()}`;
                return false;
            }
            for (let j = i + 1; j < this.ignitions.length; j++) {
                if (this.ignitions[i].id.toUpperCase() === this.ignitions[j].id.toUpperCase()) {
                    this._error = "Ignition names must be unique.";
                    return false;
                }
            }
        }
        for (let i = 0; i < this.scenarios.length - 1; i++) {
            if (!this.scenarios[i].isValid()) {
                this._error = `Invalid scenario ${this.scenarios[i].getId()}`;
                return false;
            }
            for (let j = i + 1; j < this.scenarios.length; j++) {
                if (this.scenarios[i].id.toUpperCase() === this.scenarios[j].id.toUpperCase()) {
                    this._error = "Scenario names must be unique.";
                    return false;
                }
            }
        }
        for (let i = 0; i < this.assetFiles.length - 1; i++) {
            if (!this.assetFiles[i].isValid()) {
                this._error = `Invalid asset ${this.assetFiles[i].getId()}`;
                return false;
            }
            for (let j = i + 1; j < this.assetFiles.length; j++) {
                if (this.assetFiles[i].getId().toUpperCase() === this.assetFiles[j].getId().toUpperCase()) {
                    this._error = "Asset names must be unique.";
                    return false;
                }
            }
        }
        return true;
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
        this.exportTime = null;
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
         * Output time (required). Must be formatted as 'YYYY-MM-DDThh:mm:ss'.
         */
        this.outputTime = "";
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
        if (this.filename.length == 0 || this.outputTime.length == 0 || this.statistic == null ||
            this.scenarioName.length == 0 || this.interpMethod == null) {
            return false;
        }
        if (this.statistic != psaasGlobals_1.GlobalStatistics.TEMPERATURE && this.statistic != psaasGlobals_1.GlobalStatistics.DEW_POINT && this.statistic != psaasGlobals_1.GlobalStatistics.RELATIVE_HUMIDITY &&
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
            this.statistic != psaasGlobals_1.GlobalStatistics.HFI && this.statistic != psaasGlobals_1.GlobalStatistics.HCFB) {
            return false;
        }
        return true;
    }
    static streamNullableString(value) {
        return value || "";
    }
    /**
     * Streams the grid file to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this.scenarioName + '|' + this.filename + '|' + this.outputTime + '|' + this.statistic + '|' + this.interpMethod + '|' + (+this.shouldStream) + '|' + this.compression;
        tmp = tmp + '|' + this.shouldMinimize + '|' + Output_GridFile.streamNullableString(this.subScenarioName) + '|' + this.subScenarioOverrideTimes.length;
        for (let e of this.subScenarioOverrideTimes) {
            tmp = tmp + '|' + e.subScenarioName + '|' + e.exportTime;
        }
        builder.write(Output_GridFile.PARAM_GRIDFILE + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
Output_GridFile.PARAM_GRIDFILE = "gridfile";
exports.Output_GridFile = Output_GridFile;
var VectorFileType;
(function (VectorFileType) {
    VectorFileType["KML"] = "KML";
    VectorFileType["SHP"] = "SHP";
})(VectorFileType = exports.VectorFileType || (exports.VectorFileType = {}));
/**
 * An override start and end time for a specific sub-scenario.
 */
class PerimeterTimeOverride {
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
         * Start output perimeter time (required). Must be formatted as 'YYYY-MM-DDThh:mm:ss'.
         */
        this.perimStartTime = "";
        /**
         * End output perimeter time (required). Must be formatted as 'YYYY-MM-DDThh:mm:ss'.
         */
        this.perimEndTime = "";
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
    add_subScenarioOverrides(add) {
        this.subScenarioOverrides.push(add);
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
        if (this.filename.length == 0 || this.perimStartTime.length == 0 || this.perimEndTime.length == 0 || this.scenarioName.length == 0) {
            return false;
        }
        if (this.type !== VectorFileType.KML && this.type !== VectorFileType.SHP) {
            return false;
        }
        if (this.multPerim == null || this.removeIslands == null || this.mergeContact == null || this.perimActive == null) {
            return false;
        }
        if (!this.metadata.isValid()) {
            this._error = this.metadata.err;
            return false;
        }
        return true;
    }
    /**
     * Streams the vector file to a socket.
     * @param builder
     */
    stream(builder) {
        let tmp = this.scenarioName + '|' + this.filename + '|' + (+this.multPerim) + '|' + this.perimStartTime + '|' + this.perimEndTime + '|' + (+this.removeIslands) + '|' + (+this.mergeContact) + '|' + (+this.perimActive);
        tmp = tmp + '|' + this.metadata.version + '|' + this.metadata.scenName + '|' + this.metadata.jobName + '|' + this.metadata.igName + '|' + this.metadata.simDate;
        tmp = tmp + '|' + this.metadata.fireSize + '|' + this.metadata.perimTotal + '|' + this.metadata.perimActive + '|' + this.metadata.perimUnit + '|' + this.metadata.areaUnit + '|' + (+this.shouldStream);
        tmp = tmp + '|' + VectorFile.streamNullableBoolean(this.metadata.wxValues) + '|' + VectorFile.streamNullableBoolean(this.metadata.fwiValues);
        tmp = tmp + '|' + VectorFile.streamNullableBoolean(this.metadata.ignitionLocation) + '|' + VectorFile.streamNullableBoolean(this.metadata.maxBurnDistance);
        tmp = tmp + '|' + VectorFile.streamNullableBoolean(this.metadata.ignitionAttributes) + '|' + VectorFile.streamNullableString(this.subScenarioName);
        tmp = tmp + '|' + this.subScenarioOverrides.length;
        for (let s of this.subScenarioOverrides) {
            tmp = tmp + '|' + s.subScenarioName + '|' + s.startTime + '|' + s.endTime;
        }
        tmp = tmp + '|' + VectorFile.streamNullableBoolean(this.metadata.assetArrivalTime) + '|' + VectorFile.streamNullableBoolean(this.metadata.assetArrivalCount);
        tmp = tmp + '|' + VectorFile.streamNullableBoolean(this.metadata.identifyFinalPerimeter);
        builder.write(VectorFile.PARAM_VECTORFILE + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
VectorFile.PARAM_VECTORFILE = "vectorfile";
exports.VectorFile = VectorFile;
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
        if (this.filename.length == 0) {
            return false;
        }
        if (this.scenName.length == 0) {
            return false;
        }
        return this.outputs.isValid();
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
SummaryFile.PARAM_SUMMARYFILE = "summaryfile";
exports.SummaryFile = SummaryFile;
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
        if (this.filename.length == 0) {
            return false;
        }
        if (this.scenName.length == 0) {
            return false;
        }
        for (let col of this.columns) {
            if (!this.validateColumn(col)) {
                return false;
            }
        }
        return true;
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
        builder.write(StatsFile.PARAM_STATSFILE + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(tmp + psaasGlobals_1.SocketMsg.NEWLINE);
    }
}
StatsFile.PARAM_STATSFILE = "statsfile";
exports.StatsFile = StatsFile;
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
        for (let s of this.summaryFiles) {
            if (!s.isValid()) {
                return false;
            }
        }
        for (let v of this.vectorFiles) {
            if (!v.isValid()) {
                return false;
            }
        }
        for (let g of this.gridFiles) {
            if (!g.isValid()) {
                return false;
            }
        }
        for (let s of this.statsFiles) {
            if (!s.isValid()) {
                return false;
            }
        }
        return true;
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
OutputStreamInfo.PARAM_URL = "output_stream";
exports.OutputStreamInfo = OutputStreamInfo;
class MqttOutputStreamInfo extends OutputStreamInfo {
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
     * @param content The raw contents of the file.
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
        builder.write(this.filename + psaasGlobals_1.SocketMsg.NEWLINE);
        builder.write(this.contents + psaasGlobals_1.SocketMsg.NEWLINE);
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
UnitSettings.PARAM_UNITS = "export_units";
exports.UnitSettings = UnitSettings;
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
        this._error = "";
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
    }
    /**
     * Get an error message if one has been set.
     */
    error() {
        return this._error;
    }
    /**
     * Are the input and output values for the job valid.
     */
    isValid() {
        if (!this.inputs.isValid()) {
            this._error = this.inputs.error();
            return false;
        }
        else if (!this.outputs.isValid()) {
            this._error = "Outputs invalid";
            return false;
        }
        return true;
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
     * @param file
     */
    setProjectionFile(file) {
        this.inputs.files.projFile = file;
    }
    /**
     * Unset the projection file.
     */
    unsetProjectionFile() {
        this.inputs.files.projFile = "";
    }
    /**
     * Set the look up table. This file is required.
     * An exception will be thrown if the file does not exist.
     * @param file
     */
    setLutFile(file) {
        this.inputs.files.lutFile = file;
    }
    /**
     * Unset the look up table.
     * @param file
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
     * @param value The grass curing.
     */
    setGrassCuring(fuel, value) {
        let option = new FuelOption();
        option.fuelType = fuel;
        option.optionType = FuelOptionType.GRASS_CURING;
        option.value = value;
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
     * @param fuel The fuel type to set the grass fuel load for. Must be C-6, NZ-60, NZ-61, NZ-66, NZ-67, or NZ-71.
     * @param value The crown base height.
     */
    setCrownBaseHeight(fuel, value) {
        let option = new FuelOption();
        option.fuelType = fuel;
        option.optionType = FuelOptionType.CROWN_BASE_HEIGHT;
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
     * @param file Can either be the actual file path or the
     * 			   attachment URL returned from {@link addAttachment}
     */
    setFuelmapFile(file) {
        this.inputs.files.fuelmapFile = file;
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
     * @param file Can either be the actual file path or the attachment
     * 			   URL returned from {@link addAttachment}
     */
    setElevationFile(file) {
        this.inputs.files.elevFile = file;
    }
    /**
     * Unset the elevation grid file
     * @param file
     */
    unsetElevationFile() {
        this.inputs.files.elevFile = "";
    }
    /**
     * Add a grid file to the project.
     * @param type Must be one of the GridFile::TYPE_* values.
     * @param file The location of the grid file. Can either
     * 			   be the actual file path or the attachment
     * 			   URL returned from {@link addAttachment}
     * @param proj The location of the grid files projection.
     */
    addGridFile(type, file, proj) {
        let gf = new GridFile();
        gf.filename = file;
        gf.projection = proj;
        gf.type = type;
        this.inputs.files.gridFiles.push(gf);
        return gf;
    }
    /**
     * Add a grid file to the project.
     * @param type Must be one of the GridFile::TYPE_* values.
     * @param file The location of the grid file. Can either
     * 			   be the actual file path or the attachment
     * 			   URL returned from {@link addAttachment}
     * @param proj The location of the grid files projection.
     * @param comment A user comment to add to the grid file.
     */
    addGridFileWithComment(type, file, proj, comment) {
        let gf = new GridFile();
        gf.filename = file;
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
     * @param fromFuel The fuel to change from. Can either be one of the rules defined in FuelPatch (FROM_FUEL_*) or the name of a fuel.
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
     * @param fromFuel The fuel to change from. Can either be one of the rules defined in FuelPatch (FROM_FUEL_*) or the name of a fuel.
     * @param toFuel The name of the fuel to change to.
     * @param file The location of the shape file. Can either be the actual file path or the attachment URL returned from {@link addAttachment}
     * @param comment An optional user created comment to attach to the fuel patch.
     */
    addFileFuelPatch(fromFuel, toFuel, file, comment) {
        let fp = new FuelPatch();
        fp.type = FuelPatchType.FILE;
        fp.filename = file;
        if (fromFuel === FromFuel.ALL || fromFuel === FromFuel.ALL_COMBUSTABLE || fromFuel === FromFuel.NODATA) {
            fp.fromFuelRule = fromFuel;
        }
        else {
            fp.fromFuel = fromFuel;
        }
        fp.toFuel = toFuel;
        this.inputs.files.fuelPatchFiles.push(fp);
        return fp;
    }
    /**
     * Add a polygon fuel patch to the job.
     * @param fromFuel The fuel to change from. Can either be one of the rules defined in FuelPatch (FROM_FUEL_*) or the name of a fuel.
     * @param toFuel The name of the fuel to change to.
     * @param vertices The vertices of the polygon. Must be an array of LatLon values. The LatLon values will be copied by reference.
     * @param comments An optional user created comment to attach to the fuel patch.
     */
    addPolygonFuelPatch(fromFuel, $toFuel, vertices, comments) {
        let fp = new FuelPatch();
        fp.type = FuelPatchType.POLYGON;
        fp.feature = vertices;
        if (fromFuel === FromFuel.ALL || fromFuel === FromFuel.ALL_COMBUSTABLE || fromFuel === FromFuel.NODATA) {
            fp.fromFuelRule = fromFuel;
        }
        else {
            fp.fromFuel = fromFuel;
        }
        fp.toFuel = $toFuel;
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
     * @param file The file location of the fuel break. Can either be the actual file
     * 			   path or the attachment URL returned from {@link addAttachment}
     * @param comments An optional user created comment to attach to the fuel break;
     */
    addFileFuelBreak(file, comments) {
        let fb = new FuelBreak();
        if (comments != null) {
            fb.comments = comments;
        }
        fb.type = FuelBreakType.FILE;
        fb.filename = file;
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
     * @param width The width of the fuel break.
     * @param vertices The vertices of the polyline. Must be an array of LatLon values. The LatLon values will be copied by reference.
     * @param comments An optional user created comment to attach to the fuel break;
     */
    addPolylineFuelBreak(width, vertices, comments) {
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
     * @param startTime The patch start time. Must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param startTimeOfDay The patches start time of day. Must be formatted as "hh:mm:ss".
     * @param endTime The patch end time. Must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param endTimeOfDay The patches end time of day. Must be formatted as "hh:mm:ss".
     * @param comments An optional user created comment to attach to the weather patch.
     * @return WeatherPatch
     */
    addFileWeatherPatch(filename, startTime, startTimeOfDay, endTime, endTimeOfDay, comments) {
        let wp = new WeatherPatch();
        if (comments != null) {
            wp.comments = comments;
        }
        wp.endTime = endTime;
        wp.endTimeOfDay = endTimeOfDay;
        wp.type = WeatherPatchType.FILE;
        wp.filename = filename;
        wp.startTime = startTime;
        wp.startTimeOfDay = startTimeOfDay;
        this.inputs.files.weatherPatchFiles.push(wp);
        return wp;
    }
    /**
     * Add a weather patch from an array of vertices of a polygon.
     * @param vertices The vertices of the polygon.
     * @param startTime The patch start time. Must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param startTimeOfDay The patches start time of day. Must be formatted as "hh:mm:ss".
     * @param endTime The patch end time. Must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param endTimeOfDay The patches end time of day. Must be formatted as "hh:mm:ss".
     * @param comments An optional user created comment to attach to the weather patch.
     * @return WeatherPatch
     */
    addPolygonWeatherPatch(vertices, startTime, startTimeOfDay, endTime, endTimeOfDay, comments) {
        let wp = new WeatherPatch();
        if (comments != null) {
            wp.comments = comments;
        }
        wp.endTime = endTime;
        wp.endTimeOfDay = endTimeOfDay;
        wp.type = WeatherPatchType.POLYGON;
        wp.feature = vertices;
        wp.startTime = startTime;
        wp.startTimeOfDay = startTimeOfDay;
        this.inputs.files.weatherPatchFiles.push(wp);
        return wp;
    }
    /**
     * Add a landscape weather patch.
     * @param startTime The patch start time. Must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param startTimeOfDay The patches start time of day. Must be formatted as "hh:mm:ss".
     * @param endTime The patch end time. Must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param endTimeOfDay The patches end time of day. Must be formatted as "hh:mm:ss".
     * @param comments An optional user created comment to attach to the weather patch.
     * @return WeatherPatch
     */
    addLandscapeWeatherPatch(startTime, startTimeOfDay, endTime, endTimeOfDay, comments) {
        let wp = new WeatherPatch();
        if (comments != null) {
            wp.comments = comments;
        }
        wp.endTime = endTime;
        wp.endTimeOfDay = endTimeOfDay;
        wp.type = WeatherPatchType.LANDSCAPE;
        wp.startTime = startTime;
        wp.startTimeOfDay = startTimeOfDay;
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
     * @param startTime The grids start time. Must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param startTimeOfDay The grids start time of day. Must be formatted as "hh:mm:ss".
     * @param endTime The grids end time. Must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param endTimeOfDay The grids end time of day. Must be formatted as "hh:mm:ss".
     * @param comments An optional user created comment to attach to the weather grid.
     * @return WeatherGrid
     */
    addDirectionWeatherGrid(startTime, startTimeOfDay, endTime, endTimeOfDay, comments) {
        let wg = new WeatherGrid();
        if (comments != null) {
            wg.comments = comments;
        }
        wg.endTime = endTime;
        wg.endTimeOfDay = endTimeOfDay;
        wg.startTime = startTime;
        wg.startTimeOfDay = startTimeOfDay;
        wg.type = WeatherGridType.DIRECTION;
        this.inputs.files.weatherGridFiles.push(wg);
        return wg;
    }
    /**
     * Add a weather grid for wind speeds to the project.
     * @param startTime The grids start time. Must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param startTimeOfDay The grids start time of day. Must be formatted as "hh:mm:ss".
     * @param endTime The grids end time. Must be formatted as "YYYY-MM-DDThh:mm:ss".
     * @param endTimeOfDay The grids end time of day. Must be formatted as "hh:mm:ss".
     * @param comments An optional user created comment to attach to the weather grid.
     * @return WeatherGrid
     */
    addSpeedWeatherGrid(startTime, startTimeOfDay, endTime, endTimeOfDay, comments) {
        let wg = new WeatherGrid();
        if (comments != null) {
            wg.comments = comments;
        }
        wg.endTime = endTime;
        wg.endTimeOfDay = endTimeOfDay;
        wg.startTime = startTime;
        wg.startTimeOfDay = startTimeOfDay;
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
     * @param startTime The ignitions start time.
     * @param filename The location of the ignitions file. Can either be the actual file path
     * 				   or the attachment URL returned from {@link addAttachment}
     * @param comments An optional user created comment to attach to the ignition.
     * @return Ignition
     */
    addFileIgnition(startTime, filename, comments) {
        let ig = new Ignition();
        ig.startTime = startTime;
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
    addPointIgnition(startTime, point, comments) {
        let ig = new Ignition();
        ig.startTime = startTime;
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
     * @param startTime The ignitions start time.
     * @param points An array of LatLons that are all point ignitions.
     * @param comments An optional user created comment to attach to the ignition.
     * @return Ignition
     */
    addMultiPointIgnition(startTime, points, comments) {
        let ig = new Ignition();
        ig.startTime = startTime;
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
    addPolygonIgnition(startTime, vertices, comments) {
        let ig = new Ignition();
        ig.startTime = startTime;
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
     * @param startTime The ignitions start time.
     * @param vertices An array of LatLons that descrive the polyline.
     * @param comments An optional user created comment to attach to the ignition.
     * @return Ignition
     */
    addPolylineIgnition(startTime, vertices, comments) {
        let ig = new Ignition();
        ig.startTime = startTime;
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
     * Add a scenario to the job.
     * @param startTime The start time of the scenario. Must be formatted as 'YYYY-MM-DDThh:mm:ss'.
     * @param endTime The end time of the scenario. Must be formatted as 'YYYY-MM-DDThh:mm:ss'.
     * @param comments An optional user created comment to attach to the scenario.
     */
    addScenario(startTime, endTime, comments) {
        let scen = new Scenario();
        scen.startTime = startTime;
        scen.endTime = endTime;
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
        ogf.outputTime = time;
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
        ovf.perimStartTime = perimStartTime;
        ovf.perimEndTime = perimEndTime;
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
     * fs.readFile("/mnt/location/file.txt", "utf8", function(err, data) {
     *     let psaas = new PSaaS();
     *     let att = psaas.addAttachment("file.txt", data);
     *     psaas.addFileIgnition("2019-02-20T12:00:00", att, "No comment");
     * });
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
PSaaS.PARAM_COMMENT = "GLOBALCOMMENTS";
exports.PSaaS = PSaaS;
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
     * @param string $jobname The name of the job to delete.
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