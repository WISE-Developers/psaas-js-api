# PSaaS JavaScript API #

This repository contains the PSaaS API for JavaScript/NodeJS.

## API Documentation

The API documentation can be viewed at [spydmobile.bitbucket.io](https://spydmobile.bitbucket.io/psaas_js/).

## Usage

This module can be referenced from the package.json for your project. The dependency name is `psaas-js-api`. There are multiple ways to access the module with the following being the recommended.

```json
{
    "name": "test-project",
    "dependencies": {
        "psaas-js-api": "bitbucket:psaasredapp/psaas-js-api#v6.2.5.6_20200609"
    }
}
```

Additional ways to reference the module:

1) Directly using the repository URL
```
git+https://bitbucket.org/psaasredapp/psaas-js-api.git
```

2) Reference a specific commit instead of a tag
```
bitbucket:psaasredapp/psaas-js-api#85e0660390aab21d32f70fda97438520122de8d9
```

3) Use the head revision of the repository
```
bitbucket:psaasredapp/psaas-js-api
```

The URI fragments shown in 2 and 3 can also be used with the direct URL to the repository shown in 1.

## Configuration

After being installed the module will run a script that will ask the user to input the location of their job directory. This will be asked inline with the install command. It is necessary to be able to locate the config.json file that contains the server configuration. If the installation is being automated or you don't want to specify the location for any reason run npm with the `--ignore-scripts` option. You can specify the job directory manually at runtime when constructing a [ServerConfiguration](https://spydmobile.bitbucket.io/psaas_js/classes/_defaults_.serverconfiguration.html) object. Pass the constructor the path to the job directory.

```javascript
const psaas = require("psaas-js-api");
const defaults_1 = psaas.defaults;

let serverConfig = new defaults_1.ServerConfiguration("C:\\path\\to\\jobs");
```
