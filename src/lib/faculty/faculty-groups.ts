/**
 * Grouping helpers for the public faculty listing.
 *
 * Faculty are grouped by their saved FacultyGroup order when configured.
 * Records without a linked group fall back to the legacy free-text `group`
 * value or to `Other Faculty` so they are never silently dropped.
 */

export const OTHER_FACULTY_GROUP = "Other Faculty";

export interface GroupableFaculty {
  id: number;
  sortOrder: number;
  group: string | null;
  groupId?: number | null;
}

export interface FacultyGroup<T> {
  name: string;
  members: T[];
}

export interface OrderedGroup {
  id: number;
  name: string;
  sortOrder: number;
}

/**
 * Groups faculty members by their configured group order.
 *
 * - When `orderedGroups` is provided, group headings follow `sortOrder`.
 * - Within each group members keep display order (`sortOrder`, then `id`).
 * - Unassigned members fall back to their free-text `group` or `Other Faculty`.
 * - Groups not present in `orderedGroups` are appended after configured groups.
 * - `Other Faculty` is always rendered last.
 */
export function groupFacultyByGroup<T extends GroupableFaculty>(
  members: T[],
  orderedGroups: OrderedGroup[] = [],
): FacultyGroup<T>[] {
  const buckets = new Map<string, T[]>();

  for (const member of members) {
    const key =
      (member.group?.trim() && member.group.trim()) ||
      (member as { groupRef?: { name: string } }).groupRef?.name ||
      OTHER_FACULTY_GROUP;
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.push(member);
    } else {
      buckets.set(key, [member]);
    }
  }

  // Ensure every configured group has a bucket (may be empty later but we
  // only render groups that have members; the caller can choose).
  for (const group of orderedGroups) {
    if (!buckets.has(group.name)) {
      buckets.set(group.name, []);
    }
  }

  const order = new Map(
    orderedGroups.map((group) => [group.name, group.sortOrder]),
  );

  const groups: FacultyGroup<T>[] = [...buckets.entries()]
    .filter(([, groupMembers]) => groupMembers.length > 0)
    .map(([name, groupMembers]) => ({
      name,
      members: groupMembers.sort(
        (a, b) => a.sortOrder - b.sortOrder || a.id - b.id,
      ),
    }));

  return groups.sort((a, b) => {
    if (a.name === OTHER_FACULTY_GROUP) return 1;
    if (b.name === OTHER_FACULTY_GROUP) return -1;
    const ao = order.get(a.name);
    const bo = order.get(b.name);
    if (ao !== undefined && bo !== undefined && ao !== bo) return ao - bo;
    if (ao !== undefined && bo === undefined) return -1;
    if (ao === undefined && bo !== undefined) return 1;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}

