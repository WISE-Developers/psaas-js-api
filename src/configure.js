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
const replaceinfile = require("replace-in-file");
const consoleReader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
console.log("Configuring " + path.join(__dirname, "index.js").toString());
consoleReader.question(`Enter the PSaaS job directory: `, (dir) => {
    if (!filesystem.existsSync(dir)) {
        console.log("The path '" + dir + "' does not exist.");
        process.exit();
    }
    if (!dir.endsWith("/") && !dir.endsWith("\\")) {
        dir = dir + "/";
    }
    const dirOptions = {
        files: [
            path.join(__dirname, "config.json").toString()
        ],
        from: /"exampleDirectory": ".*"/gm,
        to: '"exampleDirectory": "' + dir.replace(/\\/g, '\\\\') + '"'
    };
    replaceinfile(dirOptions)
        .then(dirChanges => {
        consoleReader.question(`Enter the IP address that PSaaS Builder will be running at: `, (address) => {
            const addOptions = {
                files: [
                    path.join(__dirname, "config.json").toString()
                ],
                from: /(builder(?:.|\r|\n)*)"hostname": "(.*)"/m,
                to: '$1"hostname": "' + address + '"'
            };
            replaceinfile(addOptions)
                .then(addChanges => {
                consoleReader.question(`Enter the port that PSaaS Builder will be listening on: `, (port) => {
                    const addOptions = {
                        files: [
                            path.join(__dirname, "config.json").toString()
                        ],
                        from: /(builder(?:.|\r|\n)*)"port": ([0-9]*)/m,
                        to: '$1"port": ' + port
                    };
                    replaceinfile(addOptions)
                        .then(addChanges => {
                        consoleReader.question(`Enter the IP address or hostname of the MQTT broker: `, (mqtt) => {
                            const mqttOptions = {
                                files: [
                                    path.join(__dirname, "config.json").toString()
                                ],
                                from: /(mqtt(?:.|\r|\n)*?)"hostname": "(.*)"/m,
                                to: '$1"hostname": "' + mqtt + '"'
                            };
                            replaceinfile(mqttOptions)
                                .then(mqttChanges => {
                                console.log("Configuration complete.");
                                process.exit();
                            });
                        });
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=configure.js.map