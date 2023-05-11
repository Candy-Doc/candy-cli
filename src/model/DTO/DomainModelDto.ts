import { DomainModelJson } from '../DomainModelJson';
import { DependencyDto } from './DependencyDto';
import { UbiquitousLanguagePattern } from '../../tools/adapter/UbiquitousLanguagePattern';

export class DomainModelDto {
  private readonly _type: UbiquitousLanguagePattern;
  private readonly _simpleName: string;
  private readonly _description: string;
  private readonly _dependencies: Array<DependencyDto>;
  private readonly _errors?: string[];

  constructor(domainModel: DomainModelJson) {
    this._type = domainModel.type;
    this._simpleName = domainModel.simpleName;
    this._description = domainModel.description;
    this._dependencies = domainModel.dependencies.map(
      (dependency) => new DependencyDto(dependency),
    );
  }

  get type(): UbiquitousLanguagePattern {
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
}
