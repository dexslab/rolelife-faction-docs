import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { Docs } from './src/docs';

const PLUGIN_NAME = 'Faction Docs'

PluginSystem.registerPlugin(PLUGIN_NAME, async () => {
    Docs.init();
    alt.log(`~lb~[RoleLife] ==> ${PLUGIN_NAME} was Loaded`);
});
