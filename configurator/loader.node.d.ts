import { type Config } from "./config.js";
/**
 * loadDefaultConfig resolves the DeployPort config using the full default
 * chain, filling only values not already set explicitly: environment variables,
 * then the default config files for the resolved profile, then DEFAULT_REGION
 * as a last resort. Explicit values always win. Missing files are ignored;
 * malformed files throw.
 */
export declare function loadDefaultConfig(config?: Config): Promise<Config>;
/**
 * getEndpointOverride reads `profiles.<profile>.services.<service>.endpoint.url`
 * from the settings file, or "" if none is set. Lets a Node consumer (e.g. a
 * CLI) pick a per-service endpoint while corelib stays service-agnostic.
 */
export declare function getEndpointOverride(service: string, options?: {
    profile?: string;
    settingsFilePath?: string;
}): Promise<string>;
