<script setup lang="ts">
import { computed } from "vue";
import { useLootStore } from "@/stores/lootStore";
import { UNIQUE_ITEMS } from "@/data/dropRates";
import ItemTooltip from "./ItemTooltip.vue";

const store = useLootStore();

const images: Record<string, string> = {
  cloth: "/src/assets/images/mokhaiotl_cloth.png",
  eye: "/src/assets/images/eye_of_ayak.png",
  treads: "/src/assets/images/avernic_treads.png",
  pet: "/src/assets/images/dom.png",
};

const collectionItems = computed(() =>
  UNIQUE_ITEMS.map((item) => ({
    ...item,
    image: images[item.id],
    count: store.uniqueCounts[item.id] || 0,
    obtained: (store.uniqueCounts[item.id] || 0) > 0,
    unlocked: item.unlocksAt <= store.maxDelveLevel,
    rolls: store.uniqueObtainedAtRolls[item.id] || [],
  }))
);

const obtainedCount = computed(
  () => collectionItems.value.filter((i) => i.obtained).length
);
</script>

<template>
  <div class="collection-card">
    <div class="card-header">
      <h3 class="card-title">Collection Log</h3>
      <div class="progress-indicator">
        <span class="progress-count">{{ obtainedCount }}/{{ UNIQUE_ITEMS.length }}</span>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: (obtainedCount / UNIQUE_ITEMS.length * 100) + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <div class="collection-grid">
      <ItemTooltip
        v-for="item in collectionItems"
        :key="item.id"
        :name="item.name"
        :subtitle="`Unlocks at Delve ${item.unlocksAt}`"
        :image="item.image"
        :count="item.obtained ? item.count : undefined"
        :rolls="item.obtained ? item.rolls : undefined"
      >
        <div class="collection-slot" :class="{ obtained: item.obtained, locked: !item.unlocked }">
          <div class="slot-inner">
            <img :src="item.image" :alt="item.name" class="item-img" />
            <span v-if="item.obtained && item.count > 1" class="item-count">{{ item.count }}</span>
            <div v-if="!item.unlocked" class="lock-overlay">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>
          <span class="item-name">{{ item.name }}</span>
        </div>
      </ItemTooltip>
    </div>
  </div>
</template>

<style scoped>
.collection-card {
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
  margin-bottom: 1.25rem;
}

.card-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.progress-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-count {
  font-size: 0.8rem;
  font-weight: 500;
  color: #71717a;
  font-variant-numeric: tabular-nums;
}

.progress-bar {
  width: 60px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 100px;
  transition: width 0.3s ease;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.collection-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: default;
}

.slot-inner {
  position: relative;
  width: 64px;
  height: 64px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.collection-slot:not(.locked):hover .slot-inner {
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.collection-slot:not(.obtained) .slot-inner {
  opacity: 0.4;
}

.collection-slot:not(.obtained) .item-img {
  filter: grayscale(100%);
}

.collection-slot.obtained .slot-inner {
  border-color: rgba(251, 191, 36, 0.4);
  background: rgba(251, 191, 36, 0.05);
}

.collection-slot.obtained:hover .slot-inner {
  border-color: rgba(251, 191, 36, 0.6);
  box-shadow: 0 0 16px rgba(251, 191, 36, 0.2);
}

.collection-slot.locked .slot-inner {
  opacity: 0.25;
}

.item-img {
  width: 44px;
  height: 44px;
  object-fit: contain;
  image-rendering: pixelated;
}

.item-count {
  position: absolute;
  bottom: 4px;
  right: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #22c55e;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  font-variant-numeric: tabular-nums;
}

.lock-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 11px;
  color: #52525b;
}

.item-name {
  font-size: 0.7rem;
  color: #71717a;
  text-align: center;
  max-width: 70px;
  line-height: 1.2;
  transition: color 0.2s ease;
}

.collection-slot.obtained .item-name {
  color: #a1a1aa;
}

.collection-slot:hover .item-name {
  color: #e4e4e7;
}
</style>
