import { CytoscapePattern } from '../tools/adapter/CytoscapePattern';

export type CytoscapeNode = {
  data: {
    id: string;
    label: string;
    parent?: string;
    warnings?: Array<string>;
    errors?: Array<string>;
  };
  classes: CytoscapePattern;
};
