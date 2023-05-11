import { UbiquitousLanguageJson } from '../UbiquitousLanguageJson';
import { DomainModelDto } from './DomainModelDto';
import { UbiquitousLanguagePattern } from '../../tools/adapter/UbiquitousLanguagePattern';
import { DomainModelJson } from '../DomainModelJson';

export class UbiquitousLanguageDto {
  private readonly _type: UbiquitousLanguagePattern;
  private readonly _name: string;
  private readonly _description: string;
  // private readonly _domainModels: Map<string, DomainModelDto>;
  private readonly _domainModels: Record<string, DomainModelDto>;

  constructor(ubiquitousLanguage: UbiquitousLanguageJson) {
    this._type = ubiquitousLanguage.type;
    this._name = ubiquitousLanguage.name;
    this._description = ubiquitousLanguage.description;
    this._domainModels = Object.entries(ubiquitousLanguage.domainModels).reduce(
      (acc: Record<string, DomainModelDto>, [fullName, domainModel]) => {
        acc[fullName] = new DomainModelDto(domainModel);
        return acc;
      },
      {},
    );
  }

  get type(): UbiquitousLanguagePattern {
    return this._type;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get domainModels(): Record<string, DomainModelDto> {
    return this._domainModels;
  }
}
