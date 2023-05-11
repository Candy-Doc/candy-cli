import { UbiquitousLanguageJson } from '../../model/UbiquitousLanguageJson';

export interface IAdapter {
  adapt(json: UbiquitousLanguageJson): string;
}
