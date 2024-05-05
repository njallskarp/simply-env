import process from 'process';

/**
 * Represents the description of an environment variable.
 */
interface EnvironmentVariableDescription {
	isSecret?: boolean;
	isRequired?: boolean;
	description: string;
}


/**
 * Represents the configuration of environment variables.
 */
export type EnvironmentConfig = Record<string, EnvironmentVariableDescription>;
type Environment<T extends EnvironmentConfig> = Record<keyof T, string>;

/**
 * Validates the environment variables based on the provided configuration.
 * 
 * @param config - The configuration of environment variables.
 * @returns `true` if all required variables exist, otherwise `false`.
 */
function validateEnvironmentVariables(config: EnvironmentConfig): boolean {
	for (const key in config) {
		if (config[key].isRequired && !process.env[key]) {
			console.error(`Missing required environment variable: ${key}`);
			process.exit(1);
		}
	}
	return true;
}


/**
 * Logs out all the environment variables and their values in a table.
 * 
 * @param config - The configuration of environment variables.
 */
function logEnvironmentVariables<T extends EnvironmentConfig>(config: EnvironmentConfig, environment: Environment<T>): void {
	const data = [];
	for (const key in config) {
		const value = environment[key];
		const description = config[key].description;
		const isSecret = config[key].isSecret;
		const displayValue = !value ? 'Missing from environment' 
			: isSecret ? `***${value.slice(-4)}` 
			: value;

		data.push({ Variable: key, Value: displayValue, Description: description });
	}
	console.table(data);
}


/**
 * Reads and processes the described environment variables.
 * 
 * @param input - The configuration of environment variables.
 * @returns An object containing the processed environment variables.
 */
export function read<T extends EnvironmentConfig>(input: T): Record<keyof T, string> {

	validateEnvironmentVariables(input);

    const result: Partial<Environment<T>> = {};
    for (const key in input) {
        result[key] = process.env[key] ?? '';
    }

	logEnvironmentVariables(input, result as Environment<T>);

    return result as Environment<T>;
}

const config: EnvironmentConfig = {
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
}