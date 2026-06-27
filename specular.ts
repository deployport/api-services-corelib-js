import {
    Runtime,
    Metadata,
} from '@deployport/specular-runtime';

/** Marks an operation with digital signature authentication for id4ntity verification
*/
export class SignedOperationV1 {
}

/** entity ServiceSignatureV1
*/
export class ServiceSignatureV1 {
    /** serviceName parameter
*/
    public ServiceName: string = '';
}

const _pkg = new Metadata.Package(
    "deployport", 
    "corelib",
);

/** Struct metadata
*/
export const AccessDeniedProblemMeta = new Metadata.Struct(
    _pkg, 
    "AccessDeniedProblem", 
);
new Metadata.Property(AccessDeniedProblemMeta, "message", {
NonNullable: true,
SubType: "builtin",
Builtin: "string"
});
/** struct AccessDeniedProblem
*/
export interface AccessDeniedProblemProperties {
    /** message property
*/
    message : string
}
/** struct AccessDeniedProblem
*/
export class AccessDeniedProblem extends Runtime.RpcError implements AccessDeniedProblemProperties, Runtime.StructInterface {
    get __structPath(): Metadata.StructPath {
        return AccessDeniedProblemMeta.path
    }
}
AccessDeniedProblemMeta.problemInstantiate = (msg: string) => new AccessDeniedProblem(msg);
/** Struct metadata
*/
export const ForbiddenProblemMeta = new Metadata.Struct(
    _pkg, 
    "ForbiddenProblem", 
);
new Metadata.Property(ForbiddenProblemMeta, "message", {
NonNullable: true,
SubType: "builtin",
Builtin: "string"
});
/** struct ForbiddenProblem
*/
export interface ForbiddenProblemProperties {
    /** message property
*/
    message : string
}
/** struct ForbiddenProblem
*/
export class ForbiddenProblem extends Runtime.RpcError implements ForbiddenProblemProperties, Runtime.StructInterface {
    get __structPath(): Metadata.StructPath {
        return ForbiddenProblemMeta.path
    }
}
ForbiddenProblemMeta.problemInstantiate = (msg: string) => new ForbiddenProblem(msg);
/** Struct metadata
*/
export const ProblemActionMeta = new Metadata.Struct(
    _pkg, 
    "ProblemAction", 
);
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
/** A localized call-to-action surfaced alongside a problem. Title and URL
* are already resolved to a specific locale; clients render them as-is.
*/
export interface ProblemActionProperties {
    /** Optional stable identifier. Clients can key on it to apply custom
* presentation (icon, ordering) per well-known action.
*/
    id : string
    /** BCP 47 tag of the locale the title and url were resolved to. May
* differ from the caller's requested locale when a fallback was used.
*/
    locale : string| null
    /** title property
*/
    title : string
    /** url property
*/
    url : string| null
}
/** A localized call-to-action surfaced alongside a problem. Title and URL
* are already resolved to a specific locale; clients render them as-is.
*/
export interface ProblemAction extends ProblemActionProperties, Runtime.StructInterface {}
/** Struct metadata
*/
export const ThrottledProblemMeta = new Metadata.Struct(
    _pkg, 
    "ThrottledProblem", 
);
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
export interface ThrottledProblemProperties {
    /** Optional calls-to-action to help the caller (e.g. support, upgrade,
* docs links), ordered most-specific first. Empty when none apply.
*/
    actions : (ProblemActionProperties)[]
    /** message property
*/
    message : string
    /** Milliseconds the caller should wait before retrying.
*/
    retryAfterMs : number| null
}
/** Raised when the caller is being throttled and should retry later.
*/
export class ThrottledProblem extends Runtime.RpcError implements ThrottledProblemProperties, Runtime.StructInterface {
    actions : (ProblemActionProperties)[] = []
    retryAfterMs : number| null = null
    get __structPath(): Metadata.StructPath {
        return ThrottledProblemMeta.path
    }
}
ThrottledProblemMeta.problemInstantiate = (msg: string) => new ThrottledProblem(msg);
/** Struct metadata
*/
export const QuotaExceededProblemMeta = new Metadata.Struct(
    _pkg, 
    "QuotaExceededProblem", 
);
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
export interface QuotaExceededProblemProperties {
    /** Optional calls-to-action to help the caller (e.g. request an increase,
* upgrade, docs links), ordered most-specific first. Empty when none apply.
*/
    actions : (ProblemActionProperties)[]
    /** message property
*/
    message : string
}
/** Raised when a resource quota has been exceeded.
*/
export class QuotaExceededProblem extends Runtime.RpcError implements QuotaExceededProblemProperties, Runtime.StructInterface {
    actions : (ProblemActionProperties)[] = []
    get __structPath(): Metadata.StructPath {
        return QuotaExceededProblemMeta.path
    }
}
QuotaExceededProblemMeta.problemInstantiate = (msg: string) => new QuotaExceededProblem(msg);

export function SpecularPackage() {
    return _pkg;
}
