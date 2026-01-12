<script setup lang="ts">
import { computed } from "vue";
import { useLootStore } from "@/stores/lootStore";

const store = useLootStore();

function formatGP(value: number): string {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(2) + "B";
  }
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(2) + "M";
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(1) + "K";
  }
  return value.toLocaleString();
}

const stats = computed(() => [
  {
    label: "Total Runs",
    value: store.totalRuns.toLocaleString(),
    icon: "🎯",
  },
  {
    label: "Uniques Obtained",
    value: store.totalUniques.toString(),
    icon: "💎",
    highlight: store.totalUniques > 0,
  },
  {
    label: "Total GP",
    value: formatGP(store.totalGP),
    icon: "💰",
  },
  {
    label: "GP/Run",
    value: formatGP(store.gpPerRun),
    icon: "📈",
  },
  {
    label: "Demon Tears",
    value: store.totalDemonTears.toLocaleString(),
    icon: "😈",
  },
  {
    label: "Longest Dry",
    value: Math.max(store.longestDryStreak, store.currentDryStreak).toString(),
    icon: "🏜️",
    isDry: Math.max(store.longestDryStreak, store.currentDryStreak) > 100,
  },
]);
</script>

<template>
  <div class="stats-display">
    <h2 class="panel-title">
      <span class="icon">📊</span>
      Statistics
    </h2>

    <div class="stats-grid">
      <div
        v-for="stat in stats"
        :key="stat.label"
        :class="['stat-card', { highlight: stat.highlight, dry: stat.isDry }]"
      >
        <span class="stat-icon">{{ stat.icon }}</span>
        <div class="stat-content">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <div v-if="store.currentDryStreak > 0" class="dry-streak-indicator">
      <span class="streak-label">Current Dry Streak:</span>
      <span class="streak-value">{{ store.currentDryStreak }}</span>
    </div>
  </div>
</template>

<style scoped>
.stats-display {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 1px solid #d4af37;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(212, 175, 55, 0.1);
}

.panel-title {
  color: #d4af37;
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0 0 1.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
}

.icon {
  font-size: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #2a2a4a;
  padding: 0.875rem;
  border-radius: 6px;
  border: 1px solid #3a3a5a;
  transition: all 0.3s;
}

.stat-card.highlight {
  border-color: #9b59b6;
  box-shadow: 0 0 15px rgba(155, 89, 182, 0.3);
  background: linear-gradient(135deg, #2a2a4a 0%, #3a2a5a 100%);
}

.stat-card.dry {
  border-color: #e74c3c;
  box-shadow: 0 0 10px rgba(231, 76, 60, 0.2);
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  color: #d4af37;
  font-size: 1.1rem;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(212, 175, 55, 0.3);
}

.stat-label {
  color: #888;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dry-streak-indicator {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.3);
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.streak-label {
  color: #e74c3c;
  font-size: 0.85rem;
}

.streak-value {
  color: #e74c3c;
  font-size: 1.1rem;
  font-weight: bold;
}
</style>
