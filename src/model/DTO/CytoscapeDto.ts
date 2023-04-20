import type { CytoscapeNode } from '../CytoscapeNode';
import {CytoscapeEdge} from "../CytoscapeEdge";

export class CytoscapeDto {
  private elements: Array<CytoscapeNode>;

  constructor(elt: (CytoscapeNode | CytoscapeEdge)[]) {
    this.elements = elt;
  }

  public json(): string {
    return JSON.stringify(this);
  }
}
