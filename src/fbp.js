"use strict";
/**
 * Request PSaaS Builder to calculate FBP values from
 * the given inputs.
 *
 * Example
 * -------
 *
 * ```javascript
 * //cache the FBP fuel type defaults
 * let fuelCache = await FbpCalculations.getFuelsWithDefaultsPromise();
 *
 * //populate the calculator with example values
 * let calculator = new FbpCalculations();
 * calculator.fuelType = "C-1";
 * calculator.elevation = 500;
 * calculator.useSlope = false;
 * calculator.slopeValue = 0;
 * calculator.aspect = 0;
 * calculator.useLine = false;
 * calculator.startTime = "2019-01-01T12:00:00";
 * calculator.elapsedTime = 60;
 * calculator.ffmc = 85;
 * calculator.bui = 40;
 * calculator.useBui = true;
 * calculator.windSpeed = 10;
 * calculator.windDirection = 0;
 * calculator.latitude = 62.454;
 * calculator.longitude = -114.3718;
 * await calculator.calculatePromise();
 * //******* calculator is now populated with FBP values **********
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FbpCalculations = exports.FuelType = exports.FuelTypeDefaults = void 0;
/** ignore this comment */
const net = require("net");
const psaasGlobals_1 = require("./psaasGlobals");
class FuelTypeDefaults {
    constructor() {
        this.useCrownBase = false;
        this.usePercentConifer = false;
        this.usePercentDeadFir = false;
        this.useGrassCuring = false;
        this.useGrassFuelLoad = false;
    }
}
exports.FuelTypeDefaults = FuelTypeDefaults;
/**
 * An FBP fuel type.
 */
class FuelType {
    constructor() {
        /**
         * Get a full display string for the fuel type.
         */
        this.toString = () => {
            return this.name + ": " + this.desc;
        };
    }
}
exports.FuelType = FuelType;
class FbpCalculations extends psaasGlobals_1.IPSaaSSerializable {
    constructor() {
        super();
        this.fuelType = "C-1";
        this.crownBase = 7;
        this.percentConifer = 50;
        this.percentDeadFir = 50;
        this.grassCuring = 60;
        this.grassFuelLoad = 0.35;
        this.ffmc = 85;
        this.dmc = 25;
        this.dc = 200;
        this.bui = 40;
        this.useBui = true;
        this.windSpeed = 0;
        this.windDirection = 0;
        this.elevation = 500;
        this.slopeValue = 0;
        this.useSlope = true;
        this.aspect = 0;
        this.useLine = false;
        this.startTime = "2019-01-01T12:00";
        this.elapsedTime = 60;
        this.latitude = 62.454;
        this.longitude = -114.3718;
        this.isCalculated = false;
    }
    /**
     * Set the fuel type. If the fuel type has defaults specified the required defaults will
     * override any value specified for them in this class.
     * @param fuelType The fuel type to use.
     */
    setFuelType(fuelType) {
        this.fuelType = fuelType.name;
        if (fuelType.defaults != null) {
            if (fuelType.defaults.useCrownBase) {
                this.crownBase = fuelType.defaults.crownBase;
            }
            if (fuelType.defaults.usePercentConifer) {
                this.percentConifer = fuelType.defaults.percentConifer;
            }
            if (fuelType.defaults.usePercentDeadFir) {
                this.percentDeadFir = fuelType.defaults.percentDeadFir;
            }
            if (fuelType.defaults.useGrassCuring) {
                this.grassCuring = fuelType.defaults.grassCuring;
            }
            if (fuelType.defaults.useGrassFuelLoad) {
                this.grassFuelLoad = fuelType.defaults.grassFuelLoad;
            }
        }
    }
    /**
     * Unset the fuel type defaults
     */
    unsetFuelType() {
        this.crownBase = null;
        this.percentConifer = null;
        this.percentDeadFir = null;
        this.grassCuring = null;
        this.grassFuelLoad = null;
    }
    /**
     * Calculate the FBP values. If there was an error during calculation a string indicating the cause of the error will be returned.
     */
    calculate(callback) {
        if (this.fetchState < 0) {
            throw new Error("Multiple concurrent reqeusts");
        }
        this.calculateInternal(callback);
    }
    /**
     * Calculate the FBP values. If there was an error during calculation a string indicating the cause of the error will be returned.
     * @returns The current {@link FbpCalculations} object.
     * @throws This method can only be called once at a time per instance.
     */
    async calculatePromise() {
        if (this.fetchState < 0) {
            throw new Error("Multiple concurrent reqeusts");
        }
        return await new Promise((resolve, reject) => {
            this.calculateInternal(resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /*
     * Connect to the builder and retrieve the FBP values
     * @returns Sets the isCalculated boolean based on the retrieval's success
     */
    calculateInternal(callback, error) {
        this.fetchState = -1;
        let stream = this.fuelType + '|' + this.crownBase + '|' + this.percentConifer + '|' + this.percentDeadFir;
        stream = stream + '|' + this.grassCuring + '|' + this.grassFuelLoad + '|' + this.ffmc + '|' + this.dmc;
        stream = stream + '|' + this.dc + '|' + this.bui + '|' + this.useBui + '|' + this.windSpeed;
        stream = stream + '|' + this.windDirection + '|' + this.elevation + '|' + this.slopeValue + '|' + this.useSlope;
        stream = stream + '|' + this.aspect + '|' + this.useLine + '|' + this.startTime + '|' + this.elapsedTime;
        stream = stream + '|' + this.latitude + '|' + this.longitude;
        let builder = net.connect({ port: psaasGlobals_1.SocketHelper.getPort(), host: psaasGlobals_1.SocketHelper.getAddress() }, function () {
            psaasGlobals_1.PSaaSLogger.getInstance().debug("connected to builder, calculating FBP values !");
            builder.write(psaasGlobals_1.SocketMsg.STARTUP + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(FbpCalculations.CALCULATE_KEY + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(stream + psaasGlobals_1.SocketMsg.NEWLINE);
        });
        builder.on('data', (data) => {
            let rawDefaults = data.toString();
            let list = rawDefaults.split('|');
            if (list.length == 25) {
                this.ros_t = +list[0];
                this.ros_eq = +list[1];
                this.fros = +list[2];
                this.lb = +list[3];
                this.bros = +list[4];
                this.rso = +list[5];
                this.hfi = +list[6];
                this.ffi = +list[7];
                this.bfi = +list[8];
                this.area = +list[9];
                this.perimeter = +list[10];
                this.distanceHead = +list[11];
                this.distanceBack = +list[12];
                this.distanceFlank = +list[13];
                this.csi = +list[14];
                this.cfb = +list[15];
                this.sfc = +list[16];
                this.tfc = +list[17];
                this.cfc = +list[18];
                this.isi = +list[19];
                this.fmc = +list[20];
                this.wsv = +list[21];
                this.raz = +list[22];
                this.fireDescription = list[23].replace(/\^/g, '\n');
                if (!this.useBui) {
                    this.bui = +list[24];
                }
                this.isCalculated = true;
            }
            else {
                psaasGlobals_1.PSaaSLogger.getInstance().error("Failed to calculate FBP values (" + rawDefaults + ")");
                this.isCalculated = false;
            }
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
                callback(this);
            }
            psaasGlobals_1.PSaaSLogger.getInstance().debug("disconnected from builder");
        });
    }
    /**
     * Get the list of fuel types from the server.
     */
    static getFuels(callback) {
        (new FuelsGetter()).getFuels(callback);
    }
    /**
     * Get the list of fuel types from the server.
     * @returns An array of {@link FuelType} without the default values populated.
     */
    static async getFuelsPromise() {
        return await new Promise((resolve, reject) => {
            (new FuelsGetter()).getFuels(resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /**
     * Get the list of fuel types from the server.
     */
    static getFuelsWithDefaults(callback) {
        (new FuelsGetter()).getFuelsWithDefaults(callback);
    }
    /**
     * Get the list of fuel types from the server.
     * @returns An array of {@link FuelType} with the default values populated.
     */
    static async getFuelsWithDefaultsPromise() {
        return await new Promise((resolve, reject) => {
            (new FuelsGetter()).getFuelsWithDefaults(resolve, reject);
        })
            .catch(err => { throw err; });
    }
}
exports.FbpCalculations = FbpCalculations;
FbpCalculations.CALCULATE_KEY = "FBP_CALCULATE";
/*
 * This class contains methods used to connect to the
 * builder and retrieve fuel type information
 */
class FuelsGetter extends psaasGlobals_1.IPSaaSSerializable {
    /*
     * This method connects to the builder and retrieves the fuel types
     * @returns An array of fuel types
     */
    getFuels(callback, error) {
        if (this.fetchState < 0) {
            throw new Error("Multiple concurrent reqeusts");
        }
        let retval = new Array();
        this.fetchState = -1;
        let builder = net.connect({ port: psaasGlobals_1.SocketHelper.getPort(), host: psaasGlobals_1.SocketHelper.getAddress() }, function () {
            psaasGlobals_1.PSaaSLogger.getInstance().debug("connected to builder, getting fuel types !");
            builder.write(psaasGlobals_1.SocketMsg.STARTUP + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(FuelsGetter.GET_FUELS_KEY + psaasGlobals_1.SocketMsg.NEWLINE);
        });
        builder.on('data', (data) => {
            let rawDefaults = data.toString();
            let list = rawDefaults.split('|');
            for (let i = 0; i < list.length;) {
                let el = new FuelType();
                el.name = list[i];
                i++;
                el.desc = list[i];
                i++;
                retval.push(el);
            }
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
                callback(retval);
            }
            psaasGlobals_1.PSaaSLogger.getInstance().debug("disconnected from builder");
        });
    }
    /*
     * This method connects to the builder and retrieves the fuel types as well as their default values
     * @returns An array of fuel types
     */
    getFuelsWithDefaults(callback, error) {
        if (this.fetchState < 0) {
            throw new Error("Multiple concurrent reqeusts");
        }
        let retval = new Array();
        this.fetchState = -1;
        let builder = net.connect({ port: psaasGlobals_1.SocketHelper.getPort(), host: psaasGlobals_1.SocketHelper.getAddress() }, function () {
            psaasGlobals_1.PSaaSLogger.getInstance().debug("connected to builder, getting fuel types !");
            builder.write(psaasGlobals_1.SocketMsg.STARTUP + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(FuelsGetter.GET_FUELS_V2_KEY + psaasGlobals_1.SocketMsg.NEWLINE);
        });
        builder.on('data', (data) => {
            let rawDefaults = data.toString();
            let list = rawDefaults.split('|');
            for (let i = 0; i < list.length;) {
                let el = new FuelType();
                el.name = list[i];
                i++;
                el.desc = list[i];
                i++;
                el.defaults = new FuelTypeDefaults();
                el.defaults.crownBase = +list[i];
                i++;
                el.defaults.percentConifer = +list[i];
                i++;
                el.defaults.percentDeadFir = +list[i];
                i++;
                el.defaults.grassCuring = +list[i];
                i++;
                el.defaults.grassFuelLoad = +list[i];
                i++;
                let bits = +list[i];
                el.defaults.useCrownBase = (bits & 1) > 0;
                el.defaults.usePercentConifer = (bits & 2) > 0;
                el.defaults.usePercentDeadFir = (bits & 4) > 0;
                el.defaults.useGrassCuring = (bits & 8) > 0;
                el.defaults.useGrassFuelLoad = (bits & 16) > 0;
                i++;
                retval.push(el);
            }
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
                callback(retval);
            }
            psaasGlobals_1.PSaaSLogger.getInstance().debug("disconnected from builder");
        });
    }
}
FuelsGetter.GET_FUELS_KEY = "FBP_GET_FUELS";
FuelsGetter.GET_FUELS_V2_KEY = "FBP_GET_FUELS_V2";
//# sourceMappingURL=fbp.js.map