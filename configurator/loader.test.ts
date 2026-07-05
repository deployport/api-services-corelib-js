import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getEndpointOverride, loadDefaultConfig } from "./loader.node.js";
import { loadDefaultConfig as browserLoadDefaultConfig } from "./loader.browser.js";

// Mirrors api-services-corelib-go/configurator/config_files_test.go.

const sampleCredentialsYAML = `profiles:
  default:
    current:
      accessKeyID: AKcurrent
      secretAccessKey: SKcurrent
    global:
      accessKeyID: AKglobal
      secretAccessKey: SKglobal
`;

const sampleSettingsYAML = `profiles:
  default:
    region: ljnyc
    services:
      iam: {}
      binara:
        endpoint:
          url: https://ljb.deployport.io
`;

const ENV_KEYS = [
    "HOME",
    "DEPLOYPORT_ACCESS_KEY_ID",
    "DEPLOYPORT_SECRET_ACCESS_KEY",
    "DEPLOYPORT_REGION",
    "DEPLOYPORT_PROFILE",
] as const;

let savedEnv: Record<string, string | undefined>;
let tmpDirs: string[];

beforeEach(() => {
    savedEnv = {};
    for (const k of ENV_KEYS) {
        savedEnv[k] = process.env[k];
    }
    tmpDirs = [];
    // Start every test from a known state.
    delete process.env.DEPLOYPORT_ACCESS_KEY_ID;
    delete process.env.DEPLOYPORT_SECRET_ACCESS_KEY;
    delete process.env.DEPLOYPORT_REGION;
    delete process.env.DEPLOYPORT_PROFILE;
});

afterEach(() => {
    for (const k of ENV_KEYS) {
        if (savedEnv[k] === undefined) {
            delete process.env[k];
        } else {
            process.env[k] = savedEnv[k];
        }
    }
    for (const d of tmpDirs) {
        rmSync(d, { recursive: true, force: true });
    }
});

function newTmpDir(): string {
    const d = mkdtempSync(join(tmpdir(), "dpp-cfg-"));
    tmpDirs.push(d);
    return d;
}

// Writes credentials.yml and settings.yml under a fresh HOME/.deployport and
// points HOME at it, so the default file paths resolve there.
function writeConfigFiles(cred: string, settings: string): void {
    const home = newTmpDir();
    const dir = join(home, ".deployport");
    mkdirSync(dir, { recursive: true });
    if (cred) {
        writeFileSync(join(dir, "credentials.yml"), cred);
    }
    if (settings) {
        writeFileSync(join(dir, "settings.yml"), settings);
    }
    process.env.HOME = home;
}

describe("loadDefaultConfig (Node)", () => {
    test("resolves credentials (auto -> current) and region from files", async () => {
        writeConfigFiles(sampleCredentialsYAML, sampleSettingsYAML);
        const c = await loadDefaultConfig();
        expect(c.deployport?.accessKeyID).toBe("AKcurrent");
        expect(c.deployport?.secretAccessKey).toBe("SKcurrent");
        expect(c.deployport?.region).toBe("ljnyc");
    });

    test("account scope global selects the global account", async () => {
        writeConfigFiles(sampleCredentialsYAML, sampleSettingsYAML);
        const c = await loadDefaultConfig({ deployport: { accountScope: "global" } });
        expect(c.deployport?.accessKeyID).toBe("AKglobal");
    });

    test("auto falls back to global when current is absent", async () => {
        const globalOnly = `profiles:
  default:
    global:
      accessKeyID: G
      secretAccessKey: S
`;
        writeConfigFiles(globalOnly, "");
        const c = await loadDefaultConfig();
        expect(c.deployport?.accessKeyID).toBe("G");
    });

    test("env overrides file", async () => {
        writeConfigFiles(sampleCredentialsYAML, sampleSettingsYAML);
        process.env.DEPLOYPORT_ACCESS_KEY_ID = "AKenv";
        process.env.DEPLOYPORT_SECRET_ACCESS_KEY = "SKenv";
        process.env.DEPLOYPORT_REGION = "us-env-1";
        const c = await loadDefaultConfig();
        expect(c.deployport?.accessKeyID).toBe("AKenv");
        expect(c.deployport?.region).toBe("us-env-1");
    });

    test("explicit wins over env and file", async () => {
        writeConfigFiles(sampleCredentialsYAML, sampleSettingsYAML);
        process.env.DEPLOYPORT_ACCESS_KEY_ID = "AKenv";
        process.env.DEPLOYPORT_SECRET_ACCESS_KEY = "SKenv";
        process.env.DEPLOYPORT_REGION = "us-env-1";
        const c = await loadDefaultConfig({
            deployport: {
                accessKeyID: "AKexplicit",
                secretAccessKey: "SKexplicit",
                region: "explicit-region",
            },
        });
        expect(c.deployport?.accessKeyID).toBe("AKexplicit");
        expect(c.deployport?.region).toBe("explicit-region");
    });

    test("no source -> DefaultRegion, no credentials", async () => {
        writeConfigFiles("", ""); // fresh empty HOME, no files
        const c = await loadDefaultConfig();
        expect(c.deployport?.region).toBe("us-east-2");
        expect(c.deployport?.accessKeyID).toBeUndefined();
    });

    test("custom file paths", async () => {
        const dir = newTmpDir();
        const credPath = join(dir, "creds.yml");
        const setPath = join(dir, "sets.yml");
        writeFileSync(credPath, sampleCredentialsYAML);
        writeFileSync(setPath, sampleSettingsYAML);
        process.env.HOME = newTmpDir(); // empty home so defaults resolve to nothing
        const c = await loadDefaultConfig({
            deployport: { credentialsFilePath: credPath, settingsFilePath: setPath },
        });
        expect(c.deployport?.accessKeyID).toBe("AKcurrent");
        expect(c.deployport?.region).toBe("ljnyc");
    });

    test("anonymous skips credential auto-loading but still resolves region", async () => {
        writeConfigFiles(sampleCredentialsYAML, sampleSettingsYAML);
        process.env.DEPLOYPORT_ACCESS_KEY_ID = "AKenv";
        process.env.DEPLOYPORT_SECRET_ACCESS_KEY = "SKenv";
        const c = await loadDefaultConfig({ deployport: { anonymous: true } });
        expect(c.deployport?.accessKeyID).toBeUndefined();
        expect(c.deployport?.region).toBe("ljnyc");
    });

    test("profile selection", async () => {
        const cred = `profiles:
  other:
    current:
      accessKeyID: AKother
      secretAccessKey: SKother
`;
        const settings = `profiles:
  other:
    region: other-region
`;
        writeConfigFiles(cred, settings);
        const c = await loadDefaultConfig({ deployport: { profile: "other" } });
        expect(c.deployport?.accessKeyID).toBe("AKother");
        expect(c.deployport?.region).toBe("other-region");
    });

    test("profile from DEPLOYPORT_PROFILE env", async () => {
        const cred = `profiles:
  other:
    current:
      accessKeyID: AKother
      secretAccessKey: SKother
`;
        writeConfigFiles(cred, "");
        process.env.DEPLOYPORT_PROFILE = "other";
        const c = await loadDefaultConfig();
        expect(c.deployport?.accessKeyID).toBe("AKother");
    });

    test("malformed file throws", async () => {
        writeConfigFiles("profiles: [unterminated", "");
        await expect(loadDefaultConfig()).rejects.toThrow(/failed to parse credentials file/);
    });
});

describe("getEndpointOverride (Node)", () => {
    test("reads a per-service endpoint override", async () => {
        writeConfigFiles(sampleCredentialsYAML, sampleSettingsYAML);
        expect(await getEndpointOverride("binara")).toBe("https://ljb.deployport.io");
    });

    test("service present but no override -> empty", async () => {
        writeConfigFiles(sampleCredentialsYAML, sampleSettingsYAML);
        expect(await getEndpointOverride("iam")).toBe("");
    });

    test("unknown service / missing file -> empty", async () => {
        writeConfigFiles(sampleCredentialsYAML, sampleSettingsYAML);
        expect(await getEndpointOverride("unknown-service")).toBe("");
        process.env.HOME = newTmpDir(); // no settings file
        expect(await getEndpointOverride("binara")).toBe("");
    });
});

describe("loadDefaultConfig (browser stub)", () => {
    test("passes explicit config through unchanged", async () => {
        const input = {
            deployport: { region: "eu-west-1", accessKeyID: "AK", secretAccessKey: "SK" },
        };
        expect(await browserLoadDefaultConfig(input)).toEqual(input);
    });

    test("does not fill any defaults (no env/file access)", async () => {
        const c = await browserLoadDefaultConfig({ deployport: {} });
        expect(c.deployport?.region).toBeUndefined();
        expect(c.deployport?.accessKeyID).toBeUndefined();
    });

    test("handles undefined input", async () => {
        expect(await browserLoadDefaultConfig()).toEqual({});
    });
});
