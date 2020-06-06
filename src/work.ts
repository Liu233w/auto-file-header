import buildConfig, { ConfigRoot } from "./config.ts";
import { parseArgs } from "../deps.ts";
import { Engine } from "./engine.ts";

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
  const workDir = Deno.cwd();
  const config = buildConfig();

  func(config);

  const engine = new Engine(workDir, config);

  if (args["dry-run"] || args["d"]) {
    console.log("globed files:");

    for await (const path of engine.globFiles()) {
      console.log(path);
    }
  }
}
