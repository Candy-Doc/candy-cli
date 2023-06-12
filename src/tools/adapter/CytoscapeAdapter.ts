import { UbiquitousLanguageDto } from '../../model/DTO/UbiquitousLanguageDto';
import { CytoscapeDto } from '../../model/DTO/CytoscapeDto';
import { CytoscapeEdgeDto } from '../../model/DTO/CytoscapeEdgeDto';
import { PatternFormatter } from './PatternFormatter';
import { CytoscapePattern } from './CytoscapePattern';
import { IAdapter } from './Adapter';
import { UbiquitousLanguageJson } from '../../model/UbiquitousLanguageJson';
import { NOT_ALLOWED_DEPENDENCIES } from './ErrorCodes';
import { CytoscapeNode } from '../../model/CytoscapeNode';

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
  private readonly nodes: Array<CytoscapeNode>;
  private readonly edges: Array<CytoscapeEdgeDto>;

  constructor() {
    this.nodes = new Array<CytoscapeNode>();
    this.edges = new Array<CytoscapeEdgeDto>();
  }

  public adapt(ubiquitousLanguageJson: UbiquitousLanguageJson) {
    const ubiquitousLanguageDto = new UbiquitousLanguageDto(ubiquitousLanguageJson);
    return this.toCytoscapeDto(ubiquitousLanguageDto).json();
  }

  private toCytoscapeDto(ubiquitousLanguageDto: UbiquitousLanguageDto): CytoscapeDto {
    this.addBoundedContext(ubiquitousLanguageDto);
    this.addDomainModelsElements(ubiquitousLanguageDto);
    this.addDependencies(ubiquitousLanguageDto);
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
  }

  private addDomainModelsElements(ubiquitousLanguageDto: UbiquitousLanguageDto) {
    Object.entries(ubiquitousLanguageDto.domainModels).forEach(
      ([domainModelId, domainModelDto]) => {
        const domainModelNode: CytoscapeNode = new CytoscapeNode(
          domainModelId,
          domainModelDto.simpleName,
          PatternFormatter.toCytoscapeFormat(domainModelDto.type),
        );
        domainModelNode.addParent(ubiquitousLanguageDto.name);
        this.nodes.push(domainModelNode);
      },
    );
  }

  private addDependencies(ubiquitousLanguageDto: UbiquitousLanguageDto) {
    Object.entries(ubiquitousLanguageDto.domainModels).forEach(
      ([domainModelId, domainModelDto]) => {
        domainModelDto.dependencies.forEach((dependencyDto) => {
          const dependencyNode: CytoscapeNode | undefined = this.getNode(dependencyDto.refersTo);
          const parentNode = this.getNode(domainModelId);
          if (dependencyNode && parentNode) {
            if (!dependencyDto.allowed) {
              parentNode.addError(NOT_ALLOWED_DEPENDENCIES);
              dependencyNode.addError(NOT_ALLOWED_DEPENDENCIES);
            }
            if (this.isNodeDependency(parentNode.classes, dependencyNode.classes)) {
              dependencyNode.addParent(parentNode.id);
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
      },
    );
  }

  private createCytoscapeDto(): CytoscapeDto {
    const nodesDto = this.nodes.map((cytoscapeNode: CytoscapeNode) => cytoscapeNode.toDto(this));
    return new CytoscapeDto([...nodesDto, ...this.edges]);
  }
}
