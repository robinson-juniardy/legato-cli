#!/usr/bin/env node
import { execSync } from "child_process";
import Listr from "listr";
import { execa } from "execa";
import chalk from "chalk";
import inquirer from "inquirer";
import shell from "shelljs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";
import path from "path";
import _package from "./lib/package.json.js";
import {
  controller,
  controllerWithPath,
  services,
  servicesWithPath,
} from "./lib/boilerplate.js";

const prompt = inquirer.createPromptModule();

const argv = yargs(hideBin(process.argv)).argv;

const runCmd = (command) => {
  try {
    execSync(`${command}`, { stdio: "ignore" });
  } catch (e) {
    console.error(`failed to execute ${command}`, e);
    return false;
  }
  return true;
};

function MakeModule(name) {
  services(name);
  controller(name);
}

const tasks = new Listr(
  [
    {
      title: "clone legato app base from github",
      task: async (ctx, task) =>
        await execa("git", [
          "clone",
          "https://github.com/robinson-juniardy/legato-starter-example.git",
          ctx.appname,
        ]),
    },
    {
      title: "installing dependencies",
      task: async (ctx, task) => {
        async function Install() {
          execa("cd", [ctx.appname, "del", "package.json package-lock.json"]);
          runCmd(`cd ${ctx.appname} && rmdir /s /q .git`);
          const packages = JSON.parse(_package);
          packages["name"] = ctx.appname;
          fs.writeFileSync(
            path.join(process.cwd(), ctx.appname, "package.json"),
            JSON.stringify(packages, null, 2)
          );
          runCmd(`cd ${ctx.appname} && npm install`);
        }

        await Install();
      },
    },
  ],
  {
    concurrent: false,
  }
);

function runTasks(appname) {
  tasks.run({ appname: appname }).catch((err) => console.log(err));
}

function CreateArguments() {
  const argument = argv["_"];

  console.log(argv);

  if (argument) {
    const commander = argument[0];
    const generateType = argument[1];
    switch (commander) {
      case "new":
        if (generateType) {
          if (generateType === "app") {
            if (argument[2]) {
              runTasks(argument[2]);
            } else {
              prompt({
                type: "input",
                name: "appname",
                message: "what is your legato project name ?",
                default: "legato-app",
              }).then((answer) => {
                if (answer.appname) {
                  runTasks(answer.appname);
                }
              });
            }
          } else if (generateType === "module") {
            if (argv.path) {
              if (argument[2]) {
                const modulePath = path.join(
                  process.cwd(),
                  "src/app",
                  argv.path,
                  String(argument[2]).toLocaleLowerCase()
                );
                if (fs.existsSync(modulePath)) {
                  console.log(chalk.red("module already exist"));
                } else {
                  shell.mkdir("-p", modulePath);

                  fs.writeFileSync(
                    path.join(
                      modulePath,
                      String(`${argument[2]}.controller.ts`).toLocaleLowerCase()
                    ),
                    controllerWithPath(String(argument[2]).toLocaleLowerCase())
                  );
                  fs.writeFileSync(
                    path.join(
                      modulePath,
                      String(`${argument[2]}.service.ts`).toLocaleLowerCase()
                    ),
                    servicesWithPath(String(argument[2]).toLocaleLowerCase())
                  );
                  console.log(
                    chalk.green("module has been created successfully")
                  );
                }
              } else {
                prompt({
                  type: "input",
                  name: "module_name",
                  message: "what is your module name ?",
                }).then((answer) => {
                  if (answer.module_name) {
                    const modulePath = path.join(
                      process.cwd(),
                      "src/app",
                      String(answer.module_name).toLocaleLowerCase()
                    );

                    if (fs.existsSync(modulePath)) {
                      console.log(chalk.red("module already exist"));
                    } else {
                      shell.mkdir("-p", modulePath);

                      fs.writeFileSync(
                        path.join(
                          modulePath,
                          String(
                            `${answer.module_name}.controller.ts`
                          ).toLocaleLowerCase()
                        ),
                        controller(
                          String(answer.module_name).toLocaleLowerCase()
                        )
                      );

                      fs.writeFileSync(
                        path.join(
                          modulePath,
                          String(
                            `${answer.module_name}.service.ts`
                          ).toLocaleLowerCase()
                        ),
                        services(String(answer.module_name).toLocaleLowerCase())
                      );
                      console.log(
                        chalk.green("module has been created successfully")
                      );
                    }
                  }
                });
              }
            } else {
              if (argument[2]) {
                const modulePath = path.join(
                  process.cwd(),
                  "src/app",
                  String(argument[2]).toLocaleLowerCase()
                );

                if (fs.existsSync(modulePath)) {
                  console.log(chalk.red("module already exist"));
                } else {
                  shell.mkdir("-p", modulePath);

                  fs.writeFileSync(
                    path.join(
                      modulePath,
                      String(`${argument[2]}.controller.ts`).toLocaleLowerCase()
                    ),
                    controllerWithPath(String(argument[2]).toLocaleLowerCase())
                  );

                  fs.writeFileSync(
                    path.join(
                      modulePath,
                      String(`${argument[2]}.service.ts`).toLocaleLowerCase()
                    ),
                    services(String(argument[2]).toLocaleLowerCase())
                  );

                  console.log(
                    chalk.green("module has been created successfully")
                  );
                }
              } else {
                prompt({
                  type: "input",
                  name: "module_name",
                  message: "what is your module name ?",
                }).then((answer) => {
                  if (answer.module_name) {
                    const modulePath = path.join(
                      process.cwd(),
                      "src/app",
                      String(answer.module_name).toLocaleLowerCase()
                    );

                    if (fs.existsSync(modulePath)) {
                      console.log(chalk.red("module already exist"));
                    } else {
                      shell.mkdir("-p", modulePath);

                      fs.writeFileSync(
                        path.join(
                          modulePath,
                          String(
                            `${answer.module_name}.controller.ts`
                          ).toLocaleLowerCase()
                        ),
                        controller(
                          String(answer.module_name).toLocaleLowerCase()
                        )
                      );

                      fs.writeFileSync(
                        path.join(
                          modulePath,
                          String(
                            `${answer.module_name}.service.ts`
                          ).toLocaleLowerCase()
                        ),
                        services(String(answer.module_name).toLocaleLowerCase())
                      );
                      console.log(
                        chalk.green("module has been created successfully")
                      );
                    }
                  }
                });
              }
            }
          } else {
            console.log(
              chalk.red("wrong arguments !!!, please choose app or module")
            );
          }
        } else {
          prompt({
            type: "list",
            name: "module_type",
            message: "what type do you want to create ?",
            choices: ["app", "module"],
            default: null,
          }).then((answer) => {
            if (answer.module_type === "app") {
              if (argument[2]) {
                runTasks(argument[2]);
              } else {
                prompt({
                  type: "input",
                  name: "appname",
                  message: "what is your legato project name ?",
                  default: "legato-app",
                }).then((answer) => {
                  if (answer.appname) {
                    runTasks(answer.appname);
                  }
                });
              }
            }
          });
        }
    }
  }
}

CreateArguments();
