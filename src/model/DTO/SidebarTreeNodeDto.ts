import { CytoscapePattern } from '../../tools/adapter/CytoscapePattern';

export type SidebarTreeNodeDto = {
  id: string;
  name: string;
  classes: CytoscapePattern;
  children?: Array<SidebarTreeNodeDto>;
};
