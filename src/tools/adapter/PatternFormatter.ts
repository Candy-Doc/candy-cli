import { CytoscapePattern } from './CytoscapePattern';
import { UbiquitousLanguagePattern } from './UbiquitousLanguagePattern';

export class PatternFormatter {
  private static TO_CYTOSCAPE_PATTERN: Record<UbiquitousLanguagePattern, CytoscapePattern> = {
    BOUNDED_CONTEXT: CytoscapePattern.BOUNDED_CONTEXT,
    AGGREGATE: CytoscapePattern.AGGREGATE,
    DOMAIN_COMMAND: CytoscapePattern.DOMAIN_COMMAND,
    DOMAIN_ENTITY: CytoscapePattern.DOMAIN_ENTITY,
    DOMAIN_EVENT: CytoscapePattern.DOMAIN_EVENT,
    DOMAIN_SERVICE: CytoscapePattern.DOMAIN_SERVICE,
    FACTORY: CytoscapePattern.FACTORY,
    REPOSITORY: CytoscapePattern.REPOSITORY,
    VALUE_OBJECT: CytoscapePattern.VALUE_OBJECT,
  };

  public static toCytoscapeFormat(
    ubiquitousLanguagePattern: UbiquitousLanguagePattern,
  ): CytoscapePattern {
    const cytoscapePattern = this.TO_CYTOSCAPE_PATTERN[ubiquitousLanguagePattern];
    if (cytoscapePattern) {
      return cytoscapePattern;
    } else {
      throw new Error('PatternFormatter : This pattern is unknown.');
    }
  }
}
