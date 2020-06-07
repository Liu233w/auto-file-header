/* @auto-file-header
 * Copyright (c) 2020 Shumin Liu and Contributors.
 * This file is a part of Auto File Header
 * Automatically update your file headers with an extendible config file!
 * Licensed under MIT. See LICENSE file in the project root for full license information.
 */

import buildConfig, { ConfigRoot } from "./config.ts";
import { parseArgs } from "../deps.ts";
import { Engine, EngineOptions } from "./engine.ts";
import { setupLog } from "./log.config.ts";

/**
 * Auto file header. see <a href="https://github.com/liu233w/auto-file-header">project website</a>
 * for complete documents.
 *
 * @param func a function to modify config
 */
export default async function work(
  func: (config: ConfigRoot) => void,
): Promise<void> {
  console.log(`
   #                           #######                    #     #
  # #   #    # #####  ####     #       # #      ######    #     # ######   ##   #####  ###### #####
 #   #  #    #   #   #    #    #       # #      #         #     # #       #  #  #    # #      #    #
#     # #    #   #   #    #    #####   # #      #####     ####### #####  #    # #    # #####  #    #
####### #    #   #   #    #    #       # #      #         #     # #      ###### #    # #      #####
#     # #    #   #   #    #    #       # #      #         #     # #      #    # #    # #      #   #
#     #  ####    #    ####     #       # ###### ######    #     # ###### #    # #####  ###### #    #
  `);

  const args = parseArgs(Deno.args);

  await setupLog(args["verbose"]);

  const workDir = Deno.cwd();
  const config = buildConfig();

  func(config);

  const options: Partial<EngineOptions> = {};

  if (args["dry-run"] || args["d"]) {
    options.dryRun = true;
    if (args["show-file-content"]) {
      options.showFileContent = true;
    }
  }

  const engine = new Engine(workDir, config, options);

  const configValidation = engine.validateConfig();
  if (configValidation.length > 0) {
    configValidation.forEach((v) => console.error(v));
    Deno.exit(-1);
  }

  await engine.init();

  if (options.dryRun) {
    console.log("Selected files:");

    for await (const file of engine.globFiles()) {
      console.log(file);
    }
  }

  engine.work();
}
