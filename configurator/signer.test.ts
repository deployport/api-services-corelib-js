import { describe, expect, test } from "vitest";
import type { Runtime } from "@deployport/specular-runtime";
import { replaceRegionInRequest } from "./signer.js";

function req(url: string, headers: Record<string, string | string[]> = {}): Runtime.HTTPRequest {
    return { url, headers } as unknown as Runtime.HTTPRequest;
}

describe("replaceRegionInRequest", () => {
    test("substitutes <region> in the URL", () => {
        const r = req("https://iam.<region>.api.deployport.io/api/User/List");
        replaceRegionInRequest(r, "us-east-2");
        expect(r.url).toBe("https://iam.us-east-2.api.deployport.io/api/User/List");
    });

    test("substitutes <region> in the Host header when present", () => {
        const r = req("https://iam.<region>.api.deployport.io/api", {
            Host: "iam.<region>.api.deployport.io",
        });
        replaceRegionInRequest(r, "eu-west-1");
        expect(r.url).toBe("https://iam.eu-west-1.api.deployport.io/api");
        expect(r.headers["Host"]).toBe("iam.eu-west-1.api.deployport.io");
    });

    test("leaves URLs without the placeholder unchanged", () => {
        const r = req("https://iam.us-east-2.api.deployport.io/api");
        replaceRegionInRequest(r, "us-east-2");
        expect(r.url).toBe("https://iam.us-east-2.api.deployport.io/api");
    });
});
