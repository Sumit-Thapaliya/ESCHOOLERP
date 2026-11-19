/**
 * Initials for an avatar, e.g. "Ram Yadav" -> "RY".
 *
 * Rule: first letter of the first word + first letter of the last word.
 * That is why "Ram Yadav" gives RY and not RA (the first two letters of
 * "Ram"). Middle names are skipped, so "Ram Kumar Yadav" also gives RY.
 * A one-word name repeats its own letter, so "Sita" gives SS.
 */
export function initialsOfName(name: string | null | undefined) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : first;
  return (first + last).toUpperCase();
}
