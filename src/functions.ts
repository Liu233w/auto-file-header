/* @auto-file-header
 * Copyright (c) 2020 Shumin Liu and Contributors.
 * This file is a part of Auto File Header
 * Automatically update your file headers with an extendible config file!
 * Licensed under MIT. See LICENSE file in the project root for full license information.
 */

import Variables from "./variables.ts";

export default class Functions {
  /**
   * Get current year
   */
  year(): number {
    return new Date().getFullYear();
  }

  /**
   * Get the range from {@link Variables.projectStartYear} to current year.
   * It returns string in the format like `2010 - 2020`
   *
   * @param v The Variables instance
   */
  years(v: Variables): string {
    const begin = v.projectStartYear;
    const end = this.year();

    if (begin === end) {
      return String(begin);
    } else {
      return `${begin} - ${end}`;
    }
  }
}
