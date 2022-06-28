# RoleLife Faction Documents

This resource allows you to have custom markdown documents in a separate resource which allows you to display various documents to faction members such as SOP, Rank Structure and so forth.

All documents must be stored in the docs folder under the resource name of your choosing. Only .md files are supported at this time.

Please report any issues here on GitHub thanks.


1. To install add rolelife-faction-docs to plugins folder in `src/core/plugins`.
2. Open `src/core/plugins/core-factions/webview/Factions.vue`.
3. Add the following to components: ` Docs: defineAsyncComponent(() => import('../../rolelife-faction-docs/webview/docs.vue')),`. (If you change the name of the resource from 'rolelife-faction-docs' make sure you change it in the import.)
4. Add the following to the pages listed: `{ name: 'Docs', page: 'Docs' },`.
5. Start making Docs

To add existing documents use the `fadddocs` command in game to add them to your current faction. Make sure you have MANAGE_MEMBERS permissions.
To create or edit in game you must have the the MANAGE_MEMBERS permission. 