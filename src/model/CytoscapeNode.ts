import { CytoscapePattern } from '../tools/adapter/CytoscapePattern';
import { CytoscapeNodeDto } from './DTO/CytoscapeNodeDto';
import { CytoscapeAdapter } from '../tools/adapter/CytoscapeAdapter';
import { SidebarTreeNode } from './SidebarTreeNode';

export class CytoscapeNode {
  get classes(): CytoscapePattern {
    return this._classes;
  }

  get id(): string {
    return this._id;
  }
  get label(): string {
    return this._label;
  }

  private readonly _id: string;
  private readonly _label: string;
  private readonly _parents: Array<string>;
  private readonly _errors: Array<string>;
  private readonly _classes: CytoscapePattern;

  constructor(id: string, label: string, classes: CytoscapePattern) {
    this._id = id;
    this._label = label;
    this._classes = classes;
    this._errors = new Array<string>();
    this._parents = new Array<string>();
  }

  public addParent(parentId: string) {
    this._parents.push(parentId);
  }

  public getStrategicPattern() {
    if (this._parents.length > 0) {
      return this._parents[0];
    }
  }

  public addError(errorCode: string) {
    this._errors.push(errorCode);
  }

  public toDto(adapter: CytoscapeAdapter): CytoscapeNodeDto {
    return {
      classes: this.classes,
      data: {
        id: this._id,
        label: this._label,
        parent:
          this._parents.length > 2 ? this.adaptToEdgeDependencies(adapter) : this._parents.at(-1),
        errors: this._errors.length > 0 ? this._errors : undefined,
      },
    };
  }

  public toSidebarTreeNode(): SidebarTreeNode {
    return new SidebarTreeNode(this._id, this._label, this._classes);
  }

  private adaptToEdgeDependencies(adapter: CytoscapeAdapter): string {
    const nodeDependencies = this._parents.slice(1);
    nodeDependencies.forEach((parentId: string) => {
      adapter.addEdge(parentId, this._id);
    });
    adapter.addSharedNodes(this._id, this._label, this._classes, nodeDependencies);
    return this._parents[0];
  }
}
