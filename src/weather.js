"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherCalculator = void 0;
/** ignore this comment */
const net = require("net");
const psaasGlobals_1 = require("./psaasGlobals");
/**
 * Fetch current weather information for a given city, province.
 */
class WeatherCalculator extends psaasGlobals_1.IPSaaSSerializable {
    /**
     * Get the current weather conditions for the specified province and city.
     */
    fetchWeather(callback) {
        if (this.fetchState < 0) {
            throw new Error("Multiple concurrent reqeusts");
        }
        this.fetchWeatherInternal(callback);
    }
    /**
     * Get the current weather conditions for the specified province and city.
     * @returns A {@link WeatherCalculator} object that contains the current weather
     *          conditions for the specified city and province.
     * @throws This method can only be called once at a time per instance.
     */
    async fetchWeatherPromise() {
        if (this.fetchState < 0) {
            throw new Error("Multiple concurrent reqeusts");
        }
        return await new Promise((resolve, reject) => {
            this.fetchWeatherInternal(resolve, reject);
        })
            .catch(err => { throw err; });
    }
    /*
     * This method connects to the builder and retrieves the weather
     */
    fetchWeatherInternal(callback, error) {
        let stream = this.province + '|' + this.city;
        this.fetchState = -1;
        let builder = net.connect({ port: psaasGlobals_1.SocketHelper.getPort(), host: psaasGlobals_1.SocketHelper.getAddress() }, function () {
            psaasGlobals_1.PSaaSLogger.getInstance().debug("connected to builder, getting weather !");
            builder.write(psaasGlobals_1.SocketMsg.STARTUP + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(WeatherCalculator.GET_WEATHER_KEY + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(stream + psaasGlobals_1.SocketMsg.NEWLINE);
        });
        builder.on('data', (data) => {
            let rawDefaults = data.toString().split(new RegExp('[\\|\\r\\n]'));
            this.province = rawDefaults[0];
            this.city = rawDefaults[1];
            this.temperature = +rawDefaults[2];
            this.time = rawDefaults[3];
            this.humidity = +rawDefaults[4];
            this.windSpeed = +rawDefaults[5];
            this.windDirection = +rawDefaults[6];
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
     * Get a list of supported cities in the provided province.
     */
    static getCities(province, callback) {
        (new CitiesGetter()).getCitiesInternal(province, callback);
    }
    /**
     * Get a list of supported cities in the provided province.
     * @param province The province to get the supported cities in.
     * @returns An array of city names.
     */
    static async getCitiesPromise(province) {
        return await new Promise((resolve, reject) => {
            (new CitiesGetter()).getCitiesInternal(province, resolve, reject);
        })
            .catch(err => { throw err; });
    }
}
exports.WeatherCalculator = WeatherCalculator;
WeatherCalculator.GET_WEATHER_KEY = "WEATHER_GET";
class CitiesGetter extends psaasGlobals_1.IPSaaSSerializable {
    /*
     * This method connects to the builder and retrieves the cities
     * @returns An array of cities from the retrieval
     */
    getCitiesInternal(province, callback, error) {
        let retval = new Array();
        this.fetchState = -1;
        let builder = net.connect({ port: psaasGlobals_1.SocketHelper.getPort(), host: psaasGlobals_1.SocketHelper.getAddress() }, function () {
            psaasGlobals_1.PSaaSLogger.getInstance().debug("connected to builder, getting cities !");
            builder.write(psaasGlobals_1.SocketMsg.STARTUP + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(CitiesGetter.GET_CITIES_KEY + psaasGlobals_1.SocketMsg.NEWLINE);
            builder.write(province + psaasGlobals_1.SocketMsg.NEWLINE);
        });
        builder.on('data', (data) => {
            let rawDefaults = data.toString().split("|");
            for (let item of rawDefaults) {
                retval.push(item);
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
CitiesGetter.GET_CITIES_KEY = "WEATHER_LIST_CITIES";
//# sourceMappingURL=weather.js.map