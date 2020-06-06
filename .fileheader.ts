import { work } from "./mod.ts";
import { within } from "./src/utils.ts";

work((cfg) => {
  cfg.include = [
    ".ts",
  ];
  cfg.includeGlob = [
    "src/*",
    "./mod.ts",
  ];

  cfg.default.format.trailingBlankLine = 1;

  within(cfg.default.variables, (it) => {
    it.author = "Shumin Liu and Contributors";
    it.projectStartYear = 2020;
    it.licenseName = "MIT";
  });
});
