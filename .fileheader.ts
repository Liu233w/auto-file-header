import { work, within, vc } from "./mod.ts";

work((cfg) => {

  cfg.versionControl = vc.git()

  cfg.include = [
    "*.ts",
  ];
  cfg.includeGlob = [
    "src/**",
    "./mod.ts",
  ];

  cfg.default.format.trailingBlankLine = 1;

  within(cfg.default.variables, (it) => {
    it.copyrightHolder = "Shumin Liu and Contributors";
    it.projectStartYear = 2020;
    it.licenseName = "MIT";
  });

  cfg.default.template = (v, f, p) =>
    `Copyright (c) ${f.years(v)} ${v.copyrightHolder}.
This file is a part of Auto File Header${
      p.endsWith(".test.ts") ? " (test file)" : ""
    }
Automatically update your file headers with an extendible config file!
Licensed under ${v.licenseName}. See LICENSE file in the project root for full license information.`;
});
