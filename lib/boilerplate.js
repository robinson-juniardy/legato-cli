export function services(name) {
    return `
import { Postgres, SqlServer, MySQL } from "../../config/database";
import {
  PostgreeContext,
  SqlServerContext,
  TDatabaseRecordResult,
} from "../../core/legato/types/database.types";

/** 
 * file created detail
 * ${String(name).replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())} Service
 * created At : ${new Date()}
*/

export default class ${String(name).replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}Service {
  constructor(
    private postgres = Postgres,
    private mssql = SqlServer,
    private mysql = MySQL
  ) {}
  Print() {
    return "this is ${String(name).replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())} service";
  }
}

`
}

export function controller(name) {
  return `
import { Request, Response } from "express";
import { Controller, Http } from "../../core/decorators";
import AppExtensions from "../../middleware/AppExtensions";
import ${String(name).replace(/(^\w|\s\w)/g, (m) =>m.toUpperCase())}Service from "./${name}.service";

/** 
 * file created detail
 * ${String(name).replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())} Controller
 * created At : ${new Date()}
*/

@Controller({
  basepath: "/${String(name).toLowerCase()}",
})

export default class ${String(name).replace(/(^\w|\s\w)/g, (m) =>m.toUpperCase())} {
  constructor(private ${String(name).replace(/(^\w|\s\w)/g, (m) =>m.toLocaleLowerCase())}Service: ${String(name).replace(/(^\w|\s\w)/g, (m) =>m.toUpperCase())}Service = new ${String(name).replace(/(^\w|\s\w)/g, (m) =>m.toUpperCase())}Service()) {}
  @Http.Get({
    path: "/",
  })
  PrintMessage(request: Request, response: Response) {
    response.json(this.${String(name).replace(/(^\w|\s\w)/g, (m) => m.toLocaleLowerCase())}Service.Print());
  }
}
`;
}
