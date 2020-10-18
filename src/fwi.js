"use strict";
/**
 * Call PSaaS Builder to calculate FWI values for a given
 * set of inputs.
 *
 * Example
 * -------
 *
 * ```javascript
 * //populate the calculator with example values
 * let calculator = new FwiCalculations();
 * calculator.date = "2014-10-4 12:18:00";
 * calculator.dst = 1;
 * calculator.location = new LatLon(49.78, -97.15);
 * calculator.noonTemp = 8.0;
 * calculator.noonRh = 44;
 * calculator.noonPrecip = 0;
 * calculator.noonWindSpeed = 18.0;
 * calculator.hourlyMethod = FWICalculationMethod.VAN_WAGNER;
 * calculator.temp = 5;
 * calculator.rh = 53;
 * calculator.precip = 0;
 * calculator.windSpeed = 10;
 * calculator.prevHourFFMC = 85.0;
 * calculator.ystrdyFFMC = 85.0;
 * calculator.ystrdyDMC = 25.0;
 * calculator.ystrdyDC = 200.0;
 * await calculator.FWICalculateDailyStatisticsPromise();
 * //************* calculator should now contain calculated FWI values ************************
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FwiCalculations = exports.FWICalculationMethod = void 0;
/** ignore this comment */
const net = require("net");
const psaasGlobals_1 = require("./psaasGlobals");
var FWICalculationMethod;
(function (FWICalculationMethod) {
    FWICalculationMethod[FWICalculationMethod["VAN_WAGNER"] = 0] = "VAN_WAGNER";
    FWICalculationMethod[FWICalculationMethod["LAWSON"] = 1] = "LAWSON";
})(FWICalculationMethod = exports.FWICalculationMethod || (exports.FWICalculationMethod = {}));
class FwiCalculations {
    constructor() {
        /**
         * The number of hours adjusted for DST. Leave 0 for no DST.
         */
        this.dst = 0;
    }
    /**
     * Calculate the FWI statistics from the given inputs.
     * @param callback A method that will be called when the FWI calculation has been completed.
     * @throws This method can only be called once at a time per instance.
     */
    FWICalculateDailyStatistics(callback) {
        this.FWICalculateDailyStatisticsInternal(callback);
    }
    /**
     * Calculate the FWI statistics from the given inputs.
     * @returns The current {@link FwiCalculations} object with the calculated daily
     *          statistics values populated.
     */
    async FWICalculateDailyStatisticsPromise() {
        return await new Promise((resolve, reject) => {
            this.FWICalculateDailyStatisticsInternal(resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /*
     * Calculates the FWI statistics from the passed inputs
     * @returns The calculated FWI statistics
     */
    FWICalculateDailyStatisticsInternal(callback, error) {
        let d = new Date(this.date);
        let month = d.getMonth();
        let hour = d.getHours();
        let min = d.getMinutes();
        let sec = d.getSeconds();
        FwiCalculations.dailyFFMCVanWagnerPromise(this.ystrdyFFMC, this.noonPrecip, this.noonTemp, this.noonRh * 0.01, this.noonWindSpeed)
            .then((val) => {
            this.calc_dailyFfmc = +val;
            return FwiCalculations.dCPromise(this.ystrdyDC, this.noonPrecip, this.noonTemp, this.location.latitude, this.location.longitude, month - 1);
        }, error)
            .then((val) => {
            this.calc_dailyDc = +val;
            return FwiCalculations.dMCPromise(this.ystrdyDMC, this.noonPrecip, this.noonTemp, this.location.latitude, this.location.longitude, month - 1, this.noonRh * 0.01);
        }, error)
            .then((val) => {
            this.calc_dailyDmc = +val;
            return FwiCalculations.buiPromise(this.calc_dailyDc, this.calc_dailyDmc);
        }, error)
            .then((val) => {
            this.calc_dailyBui = +val;
            return FwiCalculations.isiFWIPromise(this.calc_dailyFfmc, this.noonWindSpeed, psaasGlobals_1.Duration.createTime(24, 0, 0, false));
        }, error)
            .then((val) => {
            this.calc_dailyIsi = +val;
            return FwiCalculations.fwiPromise(this.calc_dailyIsi, this.calc_dailyBui);
        }, error)
            .then((val) => {
            this.calc_dailyFwi = +val;
            return FwiCalculations.dsrPromise(this.calc_dailyFwi);
        }, error)
            .then((val) => {
            this.calc_dailyDsr = +val;
            if (this.hourlyMethod == FWICalculationMethod.LAWSON) {
                return FwiCalculations.hourly_ffmc_lawson_promise(this.ystrdyFFMC, this.calc_dailyFfmc, this.rh * 0.01, psaasGlobals_1.Duration.createTime(hour - this.dst, 0, 0, false));
            }
            else {
                return FwiCalculations.hourly_ffmc_van_wagner_promise(this.prevHourFFMC, this.precip, this.temp, this.rh * 0.01, this.windSpeed, psaasGlobals_1.Duration.createTime(1, 0, 0, false));
            }
        }, error)
            .then((val) => {
            this.calc_hourlyFfmc = +val;
            return FwiCalculations.isiFWIPromise(this.calc_hourlyFfmc, this.windSpeed, psaasGlobals_1.Duration.createTime(0, min, sec, false));
        }, error)
            .then((val) => {
            this.calc_hourlyIsi = +val;
            return FwiCalculations.fwiPromise(this.calc_hourlyIsi, this.calc_dailyBui);
        }, error)
            .then((val) => {
            this.calc_hourlyFwi = +val;
            if (callback) {
                callback(this);
            }
        }, error);
    }
    /**
     * Calculate the hourly FFMC.
     *
     * Calculates hourly FFMC (fine fuel moisture code), using Van Wagner's mathematical model, based on the previous hour's FFMC and provided conditions. FFMC is a numerical rating of the moisture content of litter and other cured fine fuels.
     * @param inFFMC The previous time's Van Wagner FFMC value.
     * @param rain Precipitation since observed FFMC (mm).
     * @param temperature The temperature (Celsius).
     * @param rh Relative humidity expressed as a fraction ([0..1]).
     * @param ws Wind speed (kph).
     * @param span Seconds since observed ffmc.
     */
    static hourly_ffmc_van_wagner(inFFMC, rain, temperature, rh, ws, span, callback) {
        let tmp = inFFMC + '|' + rain + '|' + temperature + '|' + rh + '|' + ws + '|' + span;
        (new ValueGetter()).getValue(FwiCalculations.KEY_HOURLY_FFMC_VAN_WAGNER, tmp, callback);
    }
    /**
     * Calculate the hourly FFMC.
     *
     * Calculates hourly FFMC (fine fuel moisture code), using Van Wagner's mathematical model, based on the previous hour's FFMC and provided conditions. FFMC is a numerical rating of the moisture content of litter and other cured fine fuels.
     * @param inFFMC The previous time's Van Wagner FFMC value.
     * @param rain Precipitation since observed FFMC (mm).
     * @param temperature The temperature (Celsius).
     * @param rh Relative humidity expressed as a fraction ([0..1]).
     * @param ws Wind speed (kph).
     * @param span Seconds since observed ffmc.
     * @returns The calculated FFMC value stored as a string.
     */
    static async hourly_ffmc_van_wagner_promise(inFFMC, rain, temperature, rh, ws, span) {
        let tmp = inFFMC + '|' + rain + '|' + temperature + '|' + rh + '|' + ws + '|' + span;
        return await new Promise((resolve, reject) => {
            (new ValueGetter()).getValue(FwiCalculations.KEY_HOURLY_FFMC_VAN_WAGNER, tmp, resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /**
     * Calculate the hourly FFMC.
     *
     * Calculates hourly FFMC (fine fuel moisture code), using the experimental Equilibrium mathematical model developed by K. Anderson, based on the previous hour's FFMC and provided conditions. FFMC is a numerical rating of the moisture content of litter and other cured fine fuels.
     * @param inFFMC The previous time's Van Wagner FFMC value.
     * @param rain Precipitation in the prior hour (mm).
     * @param temperature The prior hours temperature (Celsius).
     * @param rh Relative humidity expressed as a fraction ([0..1]).
     * @param ws Wind speed (kph).
     * @param span Number of seconds since observed FFMC.
     */
    static hourly_ffmc_equilibrium(inFFMC, rain, temperature, rh, ws, span, callback) {
        let tmp = inFFMC + '|' + rain + '|' + temperature + '|' + rh + '|' + ws + '|' + span;
        (new ValueGetter()).getValue(FwiCalculations.KEY_HOURLY_FFMC_EQUILIBRIUM, tmp, callback);
    }
    /**
     * Calculate the hourly FFMC.
     *
     * Calculates hourly FFMC (fine fuel moisture code), using the experimental Equilibrium mathematical model developed by K. Anderson, based on the previous hour's FFMC and provided conditions. FFMC is a numerical rating of the moisture content of litter and other cured fine fuels.
     * @param inFFMC The previous time's Van Wagner FFMC value.
     * @param rain Precipitation in the prior hour (mm).
     * @param temperature The prior hours temperature (Celsius).
     * @param rh Relative humidity expressed as a fraction ([0..1]).
     * @param ws Wind speed (kph).
     * @param span Number of seconds since observed FFMC.
     * @returns The calculated FFMC value stored as a string.
     */
    static async hourly_ffmc_equilibrium_promise(inFFMC, rain, temperature, rh, ws, span) {
        let tmp = inFFMC + '|' + rain + '|' + temperature + '|' + rh + '|' + ws + '|' + span;
        return await new Promise((resolve, reject) => {
            (new ValueGetter()).getValue(FwiCalculations.KEY_HOURLY_FFMC_EQUILIBRIUM, tmp, resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /**
     * Calculate the hourly FFMC.
     *
     * Calculates hourly FFMC (fine fuel moisture code), using Lawson's mathematical model, based on the previous and current daily FFMC values (using Van Wagner) and provided conditions. FFMC is a numerical rating of the moisture content of litter and other cured fine fuels.
     * @param prevFFMC The previous day's standard daily Van Wagner FFMC value.
     * @param currFFMC The current day's standard daily Van Wagner FFMC value.
     * @param rh Relative humidity expressed as a fraction ([0..1]).
     * @param span The time to calculate the FFMC value for (seconds into day).
     */
    static hourly_ffmc_lawson(prevFFMC, currFFMC, rh, span, callback) {
        let tmp = prevFFMC + '|' + currFFMC + '|' + rh + '|' + span;
        (new ValueGetter()).getValue(FwiCalculations.KEY_HOURLY_FFMC_LAWSON, tmp, callback);
    }
    /**
     * Calculate the hourly FFMC.
     *
     * Calculates hourly FFMC (fine fuel moisture code), using Lawson's mathematical model, based on the previous and current daily FFMC values (using Van Wagner) and provided conditions. FFMC is a numerical rating of the moisture content of litter and other cured fine fuels.
     * @param prevFFMC The previous day's standard daily Van Wagner FFMC value.
     * @param currFFMC The current day's standard daily Van Wagner FFMC value.
     * @param rh Relative humidity expressed as a fraction ([0..1]).
     * @param span The time to calculate the FFMC value for (seconds into day).
     * @returns The calculated FFMC value stored as a string.
     */
    static async hourly_ffmc_lawson_promise(prevFFMC, currFFMC, rh, span) {
        let tmp = prevFFMC + '|' + currFFMC + '|' + rh + '|' + span;
        return await new Promise((resolve, reject) => {
            (new ValueGetter()).getValue(FwiCalculations.KEY_HOURLY_FFMC_LAWSON, tmp, resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /**
     * Calculate the previous hours FFMC.
     *
     * Calculates the previous hourly FFMC (fine fuel moisture code), using Van Wagner's mathematical model, based on the current hour's FFMC and previous hour's provided conditions. FFMC is a numerical rating of the moisture content of litter and other cured fine fuels.
     * @param currFFMC The current time's Van Wagner FFMC value.
     * @param rain Precipitation in the prior hour (mm).
     * @param temperature The prior hours temperature (Celsius).
     * @param rh Relative humidity expressed as a fraction ([0..1]).
     * @param ws Wind speed (kph).
     */
    static hourlyFFMCVanWagnerPrevious(currFFMC, rain, temperature, rh, ws, callback) {
        let tmp = currFFMC + '|' + rain + '|' + temperature + '|' + rh + '|' + ws;
        (new ValueGetter()).getValue(FwiCalculations.KEY_HOURLY_FFMC_VAN_WAGNER_PREVIOUS, tmp, callback);
    }
    /**
     * Calculate the previous hours FFMC.
     *
     * Calculates the previous hourly FFMC (fine fuel moisture code), using Van Wagner's mathematical model, based on the current hour's FFMC and previous hour's provided conditions. FFMC is a numerical rating of the moisture content of litter and other cured fine fuels.
     * @param currFFMC The current time's Van Wagner FFMC value.
     * @param rain Precipitation in the prior hour (mm).
     * @param temperature The prior hours temperature (Celsius).
     * @param rh Relative humidity expressed as a fraction ([0..1]).
     * @param ws Wind speed (kph).
     * @returns The calculated previous hours FFMC value stored as a string.
     */
    static async hourlyFFMCVanWagnerPreviousPromise(currFFMC, rain, temperature, rh, ws) {
        let tmp = currFFMC + '|' + rain + '|' + temperature + '|' + rh + '|' + ws;
        return await new Promise((resolve, reject) => {
            (new ValueGetter()).getValue(FwiCalculations.KEY_HOURLY_FFMC_VAN_WAGNER_PREVIOUS, tmp, resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /**
     * Calculate the previous hours FFMC.
     *
     * Calculates the previous hourly FFMC (fine fuel moisture code), using equilibrium mathematical model, based on the current hour's FFMC and previous hour's provided conditions. FFMC is a numerical rating of the moisture content of litter and other cured fine fuels.
     * @param currFFMC The previous time's equilibrium FFMC value.
     * @param rain Precipitation in the prior hour (mm).
     * @param temperature The prior hours temperature (Celsius).
     * @param rh Relative humidity expressed as a fraction ([0..1]).
     * @param ws Wind speed (kph).
     */
    static hourlyFFMCEquilibriumPrevious(currFFMC, rain, temperature, rh, ws, callback) {
        let tmp = currFFMC + '|' + rain + '|' + temperature + '|' + rh + '|' + ws;
        (new ValueGetter()).getValue(FwiCalculations.KEY_HOURLY_FFMC_EQUILIBRIUM_PREVIOUS, tmp, callback);
    }
    /**
     * Calculate the previous hours FFMC.
     *
     * Calculates the previous hourly FFMC (fine fuel moisture code), using equilibrium mathematical model, based on the current hour's FFMC and previous hour's provided conditions. FFMC is a numerical rating of the moisture content of litter and other cured fine fuels.
     * @param currFFMC The previous time's equilibrium FFMC value.
     * @param rain Precipitation in the prior hour (mm).
     * @param temperature The prior hours temperature (Celsius).
     * @param rh Relative humidity expressed as a fraction ([0..1]).
     * @param ws Wind speed (kph).
     * @returns The calculated previous hour's FFMC value stored as a string.
     */
    static async hourlyFFMCEquilibriumPreviousPromise(currFFMC, rain, temperature, rh, ws) {
        let tmp = currFFMC + '|' + rain + '|' + temperature + '|' + rh + '|' + ws;
        return await new Promise((resolve, reject) => {
            (new ValueGetter()).getValue(FwiCalculations.KEY_HOURLY_FFMC_EQUILIBRIUM_PREVIOUS, tmp, resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /**
     * Calculates a contiguous hourly FFMC.
     *
     * Calculates a contiguous hourly FFMC (fine fuel moisture code), using Lawson's mathematical model, based on the daily Van Wagner FFMC values for the previous and current days, as well as current provided conditions. FFMC is a numerical rating of the moisture content of litter and other cured fine fuels. This technique uses linear interpolation between 11am and noon LST. It also applies similar smoothing in morning hours.
     * @param prevFFMC The previous day's standard daily Van Wagner FFMC value.
     * @param currFFMC The current day's standard daily Van Wagner FFMC value.
     * @param rh0 Relative humidity at the start of the hour, expressed as a fraction ([0..1]).
     * @param rh Instantaneous relative humidity expressed as a fraction ([0..1]).
     * @param rh1 Relative humidity at the end of the hour (start of next hour) expressed as a fraction ([0..1]).
     * @param seconds_into_day The time to calculate the FFMC value for.
     */
    static hourlyFFMCLawsonContiguous(prevFFMC, currFFMC, rh0, rh, rh1, seconds_into_day, callback) {
        let tmp = prevFFMC + '|' + currFFMC + '|' + rh0 + '|' + rh + '|' + rh1 + '|' + seconds_into_day;
        (new ValueGetter()).getValue(FwiCalculations.KEY_HOURLY_FFMC_LAWSON_CONTIGUOUS, tmp, callback);
    }
    /**
     * Calculates a contiguous hourly FFMC.
     *
     * Calculates a contiguous hourly FFMC (fine fuel moisture code), using Lawson's mathematical model, based on the daily Van Wagner FFMC values for the previous and current days, as well as current provided conditions. FFMC is a numerical rating of the moisture content of litter and other cured fine fuels. This technique uses linear interpolation between 11am and noon LST. It also applies similar smoothing in morning hours.
     * @param prevFFMC The previous day's standard daily Van Wagner FFMC value.
     * @param currFFMC The current day's standard daily Van Wagner FFMC value.
     * @param rh0 Relative humidity at the start of the hour, expressed as a fraction ([0..1]).
     * @param rh Instantaneous relative humidity expressed as a fraction ([0..1]).
     * @param rh1 Relative humidity at the end of the hour (start of next hour) expressed as a fraction ([0..1]).
     * @param seconds_into_day The time to calculate the FFMC value for.
     * @returns The contiguous hourly FFMC stored as a string.
     */
    static async hourlyFFMCLawsonContiguousPromise(prevFFMC, currFFMC, rh0, rh, rh1, seconds_into_day) {
        let tmp = prevFFMC + '|' + currFFMC + '|' + rh0 + '|' + rh + '|' + rh1 + '|' + seconds_into_day;
        return await new Promise((resolve, reject) => {
            (new ValueGetter()).getValue(FwiCalculations.KEY_HOURLY_FFMC_LAWSON_CONTIGUOUS, tmp, resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /**
     * Calculates the daily FFMC.
     *
     * Calculates daily FFMC (fine fuel moisture code), based on the previous day's FFMC and provided conditions. FFMC is a numerical rating of the moisture content of litter and other cured fine fuels.
     * @param inFFMC The previous day's Van Wagner FFMC value.
     * @param rain Precipitation in the prior 24 hours (noon to noon, LST) (mm).
     * @param temperature Noon (LST) temperature (Celsius).
     * @param rh Relative humidity expressed as a fraction ([0..1]).
     * @param ws Wind speed (kph) at noon LST.
     */
    static dailyFFMCVanWagner(inFFMC, rain, temperature, rh, ws, callback) {
        let tmp = inFFMC + '|' + rain + '|' + temperature + '|' + rh + '|' + ws;
        (new ValueGetter()).getValue(FwiCalculations.KEY_DAILY_FFMC_VAN_WAGNER, tmp, callback);
    }
    /**
     * Calculates the daily FFMC.
     *
     * Calculates daily FFMC (fine fuel moisture code), based on the previous day's FFMC and provided conditions. FFMC is a numerical rating of the moisture content of litter and other cured fine fuels.
     * @param inFFMC The previous day's Van Wagner FFMC value.
     * @param rain Precipitation in the prior 24 hours (noon to noon, LST) (mm).
     * @param temperature Noon (LST) temperature (Celsius).
     * @param rh Relative humidity expressed as a fraction ([0..1]).
     * @param ws Wind speed (kph) at noon LST.
     * @returns The calculated daily FFMC stored as a string.
     */
    static async dailyFFMCVanWagnerPromise(inFFMC, rain, temperature, rh, ws) {
        let tmp = inFFMC + '|' + rain + '|' + temperature + '|' + rh + '|' + ws;
        return await new Promise((resolve, reject) => {
            (new ValueGetter()).getValue(FwiCalculations.KEY_DAILY_FFMC_VAN_WAGNER, tmp, resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /**
     * Calculates the duff moisture code.
     *
     * Calculates daily DMC (duff moisture code) given the previous day's DMC and provided conditions. DMC provides a numerical rating of the average moisture content of the loosely compact organic layers of a moderate depth (5-10cm).
     * @param inDMC The previous day's DMC value.
     * @param rain Precipitation in the prior 24 hours (noon to noon, LST) (mm).
     * @param temperature Noon (LST) temperature (Celsius).
     * @param latitude Radians, used to determine the appropriate table as defined in "Latitude Considerations in Adapting the Canadian Forest Fire Weather Index System To Other Countries", M.E. Alexander, in prep as Index X in Weather Guide for the Canadian Forest Fire Danger Rating System by B.D. Lawson, O.B. Armitage.
     * @param longitude Radians, reserved for future use, currently unused (may be if/as/when more regional constants are defined).
     * @param month Origin 0 (January = 0, December = 11)
     * @param rh Relative humidity expressed as a fraction ([0..1]) at noon LST.
     */
    static dMC(inDMC, rain, temperature, latitude, longitude, month, rh, callback) {
        let tmp = inDMC + '|' + rain + '|' + temperature + '|' + latitude + '|' + longitude + '|' + month + '|' + rh;
        (new ValueGetter()).getValue(FwiCalculations.KEY_DMC, tmp, callback);
    }
    /**
     * Calculates the duff moisture code.
     *
     * Calculates daily DMC (duff moisture code) given the previous day's DMC and provided conditions. DMC provides a numerical rating of the average moisture content of the loosely compact organic layers of a moderate depth (5-10cm).
     * @param inDMC The previous day's DMC value.
     * @param rain Precipitation in the prior 24 hours (noon to noon, LST) (mm).
     * @param temperature Noon (LST) temperature (Celsius).
     * @param latitude Radians, used to determine the appropriate table as defined in "Latitude Considerations in Adapting the Canadian Forest Fire Weather Index System To Other Countries", M.E. Alexander, in prep as Index X in Weather Guide for the Canadian Forest Fire Danger Rating System by B.D. Lawson, O.B. Armitage.
     * @param longitude Radians, reserved for future use, currently unused (may be if/as/when more regional constants are defined).
     * @param month Origin 0 (January = 0, December = 11)
     * @param rh Relative humidity expressed as a fraction ([0..1]) at noon LST.
     * @returns The calculated duff moisture code stored as a string.
     */
    static async dMCPromise(inDMC, rain, temperature, latitude, longitude, month, rh) {
        let tmp = inDMC + '|' + rain + '|' + temperature + '|' + latitude + '|' + longitude + '|' + month + '|' + rh;
        return await new Promise((resolve, reject) => {
            (new ValueGetter()).getValue(FwiCalculations.KEY_DMC, tmp, resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /**
     * Calculates the drought code.
     *
     * Calculates DC (drought code) given the previous day's DC and provided conditions. DC provides a numerical rating of the average moisture content of the deep (10-24 cm), compact organic layers.
     * @param inDC The previous day's DC value.
     * @param rain Precipitation in the prior 24 hours (noon to noon, LST) (mm).
     * @param temperature Noon (LST) temperature (Celsius).
     * @param latitude Radians, used to determine the appropriate table as defined in "Latitude Considerations in Adapting the Canadian Forest Fire Weather Index System To Other Countries", M.E. Alexander, in prep as Index X in Weather Guide for the Canadian Forest Fire Danger Rating System by B.D. Lawson, O.B. Armitage.
     * @param longitude Radians, reserved for future use, currently unused (may be if/as/when more regional constants are defined).
     * @param month Origin 0 (January = 0, December = 11).
     */
    static dC(inDC, rain, temperature, latitude, longitude, month, callback) {
        let tmp = inDC + '|' + rain + '|' + temperature + '|' + latitude + '|' + longitude + '|' + month;
        (new ValueGetter()).getValue(FwiCalculations.KEY_DC, tmp, callback);
    }
    /**
     * Calculates the drought code.
     *
     * Calculates DC (drought code) given the previous day's DC and provided conditions. DC provides a numerical rating of the average moisture content of the deep (10-24 cm), compact organic layers.
     * @param inDC The previous day's DC value.
     * @param rain Precipitation in the prior 24 hours (noon to noon, LST) (mm).
     * @param temperature Noon (LST) temperature (Celsius).
     * @param latitude Radians, used to determine the appropriate table as defined in "Latitude Considerations in Adapting the Canadian Forest Fire Weather Index System To Other Countries", M.E. Alexander, in prep as Index X in Weather Guide for the Canadian Forest Fire Danger Rating System by B.D. Lawson, O.B. Armitage.
     * @param longitude Radians, reserved for future use, currently unused (may be if/as/when more regional constants are defined).
     * @param month Origin 0 (January = 0, December = 11).
     * @returns The calculated drought code stored as a string.
     */
    static async dCPromise(inDC, rain, temperature, latitude, longitude, month) {
        let tmp = inDC + '|' + rain + '|' + temperature + '|' + latitude + '|' + longitude + '|' + month;
        return await new Promise((resolve, reject) => {
            (new ValueGetter()).getValue(FwiCalculations.KEY_DC, tmp, resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /**
     * Calculates f(F), which is used to calculate ISI from FFMC.
     * @param ffmc FFMC value.
     * @param seconds Time since observed FFMC.
     */
    static ff(ffmc, seconds, callback) {
        let tmp = ffmc + '|' + seconds;
        (new ValueGetter()).getValue(FwiCalculations.KEY_FF, tmp, callback);
    }
    /**
     * Calculates f(F), which is used to calculate ISI from FFMC.
     * @param ffmc FFMC value.
     * @param seconds Time since observed FFMC.
     * @returns The calculated f(F) stored as a string.
     */
    static async ffPromise(ffmc, seconds) {
        let tmp = ffmc + '|' + seconds;
        return await new Promise((resolve, reject) => {
            (new ValueGetter()).getValue(FwiCalculations.KEY_FF, tmp, resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /**
     * Calculates ISI from FFMC and wind speed.
     *
     * ISI provides a numerical rating of the relative expected rate of fire spread.
     * @param ffmc FFMC value.
     * @param ws Wind speed (kph).
     * @param dur Time since observed FFMC.
     */
    static isiFWI(ffmc, ws, dur, callback) {
        let tmp = ffmc + '|' + ws + '|' + dur;
        (new ValueGetter()).getValue(FwiCalculations.KEY_ISI_FWI, tmp, callback);
    }
    /**
     * Calculates ISI from FFMC and wind speed.
     *
     * ISI provides a numerical rating of the relative expected rate of fire spread.
     * @param ffmc FFMC value.
     * @param ws Wind speed (kph).
     * @param dur Time since observed FFMC.
     * @returns The calculated ISI stored as a string.
     */
    static async isiFWIPromise(ffmc, ws, dur) {
        let tmp = ffmc + '|' + ws + '|' + dur;
        return await new Promise((resolve, reject) => {
            (new ValueGetter()).getValue(FwiCalculations.KEY_ISI_FWI, tmp, resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /**
     * Calculates ISI from FFMC and wind speed.
     *
     * ISI provides a numerical rating of the relative expected rate of fire spread. The FBP system uses a local site-specific ISI influenced by topography.
     * @param ffmc FFMC value.
     * @param ws Wind speed (kph).
     * @param dur Time since observed FFMC.
     */
    static isiFBP(ffmc, ws, dur, callback) {
        let tmp = ffmc + '|' + ws + '|' + dur;
        (new ValueGetter()).getValue(FwiCalculations.KEY_ISI_FBP, tmp, callback);
    }
    /**
     * Calculates ISI from FFMC and wind speed.
     *
     * ISI provides a numerical rating of the relative expected rate of fire spread. The FBP system uses a local site-specific ISI influenced by topography.
     * @param ffmc FFMC value.
     * @param ws Wind speed (kph).
     * @param dur Time since observed FFMC.
     * @returns The calculated ISI stored as a string.
     */
    static async isiFBPPromise(ffmc, ws, dur) {
        let tmp = ffmc + '|' + ws + '|' + dur;
        return await new Promise((resolve, reject) => {
            (new ValueGetter()).getValue(FwiCalculations.KEY_ISI_FBP, tmp, resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /**
     * Calculate BUI (buildup index) from DC, DMC.
     *
     * BUI provides a numerical, relative indication of the amount of fuel available for combustion.
     * @param dc DC value.
     * @param dmc DMC value.
     */
    static bui(dc, dmc, callback) {
        let tmp = dc + '|' + dmc;
        (new ValueGetter()).getValue(FwiCalculations.KEY_BUI, tmp, callback);
    }
    /**
     * Calculate BUI (buildup index) from DC, DMC.
     *
     * BUI provides a numerical, relative indication of the amount of fuel available for combustion.
     * @param dc DC value.
     * @param dmc DMC value.
     * @returns The calculated BUI stored as a string.
     */
    static async buiPromise(dc, dmc) {
        let tmp = dc + '|' + dmc;
        return await new Promise((resolve, reject) => {
            (new ValueGetter()).getValue(FwiCalculations.KEY_BUI, tmp, resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /**
     * Calculates FWI (fire weather index) from ISI and BUI.
     *
     * FWI provides a numerical, relative rating of fire intensity.
     * @param isi ISI value.
     * @param bui BUI value.
     */
    static fwi(isi, bui, callback) {
        let tmp = isi + '|' + bui;
        (new ValueGetter()).getValue(FwiCalculations.KEY_FWI, tmp, callback);
    }
    /**
     * Calculates FWI (fire weather index) from ISI and BUI.
     *
     * FWI provides a numerical, relative rating of fire intensity.
     * @param isi ISI value.
     * @param bui BUI value.
     * @returns The calculated FWI stored as a string.
     */
    static async fwiPromise(isi, bui) {
        let tmp = isi + '|' + bui;
        return await new Promise((resolve, reject) => {
            (new ValueGetter()).getValue(FwiCalculations.KEY_FWI, tmp, resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /**
     * Calculates DSR from FWI.
     */
    static dsr(fwi, callback) {
        let tmp = "" + fwi;
        (new ValueGetter()).getValue(FwiCalculations.KEY_DSR, tmp, callback);
    }
    /**
     * Calculates DSR from FWI.
     * @returns The calculated DSR stored as a string.
     */
    static async dsrPromise(fwi) {
        let tmp = "" + fwi;
        return await new Promise((resolve, reject) => {
            (new ValueGetter()).getValue(FwiCalculations.KEY_DSR, tmp, resolve, reject);
        })
            .catch(err => { throw err; });
    }
}
exports.FwiCalculations = FwiCalculations;
FwiCalculations.KEY_HOURLY_FFMC_VAN_WAGNER = "HOURLY_FFMC_VAN_WAGNER";
FwiCalculations.KEY_HOURLY_FFMC_EQUILIBRIUM = "HOURLY_FFMC_EQUILIBRIUM";
FwiCalculations.KEY_HOURLY_FFMC_LAWSON = "HOURLY_FFMC_LAWSON";
FwiCalculations.KEY_HOURLY_FFMC_VAN_WAGNER_PREVIOUS = "HOURLY_FFMC_VAN_WAGNER_PREVIOUS";
FwiCalculations.KEY_HOURLY_FFMC_EQUILIBRIUM_PREVIOUS = "HOURLY_FFMC_EQUILIBRIUM_PREVIOUS";
FwiCalculations.KEY_HOURLY_FFMC_LAWSON_CONTIGUOUS = "HOURLY_FFMC_LAWSON_CONTIGUOUS";
FwiCalculations.KEY_DAILY_FFMC_VAN_WAGNER = "DAILY_FFMC_VAN_WAGNER";
FwiCalculations.KEY_DMC = "DMC";
FwiCalculations.KEY_DC = "DC";
FwiCalculations.KEY_FF = "FF";
FwiCalculations.KEY_ISI_FWI = "ISI_FWI";
FwiCalculations.KEY_ISI_FBP = "ISI_FBP";
FwiCalculations.KEY_BUI = "BUI";
FwiCalculations.KEY_FWI = "FWI";
FwiCalculations.KEY_DSR = "DSR";
class ValueGetter extends psaasGlobals_1.IPSaaSSerializable {
    /*
     * This method connects to the builder and retrieves the specified value
     *
     */
    getValue(key, data, callback, error) {
        this.fetchState = -1;
        let retval = '';
        let builder = net.connect({ port: psaasGlobals_1.SocketHelper.getPort(), host: psaasGlobals_1.SocketHelper.getAddress() }, function () {
            psaasGlobals_1.PSaaSLogger.getInstance().debug(`connected to builder, getting FWI value ${key} !`);
            builder.write(psaasGlobals_1.SocketMsg.STARTUP + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(key + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(data + psaasGlobals_1.SocketMsg.NEWLINE);
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
                callback(retval);
            }
            psaasGlobals_1.PSaaSLogger.getInstance().debug("disconnected from builder");
        });
    }
}
//# sourceMappingURL=fwi.js.map