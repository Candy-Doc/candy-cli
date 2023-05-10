import { UbiquitousLanguageJson } from '../../model/UbiquitousLanguageJson';
import { UbiquitousLanguageDto } from '../../model/DTO/UbiquitousLanguageDto';

export interface IAdapter {
  ubiquitousLanguageDtoArray: Array<UbiquitousLanguageDto>;

  adapt(): string;
}
