// Universal (browser + Node) configuration types and constants for the
// DeployPort configurator. This module MUST NOT import any Node builtins
// (`node:fs`, `node:os`, ...) or Node-only packages so it stays safe to bundle
// for the browser. The Node-only resolution logic lives in `loader.node.ts`,
// which is swapped in for `loader.browser.ts` via the package `#config-loader`
// import condition.

/**
 * AccountScope selects which account slot of a profile's credentials to use.
 * - `"auto"`    uses the current account if present, otherwise the global account.
 * - `"global"`  uses the profile's global account.
 * - `"current"` uses the profile's current (switched) account.
 */
export type AccountScope = "auto" | "global" | "current";

/**
 * DeployportConfig holds the DeployPort signing configuration. On Node, unset
 * fields are resolved from the environment and `~/.deployport` files by
 * {@link loadDefaultConfig}; in the browser they must be provided explicitly.
 */
export type DeployportConfig = {
    region?: string;
    accessKeyID?: string;
    secretAccessKey?: string;
    /** Profile name; else `DEPLOYPORT_PROFILE`; else `"default"`. */
    profile?: string;
    /** Which account slot to read from the profile's credentials. Defaults to `"auto"`. */
    accountScope?: AccountScope;
    /** Disables credential auto-loading from env and files. Explicit credentials are still honored. */
    anonymous?: boolean;
    /** Overrides the credentials file path. Empty uses {@link DEFAULT_CREDENTIALS_FILE_PATH}. */
    credentialsFilePath?: string;
    /** Overrides the settings file path. Empty uses {@link DEFAULT_SETTINGS_FILE_PATH}. */
    settingsFilePath?: string;
};

/** Config is the DeployPort-specific configuration attached to a client config. */
export type Config = {
    deployport?: DeployportConfig;
};

/**
 * LoadDefaultConfig resolves a Config using the full default chain. The Node
 * implementation ({@link loader.node.ts}) fills unset values from the
 * environment then the default config files; the browser implementation
 * ({@link loader.browser.ts}) returns the config unchanged (explicit only).
 */
export type LoadDefaultConfig = (config?: Config) => Promise<Config>;

/**
 * GetEndpointOverride reads a per-service endpoint URL override for a profile.
 * On Node it reads the settings file; in the browser it always returns "".
 */
export type GetEndpointOverride = (
    service: string,
    options?: { profile?: string; settingsFilePath?: string },
) => Promise<string>;

// Environment variable names used for default configuration loading (Node only).
export const ENV_ACCESS_KEY_ID = "DEPLOYPORT_ACCESS_KEY_ID";
export const ENV_SECRET_ACCESS_KEY = "DEPLOYPORT_SECRET_ACCESS_KEY";
export const ENV_REGION = "DEPLOYPORT_REGION";
export const ENV_PROFILE = "DEPLOYPORT_PROFILE";

// Defaults used when resolving configuration from the environment and files.
export const DEFAULT_PROFILE = "default";
export const DEFAULT_REGION = "us-east-2";
export const DEFAULT_CREDENTIALS_FILE_PATH = "$HOME/.deployport/credentials.yml";
export const DEFAULT_SETTINGS_FILE_PATH = "$HOME/.deployport/settings.yml";
