// JS gen package
import {
    Runtime,
    Metadata,
} from '@deployport/specular-runtime';

// SignedOperationV1 entity
// Marks an operation with digital signature authentication for id4ntity verification
export class SignedOperationV1 {
}

// ServiceSignatureV1 entity
export class ServiceSignatureV1 {
    public ServiceName: string = '';
}

const _pkg = new Metadata.Package(
    "deployport",
    "corelib",
);

export const AccessDeniedProblemMeta = new Metadata.Struct(
    _pkg,
    "AccessDeniedProblem",
);
new Metadata.Property(AccessDeniedProblemMeta, "message", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "string"
});
// AccessDeniedProblem entity
export interface AccessDeniedProblemProperties {
    // /**
    // * Returns "deployport/corelib.AccessDeniedProblem"
    // */
    // fqtn: "deployport/corelib.AccessDeniedProblem";
    message: string
}
export class AccessDeniedProblem extends Error implements AccessDeniedProblemProperties, Runtime.StructInterface {
    message: string = ''
    get __structPath(): Metadata.StructPath {
        return AccessDeniedProblemMeta.path
    }
}
AccessDeniedProblemMeta.problemInstantiate = (msg: string) => new AccessDeniedProblem(msg);
export const ForbiddenProblemMeta = new Metadata.Struct(
    _pkg,
    "ForbiddenProblem",
);
new Metadata.Property(ForbiddenProblemMeta, "message", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "string"
});
// ForbiddenProblem entity
export interface ForbiddenProblemProperties {
    // /**
    // * Returns "deployport/corelib.ForbiddenProblem"
    // */
    // fqtn: "deployport/corelib.ForbiddenProblem";
    message: string
}
export class ForbiddenProblem extends Error implements ForbiddenProblemProperties, Runtime.StructInterface {
    message: string = ''
    get __structPath(): Metadata.StructPath {
        return ForbiddenProblemMeta.path
    }
}
ForbiddenProblemMeta.problemInstantiate = (msg: string) => new ForbiddenProblem(msg);

export function SpecularPackage() {
    return _pkg;
}
