import { reactive } from "vue";
import { defaultState } from "@/Defaults";
import { makeStringLabel } from "@/utils/Translations";
import { makeStringId } from "@/utils/MakeID";
import { deepCopy, moveKey } from "@/utils/Helpers";
import { runtimeState } from ".";

// Stores language codes, keyed translations for languages  and key:label relation
const translationsStore = reactive({
  state: defaultState.translations,
  methods: {
    addLabel: (stringLabel) => {
      // Not externally used, as labels get CRUD with translations
      let stringKey;
      if (Object.values(translationsStore.state.labels).includes(stringLabel)) {
        // throw new Error("String " + stringLabel + " already exists");
        stringKey = Object.keys(translationsStore.state.labels).filter(
          (key) => translationsStore.state.labels[key] == stringLabel
        )[0];
      } else {
        stringKey = makeStringId();
      }
      const command = {
        type: "add",
        object: "label",
        do: () => {
          translationsStore.state.labels[stringKey] = stringLabel;
        },
        undo: () => {
          delete translationsStore.state.labels[stringKey];
        },
      };
      runtimeState.commandQueue.push(command);
      return stringKey;
    },
    removeLabel: (stringKey) => {
      // Not externally used, as labels get CRUD with translations
      const label = translationsStore.state.labels[stringKey];
      const command = {
        type: "remove",
        object: "label",
        do: () => {
          delete translationsStore.state.labels[stringKey];
        },
        undo: () => {
          translationsStore.state.labels[stringKey] = label;
        },
      };
      runtimeState.commandQueue.push(command);
    },
    moveLabel: (stringKey, direction) => {
      // Not externally used, as labels get CRUD with translations
      const command = {
        type: "move",
        object: "label",
        do: () => {
          translationsStore.state.labels = moveKey(
            translationsStore.state.labels,
            stringKey,
            direction
          );
        },
        undo: () => {
          translationsStore.state.labels = moveKey(
            translationsStore.state.labels,
            stringKey,
            -direction
          );
        },
      };
      runtimeState.commandQueue.push(command);
    },
    newTranslation: () => {
      const stringKey = makeStringId();
      const stringLabel = makeStringLabel();
      const command = {
        type: "new",
        object: "string",
        do: () => {
          const translations = {};
          translationsStore.state.languages.forEach((lang) => {
            translations[lang] = "";
          });
          translationsStore.state.labels[stringKey] = stringLabel;
          translationsStore.state.strings[stringKey] = translations;
        },
        undo: () => {
          delete translationsStore.state.labels[stringKey];
          delete translationsStore.state.strings[stringKey];
        },
      };
      runtimeState.commandQueue.push(command);
      return { key: stringKey, label: stringLabel };
    },
    addTranslation: (stringLabel, translations) => {
      // TODO: not really an action. Used only in CSV import code
      const stringKey = translationsStore.methods.addLabel(stringLabel);
      const command = {
        type: "add",
        object: "string",
        do: () => {
          if (!translations) {
            translations = {};
            translationsStore.state.languages.forEach((lang) => {
              translations[lang] = "";
            });
          }
          translationsStore.state.strings[stringKey] = translations;
        },
        undo: () => {
          delete translationsStore.state.strings[stringKey];
        },
      };
      runtimeState.commandQueue.push(command);
      return { key: stringKey, label: stringLabel };
    },
    removeTranslation: (stringKey) => {
      const translation = translationsStore.state.strings[stringKey];
      const command = {
        type: "delete",
        object: "string",
        do: () => {
          delete translationsStore.state.strings[stringKey];
        },
        undo: () => {
          translationsStore.state.strings[stringKey] = translation;
        },
      };
      runtimeState.commandQueue.push(command);
      translationsStore.methods.removeLabel(stringKey);
    },
    moveTranslation: (stringKey, direction) => {
      const command = {
        type: "move",
        object: "string",
        do: () => {
          translationsStore.state.translations = moveKey(
            translationsStore.state.strings,
            stringKey,
            direction
          );
        },
        undo: () => {
          translationsStore.state.translations = moveKey(
            translationsStore.state.strings,
            stringKey,
            -direction
          );
        },
      };
      runtimeState.commandQueue.push(command);
      translationsStore.methods.moveLabel(stringKey, direction);
    },
    addLanguage: (langCode) => {
      if (!langCode || translationsStore.state.languages.includes(langCode))
        return;
      const command = {
        type: "add",
        object: "language",
        do: () => {
          translationsStore.state.languages.push(langCode);
          Object.keys(translationsStore.state.strings).forEach((label) => {
            if (!translationsStore.state.strings[label][langCode]) {
              translationsStore.state.strings[label][langCode] = "";
            }
          });
        },
        undo: () => {
          translationsStore.state.languages =
            translationsStore.state.languages.filter((l) => l != langCode);
          Object.keys(translationsStore.state.strings).forEach((label) => {
            delete translationsStore.state.strings[label][langCode];
          });
        },
      };
      runtimeState.commandQueue.push(command);
    },
    removeLanguage: (langCode) => {
      if (!langCode || !translationsStore.state.languages.includes(langCode))
        return;
      const deletedTranslations = Object.values(
        translationsStore.state.strings
      ).map((translation) => translation[langCode]);
      const command = {
        type: "delete",
        object: "language",
        do: () => {
          translationsStore.state.languages =
            translationsStore.state.languages.filter((l) => l != langCode);
          Object.keys(translationsStore.state.strings).forEach((label) => {
            delete translationsStore.state.strings[label][langCode];
          });
        },
        undo: () => {
          translationsStore.state.languages.push(langCode);
          Object.keys(translationsStore.state.strings).forEach((label, idx) => {
            if (!translationsStore.state.strings[label][langCode]) {
              translationsStore.state.strings[label][langCode] =
                deletedTranslations[idx];
            }
          });
        },
      };
      runtimeState.commandQueue.push(command);
    },
    renameLanguage: (oldLang, newLang) => {
      const command = {
        type: "rename",
        object: "language",
        do: () => {
          translationsStore.state.languages =
            translationsStore.state.languages.map((l) => {
              console.log(l == oldLang);
              return l == oldLang ? newLang : l;
            });
          Object.keys(translationsStore.state.strings).forEach((key) => {
            translationsStore.state.strings[key][newLang] =
              translationsStore.state.strings[key][oldLang];
            delete translationsStore.state.strings[key][oldLang];
          });
        },
        undo: () => {
          translationsStore.state.languages =
            translationsStore.state.languages.map((l) => {
              console.log(l == newLang);
              return l == newLang ? oldLang : l;
            });
          Object.keys(translationsStore.state.strings).forEach((key) => {
            translationsStore.state.strings[key][oldLang] =
              translationsStore.state.strings[key][newLang];
            delete translationsStore.state.strings[key][newLang];
          });
        },
      };
      runtimeState.commandQueue.push(command);
    },
  },
});

export default translationsStore;
