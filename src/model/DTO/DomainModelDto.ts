import { DomainModelJson } from '../DomainModelJson';
import { DependencyDto } from './DependencyDto';

export class DomainModelDto {
  private readonly _type: string;
  private readonly _simpleName: string;
  private readonly _description: string;
  private readonly _dependencies: Array<DependencyDto>;
  private readonly _warnings: Array<string>;

  constructor(domainModel: DomainModelJson) {
    this._type = domainModel.type;
    this._simpleName = domainModel.simpleName;
    this._description = domainModel.description;
    this._dependencies = new Array<DependencyDto>();
    for (const dependency of domainModel.dependencies) {
      this._dependencies.push(new DependencyDto(dependency));
    }
    this._warnings = new Array<string>();
    for (const warning of domainModel.warnings) {
      this._warnings.push(warning);
    }
  }

  get type(): string {
    return this._type;
  }

  get simpleName(): string {
    return this._simpleName;
  }

  get description(): string {
    return this._description;
  }

  get dependencies(): Array<DependencyDto> {
    return this._dependencies;
  }

  get warnings(): Array<string> {
    return this._warnings;
  }
};