import { Runtime } from "@deployport/specular-runtime";
import type { Config } from "./config.js";
type Credentials = {
    keyID: string;
    secret: string;
};
/**
 * Replaces the `<region>` placeholder in the request URL and Host header with
 * the given region. Mirrors Go's `ReplaceRegionInRequest`. Runs for every
 * request that has a resolved region, whether or not the request is signed.
 */
export declare function replaceRegionInRequest(request: Runtime.HTTPRequest, region: string): void;
export declare function ConfigureSignatureV1(submission: Runtime.Submission, config: Config): Promise<void>;
export declare const getSigningKeyReal: (credentials: Credentials, shortDate: string, region: string, service: string, vendor: string) => Promise<Uint8Array>;
/**
 * Converts a Uint8Array of binary data to a hexadecimal encoded string.
 *
 * @param bytes The binary data to encode
 */
export declare function toHex(bytes: Uint8Array): string;
export declare const iso8601: (time: Date) => string;
export {};
