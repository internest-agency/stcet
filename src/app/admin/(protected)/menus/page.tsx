import MenusManager from "@/src/components/admin/menus/MenusManager";
import { isAdministrator, requireAdmin } from "@/src/lib/admin/authorization";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

export const metadata = { title: "Menus | STCET Admin" };

export default async function MenusPage() {
  const [admin, items] = await Promise.all([
    requireAdmin(),
    isDatabaseConfigured()
      ? getPrismaClient().menuItem.findMany({
          include: { _count: { select: { children: true } } },
          orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }, { id: "asc" }],
        })
      : [],
  ]);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <MenusManager canPublish={isAdministrator(admin)} items={items} />
    </div>
  );
}
