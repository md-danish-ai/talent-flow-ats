// Re-export the api helper and ApiError for backwards compatibility
export { api, ApiError } from "./base";
export type { ApiRequestOptions } from "./base";

// Service-specific APIs
export * from "./questions";
export * from "./classifications";
export * from "./interview-attempts";
export * from "./paper-assignments";
export * from "./results";
export * from "./notifications";
export * from "./auth";
export * from "./user-details";
export * from "./departments";
export * from "./papers";
export * from "./evaluations";
export * from "./management";
