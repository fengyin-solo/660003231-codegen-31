<template>
  <div class="bg-slate-800 rounded-lg p-4 border border-slate-700">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-bold text-slate-400">搜索历史</h3>
      <button v-if="store.searchHistory.length > 0" @click="onClear"
        class="text-xs text-slate-500 hover:text-red-400 transition">
        清空全部
      </button>
    </div>
    <div v-if="store.searchHistorySorted.length > 0" class="space-y-1 max-h-48 overflow-y-auto">
      <div v-for="item in store.searchHistorySorted" :key="item.id"
        class="flex items-center justify-between bg-slate-900 rounded p-2 group">
        <span @click="onSelect(item.query)"
          class="flex-1 cursor-pointer text-sm text-slate-200 hover:text-cyan-400 transition truncate">
          {{ item.query }}
        </span>
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-500">{{ item.useCount }}次</span>
          <button @click.stop="onRemove(item.id)"
            class="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-slate-500 text-sm">暂无搜索历史</div>
  </div>
</template>

<script setup lang="ts">
import { useHistoryStore } from '../store/history'

const emit = defineEmits<{
  select: [query: string]
}>()

const store = useHistoryStore()

function onSelect(query: string) {
  emit('select', query)
}

function onRemove(id: string) {
  store.removeSearchHistory(id)
}

function onClear() {
  store.clearSearchHistory()
}
</script>
