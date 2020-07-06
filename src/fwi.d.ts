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
import { LatLon, Duration } from "./psaasGlobals";
export declare enum FWICalculationMethod {
    VAN_WAGNER = 0,
    LAWSON = 1
}
export declare class FwiCalculations {
    private static readonly KEY_HOURLY_FFMC_VAN_WAGNER;
    private static readonly KEY_HOURLY_FFMC_EQUILIBRIUM;
    private static readonly KEY_HOURLY_FFMC_LAWSON;
    private static readonly KEY_HOURLY_FFMC_VAN_WAGNER_PREVIOUS;
    private static readonly KEY_HOURLY_FFMC_EQUILIBRIUM_PREVIOUS;
    private static readonly KEY_HOURLY_FFMC_LAWSON_CONTIGUOUS;
    private static readonly KEY_DAILY_FFMC_VAN_WAGNER;
    private static readonly KEY_DMC;
    private static readonly KEY_DC;
    private static readonly KEY_FF;
    private static readonly KEY_ISI_FWI;
    private static readonly KEY_ISI_FBP;
    private static readonly KEY_BUI;
    private static readonly KEY_FWI;
    private static readonly KEY_DSR;
    /**
     * The date and time.
     */
    date: string;
    /**
     * The number of hours adjusted for DST. Leave 0 for no DST.
     */
    dst: number;
    /**
     * The location to calculate FWI values for.
     */
    location: LatLon;
    /**
     * The temperature at noon.
     */
    noonTemp: number;
    /**
     * The relative humidity at noon as a percent.
     */
    noonRh: number;
    /**
     * The amount of precipitation to noon.
     */
    noonPrecip: number;
    /**
     * The average wind speed at noon.
     */
    noonWindSpeed: number;
    /**
     * The method to calculate the hourly FFMC.
     */
    hourlyMethod: FWICalculationMethod;
    /**
     * Current temperature.
     */
    temp: number;
    /**
     * Current relative humidity.
     */
    rh: number;
    /**
     * Current hours precipitation.
     */
    precip: number;
    /**
     * Current wind speed.
     */
    windSpeed: number;
    /**
     * Previous hours FFMC.
     */
    prevHourFFMC: number;
    /**
     * Yesterdays FFMC.
     */
    ystrdyFFMC: number;
    /**
     * Yesterdays DMC
     */
    ystrdyDMC: number;
    /**
     * Yesterdays DC.
     */
    ystrdyDC: number;
    /**
     * The calculated daily FFMC.
     */
    calc_dailyFfmc: number;
    /**
     * The calculated DMC.
     */
    calc_dailyDmc: number;
    /**
     * The calculated DC.
     */
    calc_dailyDc: number;
    /**
     * The calculated daily ISI.
     */
    calc_dailyIsi: number;
    /**
     * The calculated BUI.
     */
    calc_dailyBui: number;
    /**
     * The calculated daily FWI.
     */
    calc_dailyFwi: number;
    /**
     * The calculated DSR.
     */
    calc_dailyDsr: number;
    /**
     * The calculated hourly FFMC.
     */
    calc_hourlyFfmc: number;
    /**
     * The calculated hourly ISI.
     */
    calc_hourlyIsi: number;
    /**
     * The calculated hourly FWI.
     */
    calc_hourlyFwi: number;
    /**
     * Calculate the FWI statistics from the given inputs.
     * @param callback A method that will be called when the FWI calculation has been completed.
     * @throws This method can only be called once at a time per instance.
     */
    FWICalculateDailyStatistics(callback?: (defaults: FwiCalculations) => any): void;
    /**
     * Calculate the FWI statistics from the given inputs.
     * @returns The current {@link FwiCalculations} object with the calculated daily
     *          statistics values populated.
     */
    FWICalculateDailyStatisticsPromise(): Promise<FwiCalculations>;
    private FWICalculateDailyStatisticsInternal;
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
    static hourly_ffmc_van_wagner(inFFMC: number, rain: number, temperature: number, rh: number, ws: number, span: Duration, callback?: (value: string) => any): void;
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
    static hourly_ffmc_van_wagner_promise(inFFMC: number, rain: number, temperature: number, rh: number, ws: number, span: Duration): Promise<string>;
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
    static hourly_ffmc_equilibrium(inFFMC: number, rain: number, temperature: number, rh: number, ws: number, span: Duration, callback?: (value: string) => any): void;
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
    static hourly_ffmc_equilibrium_promise(inFFMC: number, rain: number, temperature: number, rh: number, ws: number, span: Duration): Promise<string>;
    /**
     * Calculate the hourly FFMC.
     *
     * Calculates hourly FFMC (fine fuel moisture code), using Lawson's mathematical model, based on the previous and current daily FFMC values (using Van Wagner) and provided conditions. FFMC is a numerical rating of the moisture content of litter and other cured fine fuels.
     * @param prevFFMC The previous day's standard daily Van Wagner FFMC value.
     * @param currFFMC The current day's standard daily Van Wagner FFMC value.
     * @param rh Relative humidity expressed as a fraction ([0..1]).
     * @param span The time to calculate the FFMC value for (seconds into day).
     */
    static hourly_ffmc_lawson(prevFFMC: number, currFFMC: number, rh: number, span: Duration, callback?: (value: string) => any): void;
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
    static hourly_ffmc_lawson_promise(prevFFMC: number, currFFMC: number, rh: number, span: Duration): Promise<string>;
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
    static hourlyFFMCVanWagnerPrevious(currFFMC: number, rain: number, temperature: number, rh: number, ws: number, callback?: (value: string) => any): void;
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
    static hourlyFFMCVanWagnerPreviousPromise(currFFMC: number, rain: number, temperature: number, rh: number, ws: number): Promise<string>;
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
    static hourlyFFMCEquilibriumPrevious(currFFMC: number, rain: number, temperature: number, rh: number, ws: number, callback?: (value: string) => any): void;
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
    static hourlyFFMCEquilibriumPreviousPromise(currFFMC: number, rain: number, temperature: number, rh: number, ws: number): Promise<string>;
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
    static hourlyFFMCLawsonContiguous(prevFFMC: number, currFFMC: number, rh0: number, rh: number, rh1: number, seconds_into_day: Duration, callback?: (value: string) => any): void;
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
    static hourlyFFMCLawsonContiguousPromise(prevFFMC: number, currFFMC: number, rh0: number, rh: number, rh1: number, seconds_into_day: Duration): Promise<string>;
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
    static dailyFFMCVanWagner(inFFMC: number, rain: number, temperature: number, rh: number, ws: number, callback?: (value: string) => any): void;
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
    static dailyFFMCVanWagnerPromise(inFFMC: number, rain: number, temperature: number, rh: number, ws: number): Promise<string>;
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
    static dMC(inDMC: number, rain: number, temperature: number, latitude: number, longitude: number, month: number, rh: number, callback?: (value: string) => any): void;
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
    static dMCPromise(inDMC: number, rain: number, temperature: number, latitude: number, longitude: number, month: number, rh: number): Promise<string>;
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
    static dC(inDC: number, rain: number, temperature: number, latitude: number, longitude: number, month: number, callback?: (value: string) => any): void;
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
    static dCPromise(inDC: number, rain: number, temperature: number, latitude: number, longitude: number, month: number): Promise<string>;
    /**
     * Calculates f(F), which is used to calculate ISI from FFMC.
     * @param ffmc FFMC value.
     * @param seconds Time since observed FFMC.
     */
    static ff(ffmc: number, seconds: number, callback?: (value: string) => any): void;
    /**
     * Calculates f(F), which is used to calculate ISI from FFMC.
     * @param ffmc FFMC value.
     * @param seconds Time since observed FFMC.
     * @returns The calculated f(F) stored as a string.
     */
    static ffPromise(ffmc: number, seconds: number): Promise<string>;
    /**
     * Calculates ISI from FFMC and wind speed.
     *
     * ISI provides a numerical rating of the relative expected rate of fire spread.
     * @param ffmc FFMC value.
     * @param ws Wind speed (kph).
     * @param dur Time since observed FFMC.
     */
    static isiFWI(ffmc: number, ws: number, dur: Duration, callback?: (value: string) => any): void;
    /**
     * Calculates ISI from FFMC and wind speed.
     *
     * ISI provides a numerical rating of the relative expected rate of fire spread.
     * @param ffmc FFMC value.
     * @param ws Wind speed (kph).
     * @param dur Time since observed FFMC.
     * @returns The calculated ISI stored as a string.
     */
    static isiFWIPromise(ffmc: number, ws: number, dur: Duration): Promise<string>;
    /**
     * Calculates ISI from FFMC and wind speed.
     *
     * ISI provides a numerical rating of the relative expected rate of fire spread. The FBP system uses a local site-specific ISI influenced by topography.
     * @param ffmc FFMC value.
     * @param ws Wind speed (kph).
     * @param dur Time since observed FFMC.
     */
    static isiFBP(ffmc: number, ws: number, dur: Duration, callback?: (value: string) => any): void;
    /**
     * Calculates ISI from FFMC and wind speed.
     *
     * ISI provides a numerical rating of the relative expected rate of fire spread. The FBP system uses a local site-specific ISI influenced by topography.
     * @param ffmc FFMC value.
     * @param ws Wind speed (kph).
     * @param dur Time since observed FFMC.
     * @returns The calculated ISI stored as a string.
     */
    static isiFBPPromise(ffmc: number, ws: number, dur: Duration): Promise<string>;
    /**
     * Calculate BUI (buildup index) from DC, DMC.
     *
     * BUI provides a numerical, relative indication of the amount of fuel available for combustion.
     * @param dc DC value.
     * @param dmc DMC value.
     */
    static bui(dc: number, dmc: number, callback?: (value: string) => any): void;
    /**
     * Calculate BUI (buildup index) from DC, DMC.
     *
     * BUI provides a numerical, relative indication of the amount of fuel available for combustion.
     * @param dc DC value.
     * @param dmc DMC value.
     * @returns The calculated BUI stored as a string.
     */
    static buiPromise(dc: number, dmc: number): Promise<string>;
    /**
     * Calculates FWI (fire weather index) from ISI and BUI.
     *
     * FWI provides a numerical, relative rating of fire intensity.
     * @param isi ISI value.
     * @param bui BUI value.
     */
    static fwi(isi: number, bui: number, callback?: (value: string) => any): void;
    /**
     * Calculates FWI (fire weather index) from ISI and BUI.
     *
     * FWI provides a numerical, relative rating of fire intensity.
     * @param isi ISI value.
     * @param bui BUI value.
     * @returns The calculated FWI stored as a string.
     */
    static fwiPromise(isi: number, bui: number): Promise<string>;
    /**
     * Calculates DSR from FWI.
     */
    static dsr(fwi: number, callback?: (value: string) => any): void;
    /**
     * Calculates DSR from FWI.
     * @returns The calculated DSR stored as a string.
     */
    static dsrPromise(fwi: number): Promise<string>;
}
