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
  private edgeCounter = 0;
  private nodes: Array<CytoscapeNode>;
  private edges: Array<CytoscapeEdgeDto>;
  ubiquitousLanguageDto: UbiquitousLanguageDto;

  constructor(ubiquitousLanguageJson: UbiquitousLanguageJson) {
    this.ubiquitousLanguageDto = new UbiquitousLanguageDto(ubiquitousLanguageJson);
    this.nodes = new Array<CytoscapeNode>();
    this.edges = new Array<CytoscapeEdgeDto>();
  }

  public adapt() {
    return this.toCytoscapeDto().json();
  }

  private toCytoscapeDto(): CytoscapeDto {
    this.addBoundedContext();
    this.addDomainModelsElements();
    this.addDependencies();
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

  private isNodeDependency = (parentNode: CytoscapeNode, dependencyNode: CytoscapeNode): boolean =>
    dependencyNode.classes === CytoscapePattern.DOMAIN_ENTITY ||
    dependencyNode.classes === CytoscapePattern.VALUE_OBJECT ||
    parentNode.classes === CytoscapePattern.DOMAIN_ENTITY;

  private addBoundedContext() {
    const boundedContextNode: CytoscapeNode = new CytoscapeNode(
      this.ubiquitousLanguageDto.name,
      this.ubiquitousLanguageDto.name,
      PatternFormatter.toCytoscapeFormat(this.ubiquitousLanguageDto.type),
    );
    this.nodes.push(boundedContextNode);
  }

  private addDomainModelsElements() {
    this.ubiquitousLanguageDto.domainModels.forEach((domainModelDto, domainModelId) => {
      const domainModelNode: CytoscapeNode = new CytoscapeNode(
        domainModelId,
        domainModelDto.simpleName,
        PatternFormatter.toCytoscapeFormat(domainModelDto.type),
      );
      domainModelNode.addParent(this.ubiquitousLanguageDto.name);
      domainModelDto.warnings?.forEach((warning: string) => {
        domainModelNode.addWarning(warning);
      });
      this.nodes.push(domainModelNode);
    });
  }

  private addDependencies() {
    this.ubiquitousLanguageDto.domainModels.forEach((domainModelDto, domainModelId) => {
      domainModelDto.dependencies.forEach((dependencyDto) => {
        const dependencyNode: CytoscapeNode | undefined = this.getNode(dependencyDto.refersTo);
        const parentNode = this.getNode(domainModelId);
        if (dependencyNode && parentNode) {
          if (!dependencyDto.allowed) {
            parentNode.addError(NOT_ALLOWED_DEPENDENCIES);
            dependencyNode.addError(NOT_ALLOWED_DEPENDENCIES);
          }
          if (this.isNodeDependency(parentNode, dependencyNode)) {
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
    return new CytoscapeDto([...nodesDto, ...this.edges]);
  }
}
