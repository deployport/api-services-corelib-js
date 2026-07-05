// Universal (browser + Node) configuration types and constants for the
// DeployPort configurator. This module MUST NOT import any Node builtins
// (`node:fs`, `node:os`, ...) or Node-only packages so it stays safe to bundle
// for the browser. The Node-only resolution logic lives in `loader.node.ts`,
// which is swapped in for `loader.browser.ts` via the package `#config-loader`
// import condition.
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
