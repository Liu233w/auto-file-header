/* @auto-file-header
 * Copyright (c) 2020 Shumin Liu and Contributors.
 * This file is a part of Auto File Header
 * Automatically update your file headers with an extendible config file!
 * Licensed under MIT. See LICENSE file in the project root for full license information.
 */

import { Git } from "./git.ts";

export const vc = {
  git(): Git {
    return new Git();
  },
};

export { VersionControl } from "./version-control.ts";
