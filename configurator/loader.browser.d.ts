import type { Config } from "./config.js";
/**
 * loadDefaultConfig is a no-op passthrough in the browser: whatever the
 * consumer passed is what gets used. There is no env/file resolution.
 */
export declare function loadDefaultConfig(config?: Config): Promise<Config>;
/**
 * getEndpointOverride always returns "" in the browser: there is no settings
 * file to read. Consumers set endpoints explicitly on the client config.
 */
export declare function getEndpointOverride(_service: string, _options?: {
    profile?: string;
    settingsFilePath?: string;
}): Promise<string>;
