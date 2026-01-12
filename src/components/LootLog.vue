<script setup lang="ts">
import { computed, ref, watch, nextTick } from "vue";
import { useLootStore, type RunResult } from "@/stores/lootStore";

const store = useLootStore();
const logContainer = ref<HTMLElement | null>(null);
const autoScroll = ref(true);

// Get last 100 runs for display
const displayRuns = computed(() => {
  return [...store.runHistory].reverse().slice(0, 100);
});

// Auto-scroll to top on new entries
watch(
  () => store.runHistory.length,
  async () => {
    if (autoScroll.value && logContainer.value) {
      await nextTick();
      logContainer.value.scrollTop = 0;
    }
  }
);

function formatGP(value: number): string {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + "M";
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(0) + "K";
  }
  return value.toLocaleString();
}

function getRunClass(run: RunResult): string {
  if (run.uniqueDrops.some((d) => d.itemId === "pet")) return "pet-drop";
  if (run.uniqueDrops.some((d) => d.itemId === "eye" || d.itemId === "treads"))
    return "legendary-drop";
  if (run.uniqueDrops.length > 0) return "rare-drop";
  return "";
}
</script>

<template>
  <div class="loot-log">
    <div class="log-header">
      <h2 class="panel-title">
        <span class="icon">📜</span>
        Loot Log
      </h2>
      <label class="auto-scroll-toggle">
        <input type="checkbox" v-model="autoScroll" />
        <span>Auto-scroll</span>
      </label>
    </div>

    <div v-if="displayRuns.length === 0" class="empty-state">
      <span class="empty-icon">🎲</span>
      <p>No runs yet. Start simulating to see loot!</p>
    </div>

    <div v-else ref="logContainer" class="log-entries">
      <div
        v-for="run in displayRuns"
        :key="run.runNumber"
        :class="['log-entry', getRunClass(run)]"
      >
        <div class="run-header">
          <span class="run-number">Run #{{ run.runNumber }}</span>
          <span class="delve-badge">Delve {{ run.maxDelve }}{{ run.maxDelve >= 9 ? '+' : '' }}</span>
        </div>

        <div class="run-loot">
          <div class="tears-earned">
            <span class="tear-icon">😈</span>
            <span>{{ run.demonTears }} tears</span>
          </div>

          <div v-if="run.uniqueDrops.length > 0" class="unique-drops">
            <div
              v-for="drop in run.uniqueDrops"
              :key="`${run.runNumber}-${drop.itemId}`"
              :class="['unique-badge', drop.itemId]"
            >
              <span class="drop-icon">
                <template v-if="drop.itemId === 'cloth'">🧵</template>
                <template v-else-if="drop.itemId === 'eye'">👁️</template>
                <template v-else-if="drop.itemId === 'treads'">👢</template>
                <template v-else-if="drop.itemId === 'pet'">🐉</template>
              </span>
              <span class="drop-name">{{ drop.itemName }}</span>
              <span class="drop-level">(D{{ drop.delveLevel }})</span>
            </div>
          </div>
        </div>

        <div class="run-value">{{ formatGP(run.gpValue) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loot-log {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 1px solid #d4af37;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(212, 175, 55, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 400px;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.panel-title {
  color: #d4af37;
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
}

.icon {
  font-size: 1.5rem;
}

.auto-scroll-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #888;
  font-size: 0.8rem;
  cursor: pointer;
}

.auto-scroll-toggle input {
  accent-color: #d4af37;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #666;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.log-entries {
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-right: 0.5rem;
}

.log-entries::-webkit-scrollbar {
  width: 6px;
}

.log-entries::-webkit-scrollbar-track {
  background: #1a1a2e;
  border-radius: 3px;
}

.log-entries::-webkit-scrollbar-thumb {
  background: #3a3a5a;
  border-radius: 3px;
}

.log-entries::-webkit-scrollbar-thumb:hover {
  background: #4a4a6a;
}

.log-entry {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #2a2a4a;
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 3px solid #3a3a5a;
  transition: all 0.3s;
}

.log-entry.rare-drop {
  border-left-color: #3498db;
  background: linear-gradient(90deg, rgba(52, 152, 219, 0.1) 0%, #2a2a4a 50%);
}

.log-entry.legendary-drop {
  border-left-color: #9b59b6;
  background: linear-gradient(90deg, rgba(155, 89, 182, 0.15) 0%, #2a2a4a 50%);
  animation: legendaryGlow 2s ease-in-out infinite;
}

.log-entry.pet-drop {
  border-left-color: #e74c3c;
  background: linear-gradient(90deg, rgba(231, 76, 60, 0.2) 0%, #2a2a4a 50%);
  animation: petGlow 1.5s ease-in-out infinite;
}

@keyframes legendaryGlow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(155, 89, 182, 0.3);
  }
  50% {
    box-shadow: 0 0 15px rgba(155, 89, 182, 0.5);
  }
}

@keyframes petGlow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(231, 76, 60, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(231, 76, 60, 0.6);
  }
}

.run-header {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 70px;
}

.run-number {
  color: #888;
  font-size: 0.75rem;
}

.delve-badge {
  color: #d4af37;
  font-size: 0.7rem;
  font-weight: bold;
}

.run-loot {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.tears-earned {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #888;
  font-size: 0.8rem;
}

.tear-icon {
  font-size: 0.9rem;
}

.unique-drops {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.unique-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
}

.unique-badge.cloth {
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
  border: 1px solid rgba(52, 152, 219, 0.4);
}

.unique-badge.eye,
.unique-badge.treads {
  background: rgba(155, 89, 182, 0.2);
  color: #9b59b6;
  border: 1px solid rgba(155, 89, 182, 0.4);
}

.unique-badge.pet {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.4);
}

.drop-icon {
  font-size: 0.9rem;
}

.drop-level {
  opacity: 0.7;
  font-size: 0.65rem;
}

.run-value {
  color: #d4af37;
  font-weight: bold;
  font-size: 0.85rem;
  min-width: 60px;
  text-align: right;
}
</style>
