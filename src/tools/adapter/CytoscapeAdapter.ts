import {UbiquitousLanguageDto} from '../../model/DTO/UbiquitousLanguageDto';
import {CytoscapeDto} from '../../model/DTO/CytoscapeDto';
import {CytoscapeEdge} from '../../model/CytoscapeEdge';
import {CytoscapeNode} from '../../model/CytoscapeNode';
import {PatternFormatter} from './PatternFormatter';
import {CytoscapePattern} from './CytoscapePattern';
import {IAdapter} from './Adapter';
import {UbiquitousLanguageJson} from '../../model/UbiquitousLanguageJson';
import {NOT_ALLOWED_DEPENDENCIES} from "./ErrorCodes";

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

  private cleanEmptyErrors(elements: Array<CytoscapeNode | CytoscapeEdge>) {
    elements.forEach((cytoscapeElement: CytoscapeNode | CytoscapeEdge) => {
      if (cytoscapeElement.data.errors?.length === 0) cytoscapeElement.data.errors = undefined;
    });
  }
  private getNodeIndex(nodes: Array<CytoscapeNode>, nodeId: string): number {
    return nodes.findIndex((cytoscapeNode) => cytoscapeNode.data.id === nodeId);
  }

  private isNodeDependency = (parentNode: CytoscapeNode, dependencyNode: CytoscapeNode): boolean =>
    dependencyNode.classes === CytoscapePattern.DOMAIN_ENTITY ||
    dependencyNode.classes === CytoscapePattern.VALUE_OBJECT ||
    parentNode.classes === CytoscapePattern.DOMAIN_ENTITY;

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
          warnings: domainModelDto.warnings ? domainModelDto.warnings : undefined,
          errors: [],
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
        const dependencyNodeIndex = this.getNodeIndex(nodes, dependencyDto.refersTo);
        const parentNodeIndex = this.getNodeIndex(nodes, domainModelId);
        if (dependencyNodeIndex !== -1) {
          if (!dependencyDto.allowed) {
            nodes[parentNodeIndex].data.errors.push(NOT_ALLOWED_DEPENDENCIES);
            nodes[dependencyNodeIndex].data.errors.push(NOT_ALLOWED_DEPENDENCIES);
          }
          if (this.isNodeDependency(nodes[parentNodeIndex], nodes[dependencyNodeIndex])) {
            nodes[dependencyNodeIndex].data.parent = domainModelId;
          } else {
            const domainModelEdge: CytoscapeEdge = {
              data: {
                id: this.newEdgeId(),
                source: domainModelId,
                target: dependencyDto.refersTo,
                errors: dependencyDto.allowed ? undefined : [NOT_ALLOWED_DEPENDENCIES],
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
    this.cleanEmptyErrors(elements);
    return new CytoscapeDto(elements);
  }
}
