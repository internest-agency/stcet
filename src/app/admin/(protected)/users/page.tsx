import UsersManager from "@/src/components/admin/users/UsersManager";
import { requireAdministrator } from "@/src/lib/admin/authorization";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

export const metadata = { title: "Users | STCET Admin" };

const errorMessages: Record<string, string> = {
  invalid: "Please check the form fields and try again.",
  duplicate: "A user with this email address already exists.",
  missing: "The selected user could not be found.",
  self: "You cannot remove your own access or delete your own account.",
  "last-admin": "You cannot remove or delete the last active administrator.",
  "has-uploads":
    "This user cannot be deleted because they have uploaded media/files. Reassign or remove those uploads first, or deactivate the user instead.",
  save: "The user could not be saved. Please try again.",
  delete: "The user could not be deleted. Please try again.",
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdministrator();
  const [users, params] = await Promise.all([
    isDatabaseConfigured()
      ? getPrismaClient().adminUser.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { createdAt: "desc" },
        })
      : [],
    searchParams,
  ]);

  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const saved = params.saved === "1";
  const deleted = params.deleted === "1";

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold text-primary-700">Access</p>
        <h2 className="mt-1 text-2xl font-bold">User Management</h2>
        <p className="mt-2 text-sm text-gray-600">
          Only administrators can create users, alter roles, or revoke access.
        </p>
      </section>

      {saved ? (
        <p
          aria-live="polite"
          className="rounded-md border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-900"
        >
          User saved successfully.
        </p>
      ) : null}

      {deleted ? (
        <p
          aria-live="polite"
          className="rounded-md border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-900"
        >
          User deleted successfully.
        </p>
      ) : null}

      {error ? (
        <p
          aria-live="polite"
          className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          {errorMessages[error] ?? "The action could not be completed."}
        </p>
      ) : null}

      <UsersManager users={users} />
    </div>
  );
}
