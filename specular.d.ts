import { Runtime, Metadata } from '@deployport/specular-runtime';
/** Marks an operation with digital signature authentication for id4ntity verification
*/
export declare class SignedOperationV1 {
}
/** entity ServiceSignatureV1
*/
export declare class ServiceSignatureV1 {
    /** serviceName parameter
*/
    ServiceName: string;
}
/** Struct metadata
*/
export declare const AccessDeniedProblemMeta: Metadata.Struct;
/** struct AccessDeniedProblem
*/
export interface AccessDeniedProblemProperties {
    /** message property
*/
    message: string;
}
/** struct AccessDeniedProblem
*/
export declare class AccessDeniedProblem extends Runtime.RpcError implements AccessDeniedProblemProperties, Runtime.StructInterface {
    get __structPath(): Metadata.StructPath;
}
/** Struct metadata
*/
export declare const ForbiddenProblemMeta: Metadata.Struct;
/** struct ForbiddenProblem
*/
export interface ForbiddenProblemProperties {
    /** message property
*/
    message: string;
}
/** struct ForbiddenProblem
*/
export declare class ForbiddenProblem extends Runtime.RpcError implements ForbiddenProblemProperties, Runtime.StructInterface {
    get __structPath(): Metadata.StructPath;
}
/** Struct metadata
*/
export declare const ProblemActionMeta: Metadata.Struct;
/** A localized call-to-action surfaced alongside a problem. Title and URL
* are already resolved to a specific locale; clients render them as-is.
*/
export interface ProblemActionProperties {
    /** Optional stable identifier. Clients can key on it to apply custom
* presentation (icon, ordering) per well-known action.
*/
    id: string;
    /** BCP 47 tag of the locale the title and url were resolved to. May
* differ from the caller's requested locale when a fallback was used.
*/
    locale: string | null;
    /** title property
*/
    title: string;
    /** url property
*/
    url: string | null;
}
/** A localized call-to-action surfaced alongside a problem. Title and URL
* are already resolved to a specific locale; clients render them as-is.
*/
export interface ProblemAction extends ProblemActionProperties, Runtime.StructInterface {
}
/** Struct metadata
*/
export declare const ThrottledProblemMeta: Metadata.Struct;
/** Raised when the caller is being throttled and should retry later.
*/
export interface ThrottledProblemProperties {
    /** Optional calls-to-action to help the caller (e.g. support, upgrade,
* docs links), ordered most-specific first. Empty when none apply.
*/
    actions: (ProblemActionProperties)[];
    /** message property
*/
    message: string;
    /** Milliseconds the caller should wait before retrying.
*/
    retryAfterMs: number | null;
}
/** Raised when the caller is being throttled and should retry later.
*/
export declare class ThrottledProblem extends Runtime.RpcError implements ThrottledProblemProperties, Runtime.StructInterface {
    actions: (ProblemActionProperties)[];
    retryAfterMs: number | null;
    get __structPath(): Metadata.StructPath;
}
/** Struct metadata
*/
export declare const QuotaExceededProblemMeta: Metadata.Struct;
/** Raised when a resource quota has been exceeded.
*/
export interface QuotaExceededProblemProperties {
    /** Optional calls-to-action to help the caller (e.g. request an increase,
* upgrade, docs links), ordered most-specific first. Empty when none apply.
*/
    actions: (ProblemActionProperties)[];
    /** message property
*/
    message: string;
}
/** Raised when a resource quota has been exceeded.
*/
export declare class QuotaExceededProblem extends Runtime.RpcError implements QuotaExceededProblemProperties, Runtime.StructInterface {
    actions: (ProblemActionProperties)[];
    get __structPath(): Metadata.StructPath;
}
export declare function SpecularPackage(): Metadata.Package;
