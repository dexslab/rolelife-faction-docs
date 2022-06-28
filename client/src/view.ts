import * as alt from 'alt-client';
import { Athena } from '../../../../server/api/athena';
import { FactionView } from '../../../core-factions/client/views/factionView';
import { DocFile, Faction } from '../../shared/interfaces';
import { DOCS_EVENT, DOCS_STATE } from '../../shared/enums';
import { DocPage } from '../../shared/interfaces';
import { DOCS_CONFIG } from '../../shared/config';

let _view: alt.WebView;
let pages: Array<DocPage> = [];

class InternalFunctions {
    static init() {
        FactionView.onOpen(InternalFunctions.open);
        FactionView.onClose(InternalFunctions.close);
    }

    /**
     * It opens a webview and sets the event listener for the webview to the function
     * `InternalFunctions.requestTime`
     * @param view - alt.WebView - The webview that the event is being called from.
     * @param {Faction} faction - Faction - The faction that the player is in.
     */
    static open(view: alt.WebView, faction: Faction) {
        _view = view;
        pages = [];
        let doc: string;
        alt.log(JSON.stringify(faction))
        faction.docPages.forEach((page: DocFile) => {
            try {
                alt.log(`reading file @${DOCS_CONFIG.DOCS_RESOURCE_NAME}/docs/${page.fileName}.md `)
                doc = alt.File.read(`@${DOCS_CONFIG.DOCS_RESOURCE_NAME}/docs/${page.fileName}.md`);
            } catch (err) {

            }
            if (doc) {
                pages.push({ name: page.displayName, data: doc })
            }
        });

        _view.on(DOCS_EVENT.READY, InternalFunctions.ready);
        _view.on(DOCS_EVENT.EDIT_DOC, InternalFunctions.editDoc);
        _view.on(DOCS_EVENT.CREATE_DOC, InternalFunctions.addDoc);
    }

    static ready() {
        pages.forEach(p => {
            _view.emit(DOCS_EVENT.PAGE_UPDATE, p.name, p.data);
        })
    }

    /**
     * It's a static function that closes a webview and removes an event listener.
     * @param view - alt.WebView - The webview that is being closed.
     * @param {Faction} faction - Faction - The faction that the player is in.
     */
    static close(view: alt.WebView, faction: Faction) {
        _view.off(DOCS_EVENT.READY, InternalFunctions.ready);
        _view.off(DOCS_EVENT.EDIT_DOC, InternalFunctions.editDoc);
        _view = null;

    }

    static updatePage(page: string, data: string) {
        let currentPage = pages.findIndex((p: DocPage) => p.name == page);
        if (currentPage !== -1) {
            pages[currentPage].data = data;
            return;
        }
        pages.push({ name: page, data: data });
        alt.LocalStorage.set(DOCS_STATE.LOCATION, pages);
    }

    static editDoc(page: string, data: string) {
        alt.emitServer(DOCS_EVENT.EDIT_DOC, page, data);
    }

    static addDoc(displayName: string, fileName: string, data: string) {
        alt.emitServer(DOCS_EVENT.CREATE_DOC, displayName, fileName, data);
    }
}

InternalFunctions.init();

