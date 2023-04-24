import { DependencyJson } from './DependencyJson';
import { UbiquitousLanguagePattern } from '../tools/adapter/UbiquitousLanguagePattern';

export type DomainModelJson = {
  type: UbiquitousLanguagePattern;
  simpleName: string;
  description: string;
  dependencies: Array<DependencyJson>;
  warnings: Array<string>;
};
