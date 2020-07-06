"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/** ignore this comment */
const net = require("net");
const psaasGlobals_1 = require("./psaasGlobals");
class ForecastHour {
}
exports.ForecastHour = ForecastHour;
class ForecastDay {
}
exports.ForecastDay = ForecastDay;
class ForecastCalculator extends psaasGlobals_1.IPSaaSSerializable {
    constructor() {
        super();
        this.modelIds = new Array();
        this.percentile = 50;
        this.forecastType = "hour";
    }
    /**
     * Lookup a forecast for the currently specified location and model.
     * @param callback A method that will be called when the forecast has been received.
     * @throws This method can only be called once at a time per instance.
     */
    fetchForecast(callback) {
        if (this.fetchState < 0) {
            throw new Error("Multiple concurrent reqeusts");
        }
        this.fetchForecastInternal(callback);
    }
    /**
     * Lookup a forecast for the currently specified location and model.
     * @returns The current {@link ForecastCalculator} object.
     * @throws This method can only be called once at a time per instance.
     */
    async fetchForecastPromise() {
        if (this.fetchState < 0) {
            throw new Error("Multiple concurrent reqeusts");
        }
        return await new Promise((resolve, reject) => {
            this.fetchForecastInternal(resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /*
     * This method connects to the builder and retrieves the forecast
     * @returns An array for the daily or hourly forecast
     */
    fetchForecastInternal(callback, error) {
        this.fetchState = -1;
        let stream = this.province + '|' + this.city + '|' + this.model;
        let ids = '';
        for (let i = 0; i < this.modelIds.length; i++) {
            ids = ids + this.modelIds[i];
            if (i < (this.modelIds.length - 1))
                ids = ids + ',';
        }
        stream = stream + '|' + ids + '|' + this.date + '|' + this.timezone;
        stream = stream + '|' + this.time + '|' + this.percentile + '|' + this.forecastType;
        let result = '';
        let builder = net.connect({ port: psaasGlobals_1.SocketHelper.getPort(), host: psaasGlobals_1.SocketHelper.getAddress() }, function () {
            psaasGlobals_1.PSaaSLogger.getInstance().debug("connected to builder, getting forecast !");
            builder.write(psaasGlobals_1.SocketMsg.STARTUP + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(ForecastCalculator.GET_FORECAST + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(stream + psaasGlobals_1.SocketMsg.NEWLINE);
        });
        builder.on('data', (data) => {
            result += data.toString();
            if (result.indexOf('COMPLETE') >= 0) {
                let rawDefaults = result.split(new RegExp('[\\|\\r\\n]'));
                let index = 0;
                if (this.forecastType === "day") {
                    this.results = new Array();
                    while (index <= (rawDefaults.length - 8)) {
                        let day = new ForecastDay();
                        day.time = rawDefaults[index];
                        index++;
                        day.minTemperature = +rawDefaults[index];
                        index++;
                        day.maxTemperature = +rawDefaults[index];
                        index++;
                        day.relativeHumidity = +rawDefaults[index];
                        index++;
                        day.precipitation = +rawDefaults[index];
                        index++;
                        day.minWindSpeed = +rawDefaults[index];
                        index++;
                        day.maxWindSpeed = +rawDefaults[index];
                        index++;
                        day.windDirection = +rawDefaults[index];
                        index++;
                        this.results.push(day);
                    }
                }
                else {
                    this.results = new Array();
                    while (index <= (rawDefaults.length - 6)) {
                        let hour = new ForecastHour();
                        hour.time = rawDefaults[index];
                        index++;
                        hour.temperature = +rawDefaults[index];
                        index++;
                        hour.relativeHumidity = +rawDefaults[index];
                        index++;
                        hour.precipitation = +rawDefaults[index];
                        index++;
                        hour.windSpeed = +rawDefaults[index];
                        index++;
                        hour.windDirection = +rawDefaults[index];
                        index++;
                        this.results.push(hour);
                    }
                }
                builder.write(psaasGlobals_1.SocketMsg.SHUTDOWN + psaasGlobals_1.SocketMsg.NEWLINE, (err) => {
                    builder.end();
                });
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
                callback(this);
            }
            psaasGlobals_1.PSaaSLogger.getInstance().debug("disconnected from builder");
        });
    }
    /**
     * Get a list of supported cities in the provided province.
     * @param province The province to get the available cities for.
     */
    static getCities(province, callback) {
        (new CityGetter()).getCities(province, callback);
    }
    /**
     * Get a list of supported cities in the provided province.
     * @param province The province to get the available cities for.
     * @returns A list of supported cities for the requested province.
     * @throws This method can only be called once at a time per instance.
     */
    static async getCitiesPromise(province) {
        return await new Promise((resolve, reject) => {
            (new CityGetter()).getCities(province, resolve, reject);
        })
            .catch(err => { throw err; });
    }
}
ForecastCalculator.GET_FORECAST = "FORECAST_GET";
exports.ForecastCalculator = ForecastCalculator;
class CityGetter extends psaasGlobals_1.IPSaaSSerializable {
    /*
     * This method connects to the builder and retrieves the forecast cities
     * @returns An array of strings containing the retrieved city names
     */
    getCities(province, callback, error) {
        if (this.fetchState < 0) {
            throw new Error("Multiple concurrent reqeusts");
        }
        this.fetchState = -1;
        let results;
        let builder = net.connect({ port: psaasGlobals_1.SocketHelper.getPort(), host: psaasGlobals_1.SocketHelper.getAddress() }, function () {
            psaasGlobals_1.PSaaSLogger.getInstance().debug("connected to builder, getting forecast cities !");
            builder.write(psaasGlobals_1.SocketMsg.STARTUP + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(CityGetter.GET_CITIES_KEY + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(province + psaasGlobals_1.SocketMsg.NEWLINE);
        });
        builder.on('data', (data) => {
            results = data.toString().split(new RegExp('[\\|\\r\\n]'));
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
                callback(results);
            }
            psaasGlobals_1.PSaaSLogger.getInstance().debug("disconnected from builder");
        });
    }
}
CityGetter.GET_CITIES_KEY = "FORECAST_LIST_CITIES";
//# sourceMappingURL=forecast.js.map