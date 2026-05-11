import React from "react";

interface NotificationFormatterProps {
  message: string;
}

export const NotificationFormatter: React.FC<NotificationFormatterProps> = ({
  message,
}) => {
  if (!message) return null;

  // Pattern 1a: You have been assigned to evaluate [Name] for [Round].
  const assignRegex =
    /You\s+have\s+been\s+assigned\s+to\s+evaluate\s+([^]+?)\s+for\s+([^]+?)\./i;
  let match = message.match(assignRegex);
  if (match) {
    const [, candidateName, roundName] = match;
    return (
      <span>
        You have been assigned to evaluate{" "}
        <span className="font-extrabold text-brand-primary">
          {candidateName}
        </span>{" "}
        for{" "}
        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
          {roundName}
        </span>
        .
      </span>
    );
  }

  // Pattern 1a-unassigned: You have been unassigned from evaluating [Name] for [Round].
  const unassignedRegex =
    /You\s+have\s+been\s+unassigned\s+from\s+evaluating\s+([^]+?)\s+for\s+([^]+?)\./i;
  match = message.match(unassignedRegex);
  if (match) {
    const [, candidateName, roundName] = match;
    return (
      <span>
        You have been unassigned from evaluating{" "}
        <span className="font-extrabold text-brand-primary">
          {candidateName}
        </span>{" "}
        for{" "}
        <span className="font-extrabold text-red-500 dark:text-red-400">
          {roundName}
        </span>
        .
      </span>
    );
  }

  // Pattern 1b (Fallback): Candidate [Name] has been assigned to you for [Round] evaluation.
  const candidateRegex =
    /Candidate\s+([^]+?)\s+has\s+been\s+assigned\s+to\s+you\s+for\s+([^]+?)\s+evaluation\./i;
  match = message.match(candidateRegex);
  if (match) {
    const [, candidateName, roundName] = match;
    return (
      <span>
        Candidate{" "}
        <span className="font-extrabold text-brand-primary">
          {candidateName}
        </span>{" "}
        has been assigned to you for{" "}
        <span className="font-extrabold text-slate-500 dark:text-slate-400">
          {roundName}
        </span>{" "}
        evaluation.
      </span>
    );
  }

  // Pattern 2: Project Lead [Lead Name] has submitted evaluation form for [Candidate Name].
  const leadRegex =
    /Project\s+Lead\s+([^]+?)\s+has\s+submitted\s+evaluation\s+form\s+for\s+([^]+?)\./i;
  match = message.match(leadRegex);
  if (match) {
    const [, leadName, candidateName] = match;
    return (
      <span>
        Project Lead{" "}
        <span className="font-extrabold text-slate-500 dark:text-slate-400">
          {leadName}
        </span>{" "}
        has submitted evaluation form for{" "}
        <span className="font-extrabold text-emerald-500 dark:text-emerald-400">
          {candidateName}
        </span>
        .
      </span>
    );
  }

  // Pattern 3: A new registration for '[Name]' matches existing profile '[Name]' with a [Score] similarity score. Review required.
  const duplicateRegex =
    /A\s+new\s+registration\s+for\s+'([^]+?)'\s+matches\s+existing\s+profile\s+'([^]+?)'\s+with\s+a\s+([^]+?)\s+similarity\s+score\.\s+Review\s+required\./i;
  match = message.match(duplicateRegex);
  if (match) {
    const [, newUser, matchedUser, score] = match;
    return (
      <span>
        A new registration for &apos;
        <span className="font-extrabold text-amber-500 dark:text-amber-400">
          {newUser}
        </span>
        &apos; matches existing profile &apos;
        <span className="font-extrabold text-slate-500 dark:text-slate-400">
          {matchedUser}
        </span>
        &apos; with a{" "}
        <span className="font-extrabold text-red-500">{score}</span> similarity
        score. Review required.
      </span>
    );
  }

  return <span>{message}</span>;
};
