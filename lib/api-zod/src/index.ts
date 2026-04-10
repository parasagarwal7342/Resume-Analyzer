import * as Api from "./generated/api";
import type * as Types from "./generated/types";

// 1. Export everything from generated API (Values: Zod schemas, constants)
export * from "./generated/api";

// 2. Export everything from generated types (Types: Interfaces)
export type * from "./generated/types";

// 3. Explicitly Re-export Clashing Pairs to ensure Value + Type merging
// This fixes errors where types were shadowing values in consuming packages

// GenerateResumeBody
export const GenerateResumeBody = Api.GenerateResumeBody;
export type GenerateResumeBody = Types.GenerateResumeBody;

// AtsScoreBody (and its alias)
export const AtsScoreBody = Api.GetAtsScoreBody;
export type AtsScoreBody = Types.AtsScoreBody;

// ParseResumeBody
export const ParseResumeBody = Api.ParseResumeBody;
export type ParseResumeBody = Types.ParseResumeBody;

// ListResumesQueryParams
export const ListResumesQueryParams = Api.ListResumesQueryParams;
export type ListResumesQueryParams = Types.ListResumesParams;

// MatchResumeToJobBody
export const MatchResumeToJobBody = Api.MatchResumeToJobBody;
export type MatchResumeToJobBody = Types.JobMatchBody;
