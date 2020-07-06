/**
 * Request forecast information for a given city and province
 * from PSaaS Builder. Forecast information is pulled from
 * Environment Canada.
 *
 * Example
 * -------
 *
 * ```javascript
 * //populate the calculator with some example values
 * let calculator = new ForecastCalculator();
 * calculator.province = "AB";
 * calculator.city = "Calgary";
 * calculator.model = "GEM_DETER";
 * calculator.date = "2019-01-01";
 * calculator.timezone = 13; //index retrieved from the Timezone class in psaasGlobals.js
 * calculator.time = "00Z"; //00Z for the midnight forecast, 12Z for the noon forecast
 * calculator.forecastType = "hour"; //hour for hourly forecast, day for daily forecast
 * await calculator.fetchForecastPromise();
 * //********** the calculator will now contain an array of forecasts for different hours/days. ****************
 * ```
 */
import { Province, IPSaaSSerializable } from "./psaasGlobals";
export declare class ForecastHour {
    /**
     * The date time string for the forecast.
     */
    time: string;
    /**
     * The forecast temperature (in celsius).
     */
    temperature: number;
    /**
     * The forecast relative humidity (in percent).
     */
    relativeHumidity: number;
    /**
     * The forecast precipitation (in mm).
     */
    precipitation: number;
    /**
     * The forecast wind speed (in km/h).
     */
    windSpeed: number;
    /**
     * The forecast wind direction (in degrees).
     */
    windDirection: number;
}
export declare class ForecastDay {
    /**
     * The date of the forecast
     */
    time: string;
    /**
     * The days minimum temperature (in celsius).
     */
    minTemperature: number;
    /**
     * The days maximum temperature (in celsius).
     */
    maxTemperature: number;
    /**
     * The average relative humidity (in percent).
     */
    relativeHumidity: number;
    /**
     * The total daily precipitation (in mm).
     */
    precipitation: number;
    /**
     * The days minimum wind speed (in km/h).
     */
    minWindSpeed: number;
    /**
     * The days maximum wind speed (in km/h).
     */
    maxWindSpeed: number;
    /**
     * The days average wind direction (in degress).
     */
    windDirection: number;
}
export declare class ForecastCalculator extends IPSaaSSerializable {
    private static readonly GET_FORECAST;
    /**
     * The province to fetch the forecast for (can be either the full name or abbreviation).
     */
    province: string;
    /**
     * The city to fetch the forecast for. Must be one of the predefined cities for the
     * specified province.
     */
    city: string;
    /**
     * The forecast model to use. Must be one of GEM, GEM_DETER, NCEP, or CUSTOM.
     */
    model: string;
    /**
     * An array of integer model IDs to use with the custom model type. Will be ignored
     * if the model type is not CUSTOM.
     */
    modelIds: string[];
    /**
     * The date to fetch the forecast for. Forecasts are not available for future dates and
     * only exist approximately a month into the past.
     */
    date: string;
    /**
     * The timezone index to format the returned forecast times in. Must be from the list
     * obtained from Timezone::getTimezoneNameList().
     */
    timezone: number;
    /**
     * Forecasts are generated at both 00Z and 12Z. This specifies which of those times to
     * get the forecast data for. Must be one of 00Z and 12Z.
     */
    time: string;
    /**
     * The percentile to use for calculating the forecast. Not valid for GEM Deterministic.
     */
    percentile: number;
    /**
     * The calculated forecast values.
     */
    results: ForecastHour[] | ForecastDay[];
    /**
     * The type of forecast to get (either hour or day).
     */
    forecastType: string;
    constructor();
    /**
     * Lookup a forecast for the currently specified location and model.
     * @param callback A method that will be called when the forecast has been received.
     * @throws This method can only be called once at a time per instance.
     */
    fetchForecast(callback?: (forecast: ForecastCalculator) => any): void;
    /**
     * Lookup a forecast for the currently specified location and model.
     * @returns The current {@link ForecastCalculator} object.
     * @throws This method can only be called once at a time per instance.
     */
    fetchForecastPromise(): Promise<ForecastCalculator>;
    private fetchForecastInternal;
    /**
     * Get a list of supported cities in the provided province.
     * @param province The province to get the available cities for.
     */
    static getCities(province: Province, callback?: (forecast: string[]) => any): void;
    /**
     * Get a list of supported cities in the provided province.
     * @param province The province to get the available cities for.
     * @returns A list of supported cities for the requested province.
     * @throws This method can only be called once at a time per instance.
     */
    static getCitiesPromise(province: Province): Promise<string[]>;
}
