export type SubmissionStatus =
  | "New"
  | "In Progress"
  | "Contacted"
  | "Resolved"
  | "Spam";

export const SUBMISSION_STATUSES: SubmissionStatus[] = [
  "New",
  "In Progress",
  "Contacted",
  "Resolved",
  "Spam",
];
