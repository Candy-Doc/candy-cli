import type { CytoscapeNodeDto } from './CytoscapeNodeDto';
import type { CytoscapeEdgeDto } from './CytoscapeEdgeDto';

export type CytoscapeElementDto = CytoscapeNodeDto | CytoscapeEdgeDto;

export class CytoscapeDto {
  private elements: Array<CytoscapeElementDto>;

  constructor(elt: CytoscapeElementDto[]) {
    this.elements = elt;
  }

  public json(): string {
    return JSON.stringify(this.elements);
  }
}
