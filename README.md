# Environment

Package that helps dealing with environments

-   parsing the environment variables
-   validating the environment
-   picking the right source for environment variable based on test time, dev time, or production.

It assumes that the env variables have been passed to `process.env` prior to starting (i.e. via docker). Users can pass IS_NATIVE=Y if they want to read environment variable from a stanalone .env file.

You can also specify `DRY_RUN=Y` which can be helpful if you want to run something or exit from a process conditionally. This is useful if you want to make sure that your service / application starts correctly (i.e. no error in configuration).

## Build

To build the package run the following command:

```shell
yarn build
```

## How to include in services

To include this package in a service, add the following line to your package.json under dependencies

```json
{
	"dependencies": {
		"@packages/environment": "*"
	}
}
```

Then ensure that you `cd` into the service from the root of the monorepo.

```shell
cd services/<name-of-service>
```

Lastly run `yarn` in order to install the dependency

```shell
yarn
```
