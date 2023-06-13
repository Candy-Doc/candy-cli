import { SidebarTreeNodeDto } from './DTO/SidebarTreeNodeDto';

export class SidebarTreeNode {
  private readonly _id: string;
  private readonly _name: string;
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

  constructor(id: string, label: string) {
    this._id = id;
    this._name = label;
  }

  public addChild(child: SidebarTreeNode) {
    this._children.push(child);
  }

  public toDto(): SidebarTreeNodeDto {
    return {
      id: this.id,
      name: this.name,
      children: this.children.map((child) => child.toDto()),
    };
  }
}
