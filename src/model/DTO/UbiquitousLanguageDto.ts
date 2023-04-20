import { UbiquitousLanguageJson } from '../UbiquitousLanguageJson';
import { DomainModelDto } from './DomainModelDto';

export class UbiquitousLanguageDto {
  private readonly _type: string;
  private readonly _name: string;
  private readonly _description: string;
  private readonly _domainModels: Map<string, DomainModelDto>;
  constructor(ubiquitousLanguage: UbiquitousLanguageJson) {
    this._type = ubiquitousLanguage.type;
    this._name = ubiquitousLanguage.name;
    this._description = ubiquitousLanguage.description;
    this._domainModels = new Map<string, DomainModelDto>();
    for (const [canonicalName, domainModel] of Object.entries(ubiquitousLanguage.domainModels)) {
      this._domainModels.set(canonicalName, new DomainModelDto(domainModel));
    }
  }

  get type(): string {
    return this._type;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get domainModels(): Map<string, DomainModelDto> {
    return this._domainModels;
  }
}
