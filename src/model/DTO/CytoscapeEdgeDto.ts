export type CytoscapeEdgeDto = {
  data: {
    id: number;
    source: string;
    target: string;
    errors?: string[];
  };
};