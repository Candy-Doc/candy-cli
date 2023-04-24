import { UbiquitousLanguageJson } from '../../model/UbiquitousLanguageJson';
import { UbiquitousLanguageDto } from '../../model/DTO/UbiquitousLanguageDto';

export interface IAdapter {
  ubiquitousLanguageDto: UbiquitousLanguageDto;

  adapt(json: UbiquitousLanguageJson): string;
}
