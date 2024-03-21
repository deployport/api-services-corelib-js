import { Runtime } from "@deployport/specular-runtime";
type Credentials = {
    keyID: string;
    secret: string;
};
export type Config = {
    deployport?: {
        region?: string;
        accessKeyID?: string;
        secretAccessKey?: string;
    };
};
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
