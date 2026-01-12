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
    <div class="loot-card" :class="{ 'has-unique': store.lastRollLoot.some(l => l.isUnique) }">
      <div class="card-border"></div>
      <div class="card-inner">
        <div class="card-header">
          <div class="header-line left"></div>
          <h3 class="card-title">Last Roll</h3>
          <div class="header-line right"></div>
        </div>
        <div class="loot-grid">
          <div v-if="store.lastRollLoot.length === 0" class="empty-state">
            Roll to see loot
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
    </div>

    <!-- Accumulated Loot -->
    <div class="loot-card">
      <div class="card-border"></div>
      <div class="card-inner">
        <div class="card-header">
          <div class="header-line left"></div>
          <h3 class="card-title">Total Loot</h3>
          <span class="card-counter">{{ store.totalRuns.toLocaleString() }} rolls</span>
          <div class="header-line right"></div>
        </div>
        <div class="loot-grid accumulated">
          <div v-if="store.accumulatedLoot.length === 0" class="empty-state">
            No loot yet
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
  </div>
</template>

<style scoped>
.loot-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loot-card {
  position: relative;
}

.card-border {
  position: absolute;
  inset: 0;
  border: 2px solid var(--varla-brown);
  border-radius: 4px;
  pointer-events: none;
  transition: all 0.3s ease;
}

.card-border::before {
  content: '';
  position: absolute;
  inset: 3px;
  border: 1px solid var(--varla-brown-light);
  border-radius: 2px;
}

.loot-card.has-unique .card-border {
  border-color: #e07020;
  box-shadow: 0 0 20px rgba(255, 140, 50, 0.4), inset 0 0 20px rgba(255, 140, 50, 0.15);
}

.loot-card.has-unique .card-border::before {
  border-color: #ff9040;
}

.card-inner {
  background: linear-gradient(180deg, var(--varla-bg-light) 0%, var(--varla-bg-medium) 100%);
  border-radius: 4px;
  padding: 1rem;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.875rem;
}

.header-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--varla-brown-light));
}

.header-line.right {
  background: linear-gradient(90deg, var(--varla-brown-light), transparent);
}

.card-title {
  font-family: 'Cinzel', serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--varla-gold-dark);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.card-counter {
  font-size: 0.75rem;
  color: var(--varla-text-muted);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  padding: 0 0.5rem;
  border-left: 1px solid var(--varla-brown);
}

.loot-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  min-height: 56px;
  align-content: flex-start;
}

.loot-grid.accumulated {
  max-height: 200px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.empty-state {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  color: var(--varla-text-muted);
  font-size: 0.85rem;
  font-style: italic;
}

.loot-item {
  position: relative;
  width: 44px;
  height: 44px;
  background: var(--varla-bg-dark);
  border: 1px solid var(--varla-brown);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  transition: all 0.2s ease;
}

.loot-item:hover {
  border-color: var(--varla-brown-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.loot-item.unique {
  border-color: #e07020;
  background: linear-gradient(135deg, var(--varla-bg-dark) 0%, rgba(255, 140, 50, 0.15) 100%);
  box-shadow: 0 0 10px rgba(255, 140, 50, 0.5);
  animation: uniqueGlow 2s ease-in-out infinite;
}

@keyframes uniqueGlow {
  0%, 100% { box-shadow: 0 0 10px rgba(255, 140, 50, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 160, 60, 0.8); }
}

.loot-item.unique:hover {
  border-color: #ff9040;
  box-shadow: 0 0 24px rgba(255, 160, 60, 0.7);
}

.item-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  image-rendering: pixelated;
}

.item-placeholder {
  font-size: 0.75rem;
  color: var(--varla-text-muted);
  font-weight: 600;
}

.item-count {
  position: absolute;
  bottom: 2px;
  right: 3px;
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--varla-gold);
  text-shadow:
    1px 1px 0 var(--varla-bg-dark),
    -1px -1px 0 var(--varla-bg-dark),
    1px -1px 0 var(--varla-bg-dark),
    -1px 1px 0 var(--varla-bg-dark);
  font-variant-numeric: tabular-nums;
}
</style>
