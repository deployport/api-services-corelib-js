import { Sha256 } from '@aws-crypto/sha256-js';
const VendorCode = 'dpp';
export async function ConfigureSignatureV1(submission, config) {
    // const { request } = submission;
    // const { headers } = request;
    // if (!headers["x-specular-signature"]) {
    //     headers["x-specular-signature"] = "v1";
    // }
    console.log("Hello from ConfigureSignatureV1 in runtime/signer.ts!", submission);
    const annotations = submission.operation.resource.package.annotations;
    console.log("service annotations", annotations);
    const ServiceSignatureV1 = annotations.find((a) => a.constructor.name === "ServiceSignatureV1");
    if (!ServiceSignatureV1) {
        return;
    }
    console.log("signing using config", config);
    const { deployport } = config;
    if (!deployport) {
        console.warn("missing required deployport configuration for signing", config);
        return;
    }
    const { region, accessKeyID: keyID, secretAccessKey: secret } = deployport;
    if (!region || !keyID || !secret) {
        console.warn("missing required configuration for signing", deployport);
        return;
    }
    const { ServiceName: signingService } = ServiceSignatureV1;
    console.log("annotations", annotations, VendorCode, signingService);
    const { longDate, shortDate } = formatDate(new Date());
    const signingScope = buildSigningScope(VendorCode, region, signingService, shortDate);
    console.log("signingScope", signingScope);
    const credentialPart = buildCredentialPart(keyID, signingScope);
    console.log("credentialPart", credentialPart);
    const authHeaderPrefix = vendorAlgorithm(VendorCode) + " " + credentialPart;
    const bodyDigest = toHex(await hashSHA256(submission.request.body));
    console.log("bodyDigest", bodyDigest);
    const headers = submission.request.headers;
    headers[vendorDateHeaderKey(VendorCode)] = longDate;
    headers[vendorHeaderCanonicalNameKey(VendorCode, "Service")] = signingService;
    headers[vendorHeaderCanonicalNameKey(VendorCode, "Resource")] = submission.operation.resource.packageUniqueName;
    headers[vendorHeaderCanonicalNameKey(VendorCode, "Operation")] = submission.operation.name;
    headers[vendorRegionHeaderKey(VendorCode)] = region;
    headers[vendorHeaderCanonicalNameKey(VendorCode, "Content-Sha256")] = bodyDigest;
    console.log("headers", headers);
    const canonicalHeaders = getCanonicalHeaders(VendorCode, headers);
    const credentials = {
        keyID,
        secret,
    };
    const signingKey = getSigningKey(credentials, region, shortDate, signingService, VendorCode);
    const { request } = submission;
    // const payloadHash = await getPayloadHash(request.body);
    const signature = await getSignature(VendorCode, longDate, signingScope, signingKey, createCanonicalRequest(request, canonicalHeaders, bodyDigest));
    headers["Authorization"] = [authHeaderPrefix, `SignedHeaders=${canonicalHeaders.signedHeaders}`, `Signature=${signature}`];
    console.log("signed headers", headers);
}
function createCanonicalRequest(request, canonicalHeaders, payloadHash) {
    const sortedHeaders = canonicalHeaders.names;
    return `${request.method}
${getCanonicalPath(request)}
${getCanonicalQuery(request)}
${sortedHeaders.map((name) => `${name}:${canonicalHeaders.clean[name]}`).join("\n")}

${canonicalHeaders.signedHeaders}
${payloadHash}`;
}
function getCanonicalQuery({ path }) {
    return ""; // TODO: hardcoded, we don't use query strings
}
function getCanonicalPath({ path }) {
    console.log("getCanonicalPath path", path);
    return path;
    // if (this.uriEscapePath) {
    // Non-S3 services, we normalize the path and then double URI encode it.
    // Ref: "Remove Dot Segments" https://datatracker.ietf.org/doc/html/rfc3986#section-5.2.4
    const normalizedPathSegments = [];
    for (const pathSegment of path.split("/")) {
        if (pathSegment?.length === 0)
            continue;
        if (pathSegment === ".")
            continue;
        if (pathSegment === "..") {
            normalizedPathSegments.pop();
        }
        else {
            normalizedPathSegments.push(pathSegment);
        }
        // }
        // Joining by single slashes to remove consecutive slashes.
        const normalizedPath = `${path?.startsWith("/") ? "/" : ""}${normalizedPathSegments.join("/")}${normalizedPathSegments.length > 0 && path?.endsWith("/") ? "/" : ""}`;
        const doubleEncoded = encodeURIComponent(normalizedPath);
        return doubleEncoded.replace(/%2F/g, "/");
    }
    // For S3, we shouldn't normalize the path. For example, object name
    // my-object//example//photo.user should not be normalized to
    // my-object/example/photo.user
    console.log("getCanonicalPath path (curated)", path);
    return path;
}
// /**
//  * @private
//  */
// export const getPayloadHash = async (
//     body: string,
// ): Promise<string> => {
//     const hashCtor = new Sha256();
//     // new Sha256().update(toUint8Array(body));
//     new Sha256().update(body);
//     return toHex(await hashCtor.digest());
// };
async function getSignature(vendor, longDate, credentialScope, keyPromise, canonicalRequest) {
    const stringToSign = await createStringToSign(vendor, longDate, credentialScope, canonicalRequest);
    console.log("stringToSign", stringToSign);
    const hash = new Sha256(await keyPromise);
    hash.update(stringToSign);
    return toHex(await hash.digest());
}
async function createStringToSign(vendor, longDate, credentialScope, canonicalRequest) {
    console.log('canonicalRequest', canonicalRequest);
    const hash = new Sha256();
    hash.update(canonicalRequest);
    const hashedRequest = await hash.digest();
    return `${vendorAlgorithm(vendor)}
${longDate}
${credentialScope}
${toHex(hashedRequest)}`;
}
const toUtf8 = (input) => new TextDecoder("utf-8").decode(input);
// export const toUint8Array = (data: string | ArrayBuffer | ArrayBufferView): Uint8Array => {
//     // if (typeof data === "string") {
//     //     return fromUtf8(data);
//     // }
//     // if (ArrayBuffer.isView(data)) {
//     //     return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
//     // }
//     // return new Uint8Array(data);
//     return new Uint8Array(data);
// };
async function getSigningKey(credentials, region, shortDate, service, vendor) {
    return getSigningKeyReal(credentials, shortDate, region, service, vendor);
}
function vendorKeyType(vendor) {
    return vendor + "1_request";
}
export const getSigningKeyReal = async (credentials, shortDate, region, service, vendor) => {
    let key = `${vendor}1${credentials.secret}`;
    for (const signable of [shortDate, region, service, vendorKeyType(vendor)]) {
        key = await hmac(key, signable);
    }
    return key;
};
// type signingData = string | Uint8Array;
const hmac = (secret, data) => {
    const hash = new Sha256(secret);
    hash.update(data);
    return hash.digest();
};
function getCanonicalHeaders(vendorCode, headers) {
    const validHeaderNames = [
        "Host",
        vendorDateHeaderKey(vendorCode),
        vendorHeaderCanonicalNameKey(vendorCode, "Service"),
        vendorHeaderCanonicalNameKey(vendorCode, "Resource"),
        vendorHeaderCanonicalNameKey(vendorCode, "Operation"),
        vendorHeaderCanonicalNameKey(vendorCode, "Content-Sha256"),
        vendorHeaderCanonicalNameKey(vendorCode, "Region"),
    ];
    const cleaned = {};
    for (const key in headers) {
        if (!validHeaderNames.includes(key)) {
            continue;
        }
        const val = headers[key];
        if (Array.isArray(val)) {
            cleaned[key] = val.map(v => v.trim());
        }
        else {
            cleaned[key] = val.trim();
        }
    }
    const names = Object.keys(cleaned).sort();
    return {
        names,
        signedHeaders: names.map(n => n.toLowerCase()).join(";"),
        clean: cleaned,
    };
}
const SHORT_TO_HEX = {};
for (let i = 0; i < 256; i++) {
    let encodedByte = i.toString(16).toLowerCase();
    if (encodedByte.length === 1) {
        encodedByte = `0${encodedByte}`;
    }
    SHORT_TO_HEX[i] = encodedByte;
}
/**
 * Converts a Uint8Array of binary data to a hexadecimal encoded string.
 *
 * @param bytes The binary data to encode
 */
export function toHex(bytes) {
    let out = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        out += SHORT_TO_HEX[bytes[i]];
    }
    return out;
}
// convert hashSHA256 to ts
async function hashSHA256(dataStr) {
    const data = new TextEncoder().encode(dataStr);
    const hash = new Sha256();
    hash.update(data);
    return await hash.digest();
}
const credentialPartPrefix = "Credential=";
function buildCredentialPart(keyID, signingScope) {
    return `${credentialPartPrefix}${keyID}/${signingScope}`;
}
function buildSigningScope(vendorCode, region, service, shortDate) {
    return [
        shortDate,
        region,
        service,
        vendorRequestCode(vendorCode),
    ].join("/");
}
function vendorRequestCode(vendorCode) {
    return vendorCode + "1_request";
}
function vendorAlgorithm(vendorCode) {
    return vendorCode.toUpperCase() + "1-HMAC-SHA256";
}
// function formatShortTime(dt: Date): string {
//     return dt.toISOString().replace(/[-:]/g, "").slice(0, 15);
// }
export const iso8601 = (time) => time.toISOString()
    .replace(/\.\d{3}Z$/, "Z");
const formatDate = (now) => {
    const longDate = iso8601(now).replace(/[\-:]/g, "");
    return {
        longDate,
        shortDate: longDate.slice(0, 8),
    };
};
function vendorDateHeaderKey(vendorCode) {
    return vendorHeaderCanonicalNameKey(vendorCode, "Date");
}
function vendorRegionHeaderKey(vendorCode) {
    return vendorHeaderCanonicalNameKey(vendorCode, "Region");
}
function vendorHeaderCanonicalNameKey(vendorCode, header) {
    return httpHeaderStandardName("x-" + vendorCode + "-" + header.toLowerCase());
}
function httpHeaderStandardName(header) {
    return header.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("-");
}
