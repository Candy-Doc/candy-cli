import type { DomainModelJson } from './DomainModelJson';
import { UbiquitousLanguagePattern } from '../tools/adapter/UbiquitousLanguagePattern';

export type UbiquitousLanguageJson = {
  type: UbiquitousLanguagePattern;
  name: string;
  description: string;
  domainModels: Record<string, DomainModelJson>;
};
