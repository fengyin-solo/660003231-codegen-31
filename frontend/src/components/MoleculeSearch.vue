<template>
  <div class="space-y-4">
    <SearchHistory v-if="historyStore.searchHistory.length > 0" @select="onHistorySelect" />
    <div class="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <h3 class="text-sm font-bold text-slate-400 mb-3">分子数据库 ({{ store.molecules.length }})</h3>
      <input v-model="query" @input="onSearch" placeholder="搜索分子名/类别/SMILES..."
        class="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-sm mb-3 focus:outline-none focus:border-cyan-500" />
      <div class="space-y-1 max-h-96 overflow-y-auto">
        <div v-for="mol in store.filteredMolecules" :key="mol.id" @click="store.selectMolecule(mol)"
          :class="['cursor-pointer p-2 rounded-lg border transition-all', store.currentMolecule?.id === mol.id ? 'border-cyan-500 bg-cyan-900/30' : 'border-slate-700 bg-slate-900 hover:border-slate-500']">
          <div class="flex items-center justify-between">
            <span class="text-sm font-bold text-slate-200">{{ mol.name }}</span>
            <span class="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">{{ mol.category }}</span>
          </div>
          <div class="text-xs text-slate-500 mt-1 font-mono">{{ mol.formula }} · MW {{ mol.mw }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMoleculeStore } from '../store/molecule'
import { useHistoryStore } from '../store/history'
import SearchHistory from './SearchHistory.vue'

const store = useMoleculeStore()
const historyStore = useHistoryStore()
const query = ref('')

function onSearch() {
  store.searchMolecules(query.value)
  if (query.value.trim()) {
    historyStore.addSearchHistory(query.value, store.filteredMolecules.length)
  }
}

function onHistorySelect(historyQuery: string) {
  query.value = historyQuery
  onSearch()
}
</script>
