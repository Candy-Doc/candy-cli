import { UbiquitousLanguageDto } from '../../model/DTO/UbiquitousLanguageDto';
import { CytoscapeDto } from '../../model/DTO/CytoscapeDto';
import { CytoscapeEdge } from '../../model/CytoscapeEdge';
import { CytoscapeNode } from '../../model/CytoscapeNode';
import { PatternFormatter } from './PatternFormatter';
import { CytoscapePattern } from './CytoscapePattern';
import { IAdapter } from './Adapter';
import { UbiquitousLanguageJson } from '../../model/UbiquitousLanguageJson';

export class CytoscapeAdapter implements IAdapter {
  private edgeCounter = 0;
  ubiquitousLanguageDto: UbiquitousLanguageDto;

  constructor(ubiquitousLanguageJson: UbiquitousLanguageJson) {
    this.ubiquitousLanguageDto = new UbiquitousLanguageDto(ubiquitousLanguageJson);
  }

  public adapt() {
    return this.toCytoscapeDto().json();
  }

  private newEdgeId(): number {
    this.edgeCounter++;
    return this.edgeCounter;
  }

  private isNodeDependency = (dependencyNode: CytoscapeNode): boolean =>
    dependencyNode.classes === CytoscapePattern.DOMAIN_ENTITY ||
    dependencyNode.classes === CytoscapePattern.VALUE_OBJECT;

  private addBoundedContext(nodes: CytoscapeNode[]) {
    const boundedContextNode: CytoscapeNode = {
      data: {
        id: this.ubiquitousLanguageDto.name,
        label: this.ubiquitousLanguageDto.name,
      },
      classes: PatternFormatter.toCytoscapeFormat(this.ubiquitousLanguageDto.type),
    };
    nodes.push(boundedContextNode);
  }

  private addDomainModelsElements(nodes: CytoscapeNode[]) {
    this.ubiquitousLanguageDto.domainModels.forEach((domainModelDto, domainModelId) => {
      const domainModelNode: CytoscapeNode = {
        data: {
          id: domainModelId,
          label: domainModelDto.simpleName,
          parent: this.ubiquitousLanguageDto.name,
        },
        classes: PatternFormatter.toCytoscapeFormat(domainModelDto.type),
      };
      nodes.push(domainModelNode);
    });
  }

  private addDependencies(nodes: Array<CytoscapeNode>): Array<CytoscapeNode | CytoscapeEdge> {
    const edges = new Array<CytoscapeEdge>();
    this.ubiquitousLanguageDto.domainModels.forEach((domainModelDto, domainModelId) => {
      domainModelDto.dependencies.forEach((dependencyDto) => {
        const dependencyNodeIndex = nodes.findIndex(
          (cytoscapeNode) => cytoscapeNode.data.id === dependencyDto.refersTo,
        );
        if (dependencyNodeIndex !== -1) {
          if (this.isNodeDependency(nodes[dependencyNodeIndex])) {
            nodes[dependencyNodeIndex].data.parent = domainModelId;
          } else {
            const domainModelEdge: CytoscapeEdge = {
              data: {
                id: this.newEdgeId(),
                source: domainModelId,
                target: dependencyDto.refersTo,
              },
            };
            edges.push(domainModelEdge);
          }
        }
      });
    });
    return [...nodes, ...edges];
  }

  public toCytoscapeDto(): CytoscapeDto {
    const nodes = new Array<CytoscapeNode>();
    this.addBoundedContext(nodes);
    this.addDomainModelsElements(nodes);
    const elements = this.addDependencies(nodes);
    return new CytoscapeDto(elements);
  }
}
