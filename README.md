# Simply-Env

This is a zero-dependency package that helps parse and validate environments based on a configuration. Simply-env is unaware of how you get the environment variables. I.e. if you want to use an `.env` file, then you should use something like `dotenv` to parse the .env file. Simply-env assumes that it can read environment variables from `process.env`.

Example configuration:

```ts
import simply from "simply-env";


// if reading from an .env file
import dotenv from "dotenv";
dotenv.config();

const env = simply({
	API_PORT: {
		description: "A number for the port the API will listen on",
		isRequired: true,

	},
	PAYMENT_SERVICE_KEY: {
		description: "A key from PaymentService used to authenticate requests",
		isRequired: true,
		isSecret: true,
	},
	LOG_LEVEL: {
		description: "Specify log level as 'info', 'warn', or 'error'"
	}
});

// this is now staticall typed
env.PAYMENT_SERVICE_KEY;
env.API_PORT;
env.LOG_LEVEL; // Value is empty string if non-required values are missin
```

The `read` function takes in the config and returns a dictionary object which maps the enviroinment variables to their values. If a required environment variable is missing, then your node process will terminate with an error code.

The `read` function logs out all your environment variables in a table along with their values. If an environment variable is set as `isSecret` it masks the valgiue.

```shell
┌─────────┬───────────────────────┬────────────────────────────┬───────────────────────────────────────────────────────────┐
│ (index) │ Variable              │ Value                      │ Description                                               │
├─────────┼───────────────────────┼────────────────────────────┼───────────────────────────────────────────────────────────┤
│ 0       │ 'API_PORT'            │ '3000'                     │ 'A number for the port the API will listen on'            │
│ 1       │ 'PAYMENT_SERVICE_KEY' │ '***0238'                  │ 'A key from PaymentService used to authenticate requests' │
│ 2       │ 'LOG_LEVEL'           │ 'Missing from environment' │ "Specify log level as 'info', 'warn', or 'error'"         │
└─────────┴───────────────────────┴────────────────────────────┴───────────────────────────────────────────────────────────┘
```