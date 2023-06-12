import { SidebarTreeNode } from './SidebarTreeNode';
import { CytoscapeNode } from './CytoscapeNode';
import { CytoscapePattern } from '../tools/adapter/CytoscapePattern';
import { CytoscapeNodeDto } from './DTO/CytoscapeNodeDto';
import { SidebarTreeNodeDto } from './DTO/SidebarTreeNodeDto';

export class SidebarTree {
  private roots: Array<SidebarTreeNode> = new Array<SidebarTreeNode>();

  private convertToSidebarTreeNode(cytoscapeNode: CytoscapeNode) {
    return new SidebarTreeNode(cytoscapeNode.id, cytoscapeNode.label);
  }
  private convertDtoToSidebarTreeNode(cytoscapeNodeDto: CytoscapeNodeDto) {
    return new SidebarTreeNode(cytoscapeNodeDto.data.id, cytoscapeNodeDto.data.label);
  }

  public addRoot(cytoscapeNode: CytoscapeNode) {
    this.roots.push(this.convertToSidebarTreeNode(cytoscapeNode));
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

  private getParentNodeIfAny(
    unconnectedNode: CytoscapeNodeDto,
    connectedNodes: Array<SidebarTreeNode>,
  ) {
    return connectedNodes.find((connectedNode) => unconnectedNode.data.parent === connectedNode.id);
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

  createTree(nodes: CytoscapeNodeDto[]) {
    const connectedNodes = [...this.roots];
    const unconnectedNodes = nodes.filter(
      (node) => node.classes != CytoscapePattern.BOUNDED_CONTEXT,
    );

    let aNodeGetConnected = true;
    while (aNodeGetConnected) {
      aNodeGetConnected = false;
      unconnectedNodes.forEach((unconnectedNode, unconnectedNodeIndex) => {
        const parentNode = this.getParentNodeIfAny(unconnectedNode, connectedNodes);
        if (parentNode) {
          const nodeToConnect = this.convertDtoToSidebarTreeNode(unconnectedNode);
          parentNode.addChild(nodeToConnect);
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
