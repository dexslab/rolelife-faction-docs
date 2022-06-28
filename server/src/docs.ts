import * as alt from "alt-server";
import fs, { statSync, writeFileSync } from 'fs'
import path from "path";
import { Athena } from "../../../../server/api/athena";
import { FactionFuncs } from "../../../core-factions/server/src/funcs";
import { FactionHandler } from "../../../core-factions/server/src/handler";
import { DOCS_CONFIG } from "../../shared/config";
import { DOCS_EVENT } from "../../shared/enums";
import { DocPage, Faction } from "../../shared/interfaces";
import { DocCommands } from "./commands";

let pages: Array<DocPage>

export class Docs {
    static async init() {
        DocCommands.init();
    }
}