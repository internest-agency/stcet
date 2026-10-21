import EventsManager from "@/src/components/admin/events/EventsManager";
import { isAdministrator, requireAdmin } from "@/src/lib/admin/authorization";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

export const metadata = { title: "Events | STCET Admin" };

export default async function EventsAdminPage() {
  const admin = await requireAdmin();

  const events = isDatabaseConfigured()
    ? await getPrismaClient().event.findMany({
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      })
    : [];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <section>
        <p className="text-sm font-semibold text-primary-700">Content</p>
        <h2 className="mt-1 text-2xl font-bold">Events</h2>
        <p className="mt-2 text-sm text-gray-600">
          Create and manage events. Published events appear on the public Events
          page; draft events stay hidden until an administrator publishes them.
        </p>
      </section>

      <EventsManager canPublish={isAdministrator(admin)} events={events} />
    </div>
  );
}
