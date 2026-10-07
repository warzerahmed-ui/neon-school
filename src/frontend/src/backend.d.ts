import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Cell {
    value: Value;
    name: string;
}
export interface Class {
    id: ClassId;
    subject: string;
    name: string;
    studentCount: bigint;
}
export type ClassId = bigint;
export interface ClassInput {
    subject: string;
    name: string;
}
export interface DashboardStats {
    totalClasses: bigint;
    averageClassSize: number;
    totalStudents: bigint;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface Student {
    id: StudentId;
    name: string;
    classId?: ClassId;
    enrollmentDate: Timestamp;
}
export type StudentId = bigint;
export interface StudentInput {
    name: string;
    classId?: ClassId;
    enrollmentDate: Timestamp;
}
export type Timestamp = bigint;
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createClass(input: ClassInput): Promise<Class>;
    createStudent(input: StudentInput): Promise<Student>;
    deleteClass(id: ClassId): Promise<boolean>;
    deleteStudent(id: StudentId): Promise<boolean>;
    execute(qJson: string): Promise<Result>;
    /**
     * / Returns the backend's public API documentation as Markdown.
     */
    getApiDoc(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardStats(): Promise<DashboardStats>;
    isCallerAdmin(): Promise<boolean>;
    listClasses(): Promise<Array<Class>>;
    listStudents(search: string | null, classFilter: ClassId | null): Promise<Array<Student>>;
    schema(): Promise<string>;
    updateClass(id: ClassId, input: ClassInput): Promise<Class | null>;
    updateStudent(id: StudentId, input: StudentInput): Promise<Student | null>;
}
