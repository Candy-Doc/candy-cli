import { DependencyJson } from './DependencyJson';

export type DomainModelJson = {
  type: string;
  simpleName: string;
  description: string;
  dependencies: Array<DependencyJson>;
  warnings: Array<string>;
};
