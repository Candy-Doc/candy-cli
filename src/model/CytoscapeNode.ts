export type CytoscapeNode = {
  data: {
    id: string;
    label: string;
    parent?: string;
  };
  classes: string;
};
