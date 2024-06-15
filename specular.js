// JS gen package
import { Metadata, } from '@deployport/specular-runtime';
// SignedOperationV1 entity
// Marks an operation with digital signature authentication for id4ntity verification
export class SignedOperationV1 {
}
// ServiceSignatureV1 entity
export class ServiceSignatureV1 {
    ServiceName = '';
}
const _pkg = new Metadata.Package("deployport", "corelib");
export const AccessDeniedProblemMeta = new Metadata.Struct(_pkg, "AccessDeniedProblem");
new Metadata.Property(AccessDeniedProblemMeta, "message", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "string"
});
export class AccessDeniedProblem extends Error {
    message = '';
    get __structPath() {
        return AccessDeniedProblemMeta.path;
    }
}
AccessDeniedProblemMeta.problemInstantiate = (msg) => new AccessDeniedProblem(msg);
export const ForbiddenProblemMeta = new Metadata.Struct(_pkg, "ForbiddenProblem");
new Metadata.Property(ForbiddenProblemMeta, "message", {
    NonNullable: true,
    SubType: "builtin",
    Builtin: "string"
});
export class ForbiddenProblem extends Error {
    message = '';
    get __structPath() {
        return ForbiddenProblemMeta.path;
    }
}
ForbiddenProblemMeta.problemInstantiate = (msg) => new ForbiddenProblem(msg);
export function SpecularPackage() {
    return _pkg;
}
