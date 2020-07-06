# PSaaS JavaScript API #

This repository contains the PSaaS API for JavaScript/NodeJS.

## API Documentation

The API documentation can be viewed at [spydmobile.bitbucket.io](https://spydmobile.bitbucket.io/psaas_js/).

## Usage

This module can be referenced from the package.json for your project. The dependency name is `psaas-js-api`. There are multiple ways to access the module with the following being the simplest.

```json
{
    "name": "test-project",
    "dependencies": {
        "psaas-js-api": "bitbucket:psaasredapp/psaas-js-api"
    }
}
```

Additional ways to reference the module:

1) Directly using the repository URL
```
git+https://bitbucket.org/psaasredapp/psaas-js-api.git
```

2) Reference a specific commit instead of the head of the repository
```
bitbucket:psaasredapp/psaas-js-api#85e0660390aab21d32f70fda97438520122de8d9
```

3) Reference a specific tag within the repository
```
bitbucket:psaasredapp/psaas-js-api#v6.2.5.6_20200705
```

The URI fragments shown in 2 and 3 can also be used with the direct URL to the repository shown in 1.
