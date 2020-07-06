/**
 * Fetch current weather conditions from Environment Canada for
 * a given city and province. The supported cities for each
 * province can also be retrieved.
 *
 * Example
 * -------
 *
 * For fetching the supported cities in Alberta:
 *
 * ```javascript
 * let cities = await WeatherCalculator.getCitiesPromise(Province.ALBERTA);
 * ```
 *
 * For fetching the current weather for a location:
 *
 * ```javascript
 * let calculator = new WeatherCalculator();
 * calculator.province = "AB";
 * calculator.city = "Calgary";
 * await calculator.fetchWeatherPromise();
 * //********* the calculator will now contain current weather values ***********
 * ```
 */
import { Province, IPSaaSSerializable } from "./psaasGlobals";
/**
 * Fetch current weather information for a given city, province.
 */
export declare class WeatherCalculator extends IPSaaSSerializable {
    private static readonly GET_WEATHER_KEY;
    /**
     * The province to fetch the weather for (can be either the full name or abbreviation).
     */
    province: string;
    /**
     * The city to fetch the weather for. Must be one of the predefined cities for the
     * specified province.
     */
    city: string;
    /**
     * The observation time for the weather conditions.
     */
    time: string;
    /**
     * The current temperature (in celsius).
     */
    temperature: number;
    /**
     * The current relative humidity (%).
     */
    humidity: number;
    /**
     * The current wind speed (km/h).
     */
    windSpeed: number;
    /**
     * The current wind direction (degrees).
     */
    windDirection: number;
    /**
     * Get the current weather conditions for the specified province and city.
     */
    fetchWeather(callback?: (defaults: WeatherCalculator) => any): void;
    /**
     * Get the current weather conditions for the specified province and city.
     * @returns A {@link WeatherCalculator} object that contains the current weather
     *          conditions for the specified city and province.
     * @throws This method can only be called once at a time per instance.
     */
    fetchWeatherPromise(): Promise<WeatherCalculator>;
    private fetchWeatherInternal;
    /**
     * Get a list of supported cities in the provided province.
     */
    static getCities(province: Province, callback?: (defaults: string[]) => any): void;
    /**
     * Get a list of supported cities in the provided province.
     * @param province The province to get the supported cities in.
     * @returns An array of city names.
     */
    static getCitiesPromise(province: Province): Promise<Array<string>>;
}
