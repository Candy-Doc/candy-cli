import { CytoscapePattern } from './CytoscapePattern';
import { UbiquitousLanguagePattern } from './UbiquitousLanguagePattern';

export class PatternFormatter {
  private static TO_CYTOSCAPE_PATTERN = new Map<UbiquitousLanguagePattern, CytoscapePattern>([
    [UbiquitousLanguagePattern.BOUNDED_CONTEXT, CytoscapePattern.BOUNDED_CONTEXT],
    [UbiquitousLanguagePattern.AGGREGATE, CytoscapePattern.AGGREGATE],
    [UbiquitousLanguagePattern.DOMAIN_ENTITY, CytoscapePattern.DOMAIN_ENTITY],
    [UbiquitousLanguagePattern.DOMAIN_COMMAND, CytoscapePattern.DOMAIN_COMMAND],
    [UbiquitousLanguagePattern.DOMAIN_EVENT, CytoscapePattern.DOMAIN_EVENT],
    [UbiquitousLanguagePattern.VALUE_OBJECT, CytoscapePattern.VALUE_OBJECT],
    [UbiquitousLanguagePattern.FACTORY, CytoscapePattern.FACTORY],
    [UbiquitousLanguagePattern.REPOSITORY, CytoscapePattern.REPOSITORY],
    [UbiquitousLanguagePattern.DOMAIN_SERVICE, CytoscapePattern.DOMAIN_SERVICE],
  ]);

  public static toCytoscapeFormat(
    ubiquitousLanguagePattern: UbiquitousLanguagePattern,
  ): CytoscapePattern {
    const cytoscapePattern = this.TO_CYTOSCAPE_PATTERN.get(ubiquitousLanguagePattern);
    if (cytoscapePattern) {
      return cytoscapePattern;
    } else {
      throw new Error('PatternFormatter : This pattern is unknown.');
    }
  }
}
