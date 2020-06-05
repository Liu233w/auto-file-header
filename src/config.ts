import Functions from "./functions.ts";
import Variables from "./variables.ts";
import { RecursivePartial } from "./utils.ts";

export interface ConfigRoot {
  default: Config;

  languages: Record<string, RecursivePartial<Config>>;

  include: string[];

  exclude: string[];

  includeGlob: string[];

  excludeGlob: string[];

  customFilter(path: string, isIncluded: boolean): boolean;
}

export interface Config {
  format: Format;

  variables: Variables;

  template(input: { variables: Variables; functions: Functions }): string;
}

export interface Format {
  commentBegin: string;

  commentEnd: string;

  commentPrefix: string;

  trailingBlankLine: number;
}

const config: ConfigRoot = {
  default: {
    format: {
      commentBegin: "/* ",
      commentEnd: " */",
      commentPrefix: " * ",
      trailingBlankLine: 0,
    },
    variables: new Variables(),
    template: ({ variables: v, functions: f }) =>
      `
Copyright (c) ${f.rangedYear(v.projectStartYear, f.year())} ${v.author}.
Licensed under the ${v.licenseName}. See LICENSE file in the project root for full license information.
`,
  },
  customFilter: (_, b) => b,
  exclude: [],
  include: [],
  excludeGlob: [],
  includeGlob: [],
  languages: {
    py: {
      format: {
        commentBegin: "##",
        commentEnd: "# ",
        commentPrefix: "# ",
      },
    },
  },
};

export default config;
