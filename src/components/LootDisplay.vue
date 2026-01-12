<script setup lang="ts">
import { useLootStore } from "@/stores/lootStore";
import ItemTooltip from "./ItemTooltip.vue";

const store = useLootStore();

function formatCount(count: number): string {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return count.toString();
}
</script>

<template>
  <div class="loot-section">
    <!-- Last Roll -->
    <div class="loot-card">
      <div class="card-header">
        <h3 class="card-title">Last Roll</h3>
        <span class="card-badge" v-if="store.lastRollLoot.some(l => l.isUnique)">Unique!</span>
      </div>
      <div class="loot-grid" :class="{ 'has-unique': store.lastRollLoot.some(l => l.isUnique) }">
        <div v-if="store.lastRollLoot.length === 0" class="empty-state">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          </svg>
          <span>Roll to see loot</span>
        </div>
        <ItemTooltip
          v-for="item in store.lastRollLoot"
          :key="item.id"
          :name="item.name"
          :image="item.image"
        >
          <div class="loot-item" :class="{ unique: item.isUnique }">
            <img v-if="item.image" :src="item.image" :alt="item.name" class="item-img" />
            <span v-else class="item-placeholder">{{ item.name.charAt(0) }}</span>
            <span class="item-count">{{ formatCount(item.count) }}</span>
          </div>
        </ItemTooltip>
      </div>
    </div>

    <!-- Accumulated Loot -->
    <div class="loot-card">
      <div class="card-header">
        <h3 class="card-title">Total Loot</h3>
        <span class="card-counter">{{ store.totalRuns.toLocaleString() }} rolls</span>
      </div>
      <div class="loot-grid accumulated">
        <div v-if="store.accumulatedLoot.length === 0" class="empty-state">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>No loot yet</span>
        </div>
        <ItemTooltip
          v-for="item in store.accumulatedLoot"
          :key="item.id"
          :name="item.name"
          :image="item.image"
          :count="item.isUnique ? item.count : undefined"
          :rolls="item.isUnique ? store.uniqueObtainedAtRolls[item.id] : undefined"
        >
          <div class="loot-item" :class="{ unique: item.isUnique }">
            <img v-if="item.image" :src="item.image" :alt="item.name" class="item-img" />
            <span v-else class="item-placeholder">{{ item.name.charAt(0) }}</span>
            <span class="item-count">{{ formatCount(item.count) }}</span>
          </div>
        </ItemTooltip>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loot-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loot-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.25rem;
  backdrop-filter: blur(10px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-badge {
  background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.625rem;
  border-radius: 100px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  animation: pulse-badge 2s ease-in-out infinite;
}

@keyframes pulse-badge {
  0%, 100% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(168, 85, 247, 0); }
}

.card-counter {
  font-size: 0.8rem;
  color: #71717a;
  font-variant-numeric: tabular-nums;
}

.loot-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  min-height: 56px;
  align-content: flex-start;
}

.loot-grid.accumulated {
  max-height: 200px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.loot-grid.has-unique {
  position: relative;
}

.loot-grid.has-unique::before {
  content: '';
  position: absolute;
  inset: -1rem;
  border-radius: 12px;
  background: radial-gradient(circle at center, rgba(168, 85, 247, 0.1) 0%, transparent 70%);
  pointer-events: none;
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.empty-state {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem;
  color: #52525b;
  font-size: 0.85rem;
}

.empty-state svg {
  opacity: 0.5;
}

.loot-item {
  position: relative;
  width: 44px;
  height: 44px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  transition: all 0.2s ease;
}

.loot-item:hover {
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.loot-item.unique {
  border-color: rgba(168, 85, 247, 0.5);
  background: rgba(168, 85, 247, 0.1);
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.3);
}

.loot-item.unique:hover {
  border-color: rgba(168, 85, 247, 0.7);
  box-shadow: 0 0 16px rgba(168, 85, 247, 0.5);
}

.item-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  image-rendering: pixelated;
}

.item-placeholder {
  font-size: 0.75rem;
  color: #71717a;
  font-weight: 600;
}

.item-count {
  position: absolute;
  bottom: 2px;
  right: 4px;
  font-size: 0.65rem;
  font-weight: 600;
  color: #fbbf24;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  font-variant-numeric: tabular-nums;
}
</style>
