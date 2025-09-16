<template>
    <TabPanel v-model="runtimeState.activeTabRight" :style="{ width: optionsStore.state.rightPanelWidth + 'px' }"
        :icons="tabIcons">
        <Tab name="Nodes">
            <!-- setting width for smooth animation -->
            <NodePanel :selected-node="runtimeState.selectedNode" />
        </Tab>
        <Tab name="History">
            <HistoryPanel />
        </Tab>
    </TabPanel>
</template>

<script setup>
import TabPanel from '../widgets/TabPanel.vue';
import Tab from '../widgets/Tab.vue';
import NodePanel from './NodePanel.vue';
import { APP_ICONS } from '@/Icons';
import { runtimeState, optionsStore } from '@/stores';
import HistoryPanel from './HistoryPanel.vue';

const tabIcons = {
    "Nodes": APP_ICONS.Node,
    "History": APP_ICONS.History,
}
</script>
