// Browser configuration loader. This module is selected via the
// `#config-loader` package import for non-Node targets (see package.json
// `imports`). It contains NO Node builtins, so bundlers never pull `fs`/`os`
// into a browser build. In the browser there is no environment or filesystem
// to read, so config must be provided explicitly by the consumer.
//
// It intentionally mirrors the public surface of `loader.node.ts` so that
// `#config-loader` resolves to the same shape in both environments.

import type { Config, GetEndpointOverride, LoadDefaultConfig } from "./config.js";

/**
 * loadDefaultConfig is a no-op passthrough in the browser: whatever the
 * consumer passed is what gets used. There is no env/file resolution.
 */
export async function loadDefaultConfig(config?: Config): Promise<Config> {
    return config ?? {};
}

/**
 * getEndpointOverride always returns "" in the browser: there is no settings
 * file to read. Consumers set endpoints explicitly on the client config.
 */
export async function getEndpointOverride(
    _service: string,
    _options?: { profile?: string; settingsFilePath?: string },
): Promise<string> {
    return "";
}

// Compile-time guard: this variant must match the shared loader signatures so
// `#config-loader` resolves identically in Node and the browser.
const _loadDefaultConfig: LoadDefaultConfig = loadDefaultConfig;
const _getEndpointOverride: GetEndpointOverride = getEndpointOverride;
void _loadDefaultConfig;
void _getEndpointOverride;
