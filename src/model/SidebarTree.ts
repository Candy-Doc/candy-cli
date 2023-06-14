import { SidebarTreeNode } from './SidebarTreeNode';
import { CytoscapeNode } from './CytoscapeNode';
import { CytoscapePattern } from '../tools/adapter/CytoscapePattern';
import { CytoscapeNodeDto } from './DTO/CytoscapeNodeDto';
import { SidebarTreeNodeDto } from './DTO/SidebarTreeNodeDto';

export class SidebarTree {
  private roots: Array<SidebarTreeNode> = new Array<SidebarTreeNode>();
  private sharedNodes: Array<CytoscapeNodeDto> = new Array<CytoscapeNodeDto>();

  private static isATacticalNode(node: CytoscapeNodeDto): boolean {
    return !(
      node.classes === CytoscapePattern.BOUNDED_CONTEXT ||
      node.classes === CytoscapePattern.ORPHAN_VOCABULARY
    );
  }

  public createTree(nodes: CytoscapeNodeDto[]) {
    const connectedNodes = [...this.roots];
    const unconnectedNodes = nodes.filter(SidebarTree.isATacticalNode);
    this.duplicateSharedNodes(unconnectedNodes);
    this.buildTreeLevelbyLevel(unconnectedNodes, connectedNodes);
  }

  public json(): string {
    return JSON.stringify(this.toDto());
  }

  public toDto(): Array<SidebarTreeNodeDto> {
    return this.roots.map((root) => root.toDto());
  }

  public addRoot(cytoscapeNode: CytoscapeNode) {
    this.roots.push(cytoscapeNode.toSidebarTreeNode());
  }

  public addSharedNodes(id: string, label: string, classes: CytoscapePattern, parentIds: string[]) {
    parentIds
      .map((parentId) => {
        const sharedNode: CytoscapeNodeDto = {
          data: {
            id: id,
            label: label,
            parent: parentId,
          },
          classes: classes,
        };
        return sharedNode;
      })
      .forEach((sharedNode) => {
        this.sharedNodes.push(sharedNode);
      });
  }

  private findAllParentNodesIfAny(
    unconnectedNode: CytoscapeNodeDto,
    connectedNodes: Array<SidebarTreeNode>,
  ): SidebarTreeNode[] {
    return connectedNodes.filter(
      (connectedNode) => unconnectedNode.data.parent === connectedNode.id,
    );
  }

  private duplicateSharedNodes(unconnectedNodes: CytoscapeNodeDto[]) {
    this.removeExistingSharedNode(unconnectedNodes);
    this.addDuplicatedNodes(unconnectedNodes);
  }

  private removeExistingSharedNode(unconnectedNodes: CytoscapeNodeDto[]) {
    this.sharedNodes.forEach((sharedNode) => {
      const sharedNodeIndex = unconnectedNodes
        .map((cytoscapeNodeDto) => cytoscapeNodeDto.data.id)
        .indexOf(sharedNode.data.id);
      if (sharedNodeIndex !== -1) unconnectedNodes.splice(sharedNodeIndex, 1);
    });
  }
  private addDuplicatedNodes(unconnectedNodes: CytoscapeNodeDto[]) {
    unconnectedNodes.push(...this.sharedNodes);
  }

  private createANewLevel(
    unconnectedNodes: CytoscapeNodeDto[],
    connectedNodes: SidebarTreeNode[],
  ): boolean {
    let aNodeHasBeenConnected = false;
    unconnectedNodes.forEach((unconnectedNode, unconnectedNodeIndex) => {
      const parentNodes = this.findAllParentNodesIfAny(unconnectedNode, connectedNodes);
      if (parentNodes.length > 0) {
        const nodeToConnect = this.convertDtoToSidebarTreeNode(unconnectedNode);
        parentNodes.forEach((parentNodes) => parentNodes.addChild(nodeToConnect));
        connectedNodes.push(nodeToConnect);
        unconnectedNodes.splice(unconnectedNodeIndex, 1);
        aNodeHasBeenConnected = true;
      }
    });
    return aNodeHasBeenConnected;
  }

  private convertDtoToSidebarTreeNode(cytoscapeNodeDto: CytoscapeNodeDto) {
    return new SidebarTreeNode(
      cytoscapeNodeDto.data.id,
      cytoscapeNodeDto.data.label,
      cytoscapeNodeDto.classes,
    );
  }

  private buildTreeLevelbyLevel(
    unconnectedNodes: CytoscapeNodeDto[],
    connectedNodes: SidebarTreeNode[],
  ) {
    let aNodeGetConnected = true;
    while (aNodeGetConnected) {
      aNodeGetConnected = this.createANewLevel(unconnectedNodes, connectedNodes);
    }
  }
}
