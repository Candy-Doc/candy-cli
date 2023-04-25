import type { CytoscapeNodeDto } from './CytoscapeNodeDto';
import type { CytoscapeEdgeDto } from './CytoscapeEdgeDto';

export class CytoscapeDto {
  private elements: Array<CytoscapeNodeDto | CytoscapeEdgeDto>;

  constructor(elt: (CytoscapeNodeDto | CytoscapeEdgeDto)[]) {
    this.elements = elt;
  }

  public json(): string {
    return JSON.stringify(this.elements);
  }
}
