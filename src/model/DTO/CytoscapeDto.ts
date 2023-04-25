import type { CytoscapeNode } from '../CytoscapeNode';
import type { CytoscapeEdge } from '../CytoscapeEdge';

export class CytoscapeDto {
  private elements: Array<CytoscapeNode | CytoscapeEdge>;

  constructor(elt: (CytoscapeNode | CytoscapeEdge)[]) {
    this.elements = elt;
  }

  public json(): string {
    return JSON.stringify(this.elements);
  }
}
