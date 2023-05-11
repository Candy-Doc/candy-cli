import { CytoscapePattern } from '../../tools/adapter/CytoscapePattern';

export type CytoscapeNodeDto = {
  data: {
    id: string;
    label: string;
    parent?: string;
    warnings?: string[];
    errors?: string[];
  };
  classes: CytoscapePattern;
};
