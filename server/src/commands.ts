import { command } from "../../../../server/decorators/commands";
import { PERMISSIONS } from "../../../../shared/flags/permissionFlags";
import * as alt from "alt-server"
import { FactionHandler } from "../../../core-factions/server/src/handler";
import { Athena } from "../../../../server/api/athena";
import { FactionPlayerFuncs } from "../../../core-factions/server/src/playerFuncs";
import { InputMenu, InputOptionType } from "../../../../shared/interfaces/inputMenus";
import { Faction } from "../../shared/interfaces";
import { DOCS_EVENT } from "../../shared/enums";

import { DocsHandler } from "./handlers";


export class DocCommands {

    static init() {

    }

    @command('fadddoc', '/fadddoc -- adds a documenataion page to faction based on name', PERMISSIONS.NONE)
    private static async handleDocAdd(player: alt.Player) {
        const faction: Faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            Athena.player.emit.message(player, `You are not in a faction.`);
            return;
        }

        const rank = FactionPlayerFuncs.getPlayerFactionRank(player);
        if (!rank) {
            Athena.player.emit.message(player, `You have no rank in the faction?`);
            return;
        }

        if (!rank.rankPermissions.addMembers) {
            Athena.player.emit.message(player, `No permission to invite members to faction.`);
            return;
        }

        let menu: InputMenu = {
            title: "Add new doc",
            options: [
                {
                    id: 'display-name',
                    desc: 'Please enter a display name, this will show up as the module name in faction docs page',
                    placeholder: 'Display name',
                    type: InputOptionType.TEXT,
                    error: 'Must specify display name.',
                },
                {
                    id: 'file-name',
                    desc: 'Please enter the file name you placed into rolelife-docs resource, this is case sensitive',
                    placeholder: 'File name',
                    type: InputOptionType.TEXT,
                    error: 'Must specify file name.',
                },
            ],
            serverEvent: DOCS_EVENT.ADD_DOC
        }

        Athena.player.emit.inputMenu(player, menu)
    }

}

alt.onClient(DOCS_EVENT.ADD_DOC, DocsHandler.handleAddDocInput);