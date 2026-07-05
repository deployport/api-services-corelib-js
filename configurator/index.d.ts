import type { Config } from "./config.js";
import { Runtime } from "@deployport/specular-runtime";
export type { Config, DeployportConfig, AccountScope } from "./config.js";
/**
 * Configure installs the DeployPort request signer on a client config.
 *
 * On Node, config left unset is resolved from the DEPLOYPORT_* environment
 * variables and the ~/.deployport files on the first request (the resolution is
 * async and memoized). In the browser, `loadDefaultConfig` is a no-op, so the
 * `deployport` config must be provided explicitly.
 */
export declare function Configure(config?: Runtime.ClientConfig & Config): Runtime.ClientConfig;
