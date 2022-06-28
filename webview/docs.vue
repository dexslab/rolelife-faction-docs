<template>
  <div class="docs-wrapper pa-4">
    <div class="split">
      <Button class="mr-2" v-if="canEdit && !editing" @click="createPage()">
        <Icon icon="icon-plus" :size="24"></Icon>
        Create New
      </Button>
      <Button class="mr-2" v-if="canEdit && editing" @click="doneEditing()">
        <Icon icon="icon-save1" :size="24"></Icon>
        Save
      </Button>
    </div>
    <div class="split">
      <Input
        v-if="creating"
        placeholder="Display Name"
        label="Display Name"
        :value="displayName"
        :rules="[
          (value) => {
            return value ? null : 'You must enter a display name for the document';
          },
        ]"
      ></Input>
      <Input
        v-if="creating"
        placeholder="File Name"
        label="File Name"
        :value="fileName"
        :rules="[
          (value) => {
            return value ? null : 'You must enter a file name for the document';
          },
        ]"
      ></Input>
    </div>

    <v-md-editor
      v-if="editing"
      left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code"
      v-model="editText"
      height="400px"
    ></v-md-editor>
    <Button class="mr-2" v-if="canEdit && editing && creating" @click="doneEditing()">
      <Icon icon="icon-disk" :size="24"></Icon>
    </Button>
    <Module v-for="(page, index) in pages" :name="page.name" :key="index">
      <Button class="mr-2" v-if="canEdit" @click="editPage(index)">
        <Icon icon="icon-edit" :size="24"></Icon>
      </Button>
      <div class="md-wrapper">
        <Markdown
          :source="page.data"
          :html="true"
          :typographer="true"
          :plugins="plugins"
          v-if="!editing"
        />
      </div>
    </Module>
  </div>
</template>

<style scoped>
.docs-wrapper {
  width: 100%;
  min-height: 75vh;
  max-height: 75vh;
  box-sizing: border-box;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";

import { DOCS_EVENT } from "../shared/enums";
import { DocPage, Faction } from "../shared/interfaces";

import VMdEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";

// Prism
import Prism from "prismjs";
// highlight code
import "prismjs/components/prism-json";
import { FactionParser } from "../../core-factions/webview/utility/factionParser";
import enUS from "@kangc/v-md-editor/lib/lang/en-US";

VMdEditor.use(vuepressTheme, {
  Prism,
}).lang.use("en-US", enUS);
//import SASP_SOP from './docs/sasp_sop';

// Very Important! The name of the component must match the file name.
// Don't forget to do this. This is a note so you don't forget.
const ComponentName = "Docs";
export default defineComponent({
  name: ComponentName,
  props: {
    character: String,
    faction: Object as () => Faction,
  },
  components: {
    Module: defineAsyncComponent(() => import("@components/Module.vue")),
    Markdown: defineAsyncComponent(() => import("./components/markdown.vue")),
    VMdEditor,
    Icon: defineAsyncComponent(() => import("@components/Icon.vue")),
    Input: defineAsyncComponent(() => import("@components/Input.vue")),
    Button: defineAsyncComponent(() => import("@components/Button.vue")),
  },
  data() {
    return {
      currentPage: "",
      pages: new Array<DocPage>(),
      plugins: [],
      editText: null,
      editIndex: -1,
      canEdit: false,
      editing: false,
      creating: false,
      fileName: "",
      displayName: "",
    };
  },
  mounted() {
    if ("alt" in window) {
      alt.on(DOCS_EVENT.CHANGE_PAGE, this.changePage);
      alt.on(DOCS_EVENT.PAGE_UPDATE, this.updatePages);
      console.log(`alt events registered for docs`);
      alt.emit(DOCS_EVENT.READY);

      const member = FactionParser?.getMember(this.faction, this.character);
      const rank = FactionParser?.getRank(this.faction, member);

      this.canEdit = rank?.rankPermissions.manageMembers;
    } else {
      this.pages.push({
        name: "test1",
        data: "# Hello World TESTING 1",
      });
      this.pages.push({
        name: "test2",
        data: `# Hello World 
        ## TESTING 2`,
      });
      this.canEdit = true;
      //this.pages.push({ name: 'SASP SOP', data: SASP_SOP });
    }
  },
  unmounted() {},
  methods: {
    changePage(page: string) {
      this.currentPage = page;
    },

    editPage(index: number) {
      this.editing = true;
      this.editText = this.pages[index].data;
      this.editIndex = index;
      this.creating = false;
    },

    doneEditing() {
      this.editing = false;
      this.creating = false;
      if ((this.editIndex = -1)) {
        if ("alt" in window) {
          if (this.displayName && this.fileName) {
            alt.emit(
              DOCS_EVENT.CREATE_DOC,
              this.displayName,
              this.fileName,
              this.editText
            );
          } else {
          }
        }
        return;
      }
      this.pages[this.editIndex].data = this.editText;
      if ("alt" in window) {
        alt.emit(DOCS_EVENT.EDIT_DOC, this.pages[this.editIndex].name, this.editText);
      }
    },

    createPage() {
      this.editing = true;
      this.creating = true;
      this.editIndex = -1;
      this.editText = `Please remove me before saving`;
    },

    updatePages(page: string, pageData: string) {
      console.log(`Got page ${page}`);
      let currentPage = this.pages.findIndex((p: DocPage) => p.name == page);
      if (currentPage !== -1) {
        this.pages[currentPage].data = pageData;
        return;
      }
      this.pages.push({
        name: page,
        data: pageData,
      });
    },
  },
});
</script>
