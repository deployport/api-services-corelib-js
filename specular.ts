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
    public ServiceName: string;
}

const _pkg = new Metadata.Package(
    'Deployport/CoreLib',
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
export interface AccessDeniedProblemProperties
 {
    // /**
    // * Returns "Deployport/CoreLib:AccessDeniedProblem"
    // */
    // fqtn: "Deployport/CoreLib:AccessDeniedProblem";
    message : string;
};
export interface AccessDeniedProblem extends AccessDeniedProblemProperties, Runtime.StructInterface{};
export class AccessDeniedProblem 
    extends Error
{}
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
export interface ForbiddenProblemProperties
 {
    // /**
    // * Returns "Deployport/CoreLib:ForbiddenProblem"
    // */
    // fqtn: "Deployport/CoreLib:ForbiddenProblem";
    message : string;
};
export interface ForbiddenProblem extends ForbiddenProblemProperties, Runtime.StructInterface{};
export class ForbiddenProblem 
    extends Error
{}
ForbiddenProblemMeta.problemInstantiate = (msg: string) => new ForbiddenProblem(msg);

export function SpecularPackage() {
    return _pkg;
}
