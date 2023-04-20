export class Adapter {
  static cytoscapeAdapter(_json: JSON): JSON {
    const domainDTO = DomainDTO(_json);
    const cytoscapeDTO = domainDTO.toCytoscapeDTO;
    return cytoscapeDTO.toJSON();
  }
}
