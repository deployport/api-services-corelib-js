import { Runtime, Metadata, } from '@deployport/specular-runtime';
/** Marks an operation with digital signature authentication for id4ntity verification
*/
export class SignedOperationV1 {
}
/** entity ServiceSignatureV1
*/
export class ServiceSignatureV1 {
    /** serviceName parameter
*/
    ServiceName = '';
}
const _pkg = new Metadata.Package("deployport", "corelib");
/** Struct metadata
*/
export const AccessDeniedProblemMeta = new Metadata.Struct(_pkg, "AccessDeniedProblem");
new Metadata.Property(AccessDeniedProblemMeta, "message", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "string"
});
/** struct AccessDeniedProblem
*/
export class AccessDeniedProblem extends Runtime.RpcError {
    get __structPath() {
        return AccessDeniedProblemMeta.path;
    }
}
AccessDeniedProblemMeta.problemInstantiate = (msg) => new AccessDeniedProblem(msg);
/** Struct metadata
*/
export const ForbiddenProblemMeta = new Metadata.Struct(_pkg, "ForbiddenProblem");
new Metadata.Property(ForbiddenProblemMeta, "message", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "string"
});
/** struct ForbiddenProblem
*/
export class ForbiddenProblem extends Runtime.RpcError {
    get __structPath() {
        return ForbiddenProblemMeta.path;
    }
}
ForbiddenProblemMeta.problemInstantiate = (msg) => new ForbiddenProblem(msg);
/** Struct metadata
*/
export const ProblemActionMeta = new Metadata.Struct(_pkg, "ProblemAction");
new Metadata.Property(ProblemActionMeta, "id", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "string"
});
new Metadata.Property(ProblemActionMeta, "locale", {
    NonNullable: false,
    SubType: "builtin",
    Builtin: "string"
});
new Metadata.Property(ProblemActionMeta, "title", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "string"
});
new Metadata.Property(ProblemActionMeta, "url", {
    NonNullable: false,
    SubType: "builtin",
    Builtin: "string"
});
/** Struct metadata
*/
export const ThrottledProblemMeta = new Metadata.Struct(_pkg, "ThrottledProblem");
new Metadata.Property(ThrottledProblemMeta, "actions", {
    NonNullable: true,
    SubType: "array",
    Item: {
        NonNullable: true,
        SubType: "userDefined",
        Type: SpecularPackage().requireTypeByName("ProblemAction")
    }
});
new Metadata.Property(ThrottledProblemMeta, "message", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "string"
});
new Metadata.Property(ThrottledProblemMeta, "retryAfterMs", {
    NonNullable: false,
    SubType: "builtin",
    Builtin: "int64"
});
/** Raised when the caller is being throttled and should retry later.
*/
export class ThrottledProblem extends Runtime.RpcError {
    actions = [];
    retryAfterMs = null;
    get __structPath() {
        return ThrottledProblemMeta.path;
    }
}
ThrottledProblemMeta.problemInstantiate = (msg) => new ThrottledProblem(msg);
/** Struct metadata
*/
export const QuotaExceededProblemMeta = new Metadata.Struct(_pkg, "QuotaExceededProblem");
new Metadata.Property(QuotaExceededProblemMeta, "actions", {
    NonNullable: true,
    SubType: "array",
    Item: {
        NonNullable: true,
        SubType: "userDefined",
        Type: SpecularPackage().requireTypeByName("ProblemAction")
    }
});
new Metadata.Property(QuotaExceededProblemMeta, "message", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "string"
});
/** Raised when a resource quota has been exceeded.
*/
export class QuotaExceededProblem extends Runtime.RpcError {
    actions = [];
    get __structPath() {
        return QuotaExceededProblemMeta.path;
    }
}
QuotaExceededProblemMeta.problemInstantiate = (msg) => new QuotaExceededProblem(msg);
export function SpecularPackage() {
    return _pkg;
}
