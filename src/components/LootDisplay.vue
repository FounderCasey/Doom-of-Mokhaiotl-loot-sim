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
    <h3 class="section-title">Loot from 1 roll</h3>
    <div class="loot-box last-roll" :class="{ 'has-unique': store.lastRollLoot.some(l => l.isUnique) }">
      <div v-if="store.lastRollLoot.length === 0" class="empty-state">
        Roll to see loot!
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

    <!-- Accumulated Loot -->
    <h3 class="section-title">Loot from {{ store.totalRuns.toLocaleString() }} rolls</h3>
    <div class="loot-box accumulated">
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
</template>

<style scoped>
.loot-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.section-title {
  color: #d4af37;
  font-size: 1rem;
  font-weight: normal;
  margin-top: 1rem;
}

.loot-box {
  background: #2d2216;
  border: 2px solid #5c4a32;
  border-radius: 4px;
  padding: 0.75rem;
  min-height: 60px;
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  align-content: flex-start;
}

.loot-box.last-roll {
  min-height: 50px;
}

.loot-box.last-roll.has-unique {
  border-color: #9b59b6;
  box-shadow: 0 0 15px rgba(155, 89, 182, 0.4);
}

.loot-box.accumulated {
  min-height: 100px;
  max-height: 200px;
  overflow-y: auto;
}

.empty-state {
  width: 100%;
  text-align: center;
  color: #666;
  font-size: 0.85rem;
  padding: 1rem;
}

.loot-item {
  position: relative;
  width: 40px;
  height: 40px;
  background: #1a1510;
  border: 1px solid #3d3020;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
}

.loot-item.unique {
  border-color: #9b59b6;
  box-shadow: 0 0 8px rgba(155, 89, 182, 0.6);
  animation: uniquePulse 1.5s ease-in-out infinite;
}

@keyframes uniquePulse {
  0%, 100% { box-shadow: 0 0 8px rgba(155, 89, 182, 0.6); }
  50% { box-shadow: 0 0 15px rgba(155, 89, 182, 0.9); }
}

.item-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  image-rendering: pixelated;
}

.item-placeholder {
  font-size: 0.75rem;
  color: #888;
  font-weight: bold;
}

.item-count {
  position: absolute;
  bottom: 1px;
  right: 2px;
  font-size: 0.6rem;
  color: #ffff00;
  text-shadow: 1px 1px 1px #000, -1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000;
  font-weight: bold;
}
</style>
