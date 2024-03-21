import { Runtime, Metadata } from '@deployport/specular-runtime';
export declare class SignedOperationV1 {
}
export declare class ServiceSignatureV1 {
    ServiceName: string;
}
export declare const AccessDeniedProblemMeta: Metadata.Struct;
export interface AccessDeniedProblemProperties {
    message: string;
}
export interface AccessDeniedProblem extends AccessDeniedProblemProperties, Runtime.StructInterface {
}
export declare class AccessDeniedProblem extends Error {
}
export declare const ForbiddenProblemMeta: Metadata.Struct;
export interface ForbiddenProblemProperties {
    message: string;
}
export interface ForbiddenProblem extends ForbiddenProblemProperties, Runtime.StructInterface {
}
export declare class ForbiddenProblem extends Error {
}
export declare function SpecularPackage(): Metadata.Package;
