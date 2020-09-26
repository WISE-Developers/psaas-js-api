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
        "psaas-js-api": "bitbucket:psaasredapp/psaas-js-api#v6.2.5.7_20200727"
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

### Job Directory

The job directory can be set using [npm-config](https://docs.npmjs.com/cli-commands/config.html). The config key is `psaas-js-api:job_directory`. If no directory is set the default will be `C:\jobs`. The config value can be set for different user levels including the current user, globally, and for the current project. The following examples set the job directory to `/user/home/foo/jobs` as an example for Linux.

- For the current user account
```console
foo@bar:~$ npm config set psaas-js-api:job_directory /user/home/foo/jobs
```

- Globally
```console
foo@bar:~$ npm config set psaas-js-api:job_directory /user/home/foo/jobs -g
```

- Just for the current project
```console
foo@bar:project$ npm config set psaas-js-api:job_directory /user/home/foo/jobs --userconfig ./.npmrc
```

If you have used the old method of setting the job directory through the setup script that was run on install that directory will still be loaded by the API if no other method of setting the value has been used.

You can also specify the job directory manually at runtime when constructing a [ServerConfiguration](https://spydmobile.bitbucket.io/psaas_js/classes/_defaults_.serverconfiguration.html) object. Pass the constructor the path to the job directory.

```javascript
const psaas = require("psaas-js-api");
const defaults_1 = psaas.defaults;

let serverConfig = new defaults_1.ServerConfiguration("/user/home/foo/jobs");
```
