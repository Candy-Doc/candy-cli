export const NOT_ALLOWED_DEPENDENCIES_BETWEEN = (parent: string, dependency: string): string =>
  `Not allowed dependency between ${parent} and ${dependency}`;

export const NOT_ALLOWED_DEPENDENCIES_WITH = (dependency: string): string =>
  `Not allowed dependency with ${dependency}`;
