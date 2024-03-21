import { Config, ConfigureSignatureV1 } from "./signer.js";
import { Runtime } from "@deployport/specular-runtime";

export function Configure(c?: Runtime.ClientConfig): Runtime.ClientConfig {
    const requestConfigurators = c?.requestConfigurators ?? [];
    requestConfigurators.push(async (sub) => {
        console.warn("configuring request from config", sub.request);
        await ConfigureSignatureV1(sub, c as Config)
    });
    return Runtime.MergeClientConfig(c, {
        requestConfigurators,
    });
}
