import { log } from "../deps.ts";

export function setupLog(verbose: boolean): Promise<void> {
  return log.setup({
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
        level: verbose ? "DEBUG" : "WARNING",
        handlers: ["console"],
      },
    },
  });
}
