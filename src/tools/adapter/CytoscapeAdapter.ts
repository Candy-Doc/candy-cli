import { UbiquitousLanguageDto } from '../../model/DTO/UbiquitousLanguageDto';
import { CytoscapeDto } from '../../model/DTO/CytoscapeDto';
import { CytoscapeEdgeDto } from '../../model/DTO/CytoscapeEdgeDto';
import { PatternFormatter } from './PatternFormatter';
import { CytoscapePattern } from './CytoscapePattern';
import { IAdapter } from './Adapter';
import { UbiquitousLanguageJson } from '../../model/UbiquitousLanguageJson';
import { NOT_ALLOWED_DEPENDENCIES } from './ErrorCodes';
import { CytoscapeNode } from '../../model/CytoscapeNode';
import { SidebarTree } from '../../model/SidebarTree';

export class CytoscapeAdapter implements IAdapter {
  private static NODE_DEPENDENCIES: [CytoscapePattern, CytoscapePattern][] = [
    [CytoscapePattern.AGGREGATE, CytoscapePattern.DOMAIN_ENTITY],
    [CytoscapePattern.AGGREGATE, CytoscapePattern.VALUE_OBJECT],
    [CytoscapePattern.DOMAIN_ENTITY, CytoscapePattern.DOMAIN_ENTITY],
    [CytoscapePattern.DOMAIN_ENTITY, CytoscapePattern.AGGREGATE],
    [CytoscapePattern.DOMAIN_ENTITY, CytoscapePattern.VALUE_OBJECT],
    [CytoscapePattern.VALUE_OBJECT, CytoscapePattern.VALUE_OBJECT],
    [CytoscapePattern.VALUE_OBJECT, CytoscapePattern.DOMAIN_ENTITY],
  ];

  private edgeCounter = 0;
  private nodes: Array<CytoscapeNode>;
  private edges: Array<CytoscapeEdgeDto>;
  private sidebarTree: SidebarTree;
  ubiquitousLanguageDtoArray: Array<UbiquitousLanguageDto>;
  private cytoscapeDto: CytoscapeDto | undefined;

  constructor(ubiquitousLanguageJsonArray: Array<UbiquitousLanguageJson>) {
    this.ubiquitousLanguageDtoArray = ubiquitousLanguageJsonArray.map(
      (ubiquitousLanguageJson: UbiquitousLanguageJson) =>
        new UbiquitousLanguageDto(ubiquitousLanguageJson),
    );
    this.nodes = new Array<CytoscapeNode>();
    this.edges = new Array<CytoscapeEdgeDto>();
    this.sidebarTree = new SidebarTree();
  }

  public adapt(): void {
    this.cytoscapeDto = this.toCytoscapeDto();
  }

  public getCytoscapeJson() {
    return this.cytoscapeDto!.json();
  }

  public getSidebarTree() {
    return this.sidebarTree.json();
  }

  public addSharedNodes(id: string, label: string, classes: CytoscapePattern, parentIds: string[]) {
    this.sidebarTree.addSharedNodes(id, label, classes, parentIds);
  }

  private toCytoscapeDto(): CytoscapeDto {
    this.ubiquitousLanguageDtoArray.forEach((ubiquitousLanguageDto: UbiquitousLanguageDto) => {
      this.addBoundedContext(ubiquitousLanguageDto);
      this.addDomainModelsElements(ubiquitousLanguageDto);
    });

    this.ubiquitousLanguageDtoArray.forEach((ubiquitousLanguageDto: UbiquitousLanguageDto) => {
      this.addDependencies(ubiquitousLanguageDto);
    });

    return this.createCytoscapeDto();
  }

  private newEdgeId(): number {
    this.edgeCounter++;
    return this.edgeCounter;
  }

  private getNode(nodeId: string): CytoscapeNode | undefined {
    const nodeIndex = this.nodes.findIndex((cytoscapeNode) => cytoscapeNode.id === nodeId);
    return this.nodes.at(nodeIndex);
  }

  public addEdge(source: string, target: string) {
    this.edges.push(<CytoscapeEdgeDto>{
      data: {
        id: this.newEdgeId(),
        source: source,
        target: target,
      },
    });
  }

  private isNodeDependency = (
    parentNodePatttern: CytoscapePattern,
    dependencyNodePatttern: CytoscapePattern,
  ): boolean =>
    CytoscapeAdapter.NODE_DEPENDENCIES.some(
      (nodeDependency) =>
        nodeDependency[0] === parentNodePatttern && nodeDependency[1] === dependencyNodePatttern,
    );

  private addBoundedContext(ubiquitousLanguageDto: UbiquitousLanguageDto) {
    const boundedContextNode: CytoscapeNode = new CytoscapeNode(
      ubiquitousLanguageDto.name,
      ubiquitousLanguageDto.name,
      PatternFormatter.toCytoscapeFormat(ubiquitousLanguageDto.type),
    );
    this.nodes.push(boundedContextNode);
    this.sidebarTree.addRoot(boundedContextNode);
  }

  private addDomainModelsElements(ubiquitousLanguageDto: UbiquitousLanguageDto) {
    ubiquitousLanguageDto.domainModels.forEach((domainModelDto, domainModelId) => {
      const domainModelNode: CytoscapeNode = new CytoscapeNode(
        domainModelId,
        domainModelDto.simpleName,
        PatternFormatter.toCytoscapeFormat(domainModelDto.type),
      );
      domainModelNode.addParent(ubiquitousLanguageDto.name);
      this.nodes.push(domainModelNode);
    });
  }

  private addDependencies(ubiquitousLanguageDto: UbiquitousLanguageDto) {
    ubiquitousLanguageDto.domainModels.forEach((domainModelDto, domainModelId) => {
      domainModelDto.dependencies.forEach((dependencyDto) => {
        const dependencyNode: CytoscapeNode | undefined = this.getNode(dependencyDto.refersTo);
        const parentNode = this.getNode(domainModelId);
        if (dependencyNode && parentNode) {
          if (!dependencyDto.allowed) {
            parentNode.addError(NOT_ALLOWED_DEPENDENCIES);
            dependencyNode.addError(NOT_ALLOWED_DEPENDENCIES);
          }
          if (this.isNodeDependency(parentNode.classes, dependencyNode.classes)) {
            dependencyNode.addParent(domainModelId);
          } else {
            const domainModelEdge: CytoscapeEdgeDto = {
              data: {
                id: this.newEdgeId(),
                source: domainModelId,
                target: dependencyDto.refersTo,
                errors: dependencyDto.allowed ? undefined : [NOT_ALLOWED_DEPENDENCIES],
              },
            };
            this.edges.push(domainModelEdge);
          }
        }
      });
    });
  }

  private createCytoscapeDto(): CytoscapeDto {
    const nodesDto = this.nodes.map((cytoscapeNode: CytoscapeNode) => cytoscapeNode.toDto(this));
    this.sidebarTree.createTree(nodesDto);
    return new CytoscapeDto([...nodesDto, ...this.edges]);
  }
}
