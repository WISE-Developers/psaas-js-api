"use strict";
/**
 * A configuration script to run from the command line to setup
 * the basic options required to run the example web server.
 *
 * This script will ask you to input the location of the
 * PSaaS job directory, the PSaaS Builder IP address,
 * and the port to connect to PSaaS builder with.
 *
 * It can be run from the command line with `node configure.js`.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** ignore this comment */
const readline = require("readline");
const path = require("path");
const filesystem = require("fs");
function pathCompleter(line) {
    var line2 = line.replace(/\\/g, "/");
    var index = line2.lastIndexOf('/');
    var cwd;
    var testPath;
    if (index > 0) {
        cwd = line.substring(0, index) + path.sep;
        testPath = line.substring(index + 1);
    }
    else {
        cwd = "./";
        testPath = line;
    }
    var files = filesystem.readdirSync(cwd);
    var hits = files.filter(function (c) { return c.indexOf(testPath) === 0; });
    var strike = [];
    if (hits.length == 1)
        strike.push(path.join(cwd, hits[0]) + path.sep);
    return (strike.length) ? [strike, line] : [hits.length ? hits : files, line];
}
const consoleReader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: pathCompleter
});
console.log("Configuring PSaaS Node API");
var rootPath;
try {
    rootPath = path.dirname(require.resolve("psaas-js-api/package.json"));
}
catch (e2) {
    //if the package can't be resolved it will throw a MODULE_NOT_FOUND error
    rootPath = "./";
}
consoleReader.question(`Enter the PSaaS job directory: `, (jobDirectory) => {
    if (!filesystem.existsSync(jobDirectory)) {
        console.log("The path '" + jobDirectory + "' does not exist.");
        process.exit();
    }
    const config = {
        config_path: jobDirectory
    };
    filesystem.writeFileSync(path.join(rootPath, "config", "config.json"), JSON.stringify(config));
    process.exit();
});
//# sourceMappingURL=build_config.js.map