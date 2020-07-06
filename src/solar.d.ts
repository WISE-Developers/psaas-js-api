/**
 * Use PSaaS Builder to calculate solar times
 * based on the input location and date. Solar times
 * include sunrise, sunset, and solar noon.
 *
 * Example
 * -------
 *
 * ```javascript
 * let calculator = new SolarCalculator();
 * calculator.latitude = 49.8998;
 * calculator.longitude = -97.1375;
 * calculator.timezone = 15; //index was retrieved from the Timezone class in psaasGlobals.js
 * calculator.year = 2019;
 * calculator.month = 1;
 * calculator.day = 1;
 * await calculator.fetchSolarPromise();
 * //********* calculator will now contain the calulated solar values ***********
 * ```
 */
import { IPSaaSSerializable } from "./psaasGlobals";
export declare class SolarCalculator extends IPSaaSSerializable {
    private static readonly CALCULATE_SOLAR_KEY;
    /**
     * The latitude to calculate the sunrise/sunset for (in degrees).
     */
    latitude: number;
    /**
     * The longitude to calculate the sunrise/sunset for (in degrees).
     */
    longitude: number;
    /**
     * The timezone index to format the returned forecast times in. Must be from the list
     * obtained from Timezone::getTimezoneNameList().
     */
    timezone: number;
    /**
     * The year to get the sunset/sunrise for. Must be after 1600.
     */
    year: number;
    /**
     * The month to get the sunset/sunrise for. January - 1 to December - 12.
     */
    month: number;
    /**
     * The day of the month to get the sunrise/sunset for.
     */
    day: number;
    /**
     * Sunrise in the same timezone as the input.
     */
    sunrise: string;
    /**
     * Sunset in the same timezone as the input.
     */
    sunset: string;
    /**
     * Solar noon in the same timezone as the intput.
     */
    noon: string;
    /**
     * Get the sunrise, sunset and solar noon.
     */
    fetchSolar(callback?: (solar: SolarCalculator) => any): void;
    /**
     * Get the sunrise, sunset and solar noon.
     * @returns The current {@link SolarCalculator} object with the results
     *          of the solar calculation populated.
     * @throws This method can only be called once at a time per instance.
     */
    fetchSolarPromise(): Promise<SolarCalculator>;
    private fetchSolarInternal;
}
