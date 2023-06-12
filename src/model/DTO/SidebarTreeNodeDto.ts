export type SidebarTreeNodeDto = {
  id: string;
  name: string;
  children?: Array<SidebarTreeNodeDto>;
};
