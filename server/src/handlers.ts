import { writeFileSync } from "fs";
import path from "path";
import { Athena } from "../../../../server/api/athena";
import { FactionFuncs } from "../../../core-factions/server/src/funcs";
import { FactionHandler } from "../../../core-factions/server/src/handler";
import { DocFile, Faction } from "../../shared/interfaces";
import * as alt from "alt-server";
import { DOCS_CONFIG } from "../../shared/config";
import { factionFuncs } from "../../../core-factions/server/src/exports";
import { DOCS_EVENT } from "../../shared/enums";

export class DocsHandler {

    static async handleAddDocInput(player: alt.Player, results: InputResult[]) {
        let faction: Faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            return;
        }
        if (!faction.docPages) {
            faction.docPages = [];
        }
        let displayName = results.find(r => r.id == 'display-name').value;
        let fileName = results.find(r => r.id == 'file-name').value;
        faction.docPages.push({ displayName: displayName, fileName: fileName })

        let success = await FactionHandler.update(faction._id, { docPages: faction.docPages });
        if (success) {
            FactionFuncs.updateMembers(faction);
            Athena.player.emit.notification(player, "Doc added successfully", "Faction Docs", "success")
        } else {
            Athena.player.emit.notification(player, "Doc failed to be added to faction", "Faction Docs", "error")
        }
    }

    static async handleEditDoc(player: alt.Player, pageDisplayName: string, data: string) {
        let faction: Faction = FactionHandler.get(player.data.faction);
        let doc = faction.docPages.find(d => d.displayName == pageDisplayName);
        DocsHandler.writeFactionDoc(player, doc.fileName, data);
        FactionFuncs.updateMembers(faction);
    }

    static async handleCreateDoc(player: alt.Player, pageDisplayName: string, fileName: string, data: string) {
        let faction: Faction = FactionHandler.get(player.data.faction);
        fileName = DocsHandler.sanitizeString(fileName);
        let doc: DocFile = { displayName: pageDisplayName, fileName: fileName }
        faction.docPages.push(doc)
        DocsHandler.writeFactionDoc(player, doc.fileName, data);
        let success = await FactionHandler.update(faction._id, { docPages: faction.docPages });
        if (success) {
            FactionFuncs.updateMembers(faction);
            Athena.player.emit.notification(player, "Doc added successfully", "Faction Docs", "success")
        } else {
            Athena.player.emit.notification(player, "Doc failed to be added to faction", "Faction Docs", "error")
        }
        FactionFuncs.updateMembers(faction);
    }

    static async writeFactionDoc(player: alt.Player, fileName: string, data: string) {
        let filePath = path.join(`./resources/${DOCS_CONFIG.DOCS_RESOURCE_NAME}`, "docs", `${fileName}.md`);
        writeFileSync(filePath, data);
        alt.restartResource(DOCS_CONFIG.DOCS_RESOURCE_NAME);
    }

    static sanitizeString(str) {
        str.replace(/[^a-z0-9A-Z.,_-]/gim, "");
        return str.trim();
    }
}

alt.onClient(DOCS_EVENT.EDIT_DOC, DocsHandler.handleEditDoc)

alt.onClient(DOCS_EVENT.CREATE_DOC, DocsHandler.handleCreateDoc)