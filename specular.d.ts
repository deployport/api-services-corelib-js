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
export declare class AccessDeniedProblem extends Error implements AccessDeniedProblemProperties, Runtime.StructInterface {
    message: string;
    get __structPath(): Metadata.StructPath;
}
export declare const ForbiddenProblemMeta: Metadata.Struct;
export interface ForbiddenProblemProperties {
    message: string;
}
export declare class ForbiddenProblem extends Error implements ForbiddenProblemProperties, Runtime.StructInterface {
    message: string;
    get __structPath(): Metadata.StructPath;
}
export declare function SpecularPackage(): Metadata.Package;
