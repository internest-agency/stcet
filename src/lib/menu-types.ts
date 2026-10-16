/**
 * Shape of a public navigation item produced by `getMenuItems()`.
 *
 * This lives outside `src/lib/queries/menus.ts` because that module is marked
 * `server-only`, and the Header (a Client Component) needs the type. Keeping it
 * here lets both the server query and the client component share one contract
 * without pulling server code into the browser bundle.
 */
export interface MenuItemNode {
  id: number;
  parentId: number | null;
  title: string;
  url: string;
  type: string;
  sortOrder: number;
  isActive: boolean;
  openInNewTab: boolean;
  isPublished: boolean;
  children: MenuItemNode[];
  depth: number;
}
