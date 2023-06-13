import { SidebarTreeNode } from './SidebarTreeNode';
import { CytoscapeNode } from './CytoscapeNode';
import { CytoscapePattern } from '../tools/adapter/CytoscapePattern';
import { CytoscapeNodeDto } from './DTO/CytoscapeNodeDto';
import { SidebarTreeNodeDto } from './DTO/SidebarTreeNodeDto';
import { CytoscapeEdgeDto } from './DTO/CytoscapeEdgeDto';

export class SidebarTree {
  private roots: Array<SidebarTreeNode> = new Array<SidebarTreeNode>();
  private sharedNodes: Array<CytoscapeNodeDto> = new Array<CytoscapeNodeDto>();

  private convertToSidebarTreeNode(cytoscapeNode: CytoscapeNode) {
    return new SidebarTreeNode(cytoscapeNode.id, cytoscapeNode.label);
  }

  private convertDtoToSidebarTreeNode(cytoscapeNodeDto: CytoscapeNodeDto) {
    return new SidebarTreeNode(cytoscapeNodeDto.data.id, cytoscapeNodeDto.data.label);
  }

  public addRoot(cytoscapeNode: CytoscapeNode) {
    this.roots.push(this.convertToSidebarTreeNode(cytoscapeNode));
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

  public findNode(nodeId: string): SidebarTreeNode | undefined {
    let foundNode;
    for (const root of this.roots) {
      if (!foundNode) foundNode = root.findNode(nodeId);
    }
    return foundNode;
  }

  public addChild(parentNodeId: string, childNode: CytoscapeNode) {
    const parentNode = this.findNode(parentNodeId);
    if (parentNode) parentNode.addChild(this.convertToSidebarTreeNode(childNode));
  }

  private getParentNodesIfAny(
    unconnectedNode: CytoscapeNodeDto,
    connectedNodes: Array<SidebarTreeNode>,
  ) {
    return connectedNodes.filter(
      (connectedNode) => unconnectedNode.data.parent === connectedNode.id,
    );
  }

  private moveNodeToConnectedNodes(
    nodeToPlace: SidebarTreeNode,
    connectedNodes: Array<SidebarTreeNode>,
    unconnectedNodeIndex: number,
    unconnectedNodes: Array<CytoscapeNodeDto>,
  ) {
    connectedNodes.push(nodeToPlace);
    unconnectedNodes.splice(unconnectedNodeIndex, 1);
  }

  public createTree(nodes: CytoscapeNodeDto[]) {
    const connectedNodes = [...this.roots];
    const unconnectedNodes = nodes.filter(
      (node) => node.classes != CytoscapePattern.BOUNDED_CONTEXT,
    );
    this.sharedNodes.forEach((sharedNode) => {
      const sharedNodeIndex = unconnectedNodes
        .map((cytoscapeNodeDto) => cytoscapeNodeDto.data.id)
        .indexOf(sharedNode.data.id);
      if (sharedNodeIndex !== -1) unconnectedNodes.splice(sharedNodeIndex, 1);
    });
    unconnectedNodes.push(...this.sharedNodes);

    let aNodeGetConnected = true;
    while (aNodeGetConnected) {
      aNodeGetConnected = false;
      unconnectedNodes.forEach((unconnectedNode, unconnectedNodeIndex) => {
        const parentNodes = this.getParentNodesIfAny(unconnectedNode, connectedNodes);
        if (parentNodes.length > 0) {
          const nodeToConnect = this.convertDtoToSidebarTreeNode(unconnectedNode);
          parentNodes.forEach((parentNodes) => parentNodes.addChild(nodeToConnect));
          this.moveNodeToConnectedNodes(
            nodeToConnect,
            connectedNodes,
            unconnectedNodeIndex,
            unconnectedNodes,
          );
          aNodeGetConnected = true;
        }
      });
    }
  }

  public json(): string {
    return JSON.stringify(this.toDto());
  }

  public toDto(): Array<SidebarTreeNodeDto> {
    return this.roots.map((root) => root.toDto());
  }
}
