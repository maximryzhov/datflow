<template>
    <TabPanel v-model="runtimeState.activeTabLeft" :style="{ width: optionsStore.state.leftPanelWidth + 'px' }" :icons="tabIcons">
        <Tab name="Dialogues">
            <DialoguePanel/>
        </Tab>
        <Tab name="Translations">
            <TranslationPanel />
        </Tab>
        <Tab name="Languages">
            <LanguagePanel />
        </Tab>
    </TabPanel>
</template>

<script setup>
import TabPanel from '../widgets/TabPanel.vue';
import Tab from '../widgets/Tab.vue';
import LanguagePanel from './LanguagePanel.vue';
import TranslationPanel from './TranslationPanel.vue';
import { APP_ICONS } from '@/Icons';
import { runtimeState, optionsStore } from '@/stores';
import DialoguePanel from './DialoguePanel.vue';

const tabIcons = {
    "Dialogues": APP_ICONS.Graph,
    "Nodes": APP_ICONS.Node,
    "Translations": APP_ICONS.Translation,
    "Languages": APP_ICONS.Languages,
}
</script>