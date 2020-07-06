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
import { IPSaaSSerializable } from "./psaasGlobals";
export declare class FuelTypeDefaults {
    /**
     * Does the fuel type need a crown base height specified.
     */
    useCrownBase: boolean;
    /**
     * Crown base height (m).
     */
    crownBase: number;
    /**
     * Does the fuel type need a percent conifer specified.
     */
    usePercentConifer: boolean;
    /**
     * Percent conifer (%).
     */
    percentConifer: number;
    /**
     * Does the fuel type need a percent dead fir specified.
     */
    usePercentDeadFir: boolean;
    /**
     * Percent dead fir (%).
     */
    percentDeadFir: number;
    /**
     * Does the fuel type need a grass curing specified.
     */
    useGrassCuring: boolean;
    /**
     * Percent grass curing (%).
     */
    grassCuring: number;
    /**
     * Does the fuel type need a grass fuel load specified.
     */
    useGrassFuelLoad: boolean;
    /**
     * Grass fuel load (km/m^2).
     */
    grassFuelLoad: number;
    constructor();
}
/**
 * An FBP fuel type.
 */
export declare class FuelType {
    /**
     * The name of the fuel.
     */
    name: string;
    /**
     * A description of the fuel.
     */
    desc: string;
    /**
     * The default values for the fuel type specified by {@link FuelType#name}.
     * Use {@link FbpCalculations#getFuelsWithDefaults()} to get fuel types with their default values.
     */
    defaults: FuelTypeDefaults;
    /**
     * Get a full display string for the fuel type.
     */
    toString: () => string;
}
export declare class FbpCalculations extends IPSaaSSerializable {
    private static readonly CALCULATE_KEY;
    /**
     * [Input] The fuel type.
     */
    fuelType: string;
    /**
     * [Input] Crown base height (m).
     */
    crownBase: number;
    /**
     * [Input] Percent conifer.
     */
    percentConifer: number;
    /**
     * [Input] Percent dead fir.
     */
    percentDeadFir: number;
    /**
     * [Input] Percent grass curing.
     */
    grassCuring: number;
    /**
     * [Input] Grass fuel load (kg/m^2).
     */
    grassFuelLoad: number;
    /**
     * [Input] Fine fuel moisture code.
     */
    ffmc: number;
    /**
     * [Input] The duff moisture code. Only needed if useBui is false.
     */
    dmc: number;
    /**
     * [Input] The drought code. Only needed if useBui if false.
     */
    dc: number;
    /**
     * [Input/Output] The buildup index. If useBui is true this value is used, otherwise it's calculated from the DMC and DC.
     */
    bui: number;
    /**
     * [Input] If true the specified BUI is used, otherwise it is calulated from the DMC and DC.
     */
    useBui: boolean;
    /**
     * [Input] The wind speed (km/h).
     */
    windSpeed: number;
    /**
     * [Input] The wind direction (degrees).
     */
    windDirection: number;
    /**
     * [Input] The elevation of the ignition.
     */
    elevation: number;
    /**
     * [Input] The slope the ignition was on (ignored if useSlope is false).
     */
    slopeValue: number;
    /**
     * [Input] Calculate with a slope value.
     */
    useSlope: boolean;
    /**
     * [Input] The aspect the ignition was on.
     */
    aspect: number;
    /**
     * [Input] Use a line ignition.
     */
    useLine: boolean;
    /**
     * [Input] The date of the ignition.
     */
    startTime: string;
    /**
     * [Input] Time elapsed since ignition (min).
     */
    elapsedTime: number;
    /**
     * [Input] The latitude of the ignition (degrees).
     */
    latitude: number;
    /**
     * [Input] The longitude of the ignition (degrees).
     */
    longitude: number;
    /**
     * [Output] Rate or Spread, after elapsed time t.
     */
    ros_t: number;
    /**
     * [Output] Rate of Spread, Equilibrium
     */
    ros_eq: number;
    /**
     * [Output] Flank Rate of Spread
     */
    fros: number;
    /**
     * [Output] Back Rate of Spread
     */
    bros: number;
    /**
     * [Output] Critical Surface Fire Rate of Spread
     */
    rso: number;
    /**
     * [Output] Head Fire Intensity
     */
    hfi: number;
    /**
     * [Output] Flank Fire Intensity
     */
    ffi: number;
    /**
     * [Output] Back Fire Intensity
     */
    bfi: number;
    /**
     * [Output] Elliptical Fire Area
     */
    area: number;
    /**
     * [Output] Elliptical Fire Perimeter
     */
    perimeter: number;
    /**
     * [Output] Distance Head
     */
    distanceHead: number;
    /**
     * [Output] Distance Flank
     */
    distanceFlank: number;
    /**
     * [Output] Distance Back
     */
    distanceBack: number;
    /**
     * [Output] Length-to-Breadth Ratio
     */
    lb: number;
    /**
     * [Output] Critical Surface Fire Intensity
     */
    csi: number;
    /**
     * [Output] Crown Fraction Burned
     */
    cfb: number;
    /**
     * [Output] Surface Fuel Consumption
     */
    sfc: number;
    /**
     * [Output] Total Fuel Consumption
     */
    tfc: number;
    /**
     * [Output] Crown Fuel Consumption
     */
    cfc: number;
    /**
     * [Output] Final ISI, accounting for wind and slope
     */
    isi: number;
    /**
     * [Output] Foliar Moisture Content
     */
    fmc: number;
    /**
     * [Output] Net Vectored Wind Speed
     */
    wsv: number;
    /**
     * [Output] Spread direction azimuth
     */
    raz: number;
    /**
     * [Output] A description of the fire
     */
    fireDescription: string;
    /**
     * Have the output values been calculated.
     */
    isCalculated: boolean;
    constructor();
    /**
     * Set the fuel type. If the fuel type has defaults specified the required defaults will
     * override any value specified for them in this class.
     * @param fuelType The fuel type to use.
     */
    setFuelType(fuelType: FuelType): void;
    /**
     * Unset the fuel type defaults
     */
    unsetFuelType(): void;
    /**
     * Calculate the FBP values. If there was an error during calculation a string indicating the cause of the error will be returned.
     */
    calculate(callback?: (defaults: FbpCalculations) => any): void;
    /**
     * Calculate the FBP values. If there was an error during calculation a string indicating the cause of the error will be returned.
     * @returns The current {@link FbpCalculations} object.
     * @throws This method can only be called once at a time per instance.
     */
    calculatePromise(): Promise<FbpCalculations>;
    private calculateInternal;
    /**
     * Get the list of fuel types from the server.
     */
    static getFuels(callback?: (defaults: FuelType[]) => any): void;
    /**
     * Get the list of fuel types from the server.
     * @returns An array of {@link FuelType} without the default values populated.
     */
    static getFuelsPromise(): Promise<Array<FuelType>>;
    /**
     * Get the list of fuel types from the server.
     */
    static getFuelsWithDefaults(callback?: (defaults: FuelType[]) => any): void;
    /**
     * Get the list of fuel types from the server.
     * @returns An array of {@link FuelType} with the default values populated.
     */
    static getFuelsWithDefaultsPromise(): Promise<Array<FuelType>>;
}
