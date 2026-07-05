import { ConfigureSignatureV1, replaceRegionInRequest } from "./signer.js";
import { loadDefaultConfig } from "#config-loader";
import { Runtime } from "@deployport/specular-runtime";
/**
 * Configure installs the DeployPort request signer on a client config.
 *
 * On Node, config left unset is resolved from the DEPLOYPORT_* environment
 * variables and the ~/.deployport files on the first request (the resolution is
 * async and memoized). In the browser, `loadDefaultConfig` is a no-op, so the
 * `deployport` config must be provided explicitly.
 */
export function Configure(config) {
    const requestConfigurators = config?.requestConfigurators ?? [];
    // Resolve once, lazily, on the first request. Keeps Configure synchronous
    // and browser-safe while deferring any Node I/O to request time.
    let resolved;
    requestConfigurators.push(async (submission) => {
        resolved ??= loadDefaultConfig(config);
        const cfg = await resolved;
        // Substitute the <region> endpoint placeholder for every request that
        // has a resolved region, whether or not it is signed (mirrors Go).
        const region = cfg.deployport?.region;
        if (region) {
            replaceRegionInRequest(submission.request, region);
        }
        await ConfigureSignatureV1(submission, cfg);
    });
    return Runtime.MergeClientConfig(config, {
        requestConfigurators,
    });
}
