<template>
  <div class="bg-slate-800 rounded-lg p-4 border border-slate-700">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-bold text-slate-400">查看历史</h3>
      <button v-if="store.viewHistory.length > 0" @click="onClear"
        class="text-xs text-slate-500 hover:text-red-400 transition">
        清空全部
      </button>
    </div>
    <div v-if="store.viewHistorySorted.length > 0" class="space-y-1 max-h-64 overflow-y-auto">
      <div v-for="item in store.viewHistorySorted" :key="item.id"
        class="cursor-pointer p-2 rounded-lg border transition-all border-slate-700 bg-slate-900 hover:border-slate-500 group">
        <div class="flex items-center justify-between">
          <span @click="onSelect(item.moleculeId)"
            class="text-sm font-bold text-slate-200 hover:text-cyan-400 transition">
            {{ item.moleculeName }}
          </span>
          <button @click.stop="onRemove(item.id)"
            class="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex items-center justify-between mt-1">
          <span class="text-xs text-slate-500 font-mono">{{ item.moleculeFormula }}</span>
          <div class="flex items-center gap-2">
            <span class="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">{{ item.moleculeCategory }}</span>
            <span class="text-xs text-cyan-400">{{ item.viewCount }}次</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-slate-500 text-sm">暂无查看历史</div>
  </div>
</template>

<script setup lang="ts">
import { useHistoryStore } from '../store/history'

const emit = defineEmits<{
  select: [moleculeId: number]
}>()

const store = useHistoryStore()

function onSelect(moleculeId: number) {
  emit('select', moleculeId)
}

function onRemove(id: string) {
  store.removeViewHistory(id)
}

function onClear() {
  store.clearViewHistory()
}
</script>
