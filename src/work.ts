/* @auto-file-header
 * Copyright (c) 2020 Shumin Liu and Contributors.
 * This file is a part of Auto File Header
 * Automatically update your file headers with an extendible config file!
 * Licensed under MIT. See LICENSE file in the project root for full license information.
 */

import buildConfig, { ConfigRoot } from "./config.ts";
import { parseArgs, log } from "../deps.ts";
import { Engine, EngineOptions } from "./engine.ts";

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

  await log.setup({
    handlers: {
      console: new log.handlers.ConsoleHandler("DEBUG", {
        formatter: (logRecord) => {
          let msg = `${logRecord.levelName} ${logRecord.msg}`;

          logRecord.args.forEach((arg, index) => {
            // TODO: handle functions
            msg += ` ${JSON.stringify(arg)}`;
          });

          return msg;
        },
      }),
    },
    loggers: {
      default: {
        level: args["verbose"] ? "DEBUG" : "WARNING",
        handlers: ["console"],
      },
    },
  });

  const workDir = Deno.cwd();
  const config = buildConfig();

  func(config);

  const options: Partial<EngineOptions> = {};

  if (args["dry-run"] || args["d"]) {
    options.dryRun = true;
  }

  const engine = new Engine(workDir, config, options);

  if (options.dryRun) {
    engine.globFiles();
  }

  engine.work();
}
