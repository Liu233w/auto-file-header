/* @auto-file-header
 * Copyright (c) 2020 Shumin Liu and Contributors.
 * This file is a part of Auto File Header
 * Automatically update your file headers with an extendible config file!
 * Licensed under MIT. See LICENSE file in the project root for full license information.
 */

import Functions from "./functions.ts";
import Variables from "./variables.ts";
import { RecursivePartial } from "./utils.ts";

export interface ConfigRoot {
  /**
   * Base config set. When certain config cannot be found at `languages` property,
   * configs in here are used.
   */
  default: Config;

  /**
   * Config set for a certain language.
   *
   * Key is a file extension such as `.js`, `.cpp` or `Makefile`.
   * The dot `.` is required to represent a file extension,
   * or it will match the whole file name.
   */
  languages: Record<string, RecursivePartial<Config>>;

  /**
   * The files to add file headers.
   *
   * Each value is a file extension such as `.js`, `.cpp` or `Makefile`.
   * The dot `.` is required to represent a file extension,
   * or it will match the whole file name.
   *
   * It cannot be used with `exclude` property.
   */
  include: string[];

  /**
   * If it is not empty, file headers are added to all files except the file configured
   * in the property.
   *
   * Each value is a file extension such as `.js`, `.cpp` or `Makefile`.
   * The dot `.` is required to represent a file extension,
   * or it will match the whole file name.
   *
   * It cannot be used with `include` property.
   */
  exclude: string[];

  /**
   * Additional glob to include files.
   *
   * If it is not empty, files are filtered by the property after being filtered by
   * `include` or `exclude` to ensure that all files match one (or more) of items in
   * the `includeGlob`.
   */
  includeGlob: string[];

  /**
   * Additional glob to exclude files.
   *
   * If it is not empty, files are filtered by the property after being filtered by
   * `include` or `exclude` to ensure that none files match any items in the `excludeGlob`.
   */
  excludeGlob: string[];

  /**
   * Custom filter function to apply additional rules.
   *
   * @param path Path of the source code file
   * @param isIncluded Whether this file are selected by the original rule
   * @example
   * If we have a config like this:
   * {
   *  include: ['.txt'],
   *  customFilter: (p, i) => i && basename(p).split('_').length > 3
   *    && basename(p).split('_')[0] + basename(p).split('_')[1] > 10
   * }
   * The filtered results are shown below:
   * | path          | selected |
   * | :------------ | :------- |
   * | a.txt         | false    |
   * | 1_2_.txt      | false    |
   * | 8_8_.txt      | true     |
   * | 8_8_.foo      | false    |
   */
  customFilter(path: string, isIncluded: boolean): boolean;
}

export interface Config {
  /**
   * The header format (see the document in the code)
   */
  format: Format;

  /**
   * Variables that can be used in the template function.
   *
   * You can use pre defined variable or add as many variables you want.
   *
   * @see {@link Variables}
   */
  variables: Variables;

  /**
   * The function to generate template.
   *
   * @see {@link TemplateFunction}
   */
  template: TemplateFunction;

  // TODO: more intelligent way to find header
  /**
   * A string to indicate the position of file header.
   *
   * It is used in updating headers.
   */
  headerIndicator: string;
}

// TODO: how to add js doc to the arguments?
export type TemplateFunction = (
  variables: Variables,
  functions: Functions,
  filePath: string,
) => string;

export interface Format {
  /**
   * The beginning of a comment, such as `/*` in C like languages
   */
  commentBegin: string;

  /**
   * The ending of a comment, such as `* /` in C like languages
   */
  commentEnd: string;

  /**
   * The prefix added before each line of header.
   */
  commentPrefix: string;

  /**
   * The number of blank lines added after file header.
   */
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
