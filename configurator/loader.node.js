// Node-only configuration loader. This module is selected via the
// `#config-loader` package import when running under Node (see package.json
// `imports`). It is NEVER bundled for the browser, so it may freely import
// Node builtins. The browser gets `loader.browser.ts` instead.
//
// The resolution chain mirrors the Go corelib (configurator/config_files.go,
// configurator/configurator.go): explicit config -> DEPLOYPORT_* env ->
// ~/.deployport files (for the resolved profile) -> DefaultRegion.
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { parse as parseYAML } from "yaml";
import { DEFAULT_CREDENTIALS_FILE_PATH, DEFAULT_PROFILE, DEFAULT_REGION, DEFAULT_SETTINGS_FILE_PATH, ENV_ACCESS_KEY_ID, ENV_PROFILE, ENV_REGION, ENV_SECRET_ACCESS_KEY, } from "./config.js";
// --- Public API -------------------------------------------------------------
/**
 * loadDefaultConfig resolves the DeployPort config using the full default
 * chain, filling only values not already set explicitly: environment variables,
 * then the default config files for the resolved profile, then DEFAULT_REGION
 * as a last resort. Explicit values always win. Missing files are ignored;
 * malformed files throw.
 */
export async function loadDefaultConfig(config) {
    const dp = { ...(config?.deployport ?? {}) };
    const anonymous = dp.anonymous ?? false;
    const scope = dp.accountScope ?? "auto";
    const profile = resolveProfile(dp.profile);
    // Credentials are treated as a unit: if the caller set either field
    // explicitly, we do not auto-load them from env or files (mirrors Go's
    // `Credentials == nil` gate).
    const credsExplicit = dp.accessKeyID != null || dp.secretAccessKey != null;
    if (!anonymous && !credsExplicit) {
        const envKeyID = process.env[ENV_ACCESS_KEY_ID];
        const envSecret = process.env[ENV_SECRET_ACCESS_KEY];
        if (envKeyID || envSecret) {
            // Env provides the credentials as a unit; files are skipped.
            dp.accessKeyID = envKeyID ?? "";
            dp.secretAccessKey = envSecret ?? "";
        }
        else {
            const credsFile = await loadCredentialsFile(credentialsPath(dp));
            const acc = accountFor(credsFile, profile, scope);
            if (acc && acc.accessKeyID) {
                dp.accessKeyID = acc.accessKeyID;
                dp.secretAccessKey = acc.secretAccessKey ?? "";
            }
        }
    }
    // Region: explicit -> env -> settings file -> default.
    if (!dp.region) {
        const envRegion = process.env[ENV_REGION];
        if (envRegion) {
            dp.region = envRegion;
        }
    }
    if (!dp.region) {
        const settingsFile = await loadSettingsFile(settingsPath(dp));
        const region = regionFor(settingsFile, profile);
        if (region) {
            dp.region = region;
        }
    }
    if (!dp.region) {
        dp.region = DEFAULT_REGION;
    }
    return { ...config, deployport: dp };
}
/**
 * getEndpointOverride reads `profiles.<profile>.services.<service>.endpoint.url`
 * from the settings file, or "" if none is set. Lets a Node consumer (e.g. a
 * CLI) pick a per-service endpoint while corelib stays service-agnostic.
 */
export async function getEndpointOverride(service, options) {
    const profile = resolveProfile(options?.profile);
    const settingsFile = await loadSettingsFile(options?.settingsFilePath ? expandPath(options.settingsFilePath) : defaultSettingsPath());
    return endpointFor(settingsFile, profile, service);
}
// --- Resolution helpers (mirror Go) -----------------------------------------
function resolveProfile(explicit) {
    if (explicit) {
        return explicit;
    }
    const fromEnv = process.env[ENV_PROFILE];
    if (fromEnv) {
        return fromEnv;
    }
    return DEFAULT_PROFILE;
}
function accountFor(file, profile, scope) {
    const p = file.profiles?.[profile];
    if (!p) {
        return undefined;
    }
    switch (scope) {
        case "global":
            return p.global;
        case "current":
            return p.current;
        default: // "auto"
            return p.current ?? p.global;
    }
}
function regionFor(file, profile) {
    return file.profiles?.[profile]?.region ?? "";
}
function endpointFor(file, profile, service) {
    return file.profiles?.[profile]?.services?.[service]?.endpoint?.url ?? "";
}
// --- File loading ------------------------------------------------------------
async function loadCredentialsFile(path) {
    return loadYamlFile(path, "credentials");
}
async function loadSettingsFile(path) {
    return loadYamlFile(path, "settings");
}
async function loadYamlFile(path, kind) {
    let data;
    try {
        data = await readFile(path, "utf8");
    }
    catch (err) {
        if (isNotFound(err)) {
            return { profiles: {} };
        }
        throw new Error(`failed to read ${kind} file: ${errMessage(err)}`);
    }
    try {
        return parseYAML(data) ?? { profiles: {} };
    }
    catch (err) {
        throw new Error(`failed to parse ${kind} file: ${errMessage(err)}`);
    }
}
function isNotFound(err) {
    return err?.code === "ENOENT";
}
function errMessage(err) {
    return err instanceof Error ? err.message : String(err);
}
// --- Path resolution ---------------------------------------------------------
function credentialsPath(dp) {
    return dp.credentialsFilePath
        ? expandPath(dp.credentialsFilePath)
        : defaultCredentialsPath();
}
function settingsPath(dp) {
    return dp.settingsFilePath ? expandPath(dp.settingsFilePath) : defaultSettingsPath();
}
function defaultCredentialsPath() {
    return expandPath(DEFAULT_CREDENTIALS_FILE_PATH);
}
function defaultSettingsPath() {
    return expandPath(DEFAULT_SETTINGS_FILE_PATH);
}
/** Expands a leading `~` and `$HOME`/`${HOME}` to the user's home directory. */
function expandPath(path) {
    const home = homedir();
    return path
        .replace(/^~(?=\/|$)/, home)
        .replace(/\$\{HOME\}/g, home)
        .replace(/\$HOME/g, home);
}
// Compile-time guard: this variant must match the shared loader signatures so
// `#config-loader` resolves identically in Node and the browser.
const _loadDefaultConfig = loadDefaultConfig;
const _getEndpointOverride = getEndpointOverride;
void _loadDefaultConfig;
void _getEndpointOverride;
