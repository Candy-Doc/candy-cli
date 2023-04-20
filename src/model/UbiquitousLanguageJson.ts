import type { DomainModelJson } from './DomainModelJson';

export type UbiquitousLanguageJson = {
  type: string;
  name: string;
  description: string;
  domainModels: Map<string, DomainModelJson>;
};
