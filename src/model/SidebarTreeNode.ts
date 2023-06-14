import { SidebarTreeNodeDto } from './DTO/SidebarTreeNodeDto';
import { CytoscapePattern } from '../tools/adapter/CytoscapePattern';

export class SidebarTreeNode {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _classes: CytoscapePattern;
  private _children: Array<SidebarTreeNode> = new Array<SidebarTreeNode>();

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get children(): Array<SidebarTreeNode> {
    return this._children;
  }

  constructor(id: string, label: string, classes: CytoscapePattern) {
    this._id = id;
    this._name = label;
    this._classes = classes;
  }

  public addChild(child: SidebarTreeNode) {
    this._children.push(child);
  }

  public toDto(): SidebarTreeNodeDto {
    return {
      id: this.id,
      name: this.name,
      classes: this._classes,
      children: this.children.map((child) => child.toDto()),
    };
  }
}
