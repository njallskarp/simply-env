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
 * Represents the data structure for the table object.
 */
interface TableData {
	Variable: string;
	Value: string;
	Description: string;
}

/**
 * Represents the configuration of environment variables.
 */
type EnvironmentConfig = Record<string, EnvironmentVariableDescription>;
type Environment<T extends EnvironmentConfig> = Record<keyof T, string>;

const DEFAULT_VALUE = "";
const VALUE_MISSING_MESSAGE = '"" (Missing from environment)';

/**
 * Validates the environment variables based on the provided configuration.
 * 
 * @param config - The configuration of environment variables.
 * @returns `true` if all required variables exist, otherwise `false`.
 */
function validateEnvironmentVariables(config: EnvironmentConfig): boolean {
	for (const key in config) {
		if (config[key]!.isRequired && !process.env[key]) {
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
	const data: TableData[] = [];
	for (const key in config) {
		const value = environment[key];
		const description = config[key]!.description;
		const isSecret = config[key]!.isSecret;
		const displayValue = !value ? VALUE_MISSING_MESSAGE
			: isSecret ? `****${value.slice(-4)}` 
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
export default function read<T extends EnvironmentConfig>(input: T): Record<keyof T, string> {

	validateEnvironmentVariables(input);

    const result: Partial<Environment<T>> = {};
    for (const key in input) {
        result[key] = process.env[key] ?? DEFAULT_VALUE;
    }

	logEnvironmentVariables(input, result as Environment<T>);

    return result as Environment<T>;
}
