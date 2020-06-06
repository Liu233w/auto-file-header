/* @auto-file-header
 * Copyright (c) 2020 Shumin Liu and Contributors.
 * Licensed under MIT. See LICENSE file in the project root for full license information.
 */

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

  template: TemplateFunction;

  // TODO: more intelligent way to find header
  headerIndicator: string;
}

export type TemplateFunction = (
  variables: Variables,
  functions: Functions,
  filePath: string,
) => string;

export interface Format {
  commentBegin: string;

  commentEnd: string;

  commentPrefix: string;

  trailingBlankLine: number;
}

export default function buildConfig(): ConfigRoot {
  return {
    default: {
      headerIndicator: "@auto-file-header",
      format: {
        commentBegin: "/* ",
        commentEnd: " */",
        commentPrefix: " * ",
        trailingBlankLine: 0,
      },
      variables: new Variables(),
      template: (v, f) =>
        `Copyright (c) ${f.years(v)} ${v.copyrightHolder}.
Licensed under ${v.licenseName}. See LICENSE file in the project root for full license information.`,
    },
    customFilter: (_, b) => b,
    exclude: [],
    include: [],
    excludeGlob: [],
    includeGlob: [],
    languages: {
      ".py": {
        format: {
          commentBegin: "# ",
          commentEnd: "# ",
          commentPrefix: "# ",
        },
      },
    },
  };
}
