import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { SearchHistoryItem, ViewHistoryItem } from '../types'

const SEARCH_HISTORY_KEY = 'molecule_search_history'
const VIEW_HISTORY_KEY = 'molecule_view_history'
const MAX_SEARCH_HISTORY = 20
const MAX_VIEW_HISTORY = 20

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
  }
}

export const useHistoryStore = defineStore('history', () => {
  const searchHistory = ref<SearchHistoryItem[]>(
    loadFromStorage(SEARCH_HISTORY_KEY, [])
  )
  const viewHistory = ref<ViewHistoryItem[]>(
    loadFromStorage(VIEW_HISTORY_KEY, [])
  )
  const maxSearchHistory = ref(MAX_SEARCH_HISTORY)
  const maxViewHistory = ref(MAX_VIEW_HISTORY)

  const searchHistorySorted = computed(() => {
    return [...searchHistory.value].sort((a, b) => {
      if (b.useCount !== a.useCount) return b.useCount - a.useCount
      return b.timestamp - a.timestamp
    })
  })

  const viewHistorySorted = computed(() => {
    return [...viewHistory.value].sort((a, b) => {
      if (b.viewCount !== a.viewCount) return b.viewCount - a.viewCount
      return b.timestamp - a.timestamp
    })
  })

  function addSearchHistory(query: string, resultCount: number) {
    if (!query.trim()) return

    const existingIndex = searchHistory.value.findIndex(
      item => item.query.toLowerCase() === query.toLowerCase()
    )

    if (existingIndex !== -1) {
      searchHistory.value[existingIndex].useCount++
      searchHistory.value[existingIndex].timestamp = Date.now()
      searchHistory.value[existingIndex].resultCount = resultCount
    } else {
      const newItem: SearchHistoryItem = {
        id: `search-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        query,
        timestamp: Date.now(),
        resultCount,
        useCount: 1
      }
      searchHistory.value.unshift(newItem)
      if (searchHistory.value.length > maxSearchHistory.value) {
        searchHistory.value = searchHistory.value.slice(0, maxSearchHistory.value)
      }
    }
  }

  function removeSearchHistory(id: string) {
    searchHistory.value = searchHistory.value.filter(item => item.id !== id)
  }

  function clearSearchHistory() {
    searchHistory.value = []
  }

  function addViewHistory(molecule: {
    id: number
    name: string
    smiles: string
    formula: string
    category: string
  }) {
    const existingIndex = viewHistory.value.findIndex(
      item => item.moleculeId === molecule.id
    )

    if (existingIndex !== -1) {
      viewHistory.value[existingIndex].viewCount++
      viewHistory.value[existingIndex].timestamp = Date.now()
    } else {
      const newItem: ViewHistoryItem = {
        id: `view-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        moleculeId: molecule.id,
        moleculeName: molecule.name,
        moleculeSmiles: molecule.smiles,
        moleculeFormula: molecule.formula,
        moleculeCategory: molecule.category,
        timestamp: Date.now(),
        viewCount: 1
      }
      viewHistory.value.unshift(newItem)
      if (viewHistory.value.length > maxViewHistory.value) {
        viewHistory.value = viewHistory.value.slice(0, maxViewHistory.value)
      }
    }
  }

  function removeViewHistory(id: string) {
    viewHistory.value = viewHistory.value.filter(item => item.id !== id)
  }

  function clearViewHistory() {
    viewHistory.value = []
  }

  watch(searchHistory, (val) => {
    saveToStorage(SEARCH_HISTORY_KEY, val)
  }, { deep: true })

  watch(viewHistory, (val) => {
    saveToStorage(VIEW_HISTORY_KEY, val)
  }, { deep: true })

  return {
    searchHistory,
    viewHistory,
    maxSearchHistory,
    maxViewHistory,
    searchHistorySorted,
    viewHistorySorted,
    addSearchHistory,
    removeSearchHistory,
    clearSearchHistory,
    addViewHistory,
    removeViewHistory,
    clearViewHistory
  }
})
