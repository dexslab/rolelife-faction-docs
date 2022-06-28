

import { Faction as iFaction } from '../../core-factions/shared/interfaces';

export interface DocPage {
    data: string;
    name: string;
}

export interface DocFile {
    displayName: string;
    fileName: string;
}

export interface Faction extends iFaction {
    docPages?: Array<DocFile>;
}